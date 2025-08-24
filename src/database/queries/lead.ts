import { DevRelLead } from '@/database/models';
import type { 
  DatabaseQueryResponse, 
  DevRelLeadModel, 
  ApplicationStatusType,
  LeadDashboardData 
} from '@/interfaces';
import { APPLICATION_STATUS } from '@/constants';

// Get lead by email
export const getLeadByEmailFromDB = async (
  email: string
): Promise<DatabaseQueryResponse<DevRelLeadModel>> => {
  try {
    const lead = await DevRelLead.findByEmail(email);
    
    if (!lead) {
      return { error: 'Lead not found' };
    }
    
    return { data: lead };
  } catch (error) {
    console.error('Error fetching lead by email:', error);
    return { error: 'Failed to fetch lead' };
  }
};

// Get lead by ID
export const getLeadByIdFromDB = async (
  id: string
): Promise<DatabaseQueryResponse<DevRelLeadModel>> => {
  try {
    const lead = await DevRelLead.findById(id)
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email');
    
    if (!lead) {
      return { error: 'Lead not found' };
    }
    
    return { data: lead };
  } catch (error) {
    console.error('Error fetching lead by ID:', error);
    return { error: 'Failed to fetch lead' };
  }
};

// Create new lead
export const createLeadInDB = async (
  leadData: Partial<DevRelLeadModel>
): Promise<DatabaseQueryResponse<DevRelLeadModel>> => {
  try {
    const lead = await DevRelLead.create(leadData);
    return { data: lead };
  } catch (error) {
    console.error('Error creating lead:', error);
    return { error: 'Failed to create lead' };
  }
};

// Update lead
export const updateLeadInDB = async (
  id: string,
  updateData: Partial<DevRelLeadModel>
): Promise<DatabaseQueryResponse<DevRelLeadModel>> => {
  try {
    const lead = await DevRelLead.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!lead) {
      return { error: 'Lead not found' };
    }
    
    return { data: lead };
  } catch (error) {
    console.error('Error updating lead:', error);
    return { error: 'Failed to update lead' };
  }
};

// Update lead status
export const updateLeadStatusInDB = async (
  id: string,
  status: ApplicationStatusType,
  updatedBy?: string
): Promise<DatabaseQueryResponse<DevRelLeadModel>> => {
  try {
    const lead = await DevRelLead.findById(id);
    
    if (!lead) {
      return { error: 'Lead not found' };
    }
    
    await lead.updateStatus(status, updatedBy);
    return { data: lead };
  } catch (error) {
    console.error('Error updating lead status:', error);
    return { error: 'Failed to update lead status' };
  }
};

// Get leads by status
export const getLeadsByStatusFromDB = async (
  status: ApplicationStatusType
): Promise<DatabaseQueryResponse<DevRelLeadModel[]>> => {
  try {
    const leads = await DevRelLead.findByStatus(status)
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    return { data: leads };
  } catch (error) {
    console.error('Error fetching leads by status:', error);
    return { error: 'Failed to fetch leads' };
  }
};

// Get all leads
export const getAllLeadsFromDB = async (): Promise<DatabaseQueryResponse<DevRelLeadModel[]>> => {
  try {
    const leads = await DevRelLead.find({})
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    return { data: leads };
  } catch (error) {
    console.error('Error fetching all leads:', error);
    return { error: 'Failed to fetch leads' };
  }
};

// Get leads with dashboard access
export const getAccessibleLeadsFromDB = async (): Promise<DatabaseQueryResponse<DevRelLeadModel[]>> => {
  try {
    const leads = await DevRelLead.find({
      status: {
        $in: [
          APPLICATION_STATUS.APPROVED,
          APPLICATION_STATUS.OFFER_SENT,
          APPLICATION_STATUS.OFFER_ACCEPTED,
          APPLICATION_STATUS.ONBOARDED
        ]
      }
    }).sort({ createdAt: -1 });
    
    return { data: leads };
  } catch (error) {
    console.error('Error fetching accessible leads:', error);
    return { error: 'Failed to fetch accessible leads' };
  }
};

// Get lead dashboard data
export const getLeadDashboardDataFromDB = async (
  leadId: string
): Promise<DatabaseQueryResponse<Partial<LeadDashboardData>>> => {
  try {
    const lead = await DevRelLead.findById(leadId);
    
    if (!lead) {
      return { error: 'Lead not found' };
    }
    
    if (!lead.canAccessDashboard) {
      return { error: 'Dashboard access not granted' };
    }
    
    const dashboardData = {
      lead,
      onboardingProgress: {
        totalTasks: 0, // Will be calculated with tasks
        completedTasks: lead.onboardingProgress.completedTasks.length,
        percentage: lead.onboardingProgress.completionPercentage,
      },
      performanceMetrics: lead.performanceMetrics,
    };
    
    return { data: dashboardData };
  } catch (error) {
    console.error('Error fetching lead dashboard data:', error);
    return { error: 'Failed to fetch dashboard data' };
  }
};

// Get lead leaderboard
export const getLeadLeaderboardFromDB = async (
  limit = 10
): Promise<DatabaseQueryResponse<DevRelLeadModel[]>> => {
  try {
    const leaderboard = await DevRelLead.getLeaderboard(limit);
    return { data: leaderboard };
  } catch (error) {
    console.error('Error fetching lead leaderboard:', error);
    return { error: 'Failed to fetch leaderboard' };
  }
};

// Get lead analytics
export const getLeadAnalyticsFromDB = async (): Promise<DatabaseQueryResponse<any>> => {
  try {
    const analytics = await DevRelLead.getAnalytics();
    return { data: analytics[0] || { statusCounts: [], total: 0 } };
  } catch (error) {
    console.error('Error fetching lead analytics:', error);
    return { error: 'Failed to fetch analytics' };
  }
};

// Add completed task to lead
export const addCompletedTaskToLeadInDB = async (
  leadId: string,
  taskId: string
): Promise<DatabaseQueryResponse<DevRelLeadModel>> => {
  try {
    const lead = await DevRelLead.findById(leadId);
    
    if (!lead) {
      return { error: 'Lead not found' };
    }
    
    await lead.addCompletedTask(taskId);
    return { data: lead };
  } catch (error) {
    console.error('Error adding completed task to lead:', error);
    return { error: 'Failed to add completed task' };
  }
};

// Update lead performance metrics
export const updateLeadPerformanceInDB = async (
  leadId: string,
  metricsUpdate: Partial<DevRelLeadModel['performanceMetrics']>
): Promise<DatabaseQueryResponse<DevRelLeadModel>> => {
  try {
    const lead = await DevRelLead.findById(leadId);
    
    if (!lead) {
      return { error: 'Lead not found' };
    }
    
    await lead.updatePerformanceMetrics(metricsUpdate);
    return { data: lead };
  } catch (error) {
    console.error('Error updating lead performance:', error);
    return { error: 'Failed to update performance metrics' };
  }
};

// Check if lead can access dashboard
export const checkLeadDashboardAccessFromDB = async (
  email: string
): Promise<DatabaseQueryResponse<boolean>> => {
  try {
    const lead = await DevRelLead.findByEmail(email);
    
    if (!lead) {
      return { data: false };
    }
    
    return { data: lead.canAccessDashboard };
  } catch (error) {
    console.error('Error checking lead dashboard access:', error);
    return { error: 'Failed to check dashboard access' };
  }
};

// Delete lead
export const deleteLeadFromDB = async (
  id: string
): Promise<DatabaseQueryResponse<boolean>> => {
  try {
    const result = await DevRelLead.findByIdAndDelete(id);
    
    if (!result) {
      return { error: 'Lead not found' };
    }
    
    return { data: true };
  } catch (error) {
    console.error('Error deleting lead:', error);
    return { error: 'Failed to delete lead' };
  }
};