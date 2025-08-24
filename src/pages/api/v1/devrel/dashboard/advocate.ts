import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdvocateAuthDB, sendAPIResponse } from '@/middleware/auth';
import { 
  getApplicationStatsFromDB,
  getRecentApplicationsFromDB,
  getLeadAnalyticsFromDB,
  getAccessibleLeadsFromDB,
  getTaskStatsFromDB,
  getOverdueTasksFromDB 
} from '@/database/queries';
import { API_STATUS_CODES } from '@/constants';
import type { AdvocateDashboardData } from '@/interfaces';

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
    // Get application statistics
    const { data: appStats, error: appStatsError } = await getApplicationStatsFromDB();
    
    if (appStatsError) {
      console.error('Error fetching application stats:', appStatsError);
    }

    // Get recent applications
    const { data: recentApplications, error: recentAppsError } = await getRecentApplicationsFromDB(10);
    
    if (recentAppsError) {
      console.error('Error fetching recent applications:', recentAppsError);
    }

    // Get lead analytics
    const { data: leadAnalytics, error: leadAnalyticsError } = await getLeadAnalyticsFromDB();
    
    if (leadAnalyticsError) {
      console.error('Error fetching lead analytics:', leadAnalyticsError);
    }

    // Get accessible leads for performance data
    const { data: accessibleLeads, error: leadsError } = await getAccessibleLeadsFromDB();
    
    if (leadsError) {
      console.error('Error fetching accessible leads:', leadsError);
    }

    // Get task statistics
    const { data: taskStats, error: taskStatsError } = await getTaskStatsFromDB();
    
    if (taskStatsError) {
      console.error('Error fetching task stats:', taskStatsError);
    }

    // Get overdue tasks
    const { data: overdueTasks, error: overdueError } = await getOverdueTasksFromDB();
    
    if (overdueError) {
      console.error('Error fetching overdue tasks:', overdueError);
    }

    // Process application statistics
    const applicationStats = appStats?.statusStats || [];
    const applicationCounts = {
      total: appStats?.total || 0,
      pending: applicationStats.find(s => s.status === 'applied')?.count || 0,
      approved: applicationStats.find(s => s.status === 'approved')?.count || 0,
      rejected: applicationStats.find(s => s.status === 'rejected')?.count || 0,
    };

    // Process lead statistics
    const leadStatusCounts = leadAnalytics?.statusCounts || [];
    const leadCounts = {
      total: leadAnalytics?.total || 0,
      active: leadStatusCounts.find(s => s.status === 'onboarded')?.count || 0,
      onboarding: leadStatusCounts.find(s => ['approved', 'offer_sent', 'offer_accepted'].includes(s.status))?.count || 0,
    };

    // Process lead performance data
    const performanceData = (accessibleLeads || []).map(lead => ({
      leadId: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      tasksCompleted: lead.performanceMetrics.tasksCompleted,
      completionRate: lead.getCompletionRate(),
      lastActivity: lead.performanceMetrics.lastActivityAt || lead.updatedAt,
    }));

    // Process task statistics
    const taskStatusCounts = taskStats?.statusCounts || [];
    const taskCounts = {
      total: taskStats?.total || 0,
      active: taskStatusCounts.find(s => ['pending', 'in_progress'].includes(s.status))?.count || 0,
      completed: taskStatusCounts.find(s => s.status === 'completed')?.count || 0,
      overdue: (overdueTasks || []).length,
    };

    const dashboardData: AdvocateDashboardData = {
      applications: {
        ...applicationCounts,
        recent: recentApplications || [],
      },
      leads: {
        ...leadCounts,
        performanceData,
      },
      tasks: taskCounts,
    };

    return res.status(API_STATUS_CODES.OK).json(
      sendAPIResponse({
        status: true,
        data: dashboardData,
        message: 'Advocate dashboard data fetched successfully',
      })
    );

  } catch (error) {
    console.error('Error fetching advocate dashboard data:', error);
    return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        error,
        message: 'Internal server error while fetching dashboard data',
      })
    );
  }
};

export default withAdvocateAuthDB(handler);