import type { NextApiRequest, NextApiResponse } from 'next';
import { withLeadAuthDB, sendAPIResponse } from '@/middleware/auth';
import { 
  getLeadDashboardDataFromDB,
  getLeadByEmailFromDB,
  getTasksForLeadFromDB,
  getOnboardingTasksFromDB 
} from '@/database/queries';
import { API_STATUS_CODES, TASK_STATUS } from '@/constants';
import type { LeadDashboardData } from '@/interfaces';

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
    const user = (req as any).user;

    // Get lead information
    const { data: lead, error: leadError } = await getLeadByEmailFromDB(user.email);
    
    if (leadError || !lead) {
      return res.status(API_STATUS_CODES.NOT_FOUND).json(
        sendAPIResponse({
          status: false,
          message: leadError || 'Lead profile not found',
        })
      );
    }

    // Check if lead has dashboard access
    if (!lead.canAccessDashboard) {
      return res.status(API_STATUS_CODES.FORBIDDEN).json(
        sendAPIResponse({
          status: false,
          message: 'Dashboard access not granted. Please wait for approval.',
        })
      );
    }

    // Get all tasks for this lead
    const { data: allTasks, error: tasksError } = await getTasksForLeadFromDB(lead._id.toString());
    
    if (tasksError) {
      console.error('Error fetching lead tasks:', tasksError);
    }

    // Get onboarding tasks to calculate progress
    const { data: onboardingTasks, error: onboardingError } = await getOnboardingTasksFromDB();
    
    if (onboardingError) {
      console.error('Error fetching onboarding tasks:', onboardingError);
    }

    // Categorize tasks by status for this lead
    const tasks = (allTasks || []).reduce((acc, task) => {
      const leadStatus = task.getLeadStatus(lead._id.toString());
      const status = leadStatus.status || TASK_STATUS.PENDING;
      
      if (task.isOverdue && status !== TASK_STATUS.COMPLETED) {
        acc.overdue.push(task);
      } else {
        switch (status) {
          case TASK_STATUS.PENDING:
            acc.pending.push(task);
            break;
          case TASK_STATUS.IN_PROGRESS:
            acc.inProgress.push(task);
            break;
          case TASK_STATUS.COMPLETED:
            acc.completed.push(task);
            break;
          default:
            acc.pending.push(task);
        }
      }
      
      return acc;
    }, {
      pending: [] as any[],
      inProgress: [] as any[],
      completed: [] as any[],
      overdue: [] as any[],
    });

    // Calculate onboarding progress
    const totalOnboardingTasks = (onboardingTasks || []).length;
    const completedOnboardingTasks = lead.onboardingProgress.completedTasks.length;
    const onboardingProgress = {
      totalTasks: totalOnboardingTasks,
      completedTasks: completedOnboardingTasks,
      percentage: totalOnboardingTasks > 0 ? Math.round((completedOnboardingTasks / totalOnboardingTasks) * 100) : 0,
      nextTask: tasks.pending.find(task => task.type === 'onboarding') || null,
    };

    const dashboardData: LeadDashboardData = {
      lead,
      tasks,
      onboardingProgress,
      performanceMetrics: lead.performanceMetrics,
    };

    return res.status(API_STATUS_CODES.OK).json(
      sendAPIResponse({
        status: true,
        data: dashboardData,
        message: 'Lead dashboard data fetched successfully',
      })
    );

  } catch (error) {
    console.error('Error fetching lead dashboard data:', error);
    return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        error,
        message: 'Internal server error while fetching dashboard data',
      })
    );
  }
};

export default withLeadAuthDB(handler);