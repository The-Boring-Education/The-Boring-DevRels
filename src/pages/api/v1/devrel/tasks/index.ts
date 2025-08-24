import type { NextApiRequest, NextApiResponse } from 'next';
import { withDevRelAuthDB, sendAPIResponse } from '@/middleware/auth';
import { 
  getAllTasksFromDB, 
  getTasksByTypeFromDB, 
  getTasksForLeadFromDB,
  createTaskInDB 
} from '@/database/queries';
import { API_STATUS_CODES } from '@/constants';
import type { CreateTaskRequest } from '@/interfaces';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = (req as any).user;

  if (req.method === 'GET') {
    return handleGet(req, res, user);
  } else if (req.method === 'POST') {
    return handlePost(req, res, user);
  } else {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json(
      sendAPIResponse({
        status: false,
        message: 'Method not allowed',
      })
    );
  }
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse, user: any) => {
  try {
    const { type, leadId } = req.query;

    let tasks;
    let error;

    if (leadId && typeof leadId === 'string') {
      // Get tasks for specific lead
      if (user.role === 'lead' && user.email !== leadId) {
        // Leads can only see their own tasks
        return res.status(API_STATUS_CODES.FORBIDDEN).json(
          sendAPIResponse({
            status: false,
            message: 'Access denied',
          })
        );
      }
      
      const result = await getTasksForLeadFromDB(leadId);
      tasks = result.data;
      error = result.error;
    } else if (type && typeof type === 'string') {
      // Get tasks by type
      const result = await getTasksByTypeFromDB(type);
      tasks = result.data;
      error = result.error;
    } else {
      // Get all tasks (advocates only)
      if (user.role !== 'advocate') {
        return res.status(API_STATUS_CODES.FORBIDDEN).json(
          sendAPIResponse({
            status: false,
            message: 'Only advocates can view all tasks',
          })
        );
      }
      
      const result = await getAllTasksFromDB();
      tasks = result.data;
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
        data: tasks,
        message: 'Tasks fetched successfully',
      })
    );

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        error,
        message: 'Internal server error while fetching tasks',
      })
    );
  }
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse, user: any) => {
  // Only advocates can create tasks
  if (user.role !== 'advocate') {
    return res.status(API_STATUS_CODES.FORBIDDEN).json(
      sendAPIResponse({
        status: false,
        message: 'Only advocates can create tasks',
      })
    );
  }

  try {
    const taskData: CreateTaskRequest = req.body;

    // Validate required fields
    const requiredFields = ['title', 'description', 'type'];
    const missingFields = requiredFields.filter(field => !taskData[field as keyof CreateTaskRequest]);
    
    if (missingFields.length > 0) {
      return res.status(API_STATUS_CODES.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        })
      );
    }

    // Create task
    const { data: task, error } = await createTaskInDB(taskData, user.id);
    
    if (error || !task) {
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: error || 'Failed to create task',
        })
      );
    }

    return res.status(API_STATUS_CODES.CREATED).json(
      sendAPIResponse({
        status: true,
        data: task,
        message: 'Task created successfully',
      })
    );

  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        error,
        message: 'Internal server error while creating task',
      })
    );
  }
};

export default withDevRelAuthDB(handler);