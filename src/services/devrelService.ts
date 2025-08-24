import axios from 'axios';
import { API_CONFIG } from '@/config/api';

// DevRel Application Status Types
export type DevRelApplicationStatus = 
  | 'applied' 
  | 'reviewing' 
  | 'interview_scheduled' 
  | 'approved' 
  | 'rejected' 
  | 'offer_sent' 
  | 'offer_accepted' 
  | 'onboarded';

// DevRel Application Interface
export interface DevRelApplication {
  id: string;
  email: string;
  status: DevRelApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  interviewDate?: string;
  interviewLink?: string;
  applicationData?: {
    name: string;
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
  };
}

// API Response Interface
export interface ApiResponse<T = any> {
  status: boolean;
  data?: T;
  message?: string;
  error?: any;
}

// DevRel Service Class
class DevRelService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL || '';
  }

  // Submit new DevRel application
  async submitApplication(data: any): Promise<ApiResponse<DevRelApplication>> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/devrel/apply`, {
        ...data,
        learningFocus: ['Community Building'], // Default for DevRel
      });

      return response.data;
    } catch (error: any) {
      console.error('Error submitting DevRel application:', error);
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to submit application',
        error: error.response?.data || error,
      };
    }
  }

  // Check application status by email
  async checkApplicationStatus(email: string): Promise<ApiResponse<DevRelApplication | null>> {
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
      
      console.error('Error checking DevRel application status:', error);
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to check application status',
        error: error.response?.data || error,
      };
    }
  }

  // Get application by ID
  async getApplicationById(id: string): Promise<ApiResponse<DevRelApplication>> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/devrel/applications/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching DevRel application:', error);
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch application',
        error: error.response?.data || error,
      };
    }
  }

  // Store application data locally
  storeApplicationLocally(applicationData: DevRelApplication): void {
    try {
      localStorage.setItem('devrel_application', JSON.stringify({
        ...applicationData,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error storing application locally:', error);
    }
  }

  // Get application data from local storage
  getLocalApplication(): DevRelApplication | null {
    try {
      const stored = localStorage.getItem('devrel_application');
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('Error reading local application data:', error);
      return null;
    }
  }

  // Clear local application data
  clearLocalApplication(): void {
    try {
      localStorage.removeItem('devrel_application');
    } catch (error) {
      console.error('Error clearing local application data:', error);
    }
  }

  // Check if user has a pending application
  async hasPendingApplication(email: string): Promise<boolean> {
    try {
      const result = await this.checkApplicationStatus(email);
      if (result.status && result.data) {
        const status = result.data.status;
        return ['applied', 'reviewing', 'interview_scheduled'].includes(status);
      }
      return false;
    } catch (error) {
      console.error('Error checking pending application:', error);
      return false;
    }
  }

  // Get application progress percentage
  getApplicationProgress(status: DevRelApplicationStatus): number {
    const progressMap: Record<DevRelApplicationStatus, number> = {
      'applied': 25,
      'reviewing': 50,
      'interview_scheduled': 75,
      'approved': 90,
      'rejected': 0,
      'offer_sent': 95,
      'offer_accepted': 98,
      'onboarded': 100
    };
    
    return progressMap[status] || 0;
  }

  // Get next steps based on current status
  getNextSteps(status: DevRelApplicationStatus): string[] {
    const nextStepsMap: Record<DevRelApplicationStatus, string[]> = {
      'applied': [
        'Application received and under review',
        'Expect response within 2-3 business days'
      ],
      'reviewing': [
        'Application is being reviewed by our team',
        'You may receive additional questions via email'
      ],
      'interview_scheduled': [
        'Interview scheduled! Check your email for details',
        'Prepare for questions about community building and DevRel'
      ],
      'approved': [
        'Congratulations! Your application is approved',
        'Check your email for next steps and onboarding'
      ],
      'rejected': [
        'Thank you for your interest',
        'You may reapply after 6 months'
      ],
      'offer_sent': [
        'Offer letter sent! Check your email',
        'Review and respond within 7 days'
      ],
      'offer_accepted': [
        'Welcome to the team!',
        'Onboarding process will begin shortly'
      ],
      'onboarded': [
        'You\'re now part of our DevRel team!',
        'Access your dashboard and start contributing'
      ]
    };
    
    return nextStepsMap[status] || ['Application submitted successfully'];
  }
}

// Export singleton instance
export const devrelService = new DevRelService();
export default devrelService; 