// src/models/PasswordResetToken.ts
import mongoose, { Schema } from 'mongoose';
import { IPasswordResetToken } from '@/types';

const PasswordResetTokenSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true,
      index: true
    },
    email: { 
      type: String, 
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    token: { 
      type: String, 
      required: true,
      unique: true // This creates an index automatically
    },
    expiresAt: { 
      type: Date, 
      required: true,
      expires: 0 // TTL index - this is sufficient, no need for additional index
    },
    used: { 
      type: Boolean, 
      default: false,
      index: true
    }
  }, 
  { 
    timestamps: true 
  }
);

// Compound indexes for specific query patterns
PasswordResetTokenSchema.index({ token: 1, used: 1 });
// PasswordResetTokenSchema.index({ email: 1, expiresAt: 1 });

export default mongoose.models.PasswordResetToken || 
  mongoose.model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema);