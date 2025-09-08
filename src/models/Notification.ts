// src/models/Notification.ts
import mongoose, { Schema } from 'mongoose';
import { 
  INotification, 
  INotificationModel,
  NotificationType,
  Priority
} from '@/types';

// Helper function for formatting Nigerian currency
const formatNigerianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
};

// Helper function for current Nigerian context
const getCurrentNigerianContext = () => {
  const currentDate = new Date();
  const dayOfMonth = currentDate.getDate();
  const month = currentDate.getMonth();
  
  return {
    isSchoolFeeSeason: [0, 8].includes(month), // January, September
    isSalaryCycle: dayOfMonth >= 25 && dayOfMonth <= 28,
    isFestiveSeason: [11, 0].includes(month), // December, January
    salaryDayReminders: true,
    schoolFeeAlerts: true,
    festiveSeasonWarnings: true,
    transportPriceAlerts: true
  };
};

const NotificationSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true, 
      index: true 
    },
    type: { 
      type: String, 
      enum: [
        'category_threshold', 'budget_exceeded', 'weekly_summary', 'custom_alert',
        'salary_reminder', 'school_fee_alert', 'savings_tip', 'bill_reminder'
      ],
      required: true,
      index: true
    },
    title: { 
      type: String, 
      required: true,
      maxlength: 100,
      trim: true
    },
    message: { 
      type: String, 
      required: true,
      maxlength: 500,
      trim: true
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true
    },
    status: { 
      type: String, 
      enum: ['unread', 'read', 'dismissed', 'acted_upon'],
      default: 'unread',
      index: true
    },
    data: {
      category: String,
      amount: Number,
      formattedAmount: String,
      percentage: Number,
      budgetLimit: Number,
      threshold: Number,
      actions: [{
        label: String,
        action: String,
        data: Schema.Types.Mixed
      }],
      progressData: {
        current: Number,
        target: Number,
        percentage: Number
      }
    },
    scheduledFor: { 
      type: Date,
      index: true
    },
    sentAt: { 
      type: Date,
      index: true
    },
    readAt: Date,
    dismissedAt: Date,
    expiresAt: { 
      type: Date,
      index: true
    },
    channels: {
      inApp: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    metadata: {
      triggeredBy: String,
      relatedTransactionId: String,
      relatedBudgetId: String,
      nigerianContext: {
        isSchoolFeeSeason: Boolean,
        isSalaryCycle: Boolean,
        isFestiveSeason: Boolean
      }
    }
  },
  { 
    timestamps: true,
    indexes: [
      { userId: 1, status: 1, createdAt: -1 },
      { userId: 1, type: 1, createdAt: -1 },
      { scheduledFor: 1, status: 1 },
      { expiresAt: 1 }
    ]
  }
);

// TTL index for auto-deletion of expired notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create notification with Nigerian formatting
NotificationSchema.statics.createNigerianAlert = function(
  userId: string, 
  type: NotificationType, 
  title: string, 
  message: string,
  data: any = {},
  priority: Priority = 'medium'
): Partial<INotification> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expire after 7 days

  // Format amounts in Nigerian Naira
  if (data.amount) {
    data.formattedAmount = formatNigerianCurrency(data.amount);
  }

  // Add Nigerian context
  const nigerianContext = getCurrentNigerianContext();

  return {
    userId,
    type,
    title,
    message,
    priority,
    status: 'unread',
    data,
    expiresAt,
    channels: {
      inApp: true,
      push: false,
      email: false,
      sms: false
    },
    metadata: {
      nigerianContext
    }
  };
};

// Method to mark as read
NotificationSchema.methods.markAsRead = function(this: INotification): Promise<INotification> {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Method to dismiss notification
NotificationSchema.methods.dismiss = function(this: INotification): Promise<INotification> {
  this.status = 'dismissed';
  this.dismissedAt = new Date();
  return this.save();
};

export default mongoose.models.Notification || 
  mongoose.model<INotification, INotificationModel>('Notification', NotificationSchema);