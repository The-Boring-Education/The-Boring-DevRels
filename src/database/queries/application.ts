import { DevRelApplication } from '@/database/models';
import type { 
  DatabaseQueryResponse, 
  DevRelApplicationModel, 
  ApplicationStatusType,
  CreateApplicationRequest 
} from '@/interfaces';
import { APPLICATION_STATUS } from '@/constants';

// Create new application
export const createApplicationInDB = async (
  applicationData: CreateApplicationRequest
): Promise<DatabaseQueryResponse<DevRelApplicationModel>> => {
  try {
    const application = await DevRelApplication.create({
      applicantEmail: applicationData.email,
      applicationData: {
        techStack: applicationData.techStack,
        experienceLevel: applicationData.experienceLevel,
        learningFocus: applicationData.learningFocus,
        availability: applicationData.availability,
        currentRole: applicationData.currentRole,
        company: applicationData.company,
        linkedinProfile: applicationData.linkedinProfile,
        githubProfile: applicationData.githubProfile,
        portfolioUrl: applicationData.portfolioUrl,
        motivation: applicationData.motivation,
        previousExperience: applicationData.previousExperience,
        whyTBE: applicationData.whyTBE,
      },
      commitments: applicationData.commitments,
      status: APPLICATION_STATUS.APPLIED,
    });
    
    return { data: application };
  } catch (error) {
    console.error('Error creating application:', error);
    return { error: 'Failed to create application' };
  }
};

// Get application by email
export const getApplicationByEmailFromDB = async (
  email: string
): Promise<DatabaseQueryResponse<DevRelApplicationModel>> => {
  try {
    const application = await DevRelApplication.findByEmail(email)
      .populate('reviewedBy', 'name email')
      .populate('decisionMadeBy', 'name email');
    
    if (!application) {
      return { error: 'Application not found' };
    }
    
    return { data: application };
  } catch (error) {
    console.error('Error fetching application by email:', error);
    return { error: 'Failed to fetch application' };
  }
};

// Get application by ID
export const getApplicationByIdFromDB = async (
  id: string
): Promise<DatabaseQueryResponse<DevRelApplicationModel>> => {
  try {
    const application = await DevRelApplication.findById(id)
      .populate('reviewedBy', 'name email')
      .populate('decisionMadeBy', 'name email');
    
    if (!application) {
      return { error: 'Application not found' };
    }
    
    return { data: application };
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    return { error: 'Failed to fetch application' };
  }
};

// Get applications by status
export const getApplicationsByStatusFromDB = async (
  status: ApplicationStatusType
): Promise<DatabaseQueryResponse<DevRelApplicationModel[]>> => {
  try {
    const applications = await DevRelApplication.findByStatus(status)
      .populate('reviewedBy', 'name email')
      .populate('decisionMadeBy', 'name email');
    
    return { data: applications };
  } catch (error) {
    console.error('Error fetching applications by status:', error);
    return { error: 'Failed to fetch applications' };
  }
};

// Get all applications
export const getAllApplicationsFromDB = async (): Promise<DatabaseQueryResponse<DevRelApplicationModel[]>> => {
  try {
    const applications = await DevRelApplication.find({})
      .populate('reviewedBy', 'name email')
      .populate('decisionMadeBy', 'name email')
      .sort({ submittedAt: -1 });
    
    return { data: applications };
  } catch (error) {
    console.error('Error fetching all applications:', error);
    return { error: 'Failed to fetch applications' };
  }
};

// Get pending reviews
export const getPendingReviewsFromDB = async (): Promise<DatabaseQueryResponse<DevRelApplicationModel[]>> => {
  try {
    const applications = await DevRelApplication.getPendingReviews()
      .populate('reviewedBy', 'name email');
    
    return { data: applications };
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return { error: 'Failed to fetch pending reviews' };
  }
};

// Update application status
export const updateApplicationStatusInDB = async (
  id: string,
  status: ApplicationStatusType,
  updatedBy?: string,
  notes?: string
): Promise<DatabaseQueryResponse<DevRelApplicationModel>> => {
  try {
    const application = await DevRelApplication.findById(id);
    
    if (!application) {
      return { error: 'Application not found' };
    }
    
    await application.updateStatus(status, updatedBy, notes);
    return { data: application };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { error: 'Failed to update application status' };
  }
};

// Mark video as watched
export const markVideoWatchedInDB = async (
  applicationId: string
): Promise<DatabaseQueryResponse<DevRelApplicationModel>> => {
  try {
    const application = await DevRelApplication.findById(applicationId);
    
    if (!application) {
      return { error: 'Application not found' };
    }
    
    await application.markVideoWatched();
    return { data: application };
  } catch (error) {
    console.error('Error marking video as watched:', error);
    return { error: 'Failed to mark video as watched' };
  }
};

// Submit quiz
export const submitQuizInDB = async (
  applicationId: string,
  score: number
): Promise<DatabaseQueryResponse<DevRelApplicationModel>> => {
  try {
    const application = await DevRelApplication.findById(applicationId);
    
    if (!application) {
      return { error: 'Application not found' };
    }
    
    await application.submitQuiz(score);
    return { data: application };
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return { error: 'Failed to submit quiz' };
  }
};

// Schedule interview
export const scheduleInterviewInDB = async (
  applicationId: string,
  date: Date,
  link: string
): Promise<DatabaseQueryResponse<DevRelApplicationModel>> => {
  try {
    const application = await DevRelApplication.findById(applicationId);
    
    if (!application) {
      return { error: 'Application not found' };
    }
    
    await application.scheduleInterview(date, link);
    return { data: application };
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return { error: 'Failed to schedule interview' };
  }
};

// Complete interview
export const completeInterviewInDB = async (
  applicationId: string,
  feedback: string,
  rating: number
): Promise<DatabaseQueryResponse<DevRelApplicationModel>> => {
  try {
    const application = await DevRelApplication.findById(applicationId);
    
    if (!application) {
      return { error: 'Application not found' };
    }
    
    await application.completeInterview(feedback, rating);
    return { data: application };
  } catch (error) {
    console.error('Error completing interview:', error);
    return { error: 'Failed to complete interview' };
  }
};

// Make final decision
export const makeApplicationDecisionInDB = async (
  applicationId: string,
  decision: 'approved' | 'rejected',
  decisionMaker: string,
  notes?: string
): Promise<DatabaseQueryResponse<DevRelApplicationModel>> => {
  try {
    const application = await DevRelApplication.findById(applicationId);
    
    if (!application) {
      return { error: 'Application not found' };
    }
    
    await application.makeDecision(decision, decisionMaker, notes);
    return { data: application };
  } catch (error) {
    console.error('Error making application decision:', error);
    return { error: 'Failed to make decision' };
  }
};

// Get application statistics
export const getApplicationStatsFromDB = async (): Promise<DatabaseQueryResponse<any>> => {
  try {
    const stats = await DevRelApplication.getApplicationStats();
    return { data: stats[0] || { statusStats: [], total: 0 } };
  } catch (error) {
    console.error('Error fetching application stats:', error);
    return { error: 'Failed to fetch application statistics' };
  }
};

// Get recent applications
export const getRecentApplicationsFromDB = async (
  limit = 10
): Promise<DatabaseQueryResponse<DevRelApplicationModel[]>> => {
  try {
    const applications = await DevRelApplication.find({})
      .populate('reviewedBy', 'name email')
      .sort({ submittedAt: -1 })
      .limit(limit);
    
    return { data: applications };
  } catch (error) {
    console.error('Error fetching recent applications:', error);
    return { error: 'Failed to fetch recent applications' };
  }
};

// Check if application exists for email
export const checkApplicationExistsFromDB = async (
  email: string
): Promise<DatabaseQueryResponse<boolean>> => {
  try {
    const exists = await DevRelApplication.exists({ applicantEmail: email.toLowerCase() });
    return { data: !!exists };
  } catch (error) {
    console.error('Error checking application existence:', error);
    return { error: 'Failed to check application existence' };
  }
};

// Delete application
export const deleteApplicationFromDB = async (
  id: string
): Promise<DatabaseQueryResponse<boolean>> => {
  try {
    const result = await DevRelApplication.findByIdAndDelete(id);
    
    if (!result) {
      return { error: 'Application not found' };
    }
    
    return { data: true };
  } catch (error) {
    console.error('Error deleting application:', error);
    return { error: 'Failed to delete application' };
  }
};