// src/models/Goal.ts
import mongoose, { Schema } from "mongoose";
import { 
  IGoal, 
  IGoalModel, 
  IGoalTemplate,
  IMilestone,
  IContribution,
  ContributionSource,
  GoalCategory,
  Priority
} from '@/types';

const GoalSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 1000,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "emergency_fund",
        "school_fees",
        "rent_advance",
        "vacation",
        "wedding",
        "business_capital",
        "gadget_purchase",
        "house_deposit",
        "car_purchase",
        "medical_emergency",
        "custom",
      ],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    deadline: {
      type: Date,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: Date,
    autoSaveRules: {
      enabled: { type: Boolean, default: false },
      percentage: { type: Number, min: 0.1, max: 50 },
      frequency: {
        type: String,
        enum: ["weekly", "monthly", "per_transaction"],
        default: "monthly",
      },
      minTransactionAmount: { type: Number, min: 0 },
    },
    milestones: [
      {
        percentage: { type: Number, required: true, min: 0, max: 100 },
        amount: { type: Number, required: true },
        achievedAt: Date,
        celebrated: { type: Boolean, default: false },
      },
    ],
    contributions: [
      {
        amount: { type: Number, required: true, min: 0 },
        date: { type: Date, required: true, default: Date.now },
        source: {
          type: String,
          enum: ["manual", "auto_save", "windfall", "salary_bonus"],
          default: "manual",
        },
        transactionId: String,
        note: { type: String, maxlength: 200 },
      },
    ],
    nigerianContext: {
      isSchoolFeesGoal: { type: Boolean, default: false },
      schoolTerm: {
        type: String,
        enum: ["first", "second", "third"],
      },
      isEmergencyFund: { type: Boolean, default: false },
      targetMonthsCoverage: { type: Number, min: 1, max: 12 },
      isSalaryLinked: { type: Boolean, default: false },
      festiveSeasonBuffer: { type: Boolean, default: false },
    },
    insights: {
      projectedCompletionDate: Date,
      monthlyContributionNeeded: { type: Number, default: 0 },
      daysRemaining: Number,
      progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
      isOnTrack: { type: Boolean, default: true },
      averageMonthlyContribution: { type: Number, default: 0 },
      recommendedMonthlyContribution: { type: Number, default: 0 },
    },
    tags: [{ type: String, maxlength: 30 }],
  },
  {
    timestamps: true,
    indexes: [
      { userId: 1, isActive: 1, priority: -1 },
      { userId: 1, category: 1 },
      { userId: 1, deadline: 1 },
      { userId: 1, isCompleted: 1, completedAt: -1 },
    ],
  }
);

// Virtual for progress percentage
GoalSchema.virtual("progressPercentage").get(function (this: IGoal) {
  return this.targetAmount > 0
    ? Math.min((this.currentAmount / this.targetAmount) * 100, 100)
    : 0;
});

// Virtual for remaining amount
GoalSchema.virtual("remainingAmount").get(function (this: IGoal) {
  return Math.max(this.targetAmount - this.currentAmount, 0);
});

// Virtual for formatted amounts using Nigerian formatting
GoalSchema.virtual("formattedTargetAmount").get(function (this: IGoal) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(this.targetAmount).replace('NGN', '₦');
});

GoalSchema.virtual("formattedCurrentAmount").get(function (this: IGoal) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(this.currentAmount).replace('NGN', '₦');
});

// Method to add contribution
GoalSchema.methods.addContribution = function (
  this: IGoal,
  amount: number,
  source: ContributionSource = "manual",
  note?: string,
  transactionId?: string
): Promise<IGoal> {
  this.contributions.push({
    amount,
    date: new Date(),
    source,
    note,
    transactionId,
  });

  this.currentAmount += amount;

  // Check if goal is completed
  if (this.currentAmount >= this.targetAmount && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }

  // Check milestones and update insights
  this.updateMilestones();
  this.updateInsights();

  return this.save();
};

// Method to update milestones
GoalSchema.methods.updateMilestones = function (this: IGoal): void {
  const progressPercentage = (this.currentAmount / this.targetAmount) * 100;

  this.milestones.forEach((milestone: IMilestone) => {
    if (progressPercentage >= milestone.percentage && !milestone.achievedAt) {
      milestone.achievedAt = new Date();
    }
  });
};

// Method to update insights
GoalSchema.methods.updateInsights = function (this: IGoal): void {
  const now = new Date();
  const progressPercentage = Math.min(
    (this.currentAmount / this.targetAmount) * 100,
    100
  );
  const remainingAmount = this.targetAmount - this.currentAmount;

  // Calculate average monthly contribution
  // Fix: Handle case where createdAt might be undefined
  const createdDate = this.createdAt || now;
  const monthsActive =
    this.contributions.length > 0
      ? Math.max(
          1,
          (now.getTime() - createdDate.getTime()) /
            (1000 * 60 * 60 * 24 * 30)
        )
      : 1;
  const averageMonthlyContribution = this.currentAmount / monthsActive;

  // Calculate days remaining
  let daysRemaining: number | undefined = undefined;
  let projectedCompletionDate: Date | undefined = undefined;
  let monthlyContributionNeeded = 0;

  if (this.deadline) {
    daysRemaining = Math.max(
      0,
      Math.ceil(
        (this.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const monthsRemaining = Math.max(1, daysRemaining / 30);
    monthlyContributionNeeded = remainingAmount / monthsRemaining;

    projectedCompletionDate =
      averageMonthlyContribution > 0
        ? new Date(
            now.getTime() +
              (remainingAmount / averageMonthlyContribution) *
                30 *
                24 *
                60 *
                60 *
                1000
          )
        : undefined;
  }

  // Determine if on track
  const isOnTrack = this.deadline
    ? projectedCompletionDate
      ? projectedCompletionDate <= this.deadline
      : false
    : true;

  // Recommended monthly contribution (conservative approach)
  const recommendedMonthlyContribution = this.deadline
    ? Math.ceil(monthlyContributionNeeded * 1.1) // 10% buffer
    : Math.max(remainingAmount / 12, 5000); // Default to 12 months or minimum ₦5,000

  this.insights = {
    projectedCompletionDate,
    monthlyContributionNeeded,
    daysRemaining,
    progressPercentage,
    isOnTrack,
    averageMonthlyContribution,
    recommendedMonthlyContribution,
  };
};

// Static method to create Nigerian-specific goal templates
GoalSchema.statics.createNigerianGoalTemplate = function (
  category: string,
  userMonthlyIncome?: number
): IGoalTemplate | undefined {
  const templates: Record<string, IGoalTemplate> = {
    emergency_fund: {
      title: "Emergency Fund",
      description: "Save for unexpected expenses and economic uncertainty",
      targetAmount: userMonthlyIncome ? userMonthlyIncome * 3 : 150000, // 3 months or ₦150k
      category: "emergency_fund",
      priority: "urgent",
      nigerianContext: {
        isEmergencyFund: true,
        targetMonthsCoverage: 3,
        isSalaryLinked: true,
      },
      milestones: [
        { percentage: 25, amount: 0, celebrated: false },
        { percentage: 50, amount: 0, celebrated: false },
        { percentage: 75, amount: 0, celebrated: false },
        { percentage: 100, amount: 0, celebrated: false },
      ],
    },
    school_fees: {
      title: "School Fees",
      description: "Save for next term's school fees",
      targetAmount: 100000, // Average private school fees
      category: "school_fees",
      priority: "high",
      deadline: new Date(new Date().getFullYear() + 1, 0, 15), // January 15th next year
      nigerianContext: {
        isSchoolFeesGoal: true,
        schoolTerm: "first",
        isSalaryLinked: true,
      },
      milestones: [
        { percentage: 25, amount: 25000, celebrated: false },
        { percentage: 50, amount: 50000, celebrated: false },
        { percentage: 75, amount: 75000, celebrated: false },
        { percentage: 100, amount: 100000, celebrated: false },
      ],
    },
    rent_advance: {
      title: "Rent Advance",
      description: "Save for annual rent payment",
      targetAmount: userMonthlyIncome ? userMonthlyIncome * 12 * 0.3 : 360000, // 30% of annual income
      category: "rent_advance",
      priority: "high",
      nigerianContext: {
        isSalaryLinked: true,
      },
      milestones: [
        { percentage: 25, amount: 0, celebrated: false },
        { percentage: 50, amount: 0, celebrated: false },
        { percentage: 75, amount: 0, celebrated: false },
        { percentage: 100, amount: 0, celebrated: false },
      ],
    },
  };

  const template = templates[category];
  if (template && template.milestones) {
    template.milestones.forEach((milestone: IMilestone) => {
      milestone.amount = (template.targetAmount * milestone.percentage) / 100;
    });
  }

  return template;
};

// Pre-save middleware to update insights
GoalSchema.pre("save", function (this: IGoal) {
  if (
    this.isModified("currentAmount") ||
    this.isModified("targetAmount") ||
    this.isModified("deadline")
  ) {
    this.updateInsights();
  }
});

export default mongoose.models.Goal ||
  mongoose.model<IGoal, IGoalModel>("Goal", GoalSchema);