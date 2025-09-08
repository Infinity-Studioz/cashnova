// src/models/User.ts
import mongoose, { Schema } from "mongoose";
import { IUser, AuthProvider } from '@/types';

const UserSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    email: { 
      type: String, 
      unique: true,  // This creates the index - no need for separate UserSchema.index()
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation
    },
    image: {
      type: String,
      validate: {
        validator: function(v: string) {
          // Basic URL validation if image is provided
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Image must be a valid URL'
      }
    },
    provider: {
      type: String,
      enum: ['google', 'credentials', 'dual'],
      default: 'credentials',
      index: true  // Simple index for provider queries
    },
    password: {
      type: String,
      required: function(this: IUser) {
        return this.provider === 'credentials' || this.provider === 'dual';
      },
      minlength: 8
    },
    emailVerified: {
      type: Date,
      default: null
    },
    preferences: {
      currency: {
        type: String,
        enum: ['NGN', 'USD', 'EUR', 'GBP'],
        default: 'NGN'
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      }
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true  // Simple index for active user queries
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password; // Never expose password in JSON
        return ret;
      }
    }
    // Removed the indexes array since we're using field-level indexing
  }
);

export default mongoose.models.User || 
  mongoose.model<IUser>("User", UserSchema);