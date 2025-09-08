// src/models/CategoryBudget.ts

import mongoose, { Schema } from "mongoose";
import { ICategoryBudget } from '@/types';

const CategoryBudgetSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true,
      index: true
    },
    month: { 
      type: String, 
      required: true,
      match: /^\d{4}-\d{2}$/, // Enforce YYYY-MM format
      index: true
    },
    category: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    allocated: { 
      type: Number, 
      required: true,
      min: 0
    },
    spent: { 
      type: Number, 
      default: 0,
      min: 0
    },
    AIRecommendation: { 
      type: String,
      maxlength: 500
    }
  },
  { 
    timestamps: true,
    indexes: [
      { userId: 1, month: 1, category: 1 }
    ]
  }
);

// Ensure unique constraint for userId + month + category combination
CategoryBudgetSchema.index(
  { userId: 1, month: 1, category: 1 },
  { unique: true }
);

export default mongoose.models.CategoryBudget ||
  mongoose.model<ICategoryBudget>("CategoryBudget", CategoryBudgetSchema);