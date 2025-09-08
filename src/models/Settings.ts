// src/models/Settings.ts
import mongoose, { Schema } from "mongoose";
import { ISettings, Currency, Locale, Theme, IDataSync } from '@/types';

const SettingsSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    currency: { 
      type: String, 
      enum: ['NGN', 'USD', 'EUR', 'GBP'],
      default: "NGN" 
    },
    locale: { 
      type: String, 
      enum: ['en-NG', 'en-US', 'en-GB'],
      default: "en-NG" 
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    biometricLogin: { 
      type: Boolean, 
      default: false 
    },
    notifications: {
      budgetAlerts: { type: Boolean, default: true },
      weeklySummary: { type: Boolean, default: true },
    },
    dataSync: {
      enabled: { type: Boolean, default: false },
      provider: {
        type: String,
        enum: ["googleDrive", "dropbox", "iCloud", null],
        default: null,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

