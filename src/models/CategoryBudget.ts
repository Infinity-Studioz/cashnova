import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryBudget extends Document {
  userId: string;
  month: string; // e.g., "2025-07"
  category: string;
  allocated: number;
  spent: number;
  AIRecommendation?: string;
}

const CategoryBudgetSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    month: { type: String, required: true },
    category: { type: String, required: true },
    allocated: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    AIRecommendation: { type: String },
  },
  { timestamps: true }
);

CategoryBudgetSchema.index(
  { userId: 1, month: 1, category: 1 },
  { unique: true }
);

export default mongoose.models.CategoryBudget ||
  mongoose.model<ICategoryBudget>("CategoryBudget", CategoryBudgetSchema);
