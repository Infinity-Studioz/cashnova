// src/models/Report.ts
import mongoose, { Schema } from 'mongoose';
import { 
  IBaseDocument,
  INigerianContext,
  formatNigerianCurrency
} from '@/types';

export interface ITrendData {
  period: string; // "2025-01", "2025-Q1", "2025"
  value: number;
  comparisonValue?: number; // Previous period value for trend comparison
  percentageChange?: number;
  formattedValue: string;
}

export interface ICategoryData {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  averageTransaction: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  formattedAmount: string;
}

export interface ISavingsAnalysis {
  totalSaved: number;
  savingsRate: number; // Percentage of income saved
  goalProgress: number; // Average progress across all goals
  emergencyFundMonths: number; // Months of expenses covered
  recommendedSavings: number;
  formattedTotalSaved: string;
}

export interface INigerianMetrics {
  inflationImpact: number; // Estimated inflation effect on spending
  salaryEfficiency: number; // How well salary is utilized (0-100)
  festiveSpendingRatio: number; // Festive vs normal spending ratio
  transportCostVariation: number; // Transport cost volatility
  familySupportAmount: number; // Family support spending
  schoolFeesAllocation: number; // Education spending allocation
  emergencyFundAdequacy: 'low' | 'adequate' | 'excellent';
}

export interface IComparisonData {
  previousPeriod: {
    income: number;
    expenses: number;
    savings: number;
    topCategories: ICategoryData[];
  };
  yearOverYear?: {
    incomeGrowth: number;
    expenseGrowth: number;
    savingsGrowth: number;
    categoryChanges: Record<string, number>;
  };
}

export interface IReport extends IBaseDocument {
  userId: string;
  type: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  period: string; // "2025-09", "2025-Q3", "2025", "2025-09-01_2025-09-30"
  title: string;
  
  status: 'generating' | 'completed' | 'failed';
  
  // Core financial data
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    transactionCount: number;
    avgDailySpending: number;
    
    formattedIncome: string;
    formattedExpenses: string;
    formattedSavings: string;
  };
  
  // Category breakdown
  incomeCategories: ICategoryData[];
  expenseCategories: ICategoryData[];
  
  // Trends and patterns
  spendingTrends: ITrendData[];
  incomeTrends: ITrendData[];
  savingsTrends: ITrendData[];
  
  // Savings analysis
  savingsAnalysis: ISavingsAnalysis;
  
  // Nigerian-specific metrics
  nigerianMetrics: INigerianMetrics;
  nigerianContext: INigerianContext;
  
  // Comparison data
  comparison: IComparisonData;
  
  // Insights and recommendations
  insights: Array<{
    type: 'positive' | 'warning' | 'opportunity' | 'achievement';
    title: string;
    description: string;
    value?: number;
    formattedValue?: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  
  recommendations: Array<{
    category: 'spending' | 'saving' | 'budgeting' | 'goals' | 'nigerian_context';
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    actionable: boolean;
    estimatedImpact?: number;
  }>;
  
  // Report metadata
  dataQuality: {
    completeness: number; // 0-100 percentage
    accuracy: number; // 0-100 percentage
    dataPoints: number;
    missingDays: number;
  };
  
  generatedAt: Date;
  lastUpdated: Date;
  isBookmarked: boolean;
  tags: string[];
  
  // Methods
  generateInsights(): void;
  generateRecommendations(): void;
  updateNigerianMetrics(): void;
  calculateTrends(): void;
}

export interface IReportModel extends mongoose.Model<IReport> {
  generateMonthlyReport(userId: string, year: number, month: number): Promise<IReport>;
  generateQuarterlyReport(userId: string, year: number, quarter: number): Promise<IReport>;
  generateYearlyReport(userId: string, year: number): Promise<IReport>;
  getUserReports(userId: string, type?: IReport['type'], limit?: number): Promise<IReport[]>;
  cleanupOldReports(olderThanDays: number): Promise<number>;
}

const ReportSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true, 
      index: true 
    },
    type: { 
      type: String, 
      enum: ['monthly', 'quarterly', 'yearly', 'custom'],
      required: true,
      index: true
    },
    period: { 
      type: String, 
      required: true,
      index: true
    },
    title: { 
      type: String, 
      required: true,
      maxlength: 100
    },
    status: { 
      type: String, 
      enum: ['generating', 'completed', 'failed'],
      default: 'generating',
      index: true
    },
    summary: {
      totalIncome: { type: Number, default: 0 },
      totalExpenses: { type: Number, default: 0 },
      netSavings: { type: Number, default: 0 },
      transactionCount: { type: Number, default: 0 },
      avgDailySpending: { type: Number, default: 0 },
      formattedIncome: String,
      formattedExpenses: String,
      formattedSavings: String
    },
    incomeCategories: [{
      category: { type: String, required: true },
      amount: { type: Number, required: true },
      percentage: { type: Number, required: true },
      transactionCount: { type: Number, required: true },
      averageTransaction: { type: Number, required: true },
      trend: { type: String, enum: ['increasing', 'decreasing', 'stable'] },
      formattedAmount: String
    }],
    expenseCategories: [{
      category: { type: String, required: true },
      amount: { type: Number, required: true },
      percentage: { type: Number, required: true },
      transactionCount: { type: Number, required: true },
      averageTransaction: { type: Number, required: true },
      trend: { type: String, enum: ['increasing', 'decreasing', 'stable'] },
      formattedAmount: String
    }],
    spendingTrends: [{
      period: String,
      value: Number,
      comparisonValue: Number,
      percentageChange: Number,
      formattedValue: String
    }],
    incomeTrends: [{
      period: String,
      value: Number,
      comparisonValue: Number,
      percentageChange: Number,
      formattedValue: String
    }],
    savingsTrends: [{
      period: String,
      value: Number,
      comparisonValue: Number,
      percentageChange: Number,
      formattedValue: String
    }],
    savingsAnalysis: {
      totalSaved: { type: Number, default: 0 },
      savingsRate: { type: Number, default: 0 },
      goalProgress: { type: Number, default: 0 },
      emergencyFundMonths: { type: Number, default: 0 },
      recommendedSavings: { type: Number, default: 0 },
      formattedTotalSaved: String
    },
    nigerianMetrics: {
      inflationImpact: { type: Number, default: 0 },
      salaryEfficiency: { type: Number, default: 0 },
      festiveSpendingRatio: { type: Number, default: 1 },
      transportCostVariation: { type: Number, default: 0 },
      familySupportAmount: { type: Number, default: 0 },
      schoolFeesAllocation: { type: Number, default: 0 },
      emergencyFundAdequacy: { 
        type: String, 
        enum: ['low', 'adequate', 'excellent'],
        default: 'low'
      }
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
    comparison: {
      previousPeriod: {
        income: Number,
        expenses: Number,
        savings: Number,
        topCategories: [{
          category: String,
          amount: Number,
          percentage: Number,
          transactionCount: Number,
          averageTransaction: Number,
          trend: { type: String, enum: ['increasing', 'decreasing', 'stable'] },
          formattedAmount: String
        }]
      },
      yearOverYear: {
        incomeGrowth: Number,
        expenseGrowth: Number,
        savingsGrowth: Number,
        categoryChanges: Schema.Types.Mixed
      }
    },
    insights: [{
      type: { 
        type: String, 
        enum: ['positive', 'warning', 'opportunity', 'achievement'],
        required: true 
      },
      title: { type: String, required: true, maxlength: 100 },
      description: { type: String, required: true, maxlength: 300 },
      value: Number,
      formattedValue: String,
      impact: { 
        type: String, 
        enum: ['low', 'medium', 'high'],
        required: true 
      }
    }],
    recommendations: [{
      category: { 
        type: String, 
        enum: ['spending', 'saving', 'budgeting', 'goals', 'nigerian_context'],
        required: true 
      },
      priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'],
        required: true 
      },
      title: { type: String, required: true, maxlength: 100 },
      description: { type: String, required: true, maxlength: 300 },
      actionable: { type: Boolean, default: true },
      estimatedImpact: Number
    }],
    dataQuality: {
      completeness: { type: Number, default: 100 },
      accuracy: { type: Number, default: 100 },
      dataPoints: { type: Number, default: 0 },
      missingDays: { type: Number, default: 0 }
    },
    generatedAt: { 
      type: Date, 
      default: Date.now 
    },
    lastUpdated: { 
      type: Date, 
      default: Date.now 
    },
    isBookmarked: { 
      type: Boolean, 
      default: false 
    },
    tags: [{ 
      type: String, 
      maxlength: 30 
    }]
  },
  { 
    timestamps: true,
    indexes: [
      { userId: 1, type: 1, period: -1 },
      { userId: 1, status: 1, createdAt: -1 },
      { userId: 1, isBookmarked: 1 },
      { generatedAt: 1 } // For cleanup
    ]
  }
);

// Method to generate insights
ReportSchema.methods.generateInsights = function(this: IReport): void {
  const insights = [];
  
  // Positive insights
  if (this.summary.netSavings > 0) {
    insights.push({
      type: 'positive',
      title: 'Positive Savings',
      description: `You saved ${formatNigerianCurrency(this.summary.netSavings)} this period!`,
      value: this.summary.netSavings,
      formattedValue: formatNigerianCurrency(this.summary.netSavings),
      impact: this.summary.netSavings > 50000 ? 'high' : 'medium'
    });
  }
  
  // Warning insights
  if (this.savingsAnalysis.savingsRate < 10) {
    insights.push({
      type: 'warning',
      title: 'Low Savings Rate',
      description: `Your savings rate of ${this.savingsAnalysis.savingsRate.toFixed(1)}% is below the recommended 20% for Nigerian economic conditions.`,
      value: this.savingsAnalysis.savingsRate,
      formattedValue: `${this.savingsAnalysis.savingsRate.toFixed(1)}%`,
      impact: 'high'
    });
  }
  
  // Nigerian-specific insights
  if (this.nigerianMetrics.familySupportAmount > this.summary.totalExpenses * 0.15) {
    insights.push({
      type: 'opportunity',
      title: 'High Family Support Spending',
      description: 'Family support represents a significant portion of your expenses. Consider budgeting specifically for this category.',
      value: this.nigerianMetrics.familySupportAmount,
      formattedValue: formatNigerianCurrency(this.nigerianMetrics.familySupportAmount),
      impact: 'medium'
    });
  }
  
  this.insights = insights;
};

// Method to generate recommendations
ReportSchema.methods.generateRecommendations = function(this: IReport): void {
  const recommendations = [];
  
  // Savings recommendations
  if (this.savingsAnalysis.savingsRate < 20) {
    recommendations.push({
      category: 'saving',
      priority: 'high',
      title: 'Increase Savings Rate',
      description: 'Aim to save at least 20% of your income to build financial resilience against Nigerian economic volatility.',
      actionable: true,
      estimatedImpact: this.summary.totalIncome * 0.2 - this.summary.netSavings
    });
  }
  
  // Emergency fund recommendations
  if (this.savingsAnalysis.emergencyFundMonths < 3) {
    recommendations.push({
      category: 'goals',
      priority: 'high',
      title: 'Build Emergency Fund',
      description: 'Prioritize building an emergency fund covering 3-6 months of expenses for economic security.',
      actionable: true,
      estimatedImpact: this.summary.totalExpenses * 3
    });
  }
  
  // Nigerian-specific recommendations
  if (this.nigerianContext.isSchoolFeeSeason && this.nigerianMetrics.schoolFeesAllocation < 10000) {
    recommendations.push({
      category: 'nigerian_context',
      priority: 'medium',
      title: 'School Fees Planning',
      description: 'Set aside funds for upcoming school fees to avoid financial strain during education payment periods.',
      actionable: true
    });
  }
  
  this.recommendations = recommendations;
};

// Method to update Nigerian metrics
ReportSchema.methods.updateNigerianMetrics = function(this: IReport): void {
  // Calculate salary efficiency (how well income is utilized)
  const essentialExpenses = this.expenseCategories
    .filter(cat => ['Food & Dining', 'Rent/Housing', 'Transport', 'Bills'].includes(cat.category))
    .reduce((sum, cat) => sum + cat.amount, 0);
  
  this.nigerianMetrics.salaryEfficiency = Math.min(100, (essentialExpenses / this.summary.totalIncome) * 100);
  
  // Calculate emergency fund adequacy
  const monthlyExpenses = this.summary.totalExpenses;
  const emergencyMonths = this.savingsAnalysis.emergencyFundMonths;
  
  if (emergencyMonths >= 6) {
    this.nigerianMetrics.emergencyFundAdequacy = 'excellent';
  } else if (emergencyMonths >= 3) {
    this.nigerianMetrics.emergencyFundAdequacy = 'adequate';
  } else {
    this.nigerianMetrics.emergencyFundAdequacy = 'low';
  }
  
  // Calculate family support amount
  const familyCategory = this.expenseCategories.find(cat => cat.category === 'Family Support');
  this.nigerianMetrics.familySupportAmount = familyCategory?.amount || 0;
  
  // Calculate school fees allocation
  const schoolCategory = this.expenseCategories.find(cat => cat.category === 'School Fees');
  this.nigerianMetrics.schoolFeesAllocation = schoolCategory?.amount || 0;
};

// Static method to generate monthly report
ReportSchema.statics.generateMonthlyReport = async function(
  userId: string,
  year: number,
  month: number
): Promise<IReport> {
  const period = `${year}-${month.toString().padStart(2, '0')}`;
  const title = `Monthly Report - ${new Date(year, month - 1).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}`;
  
  // Check if report already exists
  const existingReport = await this.findOne({ userId, type: 'monthly', period });
  if (existingReport) {
    return existingReport;
  }
  
  const report = new this({
    userId,
    type: 'monthly',
    period,
    title,
    status: 'generating',
    tags: ['monthly', 'auto_generated']
  });
  
  // Generate report data (this would fetch from Transaction, Budget, Goal models)
  // For now, setting up the structure
  report.status = 'completed';
  report.generatedAt = new Date();
  
  await report.save();
  return report;
};

// Static method to get user reports
ReportSchema.statics.getUserReports = function(
  userId: string,
  type?: IReport['type'],
  limit: number = 12
): Promise<IReport[]> {
  const query: any = { userId, status: 'completed' };
  if (type) {
    query.type = type;
  }
  
  return this.find(query)
    .sort({ period: -1, createdAt: -1 })
    .limit(limit);
};

// Static method to cleanup old reports
ReportSchema.statics.cleanupOldReports = async function(olderThanDays: number = 365): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
  
  const result = await this.deleteMany({
    generatedAt: { $lt: cutoffDate },
    isBookmarked: false
  });
  
  return result.deletedCount;
};

export default mongoose.models.Report || 
  mongoose.model<IReport, IReportModel>('Report', ReportSchema);