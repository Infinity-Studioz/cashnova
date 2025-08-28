import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      unique: true, 
      required: true,
      lowercase: true,
      trim: true
    },
    image: String,
    // For OAuth providers (Google, etc.)
    provider: {
      type: String,
      enum: ['google', 'credentials'],
      default: 'credentials'
    },
    // For email/password authentication
    password: {
      type: String,
      // Required only for credentials provider
      required: function(this: any) {
        return this.provider === 'credentials';
      },
      minlength: 8
    },
    // Email verification
    emailVerified: {
      type: Date,
      default: null
    },
    // User preferences (for future use)
    preferences: {
      currency: {
        type: String,
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
    // Account status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    // Ensure we don't accidentally expose password in JSON
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);