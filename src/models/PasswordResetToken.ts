import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordResetToken extends Document {
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const PasswordResetTokenSchema: Schema = new Schema({
  userId: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true 
  },
  token: { 
    type: String, 
    required: true,
    unique: true 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    // Automatically delete expired tokens after 1 hour
    expires: 0
  },
  used: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
PasswordResetTokenSchema.index({ token: 1 });
PasswordResetTokenSchema.index({ email: 1 });
PasswordResetTokenSchema.index({ expiresAt: 1 });

export default mongoose.models.PasswordResetToken || 
  mongoose.model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema);