// src/models/AIInsight.ts
import mongoose, { Schema } from 'mongoose';
import { 
  IBaseDocument,
  INigerianContext,
  Priority
} from '@/types';

export interface IInsightAction {
  type: 'navigate' | 'create' | 'adjust' | 'review' | 'external_link';
  label: string;
  description: string;
  data?: {
    route?: string;
    categoryId?: string;
    goalId?: string;
    budgetMonth?: string;
    url?: string;
    amount?: number;
  };
}

export interface IInsightMetrics {
  potentialSavings?: number;
  impactScore: number; // 1-10 scale
  confidenceLevel: number; // 0-100 percentage
  urgencyScore: number; // 1-5 scale
  relevanceScore: number; // 1-10 scale
  userEngagementScore?: number; // How often user acts on this type
}

export interface IAIInsight extends IBaseDocument {
  userId: string;
  type: 
    | 'spending_tip'
    | 'budget_alert' 
    | 'savings_suggestion'
    | 'goal_reminder'
    | 'economic_update'
    | 'achievement_celebration'
    | 'pattern_detection'
    | 'optimization_opportunity'
    | 'risk_warning'
    | 'seasonal_advice';
  
  category: 'budget' | 'savings' | 'spending' | 'goals' | 'general' | 'nigerian_market';
  title: string;
  message: string;
  description?: string;
  
  priority: Priority;
  status: 'pending' | 'displayed' | 'acted_upon' | 'dismissed' | 'expired';
  
  metrics: IInsightMetrics;
  nigerianContext: Partial<INigerianContext>;
  
  actions: IInsightAction[];
  
  sourceData: {
    triggeredBy: 'transaction' | 'budget' | 'goal' | 'pattern' | 'schedule' | 'external';
    dataId?: string;
    analysisData?: {
      timeframe: string;
      dataPoints: number;
      comparisonPeriod?: string;
    };
  };
  
  displayConditions: {
    minViewDuration?: number;
    maxDisplayCount?: number;
    displayCount: number;
    validUntil?: Date;
  };
  
  userInteraction: {
    viewedAt?: Date;
    lastDisplayedAt?: Date;
    actedUponAt?: Date;
    dismissedAt?: Date;
    actionTaken?: string;
    feedbackScore?: number;
  };
  
  tags: string[];
  isPersonalized: boolean;
  isStarred?: boolean;
  
  // Methods
  markAsDisplayed(): Promise<IAIInsight>;
  markAsActedUpon(actionType: string): Promise<IAIInsight>;
  dismiss(): Promise<IAIInsight>;
  updateEngagement(score: number): Promise<IAIInsight>;
}

export interface IAIInsightModel extends mongoose.Model<IAIInsight> {
  generateSpendingInsight(userId: string, spendingData: any): Promise<IAIInsight>;
  generateBudgetAlert(userId: string, budgetData: any): Promise<IAIInsight>;
  generateSavingsOpportunity(userId: string, transactionData: any): Promise<IAIInsight>;
  generateNigerianEconomicInsight(userId: string): Promise<IAIInsight>;
  getUserPendingInsights(userId: string, category?: string): Promise<IAIInsight[]>;
  cleanupExpiredInsights(): Promise<number>;
}

// Helper function for current Nigerian context
const getCurrentNigerianContext = (): INigerianContext => {
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

const AIInsightSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true, 
      index: true 
    },
    type: { 
      type: String, 
      enum: [
        'spending_tip', 'budget_alert', 'savings_suggestion', 'goal_reminder',
        'economic_update', 'achievement_celebration', 'pattern_detection',
        'optimization_opportunity', 'risk_warning', 'seasonal_advice'
      ],
      required: true,
      index: true
    },
    category: { 
      type: String, 
      enum: ['budget', 'savings', 'spending', 'goals', 'general', 'nigerian_market'],
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
    description: { 
      type: String,
      maxlength: 1000,
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
      enum: ['pending', 'displayed', 'acted_upon', 'dismissed', 'expired'],
      default: 'pending',
      index: true
    },
    metrics: {
      potentialSavings: { type: Number, min: 0 },
      impactScore: { type: Number, required: true, min: 1, max: 10 },
      confidenceLevel: { type: Number, required: true, min: 0, max: 100 },
      urgencyScore: { type: Number, required: true, min: 1, max: 5 },
      relevanceScore: { type: Number, required: true, min: 1, max: 10 },
      userEngagementScore: { type: Number, min: 0, max: 100 }
    },
    nigerianContext: {
      isSchoolFeeSeason: Boolean,
      isSalaryCycle: Boolean,
      isFestiveSeason: Boolean,
      salaryDayReminders: Boolean,
      schoolFeeAlerts: Boolean,
      festiveSeasonWarnings: Boolean,
      transportPriceAlerts: Boolean
    },
    actions: [{
      type: { 
        type: String, 
        enum: ['navigate', 'create', 'adjust', 'review', 'external_link'],
        required: true 
      },
      label: { type: String, required: true, maxlength: 50 },
      description: { type: String, maxlength: 200 },
      data: {
        route: String,
        categoryId: String,
        goalId: String,
        budgetMonth: String,
        url: String,
        amount: Number
      }
    }],
    sourceData: {
      triggeredBy: { 
        type: String, 
        enum: ['transaction', 'budget', 'goal', 'pattern', 'schedule', 'external'],
        required: true 
      },
      dataId: String,
      analysisData: {
        timeframe: String,
        dataPoints: Number,
        comparisonPeriod: String
      }
    },
    displayConditions: {
      minViewDuration: { type: Number, default: 5000 }, // 5 seconds
      maxDisplayCount: { type: Number, default: 3 },
      displayCount: { type: Number, default: 0 },
      validUntil: Date
    },
    userInteraction: {
      viewedAt: Date,
      lastDisplayedAt: Date,
      actedUponAt: Date,
      dismissedAt: Date,
      actionTaken: String,
      feedbackScore: { type: Number, min: 1, max: 5 }
    },
    tags: [{ 
      type: String, 
      maxlength: 30 
    }],
    isPersonalized: { 
      type: Boolean, 
      default: true 
    },
    isStarred: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true,
    indexes: [
      { userId: 1, status: 1, priority: -1, createdAt: -1 },
      { userId: 1, category: 1, status: 1 },
      { userId: 1, type: 1, createdAt: -1 },
      { 'displayConditions.validUntil': 1 },
      { 'metrics.urgencyScore': -1, 'metrics.impactScore': -1 }
    ]
  }
);

// Method to mark insight as displayed
AIInsightSchema.methods.markAsDisplayed = function(this: IAIInsight): Promise<IAIInsight> {
  this.status = 'displayed';
  this.displayConditions.displayCount += 1;
  this.userInteraction.lastDisplayedAt = new Date();
  
  if (!this.userInteraction.viewedAt) {
    this.userInteraction.viewedAt = new Date();
  }
  
  return this.save();
};

// Method to mark insight as acted upon
AIInsightSchema.methods.markAsActedUpon = function(
  this: IAIInsight,
  actionType: string
): Promise<IAIInsight> {
  this.status = 'acted_upon';
  this.userInteraction.actedUponAt = new Date();
  this.userInteraction.actionTaken = actionType;
  
  return this.save();
};

// Method to dismiss insight
AIInsightSchema.methods.dismiss = function(this: IAIInsight): Promise<IAIInsight> {
  this.status = 'dismissed';
  this.userInteraction.dismissedAt = new Date();
  
  return this.save();
};

// Method to update user engagement score
AIInsightSchema.methods.updateEngagement = function(
  this: IAIInsight,
  score: number
): Promise<IAIInsight> {
  this.userInteraction.feedbackScore = Math.max(1, Math.min(5, score));
  this.metrics.userEngagementScore = score * 20; // Convert 1-5 to 0-100 scale
  
  return this.save();
};

// Static method to generate spending insight
AIInsightSchema.statics.generateSpendingInsight = async function(
  userId: string,
  spendingData: any
): Promise<IAIInsight> {
  const nigerianContext = getCurrentNigerianContext();
  
  let insight: Partial<IAIInsight>;
  
  // Example: High transport spending
  if (spendingData.category === 'Transport' && spendingData.percentageOfBudget > 20) {
    insight = {
      userId,
      type: 'spending_tip',
      category: 'spending',
      title: 'High Transport Spending Detected',
      message: `You've spent ${spendingData.percentageOfBudget}% of your budget on transport this month. Consider using cheaper transport options like BRT or carpooling.`,
      priority: 'medium',
      metrics: {
        potentialSavings: spendingData.potentialSavings,
        impactScore: 7,
        confidenceLevel: 85,
        urgencyScore: 3,
        relevanceScore: 8
      },
      nigerianContext,
      actions: [{
        type: 'review',
        label: 'Review Transport Budget',
        description: 'Analyze your transport spending patterns',
        data: { route: '/budget-planner/categories', categoryId: 'transport' }
      }],
      sourceData: {
        triggeredBy: 'pattern',
        analysisData: {
          timeframe: 'current_month',
          dataPoints: spendingData.transactionCount
        }
      },
      tags: ['transport', 'budget_optimization', 'nigerian_transport']
    };
  } else {
    // Default insight for any spending data
    insight = {
      userId,
      type: 'spending_tip',
      category: 'spending',
      title: 'Spending Pattern Analysis',
      message: 'Based on your recent transactions, we have some suggestions to optimize your spending.',
      priority: 'low',
      metrics: {
        impactScore: 5,
        confidenceLevel: 70,
        urgencyScore: 2,
        relevanceScore: 6
      },
      nigerianContext,
      actions: [],
      sourceData: {
        triggeredBy: 'pattern'
      },
      tags: ['spending_analysis']
    };
  }
  
  const newInsight = new this(insight);
  await newInsight.save();
  return newInsight;
};

// Static method to generate Nigerian economic insight
AIInsightSchema.statics.generateNigerianEconomicInsight = async function(
  userId: string
): Promise<IAIInsight> {
  const nigerianContext = getCurrentNigerianContext();
  const currentDate = new Date();
  const month = currentDate.getMonth();
  
  let insight: Partial<IAIInsight>;
  
  // School fees season insight
  if (nigerianContext.isSchoolFeeSeason) {
    insight = {
      userId,
      type: 'seasonal_advice',
      category: 'nigerian_market',
      title: 'School Fees Season Planning',
      message: 'School fees season is here. Review your education budget and consider setting up dedicated savings for next term.',
      priority: 'high',
      metrics: {
        impactScore: 8,
        confidenceLevel: 95,
        urgencyScore: 4,
        relevanceScore: 9
      },
      nigerianContext,
      actions: [
        {
          type: 'create',
          label: 'Create School Fees Goal',
          description: 'Set up savings goal for next term',
          data: { route: '/goals', categoryId: 'school_fees' }
        },
        {
          type: 'review',
          label: 'Review Education Budget',
          description: 'Check education category allocation',
          data: { route: '/budget-planner/categories', categoryId: 'education' }
        }
      ]
    };
  } else {
    // Default economic insight
    insight = {
      userId,
      type: 'economic_update',
      category: 'nigerian_market',
      title: 'Nigerian Economy Tip',
      message: 'Keep building your emergency fund to protect against naira volatility and economic uncertainty.',
      priority: 'low',
      metrics: {
        impactScore: 5,
        confidenceLevel: 85,
        urgencyScore: 2,
        relevanceScore: 7
      },
      nigerianContext,
      actions: [
        {
          type: 'create',
          label: 'Build Emergency Fund',
          description: 'Start or increase emergency savings',
          data: { route: '/goals', categoryId: 'emergency_fund' }
        }
      ]
    };
  }
  
  insight.sourceData = {
    triggeredBy: 'schedule',
    analysisData: {
      timeframe: 'current_date',
      dataPoints: 1
    }
  };
  
  insight.tags = ['nigerian_economy', 'seasonal', 'market_context'];
  
  const newInsight = new this(insight);
  await newInsight.save();
  return newInsight;
};

// Static method to generate budget alert
AIInsightSchema.statics.generateBudgetAlert = async function(
  userId: string,
  budgetData: any
): Promise<IAIInsight> {
  const nigerianContext = getCurrentNigerianContext();
  
  const insight: Partial<IAIInsight> = {
    userId,
    type: 'budget_alert',
    category: 'budget',
    title: `${budgetData.categoryName} Budget Alert`,
    message: `You've used ${budgetData.percentageUsed}% of your ${budgetData.categoryName} budget. ₦${budgetData.remaining.toLocaleString()} remaining.`,
    priority: budgetData.percentageUsed >= 90 ? 'urgent' : 'high',
    metrics: {
      impactScore: budgetData.percentageUsed >= 90 ? 9 : 6,
      confidenceLevel: 95,
      urgencyScore: budgetData.percentageUsed >= 90 ? 5 : 3,
      relevanceScore: 9
    },
    nigerianContext,
    actions: [{
      type: 'review',
      label: 'Review Spending',
      description: `Analyze ${budgetData.categoryName} transactions`,
      data: { 
        route: '/transactionHistory',
        categoryId: budgetData.categoryName.toLowerCase().replace(' ', '_')
      }
    }],
    sourceData: {
      triggeredBy: 'budget',
      dataId: budgetData.budgetId
    },
    displayConditions: {
      maxDisplayCount: 1,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    tags: ['budget_alert', budgetData.categoryName.toLowerCase()]
  };
  
  const newInsight = new this(insight);
  await newInsight.save();
  return newInsight;
};

// Static method to generate savings opportunity
AIInsightSchema.statics.generateSavingsOpportunity = async function(
  userId: string,
  transactionData: any
): Promise<IAIInsight> {
  const nigerianContext = getCurrentNigerianContext();
  
  const insight: Partial<IAIInsight> = {
    userId,
    type: 'savings_suggestion',
    category: 'savings',
    title: 'Savings Opportunity Detected',
    message: `Based on your spending patterns, you could save ₦${transactionData.potentialSavings.toLocaleString()} by ${transactionData.suggestion}.`,
    priority: 'medium',
    metrics: {
      potentialSavings: transactionData.potentialSavings,
      impactScore: Math.min(10, Math.floor(transactionData.potentialSavings / 5000)),
      confidenceLevel: 75,
      urgencyScore: 2,
      relevanceScore: 8
    },
    nigerianContext,
    actions: [{
      type: 'create',
      label: 'Create Savings Goal',
      description: 'Set up automatic savings for this opportunity',
      data: { route: '/goals', amount: transactionData.potentialSavings }
    }],
    sourceData: {
      triggeredBy: 'transaction',
      dataId: transactionData.transactionId,
      analysisData: {
        timeframe: 'last_30_days',
        dataPoints: transactionData.analysisPoints
      }
    },
    tags: ['savings_opportunity', 'optimization']
  };
  
  const newInsight = new this(insight);
  await newInsight.save();
  return newInsight;
};

// Static method to get user's pending insights
AIInsightSchema.statics.getUserPendingInsights = function(
  userId: string,
  category?: string
): Promise<IAIInsight[]> {
  const query: any = {
    userId,
    status: 'pending',
    $or: [
      { 'displayConditions.validUntil': { $exists: false } },
      { 'displayConditions.validUntil': { $gte: new Date() } }
    ]
  };
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query)
    .sort({ 
      priority: 1, // urgent first
      'metrics.urgencyScore': -1,
      'metrics.impactScore': -1,
      createdAt: -1
    })
    .limit(10);
};

// Static method to cleanup expired insights
AIInsightSchema.statics.cleanupExpiredInsights = async function(): Promise<number> {
  const result = await this.updateMany(
    {
      $or: [
        { 
          'displayConditions.validUntil': { $lt: new Date() }
        },
        {
          status: 'displayed',
          'displayConditions.displayCount': { $gte: { $ifNull: ['$displayConditions.maxDisplayCount', 3] } }
        }
      ]
    },
    { 
      $set: { status: 'expired' }
    }
  );
  
  return result.modifiedCount;
};

export default mongoose.models.AIInsight || 
  mongoose.model<IAIInsight, IAIInsightModel>('AIInsight', AIInsightSchema);