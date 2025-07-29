import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  userId: string;
  currency: string;
  locale: string;
  theme: "light" | "dark" | "system";
  biometricLogin: boolean;
  notifications: {
    budgetAlerts: boolean;
    weeklySummary: boolean;
  };
  dataSync: {
    enabled: boolean;
    provider: "googleDrive" | "dropbox" | "iCloud" | null;
  };
}

const SettingsSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    currency: { type: String, default: "NGN" },
    locale: { type: String, default: "en-NG" },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    biometricLogin: { type: Boolean, default: false },
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
