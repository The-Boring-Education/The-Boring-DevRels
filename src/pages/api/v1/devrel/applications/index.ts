import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdvocateAuthDB, sendAPIResponse } from '@/middleware/auth';
import { getAllApplicationsFromDB, getApplicationsByStatusFromDB } from '@/database/queries';
import { API_STATUS_CODES } from '@/constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json(
      sendAPIResponse({
        status: false,
        message: 'Method not allowed',
      })
    );
  }

  try {
    const { status } = req.query;

    let applications;
    let error;

    if (status && typeof status === 'string') {
      // Get applications by status
      const result = await getApplicationsByStatusFromDB(status as any);
      applications = result.data;
      error = result.error;
    } else {
      // Get all applications
      const result = await getAllApplicationsFromDB();
      applications = result.data;
      error = result.error;
    }

    if (error) {
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: error,
        })
      );
    }

    return res.status(API_STATUS_CODES.OK).json(
      sendAPIResponse({
        status: true,
        data: applications,
        message: 'Applications fetched successfully',
      })
    );

  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        error,
        message: 'Internal server error while fetching applications',
      })
    );
  }
};

export default withAdvocateAuthDB(handler);