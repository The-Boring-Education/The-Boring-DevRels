import { type Model, model, models, Schema } from 'mongoose';
import { DATABASE_MODELS, APPLICATION_STATUS } from '@/constants';
import type { DevRelApplicationModel } from '@/interfaces';

const DevRelApplicationSchema = new Schema<DevRelApplicationModel>(
  {
    applicantEmail: {
      type: String,
      required: [true, 'Applicant email is required'],
      lowercase: true,
      trim: true,
    },
    
    applicationData: {
      techStack: {
        type: [String],
        required: [true, 'Tech stack is required'],
      },
      experienceLevel: {
        type: String,
        required: [true, 'Experience level is required'],
      },
      learningFocus: {
        type: [String],
        required: [true, 'Learning focus is required'],
      },
      availability: {
        type: String,
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
      },
      previousExperience: String,
      whyTBE: {
        type: String,
        required: [true, 'Why TBE is required'],
      },
    },
    
    commitments: {
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
    },
    
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
    },
    
    // Application Flow Tracking
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewStartedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_MODELS.DEVREL_ADVOCATE,
    },
    reviewNotes: String,
    
    // Video & Quiz Tracking
    videoWatched: {
      type: Boolean,
      default: false,
    },
    videoWatchedAt: Date,
    quizAttempted: {
      type: Boolean,
      default: false,
    },
    quizScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    quizCompletedAt: Date,
    
    // Interview Tracking
    interviewScheduled: {
      type: Boolean,
      default: false,
    },
    interviewLink: String,
    interviewDate: Date,
    interviewCompleted: {
      type: Boolean,
      default: false,
    },
    interviewFeedback: String,
    interviewRating: {
      type: Number,
      min: 1,
      max: 10,
    },
    
    // Final Decision
    finalDecision: {
      type: String,
      enum: ['approved', 'rejected'],
    },
    decisionMadeBy: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_MODELS.DEVREL_ADVOCATE,
    },
    decisionMadeAt: Date,
    decisionNotes: String,
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
DevRelApplicationSchema.index({ applicantEmail: 1 });
DevRelApplicationSchema.index({ status: 1 });
DevRelApplicationSchema.index({ submittedAt: -1 });
DevRelApplicationSchema.index({ reviewedBy: 1 });

// Virtual fields
DevRelApplicationSchema.virtual('daysInReview').get(function() {
  const startDate = this.reviewStartedAt || this.submittedAt;
  return Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
});

DevRelApplicationSchema.virtual('isReadyForInterview').get(function() {
  return this.videoWatched && this.quizAttempted && this.quizScore >= 70;
});

DevRelApplicationSchema.virtual('completionRate').get(function() {
  const steps = {
    submitted: 1,
    videoWatched: this.videoWatched ? 1 : 0,
    quizCompleted: this.quizAttempted ? 1 : 0,
    interviewed: this.interviewCompleted ? 1 : 0,
    decided: this.finalDecision ? 1 : 0,
  };
  
  const completed = Object.values(steps).reduce((sum, val) => sum + val, 0);
  return (completed / 5) * 100;
});

// Instance methods
DevRelApplicationSchema.methods.updateStatus = function(status: string, updatedBy?: string, notes?: string) {
  this.status = status;
  
  if (updatedBy) {
    this.reviewedBy = updatedBy;
    this.reviewedAt = new Date();
    if (!this.reviewStartedAt) {
      this.reviewStartedAt = new Date();
    }
  }
  
  if (notes) {
    this.reviewNotes = notes;
  }
  
  if (status === APPLICATION_STATUS.INTERVIEW_SCHEDULED) {
    this.interviewScheduled = true;
  }
  
  return this.save();
};

DevRelApplicationSchema.methods.markVideoWatched = function() {
  this.videoWatched = true;
  this.videoWatchedAt = new Date();
  return this.save();
};

DevRelApplicationSchema.methods.submitQuiz = function(score: number) {
  this.quizAttempted = true;
  this.quizScore = score;
  this.quizCompletedAt = new Date();
  return this.save();
};

DevRelApplicationSchema.methods.scheduleInterview = function(date: Date, link: string) {
  this.interviewDate = date;
  this.interviewLink = link;
  this.interviewScheduled = true;
  this.status = APPLICATION_STATUS.INTERVIEW_SCHEDULED;
  return this.save();
};

DevRelApplicationSchema.methods.completeInterview = function(feedback: string, rating: number) {
  this.interviewCompleted = true;
  this.interviewFeedback = feedback;
  this.interviewRating = rating;
  this.status = APPLICATION_STATUS.INTERVIEW_COMPLETED;
  return this.save();
};

DevRelApplicationSchema.methods.makeDecision = function(decision: 'approved' | 'rejected', decisionMaker: string, notes?: string) {
  this.finalDecision = decision;
  this.decisionMadeBy = decisionMaker;
  this.decisionMadeAt = new Date();
  this.decisionNotes = notes;
  this.status = decision === 'approved' ? APPLICATION_STATUS.APPROVED : APPLICATION_STATUS.REJECTED;
  return this.save();
};

// Static methods
DevRelApplicationSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ applicantEmail: email.toLowerCase() });
};

DevRelApplicationSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).sort({ submittedAt: -1 });
};

DevRelApplicationSchema.statics.getPendingReviews = function() {
  return this.find({
    status: { $in: [APPLICATION_STATUS.APPLIED, APPLICATION_STATUS.UNDER_REVIEW] }
  }).sort({ submittedAt: 1 });
};

DevRelApplicationSchema.statics.getApplicationStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgScore: { $avg: '$quizScore' },
      },
    },
    {
      $group: {
        _id: null,
        statusStats: {
          $push: {
            status: '$_id',
            count: '$count',
            avgScore: '$avgScore',
          },
        },
        total: { $sum: '$count' },
      },
    },
  ]);
};

export const DevRelApplication: Model<DevRelApplicationModel> = 
  models?.[DATABASE_MODELS.DEVREL_APPLICATION] || 
  model<DevRelApplicationModel>(DATABASE_MODELS.DEVREL_APPLICATION, DevRelApplicationSchema);