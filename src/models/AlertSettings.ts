// src/models/AlertSettings.ts
import mongoose, { Schema } from 'mongoose';
import { 
  IAlertSettings, 
  IAlertSettingsModel,
  WeekDay,
  AlertCondition,
  NotificationTiming,
  ICategoryThreshold,
  IBudgetExceeded,
  IWeeklySummary,
  ICustomAlert,
  INotificationPreferences,
  INigerianContext
} from '@/types';

const AlertSettingsSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true
      // Removed index: true and unique: true - will be handled by schema index
    },
    categoryThreshold: {
      enabled: { type: Boolean, default: true },
      percentage: { type: Number, default: 80, min: 1, max: 100 },
      specificCategory: { type: String, default: null }
    },
    budgetExceeded: {
      enabled: { type: Boolean, default: true },
      percentage: { type: Number, default: 5, min: 1, max: 50 }
    },
    weeklySummary: {
      enabled: { type: Boolean, default: false },
      day: { 
        type: String, 
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        default: 'Sunday'
      },
      time: { 
        type: String, 
        default: '9:00 AM',
        validate: {
          validator: function(v: string) {
            return /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(v);
          },
          message: 'Time must be in format "H:MM AM/PM"'
        }
      }
    },
    customAlerts: [{
      id: { 
        type: String, 
        required: true,
        default: () => new mongoose.Types.ObjectId().toString()
      },
      enabled: { type: Boolean, default: false },
      category: { 
        type: String, 
        required: true,
        trim: true
      },
      condition: { 
        type: String, 
        enum: ['spending_reaches', 'daily_exceeds', 'weekly_exceeds'],
        required: true
      },
      threshold: { 
        type: Number, 
        required: true, 
        min: 0 
      },
      isPercentage: { type: Boolean, default: true },
      notificationTiming: { 
        type: String, 
        enum: ['immediate', 'daily_8pm', 'weekly_friday'],
        default: 'immediate'
      }
    }],
    notificationPreferences: {
      pushNotifications: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false },
      inAppNotifications: { type: Boolean, default: true }
    },
    nigerianContext: {
      salaryDayReminders: { type: Boolean, default: true },
      schoolFeeAlerts: { type: Boolean, default: true },
      festiveSeasonWarnings: { type: Boolean, default: true },
      transportPriceAlerts: { type: Boolean, default: true }
    }
  },
  { 
    timestamps: true
  }
);

// Create the unique index at schema level
AlertSettingsSchema.index({ userId: 1 }, { unique: true });

// Static method to get default settings for a new user
AlertSettingsSchema.statics.getDefaultSettings = function(userId: string): Partial<IAlertSettings> {
  return {
    userId,
    categoryThreshold: {
      enabled: true,
      percentage: 80,
      specificCategory: null
    },
    budgetExceeded: {
      enabled: true,
      percentage: 5
    },
    weeklySummary: {
      enabled: false,
      day: 'Sunday',
      time: '9:00 AM'
    },
    customAlerts: [],
    notificationPreferences: {
      pushNotifications: true,
      emailAlerts: true,
      smsAlerts: false,
      inAppNotifications: true
    },
    nigerianContext: {
      salaryDayReminders: true,
      schoolFeeAlerts: true,
      festiveSeasonWarnings: true,
      transportPriceAlerts: true
    }
  };
};

export default mongoose.models.AlertSettings || 
  mongoose.model<IAlertSettings, IAlertSettingsModel>('AlertSettings', AlertSettingsSchema);