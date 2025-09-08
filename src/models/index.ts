// src/models/index.ts
// Main model exports for CashNova

// Core Financial Models
export { default as User } from './User';
export { default as Transaction } from './Transaction';
export { default as Goal } from './Goal';
export { default as Budget } from './Budget';
export { default as CategoryBudget } from './CategoryBudget';

// User Preference Models
export { default as Settings } from './Settings';
export { default as AlertSettings } from './AlertSettings';

// AI and Intelligence Models
export { default as AIInsight } from './AIInsight';
export { default as Notification } from './Notification';
export { default as Conversation } from './Conversation';
export { default as Report } from './Report';

// Authentication & Security Models
export { default as PasswordResetToken } from './PasswordResetToken';

// Future Integration Models
export { default as BankConnection } from './BankConnection';

// Re-export types for convenience
export type {
  IUser,
  ITransaction,
  IGoal,
  IBudget,
  ICategoryBudget,
  ISettings,
  IAlertSettings,
  INotification,
  IBankConnection,
  IPasswordResetToken
} from '@/types';

// Re-export AI-specific types
export type {
  IAIInsight,
  IInsightAction,
  IInsightMetrics,
  IAIInsightModel
} from './AIInsight';

export type {
  IConversation,
  IMessage,
  IConversationSummary,
  IConversationModel
} from './Conversation';

export type {
  IReport,
  ITrendData,
  ICategoryData,
  ISavingsAnalysis,
  INigerianMetrics,
  IComparisonData,
  IReportModel
} from './Report';