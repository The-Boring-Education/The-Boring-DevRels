import { type Model, model, models, Schema } from 'mongoose';
import { DATABASE_MODELS, APPLICATION_STATUS, TECH_STACKS, EXPERIENCE_LEVELS, LEARNING_FOCUS, AVAILABILITY } from '@/constants';
import type { DevRelLeadModel } from '@/interfaces';

const ApplicationDataSchema = new Schema({
  techStack: {
    type: [String],
    enum: TECH_STACKS,
    required: [true, 'Tech stack is required'],
  },
  experienceLevel: {
    type: String,
    enum: EXPERIENCE_LEVELS,
    required: [true, 'Experience level is required'],
  },
  learningFocus: {
    type: [String],
    enum: LEARNING_FOCUS,
    required: [true, 'Learning focus is required'],
  },
  availability: {
    type: String,
    enum: AVAILABILITY,
    required: [true, 'Availability is required'],
  },
  currentRole: String,
  company: String,
  linkedinProfile: String,
  githubProfile: String,
  portfolioUrl: String,
  motivation: {
    type: String,
    required: [true, 'Motivation is required'],
    maxlength: [1000, 'Motivation cannot exceed 1000 characters'],
  },
  previousExperience: {
    type: String,
    maxlength: [1000, 'Previous experience cannot exceed 1000 characters'],
  },
  whyTBE: {
    type: String,
    required: [true, 'Why TBE is required'],
    maxlength: [1000, 'Why TBE cannot exceed 1000 characters'],
  },
}, { _id: false });

const CommitmentsSchema = new Schema({
  weeklyLearning: {
    type: Boolean,
    required: [true, 'Weekly learning commitment is required'],
  },
  communityParticipation: {
    type: Boolean,
    required: [true, 'Community participation commitment is required'],
  },
  eventAttendance: {
    type: Boolean,
    required: [true, 'Event attendance commitment is required'],
  },
  contentCreation: {
    type: Boolean,
    required: [true, 'Content creation commitment is required'],
  },
  socialMediaEngagement: {
    type: Boolean,
    required: [true, 'Social media engagement commitment is required'],
  },
}, { _id: false });

const AssessmentResultsSchema = new Schema({
  devrelKnowledgeScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  skillAssessmentScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const InterviewDataSchema = new Schema({
  scheduledAt: Date,
  interviewerEmail: String,
  meetingLink: String,
  feedback: {
    type: String,
    maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
  },
  completedAt: Date,
}, { _id: false });

const OnboardingProgressSchema = new Schema({
  isStarted: {
    type: Boolean,
    default: false,
  },
  completedTasks: [{
    type: Schema.Types.ObjectId,
    ref: DATABASE_MODELS.DEVREL_TASK,
  }],
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  startedAt: Date,
  completedAt: Date,
}, { _id: false });

const PerformanceMetricsSchema = new Schema({
  tasksCompleted: {
    type: Number,
    default: 0,
  },
  tasksAssigned: {
    type: Number,
    default: 0,
  },
  averageCompletionTime: {
    type: Number,
    default: 0,
  },
  streakCount: {
    type: Number,
    default: 0,
  },
  lastActivityAt: Date,
}, { _id: false });

const DevRelLeadSchema = new Schema<DevRelLeadModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'lead',
      immutable: true,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
    },
    profileImage: String,
    
    applicationData: {
      type: ApplicationDataSchema,
      required: [true, 'Application data is required'],
    },
    
    commitments: {
      type: CommitmentsSchema,
      required: [true, 'Commitments are required'],
    },
    
    assessmentResults: AssessmentResultsSchema,
    interviewData: InterviewDataSchema,
    
    onboardingProgress: {
      type: OnboardingProgressSchema,
      default: () => ({}),
    },
    
    performanceMetrics: {
      type: PerformanceMetricsSchema,
      default: () => ({}),
    },
    
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_MODELS.DEVREL_ADVOCATE,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_MODELS.DEVREL_ADVOCATE,
    },
    rejectedAt: Date,
    rejectionReason: String,
    offerSentAt: Date,
    offerAcceptedAt: Date,
    onboardedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
DevRelLeadSchema.index({ email: 1 });
DevRelLeadSchema.index({ status: 1 });
DevRelLeadSchema.index({ createdAt: -1 });
DevRelLeadSchema.index({ 'applicationData.experienceLevel': 1 });
DevRelLeadSchema.index({ 'applicationData.techStack': 1 });

// Virtual fields
DevRelLeadSchema.virtual('isOnboarded').get(function() {
  return this.status === APPLICATION_STATUS.ONBOARDED;
});

DevRelLeadSchema.virtual('canAccessDashboard').get(function() {
  return [
    APPLICATION_STATUS.APPROVED,
    APPLICATION_STATUS.OFFER_SENT,
    APPLICATION_STATUS.OFFER_ACCEPTED,
    APPLICATION_STATUS.ONBOARDED
  ].includes(this.status);
});

DevRelLeadSchema.virtual('applicationAge').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Instance methods
DevRelLeadSchema.methods.updateStatus = function(status: string, updatedBy?: string) {
  this.status = status;
  
  if (status === APPLICATION_STATUS.APPROVED && updatedBy) {
    this.approvedBy = updatedBy;
  }
  
  if (status === APPLICATION_STATUS.REJECTED) {
    this.rejectedAt = new Date();
  }
  
  if (status === APPLICATION_STATUS.OFFER_SENT) {
    this.offerSentAt = new Date();
  }
  
  if (status === APPLICATION_STATUS.OFFER_ACCEPTED) {
    this.offerAcceptedAt = new Date();
  }
  
  if (status === APPLICATION_STATUS.ONBOARDED) {
    this.onboardedAt = new Date();
    this.onboardingProgress.isStarted = true;
    this.onboardingProgress.startedAt = new Date();
  }
  
  return this.save();
};

DevRelLeadSchema.methods.addCompletedTask = function(taskId: string) {
  if (!this.onboardingProgress.completedTasks.includes(taskId)) {
    this.onboardingProgress.completedTasks.push(taskId);
    this.performanceMetrics.tasksCompleted += 1;
    this.performanceMetrics.lastActivityAt = new Date();
  }
  return this.save();
};

DevRelLeadSchema.methods.updatePerformanceMetrics = function(metricsUpdate: Partial<DevRelLeadModel['performanceMetrics']>) {
  Object.assign(this.performanceMetrics, metricsUpdate);
  return this.save();
};

DevRelLeadSchema.methods.getCompletionRate = function() {
  if (this.performanceMetrics.tasksAssigned === 0) return 0;
  return (this.performanceMetrics.tasksCompleted / this.performanceMetrics.tasksAssigned) * 100;
};

// Static methods
DevRelLeadSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

DevRelLeadSchema.statics.findByStatus = function(status: string) {
  return this.find({ status });
};

DevRelLeadSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find({ status: APPLICATION_STATUS.ONBOARDED })
    .sort({ 'performanceMetrics.tasksCompleted': -1, 'performanceMetrics.streakCount': -1 })
    .limit(limit)
    .select('name email performanceMetrics');
};

DevRelLeadSchema.statics.getAnalytics = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        statusCounts: {
          $push: {
            status: '$_id',
            count: '$count',
          },
        },
        total: { $sum: '$count' },
      },
    },
  ]);
};

export const DevRelLead: Model<DevRelLeadModel> = 
  models?.[DATABASE_MODELS.DEVREL_LEAD] || 
  model<DevRelLeadModel>(DATABASE_MODELS.DEVREL_LEAD, DevRelLeadSchema);