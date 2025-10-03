// src/types/index.ts
import { Document, Model } from 'mongoose';

// ================================
// SHARED ENUMS AND CONSTANTS
// ================================

export type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP';
export type Locale = 'en-NG' | 'en-US' | 'en-GB';
export type Theme = 'light' | 'dark' | 'system';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'pos' | 'online' | 'other';
export type TransactionStatus = 'completed' | 'pending' | 'flagged';
export type RecurringPattern = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Goal-specific types
export type GoalCategory = 
  | 'emergency_fund'
  | 'school_fees'
  | 'rent_advance'
  | 'vacation'
  | 'wedding'
  | 'business_capital'
  | 'gadget_purchase'
  | 'house_deposit'
  | 'car_purchase'
  | 'medical_emergency'
  | 'custom';

export type ContributionSource = 'manual' | 'auto_save' | 'windfall' | 'salary_bonus';
export type AutoSaveFrequency = 'weekly' | 'monthly' | 'per_transaction';
export type SchoolTerm = 'first' | 'second' | 'third';

// Notification types
export type NotificationType = 
  | 'category_threshold' 
  | 'budget_exceeded' 
  | 'weekly_summary' 
  | 'custom_alert'
  | 'salary_reminder' 
  | 'school_fee_alert' 
  | 'savings_tip' 
  | 'bill_reminder';

export type NotificationStatus = 'unread' | 'read' | 'dismissed' | 'acted_upon';
export type NotificationTiming = 'immediate' | 'daily_8pm' | 'weekly_friday';
export type WeekDay = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

// Alert condition types
export type AlertCondition = 'spending_reaches' | 'daily_exceeds' | 'weekly_exceeds';

// User provider types
export type AuthProvider = 'google' | 'credentials' | 'dual';
export type DataSyncProvider = 'googleDrive' | 'dropbox' | 'iCloud' | null;

// Bank connection types
export type BankConnectionStatus = 'active' | 'inactive' | 'error';

// ================================
// NIGERIAN-SPECIFIC CONSTANTS
// ================================

export const NIGERIAN_INCOME_CATEGORIES = [
  'Salary',
  'Freelance Work', 
  'Business Income',
  'Investment Returns',
  'Gift/Family Support',
  'Side Hustle',
  'Rental Income',
  'Other Income'
] as const;

export const NIGERIAN_EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Bills', 
  'Shopping',
  'Entertainment',
  'School Fees',
  'Church/Mosque',
  'Family Support',
  'Health/Medical',
  'Rent/Housing',
  'Savings/Investment',
  'Personal Care',
  'Clothing',
  'Emergency Fund',
  'Other Expenses'
] as const;

export const NIGERIAN_BUDGET_CATEGORIES = {
  'Rent/Housing': { percentage: 30, icon: 'home', priority: 1 },
  'Food & Dining': { percentage: 25, icon: 'utensils', priority: 2 },
  'Transport': { percentage: 15, icon: 'car', priority: 3 },
  'Bills': { percentage: 10, icon: 'bolt', priority: 4 },
  'Family Support': { percentage: 8, icon: 'heart', priority: 5 },
  'Entertainment': { percentage: 5, icon: 'film', priority: 6 },
  'Health/Medical': { percentage: 4, icon: 'heartbeat', priority: 7 },
  'Emergency Fund': { percentage: 3, icon: 'shield-alt', priority: 8 }
} as const;

// ================================
// SHARED INTERFACES
// ================================

// Base document interface
export interface IBaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

// Nigerian context interface (used across multiple models)
export interface INigerianContext {
  isSchoolFeesGoal?: boolean;
  schoolTerm?: SchoolTerm;
  isEmergencyFund?: boolean;
  targetMonthsCoverage?: number;
  isSalaryLinked?: boolean;
  festiveSeasonBuffer?: boolean;
  isSchoolFeeSeason?: boolean;
  isSalaryCycle?: boolean;
  isFestiveSeason?: boolean;
  salaryDayReminders?: boolean;
  schoolFeeAlerts?: boolean;
  festiveSeasonWarnings?: boolean;
  transportPriceAlerts?: boolean;
}

// Notification preferences interface
export interface INotificationPreferences {
  pushNotifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  inAppNotifications: boolean;
  email?: boolean;
  push?: boolean;
}

// Progress data interface
export interface IProgressData {
  current: number;
  target: number;
  percentage: number;
}

// Action interface for notifications
export interface INotificationAction {
  label: string;
  action: string;
  data?: any;
}

// Notification channels interface
export interface INotificationChannels {
  inApp: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
}

// Money formatting utility type
export interface IFormattedAmount {
  raw: number;
  formatted: string;
  currency: Currency;
}

// Date range interface
export interface IDateRange {
  start: Date;
  end: Date;
}

// Monthly data interface
export interface IMonthlyData {
  month: string; // Format: "YYYY-MM"
  year: number;
  monthName: string;
}

// ================================
// GOAL-SPECIFIC INTERFACES
// ================================

export interface IMilestone {
  percentage: number;
  amount: number;
  achievedAt?: Date;
  celebrated: boolean;
}

export interface IContribution {
  amount: number;
  date: Date;
  source: ContributionSource;
  transactionId?: string;
  note?: string;
}

export interface IAutoSaveRules {
  enabled: boolean;
  percentage: number;
  frequency: AutoSaveFrequency;
  minTransactionAmount?: number;
}

export interface IGoalInsights {
  projectedCompletionDate?: Date;
  monthlyContributionNeeded: number;
  daysRemaining?: number;
  progressPercentage: number;
  isOnTrack: boolean;
  averageMonthlyContribution: number;
  recommendedMonthlyContribution: number;
}

// ================================
// ALERT AND NOTIFICATION INTERFACES
// ================================

export interface ICategoryThreshold {
  enabled: boolean;
  percentage: number;
  specificCategory?: string;
}

export interface IBudgetExceeded {
  enabled: boolean;
  percentage: number;
}

export interface IWeeklySummary {
  enabled: boolean;
  day: WeekDay;
  time: string;
}

export interface ICustomAlert {
  id: string;
  enabled: boolean;
  category: string;
  condition: AlertCondition;
  threshold: number;
  isPercentage: boolean;
  notificationTiming: NotificationTiming;
}

export interface INotificationData {
  category?: string;
  amount?: number;
  formattedAmount?: string;
  percentage?: number;
  budgetLimit?: number;
  threshold?: number;
  actions?: INotificationAction[];
  progressData?: IProgressData;
  currentSpending?: number;
  suggestedTarget?: number;
  potentialSavings?: number;
  alertId?: string;
  condition?: AlertCondition;
}

export interface INotificationMetadata {
  triggeredBy?: string;
  relatedTransactionId?: string;
  relatedBudgetId?: string;
  nigerianContext?: INigerianContext;
}

// ================================
// USER PREFERENCES INTERFACES
// ================================

export interface IUserPreferences {
  currency: Currency;
  theme: Theme;
  notifications: INotificationPreferences;
}

export interface IDataSync {
  enabled: boolean;
  provider: DataSyncProvider;
}

// ================================
// UTILITY FUNCTIONS TYPE DEFINITIONS
// ================================

export interface INigerianFormatOptions {
  currency?: Currency;
  locale?: Locale;
  minimumFractionDigits?: number;
  showSymbol?: boolean;
}

// ================================
// TEMPLATE INTERFACES
// ================================

export interface IGoalTemplate {
  title: string;
  description: string;
  targetAmount: number;
  category: GoalCategory;
  priority: Priority;
  deadline?: Date;
  nigerianContext?: Partial<INigerianContext>;
  milestones?: IMilestone[];
  icon?: string;
  defaultAmount?: number;
  insights?: string[];
}

// ================================
// FORWARD DECLARATIONS FOR MODELS
// ================================

export interface IUser extends IBaseDocument {
  name: string;
  email: string;
  image?: string;
  provider: AuthProvider;
  password?: string;
  emailVerified?: Date;
  preferences: IUserPreferences;
  isActive: boolean;
}

export interface IGoal extends IBaseDocument {
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  category: GoalCategory;
  priority: Priority;
  deadline?: Date;
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  autoSaveRules?: IAutoSaveRules;
  milestones: IMilestone[];
  contributions: IContribution[];
  nigerianContext: INigerianContext;
  insights: IGoalInsights;
  tags: string[];
  
  // Virtual properties
  progressPercentage: number;
  remainingAmount: number;
  formattedTargetAmount: string;
  formattedCurrentAmount: string;

  // Methods
  addContribution(amount: number, source?: ContributionSource, note?: string, transactionId?: string): Promise<IGoal>;
  updateMilestones(): void;
  updateInsights(): void;
}

export interface IBudget extends IBaseDocument {
  userId: string;
  month: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  AIWarning?: string;
}

export interface ICategoryBudget extends IBaseDocument {
  userId: string;
  month: string;
  category: string;
  allocated: number;
  spent: number;
  AIRecommendation?: string;
}

export interface ITransaction extends IBaseDocument {
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  merchant?: string;
  location?: string;
  paymentMethod?: PaymentMethod;
  date: Date;
  recurring: boolean;
  recurringPattern?: RecurringPattern;
  status: TransactionStatus;
  autoCategory?: string;
  userCategory?: string;
  tags?: string[];
  receiptUrl?: string;

  // Virtual properties
  effectiveCategory: string;
}

export interface ISettings extends IBaseDocument {
  userId: string;
  currency: Currency;
  locale: Locale;
  theme: Theme;
  biometricLogin: boolean;
  notifications: {
    budgetAlerts: boolean;
    weeklySummary: boolean;
  };
  dataSync: IDataSync;
}

export interface IAlertSettings extends IBaseDocument {
  userId: string;
  categoryThreshold: ICategoryThreshold;
  budgetExceeded: IBudgetExceeded;
  weeklySummary: IWeeklySummary;
  customAlerts: ICustomAlert[];
  notificationPreferences: INotificationPreferences;
  nigerianContext: INigerianContext;
}

export interface INotification extends IBaseDocument {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: Priority;
  status: NotificationStatus;
  data?: INotificationData;
  scheduledFor?: Date;
  sentAt?: Date;
  readAt?: Date;
  dismissedAt?: Date;
  expiresAt?: Date;
  channels: INotificationChannels;
  metadata: INotificationMetadata;

  // Methods
  markAsRead(): Promise<INotification>;
  dismiss(): Promise<INotification>;
}

export interface IBankConnection extends IBaseDocument {
  userId: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  linkedAt: Date;
  status: BankConnectionStatus;
  lastSync?: Date;
}

export interface IPasswordResetToken extends IBaseDocument {
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
}

// ================================
// MODEL STATIC METHODS INTERFACES
// ================================

export interface IGoalModelStatics {
  createNigerianGoalTemplate(category: string, userMonthlyIncome?: number): IGoalTemplate | undefined;
}

export interface ITransactionModelStatics {
  categorizeTransaction(merchant?: string, note?: string, amount?: number): string;
}

export interface INotificationModelStatics {
  createNigerianAlert(
    userId: string, 
    type: NotificationType, 
    title: string, 
    message: string,
    data?: INotificationData,
    priority?: Priority
  ): INotificationData;
}

export interface IAlertSettingsModelStatics {
  getDefaultSettings(userId: string): Partial<IAlertSettings>;
}

// ================================
// MODEL INTERFACES WITH STATICS
// ================================

export interface IGoalModel extends Model<IGoal>, IGoalModelStatics {}
export interface ITransactionModel extends Model<ITransaction>, ITransactionModelStatics {}
export interface INotificationModel extends Model<INotification>, INotificationModelStatics {}
export interface IAlertSettingsModel extends Model<IAlertSettings>, IAlertSettingsModelStatics {}

// ================================
// UTILITY FUNCTIONS
// ================================

export const formatNigerianCurrency = (
  amount: number, 
  options: INigerianFormatOptions = {}
): string => {
  const {
    currency = 'NGN',
    locale = 'en-NG',
    minimumFractionDigits = 0,
    showSymbol = true
  } = options;

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(amount);

  return showSymbol ? formatted.replace('NGN', '₦') : formatted.replace(/[₦NGN]/g, '').trim();
};

export const getCurrentNigerianContext = (): INigerianContext => {
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