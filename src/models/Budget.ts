// src/models/Budget.ts
import mongoose, { Schema } from 'mongoose';
import { IBudget } from '@/types';

const BudgetSchema: Schema = new Schema(
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
    totalBudget: { 
      type: Number, 
      required: true,
      min: 0
    },
    spent: { 
      type: Number, 
      default: 0,
      min: 0
    },
    remaining: { 
      type: Number, 
      default: 0
    },
    AIWarning: { 
      type: String,
      maxlength: 500
    }
  },
  { 
    timestamps: true,
    indexes: [
      { userId: 1, month: 1 }
    ]
  }
);

// Ensure unique constraint for userId + month combination
BudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

// Pre-save middleware to calculate remaining amount
BudgetSchema.pre('save', function(this: IBudget) {
  this.remaining = this.totalBudget - this.spent;
});

export default mongoose.models.Budget ||
  mongoose.model<IBudget>('Budget', BudgetSchema);

