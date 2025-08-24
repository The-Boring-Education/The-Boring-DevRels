import type { Document, Schema, Types } from 'mongoose';

// Base API Response Types
export interface APIResponse<T = any> {
  status: boolean;
  data?: T;
  message?: string;
  error?: any;
}

export interface DatabaseQueryResponse<T = any> {
  data?: T;
  error?: string;
}

// User Role Types
export type UserRole = 'advocate' | 'lead';

// Application Status Types
export type ApplicationStatusType = 
  | 'applied' 
  | 'under_review' 
  | 'interview_scheduled' 
  | 'interview_completed' 
  | 'approved' 
  | 'rejected' 
  | 'offer_sent' 
  | 'offer_accepted' 
  | 'onboarded';

// Task Types
export type TaskStatusType = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskType = 'onboarding' | 'weekly' | 'special' | 'training';

// DevRel Advocate Interface
export interface DevRelAdvocateModel extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: 'advocate';
  profileImage?: string;
  department?: string;
  permissions: {
    canManageApplications: boolean;
    canCreateTasks: boolean;
    canManageAccess: boolean;
    canSendOffers: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// DevRel Lead Interface
export interface DevRelLeadModel extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: 'lead';
  status: ApplicationStatusType;
  profileImage?: string;
  
  // Application Data
  applicationData: {
    techStack: string[];
    experienceLevel: string;
    learningFocus: string[];
    availability: string;
    currentRole?: string;
    company?: string;
    linkedinProfile?: string;
    githubProfile?: string;
    portfolioUrl?: string;
    motivation: string;
    previousExperience?: string;
    whyTBE: string;
  };
  
  // Commitment Responses
  commitments: {
    weeklyLearning: boolean;
    communityParticipation: boolean;
    eventAttendance: boolean;
    contentCreation: boolean;
    socialMediaEngagement: boolean;
  };
  
  // Quiz/Assessment Results
  assessmentResults?: {
    devrelKnowledgeScore: number;
    skillAssessmentScore: number;
    totalScore: number;
    completedAt: Date;
  };
  
  // Interview Data
  interviewData?: {
    scheduledAt?: Date;
    interviewerEmail?: string;
    meetingLink?: string;
    feedback?: string;
    rating?: number;
    completedAt?: Date;
  };
  
  // Onboarding Progress
  onboardingProgress: {
    isStarted: boolean;
    completedTasks: Types.ObjectId[];
    completionPercentage: number;
    startedAt?: Date;
    completedAt?: Date;
  };
  
  // Performance Metrics
  performanceMetrics: {
    tasksCompleted: number;
    tasksAssigned: number;
    averageCompletionTime: number; // in days
    streakCount: number;
    lastActivityAt?: Date;
  };
  
  reviewedBy?: Types.ObjectId; // Reference to DevRelAdvocate
  approvedBy?: Types.ObjectId; // Reference to DevRelAdvocate
  rejectedAt?: Date;
  rejectionReason?: string;
  offerSentAt?: Date;
  offerAcceptedAt?: Date;
  onboardedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// DevRel Application Interface (for tracking application flow)
export interface DevRelApplicationModel extends Document {
  _id: Types.ObjectId;
  applicantEmail: string;
  applicationData: DevRelLeadModel['applicationData'];
  commitments: DevRelLeadModel['commitments'];
  status: ApplicationStatusType;
  
  // Application Flow Tracking
  submittedAt: Date;
  reviewStartedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: Types.ObjectId;
  reviewNotes?: string;
  
  // Video & Quiz Tracking
  videoWatched: boolean;
  videoWatchedAt?: Date;
  quizAttempted: boolean;
  quizScore?: number;
  quizCompletedAt?: Date;
  
  // Interview Tracking
  interviewScheduled: boolean;
  interviewLink?: string;
  interviewDate?: Date;
  interviewCompleted: boolean;
  interviewFeedback?: string;
  interviewRating?: number;
  
  // Final Decision
  finalDecision?: 'approved' | 'rejected';
  decisionMadeBy?: Types.ObjectId;
  decisionMadeAt?: Date;
  decisionNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// DevRel Task Interface
export interface DevRelTaskModel extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  type: TaskType;
  priority: 'low' | 'medium' | 'high';
  
  // Assignment
  assignedTo?: Types.ObjectId[]; // Array of DevRelLead IDs
  assignedToAll?: boolean; // If true, assigned to all leads
  createdBy: Types.ObjectId; // DevRelAdvocate ID
  
  // Timing
  dueDate?: Date;
  estimatedHours?: number;
  
  // Status Tracking
  status: TaskStatusType;
  completionTracking: {
    [leadId: string]: {
      status: TaskStatusType;
      startedAt?: Date;
      completedAt?: Date;
      notes?: string;
      submissionUrl?: string;
      reviewStatus?: 'pending' | 'approved' | 'needs_revision';
      reviewNotes?: string;
      reviewedBy?: Types.ObjectId;
      reviewedAt?: Date;
    };
  };
  
  // Task Details
  requirements?: string[];
  resources?: {
    title: string;
    url: string;
    type: 'link' | 'document' | 'video';
  }[];
  
  // Submission Requirements
  submissionRequired: boolean;
  submissionType?: 'url' | 'text' | 'file';
  submissionInstructions?: string;
  
  tags?: string[];
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface CreateApplicationRequest {
  name: string;
  email: string;
  techStack: string[];
  experienceLevel: string;
  learningFocus: string[];
  availability: string;
  currentRole?: string;
  company?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  motivation: string;
  previousExperience?: string;
  whyTBE: string;
  commitments: DevRelLeadModel['commitments'];
}

export interface UpdateApplicationStatusRequest {
  applicationId: string;
  status: ApplicationStatusType;
  notes?: string;
  interviewDate?: Date;
  interviewLink?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  type: TaskType;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string[]; // Lead IDs
  assignedToAll?: boolean;
  dueDate?: Date;
  estimatedHours?: number;
  requirements?: string[];
  resources?: DevRelTaskModel['resources'];
  submissionRequired: boolean;
  submissionType?: 'url' | 'text' | 'file';
  submissionInstructions?: string;
  tags?: string[];
}

export interface UpdateTaskStatusRequest {
  taskId: string;
  leadId: string;
  status: TaskStatusType;
  notes?: string;
  submissionUrl?: string;
}

export interface LeadDashboardData {
  lead: DevRelLeadModel;
  tasks: {
    pending: DevRelTaskModel[];
    inProgress: DevRelTaskModel[];
    completed: DevRelTaskModel[];
    overdue: DevRelTaskModel[];
  };
  onboardingProgress: {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
    nextTask?: DevRelTaskModel;
  };
  performanceMetrics: DevRelLeadModel['performanceMetrics'];
}

export interface AdvocateDashboardData {
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    recent: DevRelApplicationModel[];
  };
  leads: {
    total: number;
    active: number;
    onboarding: number;
    performanceData: Array<{
      leadId: string;
      name: string;
      email: string;
      tasksCompleted: number;
      completionRate: number;
      lastActivity: Date;
    }>;
  };
  tasks: {
    total: number;
    active: number;
    completed: number;
    overdue: number;
  };
}

// NextAuth Extensions
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role?: UserRole;
      isAuthorized: boolean;
    };
  }

  interface User {
    id: string;
    role?: UserRole;
    isAuthorized: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    isAuthorized: boolean;
  }
}

// Email Template Types
export interface OfferLetterData {
  candidateName: string;
  candidateEmail: string;
  position: string;
  startDate: Date;
  reportingManager: string;
  credentials: {
    dashboardUrl: string;
    temporaryPassword: string;
  };
}

export interface EmailNotification {
  to: string;
  subject: string;
  template: 'offer_letter' | 'status_update' | 'task_assigned' | 'welcome';
  data: any;
}