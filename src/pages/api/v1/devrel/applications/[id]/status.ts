import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdvocateAuthDB, sendAPIResponse } from '@/middleware/auth';
import { 
  updateApplicationStatusInDB, 
  getApplicationByIdFromDB,
  updateLeadStatusInDB,
  getLeadByEmailFromDB 
} from '@/database/queries';
import { API_STATUS_CODES } from '@/constants';
import type { UpdateApplicationStatusRequest } from '@/interfaces';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json(
      sendAPIResponse({
        status: false,
        message: 'Method not allowed',
      })
    );
  }

  try {
    const { id } = req.query;
    const user = (req as any).user;
    const { status, notes, interviewDate, interviewLink }: UpdateApplicationStatusRequest = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(API_STATUS_CODES.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: 'Application ID is required',
        })
      );
    }

    if (!status) {
      return res.status(API_STATUS_CODES.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: 'Status is required',
        })
      );
    }

    // Get current application
    const { data: application, error: appError } = await getApplicationByIdFromDB(id);
    
    if (appError || !application) {
      return res.status(API_STATUS_CODES.NOT_FOUND).json(
        sendAPIResponse({
          status: false,
          message: appError || 'Application not found',
        })
      );
    }

    // Update application status
    const { data: updatedApplication, error: updateError } = await updateApplicationStatusInDB(
      id,
      status,
      user.id,
      notes
    );

    if (updateError || !updatedApplication) {
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: updateError || 'Failed to update application status',
        })
      );
    }

    // Update corresponding lead status
    const { data: lead } = await getLeadByEmailFromDB(application.applicantEmail);
    
    if (lead) {
      await updateLeadStatusInDB(lead._id.toString(), status, user.id);
    }

    // Handle interview scheduling
    if (status === 'interview_scheduled' && interviewDate && interviewLink) {
      // You can add interview scheduling logic here
      // For now, we'll just update the application with interview details
      updatedApplication.interviewDate = new Date(interviewDate);
      updatedApplication.interviewLink = interviewLink;
      await updatedApplication.save();
    }

    return res.status(API_STATUS_CODES.OK).json(
      sendAPIResponse({
        status: true,
        data: updatedApplication,
        message: 'Application status updated successfully',
      })
    );

  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        error,
        message: 'Internal server error while updating application status',
      })
    );
  }
};

export default withAdvocateAuthDB(handler);