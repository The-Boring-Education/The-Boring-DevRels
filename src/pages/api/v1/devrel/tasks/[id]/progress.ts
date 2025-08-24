import type { NextApiRequest, NextApiResponse } from 'next';
import { withDevRelAuthDB, sendAPIResponse } from '@/middleware/auth';
import { 
  updateTaskProgressInDB, 
  submitTaskWorkInDB,
  getTaskByIdFromDB,
  addCompletedTaskToLeadInDB,
  updateLeadPerformanceInDB,
  getLeadByEmailFromDB 
} from '@/database/queries';
import { API_STATUS_CODES, TASK_STATUS } from '@/constants';
import type { UpdateTaskStatusRequest } from '@/interfaces';

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
    const { leadId, status, notes, submissionUrl }: UpdateTaskStatusRequest = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(API_STATUS_CODES.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: 'Task ID is required',
        })
      );
    }

    if (!leadId || !status) {
      return res.status(API_STATUS_CODES.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: 'Lead ID and status are required',
        })
      );
    }

    // Get task details
    const { data: task, error: taskError } = await getTaskByIdFromDB(id);
    
    if (taskError || !task) {
      return res.status(API_STATUS_CODES.NOT_FOUND).json(
        sendAPIResponse({
          status: false,
          message: taskError || 'Task not found',
        })
      );
    }

    // Check permissions
    if (user.role === 'lead') {
      // Leads can only update their own task progress
      const { data: lead } = await getLeadByEmailFromDB(user.email);
      if (!lead || lead._id.toString() !== leadId) {
        return res.status(API_STATUS_CODES.FORBIDDEN).json(
          sendAPIResponse({
            status: false,
            message: 'You can only update your own task progress',
          })
        );
      }
    }

    let updatedTask;
    let error;

    if (status === TASK_STATUS.COMPLETED && submissionUrl) {
      // Submit work with URL
      const result = await submitTaskWorkInDB(id, leadId, {
        url: submissionUrl,
        notes,
      });
      updatedTask = result.data;
      error = result.error;
    } else {
      // Update progress only
      const result = await updateTaskProgressInDB(id, leadId, status, { notes });
      updatedTask = result.data;
      error = result.error;
    }

    if (error || !updatedTask) {
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: error || 'Failed to update task progress',
        })
      );
    }

    // Update lead performance metrics if task is completed
    if (status === TASK_STATUS.COMPLETED) {
      await addCompletedTaskToLeadInDB(leadId, id);
      
      // Update performance metrics
      const currentTime = new Date();
      const taskStartTime = task.createdAt;
      const completionTimeInDays = Math.ceil(
        (currentTime.getTime() - taskStartTime.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      await updateLeadPerformanceInDB(leadId, {
        lastActivityAt: currentTime,
        // You can add more metrics calculation here
      });
    }

    return res.status(API_STATUS_CODES.OK).json(
      sendAPIResponse({
        status: true,
        data: updatedTask,
        message: 'Task progress updated successfully',
      })
    );

  } catch (error) {
    console.error('Error updating task progress:', error);
    return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        error,
        message: 'Internal server error while updating task progress',
      })
    );
  }
};

export default withDevRelAuthDB(handler);