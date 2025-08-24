import axios from 'axios';
import { API_CONFIG, getApiUrl } from '@/config/api';

// Types for hiring operations
export interface HiringApplication {
  id: string;
  name: string;
  email: string;
  techStack: string[];
  experienceLevel: string;
  availability: string;
  motivation: string;
  whyTBE: string;
  commitments: {
    weeklyLearning: boolean;
    communityParticipation: boolean;
    eventAttendance: boolean;
    contentCreation: boolean;
    socialMediaEngagement: boolean;
  };
  status: 'applied' | 'reviewing' | 'interview_scheduled' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  interviewDate?: string;
  interviewLink?: string;
}

export interface CreateApplicationRequest {
  name: string;
  email: string;
  techStack: string[];
  experienceLevel: string;
  availability: string;
  motivation: string;
  whyTBE: string;
  commitments: {
    weeklyLearning: boolean;
    communityParticipation: boolean;
    eventAttendance: boolean;
    contentCreation: boolean;
    socialMediaEngagement: boolean;
  };
  currentRole?: string;
  company?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  previousExperience?: string;
}

export interface UpdateApplicationRequest {
  status: string;
  notes?: string;
  interviewDate?: string;
  interviewLink?: string;
}

export interface ApiResponse<T = any> {
  status: boolean;
  data?: T;
  message?: string;
  error?: any;
}

// Hiring Service Class
class HiringService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL || '';
  }

  // Submit new application
  async submitApplication(data: CreateApplicationRequest): Promise<ApiResponse<HiringApplication>> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/devrel/apply`, {
        ...data,
        learningFocus: ['Community Building'], // Default for DevRel
      });

      return response.data;
    } catch (error: any) {
      console.error('Error submitting application:', error);
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to submit application',
        error: error.response?.data || error,
      };
    }
  }

  // Get all applications (for advocates)
  async getApplications(status?: string): Promise<ApiResponse<HiringApplication[]>> {
    try {
      const url = status 
        ? `${this.baseURL}/api/v1/devrel/applications?status=${status}`
        : `${this.baseURL}/api/v1/devrel/applications`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch applications',
        error: error.response?.data || error,
      };
    }
  }

  // Update application status (for advocates)
  async updateApplicationStatus(
    applicationId: string, 
    data: UpdateApplicationRequest
  ): Promise<ApiResponse<HiringApplication>> {
    try {
      const response = await axios.put(`${this.baseURL}/api/v1/devrel/applications`, {
        applicationId,
        ...data,
      });

      return response.data;
    } catch (error: any) {
      console.error('Error updating application status:', error);
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to update application status',
        error: error.response?.data || error,
      };
    }
  }

  // Get application by ID
  async getApplicationById(id: string): Promise<ApiResponse<HiringApplication>> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/devrel/applications/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching application:', error);
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch application',
        error: error.response?.data || error,
      };
    }
  }

  // Check application status by email
  async checkApplicationStatus(email: string): Promise<ApiResponse<HiringApplication | null>> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/devrel/applications/status/${email}`);
      return response.data;
    } catch (error: any) {
      // If application doesn't exist, that's fine
      if (error.response?.status === 404) {
        return {
          status: true,
          data: null,
          message: 'No application found',
        };
      }
      
      console.error('Error checking application status:', error);
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to check application status',
        error: error.response?.data || error,
      };
    }
  }
}

// Export singleton instance
export const hiringService = new HiringService();
export default hiringService; 