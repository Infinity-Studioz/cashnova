import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: string;
  month: string; // e.g., "2025-07"
  totalBudget: number;
  spent: number;
  remaining: number;
  AIWarning?: string;
}

const BudgetSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    month: { type: String, required: true },
    totalBudget: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
    AIWarning: { type: String },
  },
  { timestamps: true }
);

BudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget ||
  mongoose.model<IBudget>('Budget', BudgetSchema);
