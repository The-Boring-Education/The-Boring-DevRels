import { type Model, model, models, Schema } from 'mongoose';
import { DATABASE_MODELS } from '@/constants';
import type { DevRelAdvocateModel } from '@/interfaces';

const DevRelAdvocateSchema = new Schema<DevRelAdvocateModel>(
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
      default: 'advocate',
      immutable: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      default: 'Campus Connect',
    },
    permissions: {
      canManageApplications: {
        type: Boolean,
        default: true,
      },
      canCreateTasks: {
        type: Boolean,
        default: true,
      },
      canManageAccess: {
        type: Boolean,
        default: true,
      },
      canSendOffers: {
        type: Boolean,
        default: true,
      },
    },
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
DevRelAdvocateSchema.index({ email: 1 });

// Instance methods
DevRelAdvocateSchema.methods.hasPermission = function(permission: keyof DevRelAdvocateModel['permissions']): boolean {
  return this.permissions[permission] === true;
};

DevRelAdvocateSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  return {
    _id: obj._id,
    name: obj.name,
    email: obj.email,
    role: obj.role,
    profileImage: obj.profileImage,
    department: obj.department,
    permissions: obj.permissions,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// Static methods
DevRelAdvocateSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

DevRelAdvocateSchema.statics.isAuthorizedEmail = function(email: string) {
  return this.exists({ email: email.toLowerCase() });
};

export const DevRelAdvocate: Model<DevRelAdvocateModel> = 
  models?.[DATABASE_MODELS.DEVREL_ADVOCATE] || 
  model<DevRelAdvocateModel>(DATABASE_MODELS.DEVREL_ADVOCATE, DevRelAdvocateSchema);