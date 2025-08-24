import { type Model, model, models, Schema } from 'mongoose';
import { DATABASE_MODELS, TASK_STATUS, TASK_TYPES } from '@/constants';
import type { DevRelTaskModel } from '@/interfaces';

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
  },
  url: {
    type: String,
    required: [true, 'Resource URL is required'],
  },
  type: {
    type: String,
    enum: ['link', 'document', 'video'],
    required: [true, 'Resource type is required'],
  },
}, { _id: false });

const CompletionTrackingSchema = new Schema({}, { strict: false }); // Dynamic schema for leadId keys

const DevRelTaskSchema = new Schema<DevRelTaskModel>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(TASK_TYPES),
      required: [true, 'Task type is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    
    // Assignment
    assignedTo: [{
      type: Schema.Types.ObjectId,
      ref: DATABASE_MODELS.DEVREL_LEAD,
    }],
    assignedToAll: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: DATABASE_MODELS.DEVREL_ADVOCATE,
      required: [true, 'Task creator is required'],
    },
    
    // Timing
    dueDate: Date,
    estimatedHours: {
      type: Number,
      min: 0,
    },
    
    // Status Tracking
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.PENDING,
    },
    completionTracking: {
      type: Map,
      of: {
        status: {
          type: String,
          enum: Object.values(TASK_STATUS),
          default: TASK_STATUS.PENDING,
        },
        startedAt: Date,
        completedAt: Date,
        notes: String,
        submissionUrl: String,
        reviewStatus: {
          type: String,
          enum: ['pending', 'approved', 'needs_revision'],
        },
        reviewNotes: String,
        reviewedBy: {
          type: Schema.Types.ObjectId,
          ref: DATABASE_MODELS.DEVREL_ADVOCATE,
        },
        reviewedAt: Date,
      },
      default: () => new Map(),
    },
    
    // Task Details
    requirements: [String],
    resources: [ResourceSchema],
    
    // Submission Requirements
    submissionRequired: {
      type: Boolean,
      default: false,
    },
    submissionType: {
      type: String,
      enum: ['url', 'text', 'file'],
    },
    submissionInstructions: String,
    
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        // Convert Map to Object for JSON serialization
        if (ret.completionTracking instanceof Map) {
          ret.completionTracking = Object.fromEntries(ret.completionTracking);
        }
        return ret;
      },
    },
  }
);

// Indexes
DevRelTaskSchema.index({ type: 1 });
DevRelTaskSchema.index({ status: 1 });
DevRelTaskSchema.index({ createdBy: 1 });
DevRelTaskSchema.index({ assignedTo: 1 });
DevRelTaskSchema.index({ dueDate: 1 });
DevRelTaskSchema.index({ isActive: 1 });
DevRelTaskSchema.index({ tags: 1 });

// Virtual fields
DevRelTaskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && new Date() > this.dueDate && this.status !== TASK_STATUS.COMPLETED;
});

DevRelTaskSchema.virtual('completionRate').get(function() {
  if (this.assignedToAll || this.assignedTo.length === 0) return 0;
  
  const completed = Array.from(this.completionTracking.values()).filter(
    (tracking: any) => tracking.status === TASK_STATUS.COMPLETED
  ).length;
  
  return (completed / this.assignedTo.length) * 100;
});

DevRelTaskSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const diffTime = this.dueDate.getTime() - Date.now();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Instance methods
DevRelTaskSchema.methods.assignToLead = function(leadId: string) {
  if (!this.assignedTo.includes(leadId)) {
    this.assignedTo.push(leadId);
    this.completionTracking.set(leadId, {
      status: TASK_STATUS.PENDING,
    });
  }
  return this.save();
};

DevRelTaskSchema.methods.updateLeadProgress = function(
  leadId: string, 
  status: string, 
  data: any = {}
) {
  const tracking = this.completionTracking.get(leadId) || {};
  
  tracking.status = status;
  
  if (status === TASK_STATUS.IN_PROGRESS && !tracking.startedAt) {
    tracking.startedAt = new Date();
  }
  
  if (status === TASK_STATUS.COMPLETED) {
    tracking.completedAt = new Date();
  }
  
  // Merge additional data
  Object.assign(tracking, data);
  
  this.completionTracking.set(leadId, tracking);
  
  // Update overall task status
  this.updateOverallStatus();
  
  return this.save();
};

DevRelTaskSchema.methods.submitWork = function(leadId: string, submissionData: any) {
  const tracking = this.completionTracking.get(leadId) || {};
  
  tracking.status = TASK_STATUS.COMPLETED;
  tracking.completedAt = new Date();
  tracking.submissionUrl = submissionData.url;
  tracking.notes = submissionData.notes;
  
  if (this.submissionRequired) {
    tracking.reviewStatus = 'pending';
  }
  
  this.completionTracking.set(leadId, tracking);
  this.updateOverallStatus();
  
  return this.save();
};

DevRelTaskSchema.methods.reviewSubmission = function(
  leadId: string, 
  reviewerId: string, 
  decision: 'approved' | 'needs_revision', 
  notes?: string
) {
  const tracking = this.completionTracking.get(leadId);
  
  if (tracking) {
    tracking.reviewStatus = decision;
    tracking.reviewNotes = notes;
    tracking.reviewedBy = reviewerId;
    tracking.reviewedAt = new Date();
    
    this.completionTracking.set(leadId, tracking);
  }
  
  return this.save();
};

DevRelTaskSchema.methods.updateOverallStatus = function() {
  if (this.assignedToAll) return; // Don't update status for global tasks
  
  const trackingValues = Array.from(this.completionTracking.values());
  
  if (trackingValues.every((t: any) => t.status === TASK_STATUS.COMPLETED)) {
    this.status = TASK_STATUS.COMPLETED;
  } else if (trackingValues.some((t: any) => t.status === TASK_STATUS.IN_PROGRESS)) {
    this.status = TASK_STATUS.IN_PROGRESS;
  } else if (this.isOverdue) {
    this.status = TASK_STATUS.OVERDUE;
  } else {
    this.status = TASK_STATUS.PENDING;
  }
};

DevRelTaskSchema.methods.getLeadStatus = function(leadId: string) {
  return this.completionTracking.get(leadId) || { status: TASK_STATUS.PENDING };
};

// Static methods
DevRelTaskSchema.statics.findByType = function(type: string) {
  return this.find({ type, isActive: true }).sort({ createdAt: -1 });
};

DevRelTaskSchema.statics.findForLead = function(leadId: string) {
  return this.find({
    $or: [
      { assignedTo: leadId },
      { assignedToAll: true }
    ],
    isActive: true
  }).sort({ dueDate: 1, createdAt: -1 });
};

DevRelTaskSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: TASK_STATUS.COMPLETED },
    isActive: true
  });
};

DevRelTaskSchema.statics.getTaskStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
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

DevRelTaskSchema.statics.getLeadTaskSummary = function(leadId: string) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { assignedTo: mongoose.Types.ObjectId(leadId) },
          { assignedToAll: true }
        ],
        isActive: true
      }
    },
    {
      $addFields: {
        leadStatus: {
          $ifNull: [`$completionTracking.${leadId}.status`, 'pending']
        }
      }
    },
    {
      $group: {
        _id: '$leadStatus',
        count: { $sum: 1 },
        tasks: { $push: '$$ROOT' }
      }
    }
  ]);
};

export const DevRelTask: Model<DevRelTaskModel> = 
  models?.[DATABASE_MODELS.DEVREL_TASK] || 
  model<DevRelTaskModel>(DATABASE_MODELS.DEVREL_TASK, DevRelTaskSchema);