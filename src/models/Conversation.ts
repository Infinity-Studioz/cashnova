// src/models/Conversation.ts
import mongoose, { Schema } from 'mongoose';
import { 
  IBaseDocument,
  INigerianContext,
  Priority,
  formatNigerianCurrency
} from '@/types';

export interface IMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    tokens?: number;
    model?: string;
    nigerianContext?: Partial<INigerianContext>;
    relatedData?: {
      transactionId?: string;
      budgetId?: string;
      goalId?: string;
      amount?: number;
    };
  };
}

export interface IConversationSummary {
  totalMessages: number;
  userQueries: string[];
  mainTopics: string[];
  actionableInsights: number;
  lastActiveDate: Date;
}

export interface IConversation extends IBaseDocument {
  userId: string;
  title: string;
  context: 'budget_help' | 'savings_advice' | 'spending_analysis' | 'goal_planning' | 'general_finance' | 'nigerian_economy';
  status: 'active' | 'paused' | 'completed' | 'archived';
  priority: Priority;
  messages: IMessage[];
  summary: IConversationSummary;
  nigerianInsights: string[];
  actionItems: Array<{
    id: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    completedAt?: Date;
  }>;
  tags: string[];
  isStarred: boolean;
  lastUserMessage?: Date;
  lastAssistantMessage?: Date;
  
  // Methods
  addMessage(role: IMessage['role'], content: string, metadata?: IMessage['metadata']): Promise<IConversation>;
  generateSummary(): void;
  markActionItemComplete(actionId: string): Promise<IConversation>;
}

export interface IConversationModel extends mongoose.Model<IConversation> {
  createFinancialCoachSession(userId: string, initialQuery: string, context?: IConversation['context']): Promise<IConversation>;
  getUserActiveConversations(userId: string, limit?: number): Promise<IConversation[]>;
  searchConversations(userId: string, query: string): Promise<IConversation[]>;
}

const MessageSchema: Schema = new Schema({
  id: { 
    type: String, 
    required: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  role: { 
    type: String, 
    enum: ['user', 'assistant', 'system'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 5000
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  metadata: {
    tokens: Number,
    model: String,
    nigerianContext: {
      isSchoolFeeSeason: Boolean,
      isSalaryCycle: Boolean,
      isFestiveSeason: Boolean
    },
    relatedData: {
      transactionId: String,
      budgetId: String,
      goalId: String,
      amount: Number
    }
  }
});

const ConversationSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true, 
      index: true 
    },
    title: { 
      type: String, 
      required: true,
      maxlength: 100,
      trim: true
    },
    context: { 
      type: String, 
      enum: ['budget_help', 'savings_advice', 'spending_analysis', 'goal_planning', 'general_finance', 'nigerian_economy'],
      default: 'general_finance',
      index: true
    },
    status: { 
      type: String, 
      enum: ['active', 'paused', 'completed', 'archived'],
      default: 'active',
      index: true
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    messages: [MessageSchema],
    summary: {
      totalMessages: { type: Number, default: 0 },
      userQueries: [{ type: String, maxlength: 200 }],
      mainTopics: [{ type: String, maxlength: 50 }],
      actionableInsights: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: Date.now }
    },
    nigerianInsights: [{
      type: String,
      maxlength: 300
    }],
    actionItems: [{
      id: { 
        type: String, 
        default: () => new mongoose.Types.ObjectId().toString()
      },
      description: { type: String, required: true, maxlength: 200 },
      completed: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      completedAt: Date
    }],
    tags: [{ 
      type: String, 
      maxlength: 30 
    }],
    isStarred: { 
      type: Boolean, 
      default: false,
      index: true
    },
    lastUserMessage: Date,
    lastAssistantMessage: Date
  },
  { 
    timestamps: true,
    indexes: [
      { userId: 1, status: 1, createdAt: -1 },
      { userId: 1, context: 1 },
      { userId: 1, isStarred: 1 },
      { 'summary.lastActiveDate': -1 }
    ]
  }
);

// Method to add a message to the conversation
ConversationSchema.methods.addMessage = function(
  this: IConversation,
  role: IMessage['role'],
  content: string,
  metadata?: IMessage['metadata']
): Promise<IConversation> {
  const message: IMessage = {
    id: new mongoose.Types.ObjectId().toString(),
    role,
    content,
    timestamp: new Date(),
    metadata
  };

  this.messages.push(message);
  
  // Update timestamps
  if (role === 'user') {
    this.lastUserMessage = new Date();
  } else if (role === 'assistant') {
    this.lastAssistantMessage = new Date();
  }

  // Update summary
  this.summary.totalMessages = this.messages.length;
  this.summary.lastActiveDate = new Date();

  // Auto-update status
  if (this.status === 'paused') {
    this.status = 'active';
  }

  return this.save();
};

// Method to generate conversation summary
ConversationSchema.methods.generateSummary = function(this: IConversation): void {
  const userMessages = this.messages.filter(m => m.role === 'user');
  
  this.summary = {
    totalMessages: this.messages.length,
    userQueries: userMessages.slice(-5).map(m => m.content.slice(0, 100)),
    mainTopics: this.extractMainTopics(),
    actionableInsights: this.actionItems.length,
    lastActiveDate: this.messages.length > 0 ? 
      this.messages[this.messages.length - 1].timestamp : 
      this.createdAt
  };
};

// Helper method to extract main topics
ConversationSchema.methods.extractMainTopics = function(this: IConversation): string[] {
  const topicKeywords = {
    'Budget Planning': ['budget', 'planning', 'allocation', 'spending'],
    'Savings Goals': ['save', 'goal', 'target', 'emergency'],
    'Debt Management': ['debt', 'loan', 'payment', 'interest'],
    'Nigerian Economy': ['naira', 'inflation', 'salary', 'nigeria'],
    'Investment': ['invest', 'returns', 'portfolio', 'stock'],
    'School Fees': ['school', 'fees', 'education', 'tuition'],
    'Family Finance': ['family', 'support', 'children', 'parents']
  };

  const content = this.messages.map(m => m.content.toLowerCase()).join(' ');
  const detectedTopics: string[] = [];

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => content.includes(keyword))) {
      detectedTopics.push(topic);
    }
  });

  return detectedTopics.slice(0, 5); // Limit to 5 main topics
};

// Method to mark action item as complete
ConversationSchema.methods.markActionItemComplete = function(
  this: IConversation,
  actionId: string
): Promise<IConversation> {
  const actionItem = this.actionItems.find(item => item.id === actionId);
  if (actionItem) {
    actionItem.completed = true;
    actionItem.completedAt = new Date();
  }
  return this.save();
};

// Static method to create a financial coach session
ConversationSchema.statics.createFinancialCoachSession = async function(
  userId: string,
  initialQuery: string,
  context: IConversation['context'] = 'general_finance'
): Promise<IConversation> {
  const title = this.generateConversationTitle(initialQuery, context);
  
  const conversation = new this({
    userId,
    title,
    context,
    status: 'active',
    priority: 'medium',
    messages: [{
      id: new mongoose.Types.ObjectId().toString(),
      role: 'user',
      content: initialQuery,
      timestamp: new Date()
    }],
    lastUserMessage: new Date()
  });

  // Generate initial Nigerian insights based on context
  conversation.nigerianInsights = this.generateInitialInsights(context);
  
  await conversation.save();
  return conversation;
};

// Static method to generate conversation title
ConversationSchema.statics.generateConversationTitle = function(
  query: string,
  context: IConversation['context']
): string {
  const contextTitles = {
    'budget_help': 'Budget Planning Session',
    'savings_advice': 'Savings Strategy Discussion',
    'spending_analysis': 'Spending Review',
    'goal_planning': 'Goal Setting Session',
    'general_finance': 'Financial Consultation',
    'nigerian_economy': 'Nigerian Market Analysis'
  };

  const baseTitle = contextTitles[context] || 'Financial Chat';
  const date = new Date().toLocaleDateString('en-NG', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  return `${baseTitle} - ${date}`;
};

// Static method to generate initial Nigerian insights
ConversationSchema.statics.generateInitialInsights = function(
  context: IConversation['context']
): string[] {
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const dayOfMonth = currentDate.getDate();

  const insights: string[] = [];

  // Seasonal insights
  if ([0, 8].includes(month)) { // January, September
    insights.push('School fees season - prioritize education budgets');
  }

  if ([11, 0].includes(month)) { // December, January
    insights.push('Festive season - monitor increased spending patterns');
  }

  // Salary cycle insights
  if (dayOfMonth >= 25) {
    insights.push('End-of-month salary period - good time for budget reviews');
  }

  // Context-specific insights
  switch (context) {
    case 'budget_help':
      insights.push('Nigerian salary budgeting: 30% housing, 25% food, 15% transport');
      break;
    case 'savings_advice':
      insights.push('Emergency fund priority: 3-6 months expenses for Nigerian economy');
      break;
    case 'goal_planning':
      insights.push('Consider Nigerian-specific goals: school fees, rent advance, family support');
      break;
    case 'nigerian_economy':
      insights.push('Account for inflation and naira volatility in financial planning');
      break;
  }

  return insights;
};

// Static method to get user's active conversations
ConversationSchema.statics.getUserActiveConversations = function(
  userId: string,
  limit: number = 10
): Promise<IConversation[]> {
  return this.find({
    userId,
    status: { $in: ['active', 'paused'] }
  })
  .sort({ 'summary.lastActiveDate': -1 })
  .limit(limit);
};

// Static method to search conversations
ConversationSchema.statics.searchConversations = function(
  userId: string,
  query: string
): Promise<IConversation[]> {
  return this.find({
    userId,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { 'messages.content': { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
  .sort({ 'summary.lastActiveDate': -1 })
  .limit(20);
};

export default mongoose.models.Conversation || 
  mongoose.model<IConversation, IConversationModel>('Conversation', ConversationSchema);