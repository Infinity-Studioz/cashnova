// services/goalsService.ts
import { IGoalTemplate } from '@/models/Goal';

export interface Goal {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  category: 'emergency_fund' | 'school_fees' | 'rent_advance' | 'vacation' | 'wedding' | 
           'business_capital' | 'gadget_purchase' | 'house_deposit' | 'car_purchase' | 
           'medical_emergency' | 'custom';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: string;
  autoSaveRules?: {
    enabled: boolean;
    percentage: number;
    frequency: 'weekly' | 'monthly' | 'per_transaction';
    minTransactionAmount?: number;
  };
  milestones: Array<{
    percentage: number;
    amount: number;
    achievedAt?: string;
    celebrated: boolean;
  }>;
  contributions: Array<{
    amount: number;
    date: string;
    source: 'manual' | 'auto_save' | 'windfall' | 'salary_bonus';
    transactionId?: string;
    note?: string;
  }>;
  nigerianContext: {
    isSchoolFeesGoal: boolean;
    schoolTerm?: 'first' | 'second' | 'third';
    isEmergencyFund: boolean;
    targetMonthsCoverage?: number;
    isSalaryLinked: boolean;
    festiveSeasonBuffer: boolean;
  };
  insights: {
    projectedCompletionDate?: string;
    monthlyContributionNeeded: number;
    daysRemaining?: number;
    progressPercentage: number;
    isOnTrack: boolean;
    averageMonthlyContribution: number;
    recommendedMonthlyContribution: number;
  };
  // Virtual fields from your API
  progressPercentage: number;
  remainingAmount: number;
  formattedTargetAmount: string;
  formattedCurrentAmount: string;
  daysUntilDeadline?: number;
  timeStatus: 'no_deadline' | 'overdue' | 'urgent' | 'approaching' | 'on_time';
  nigerianInsights: string[];
  recentActivity: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoalSummary {
  total: number;
  active: number;
  completed: number;
  totalSaved: number;
  totalTargets: number;
  averageProgress: number;
  formattedTotalSaved: string;
  formattedTotalTargets: string;
}

export interface GoalResponse {
  success: boolean;
  goals: Goal[];
  summary: GoalSummary;
  nigerianMarketInsights: string[];
  metadata: {
    total: number;
    hasMore: boolean;
    filters: {
      category?: string;
      status?: string;
      priority?: string;
    };
  };
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  targetAmount: number;
  category: Goal['category'];
  deadline?: string;
  priority?: Goal['priority'];
  autoSaveRules?: Goal['autoSaveRules'];
  nigerianContext?: Partial<Goal['nigerianContext']>;
  currentAmount?: number;
}

export interface ContributeResponse {
  success: boolean;
  message: string;
  contribution: {
    amount: number;
    formattedAmount: string;
    source: string;
    note?: string;
    date: string;
  };
  goal: {
    id: string;
    title: string;
    currentAmount: number;
    targetAmount: number;
    progress: number;
    remaining: number;
    isCompleted: boolean;
    formattedCurrentAmount: string;
    formattedTargetAmount: string;
  };
  achievements: {
    milestones: Array<{
      percentage: number;
      achievedAt: string;
    }>;
    completed: boolean;
    progressJump: string;
  };
  insights: Array<{
    type: string;
    message: string;
    metric?: string;
    action?: string;
  }>;
  recommendations: Array<{
    type: string;
    message: string;
    action: string;
    priority: string;
  }>;
}

export class GoalsService {
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  static async getGoals(filters: {
    category?: string;
    status?: string;
    priority?: string;
    limit?: number;
  } = {}): Promise<GoalResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await fetch(`/api/goals?${params.toString()}`);
    return this.handleResponse<GoalResponse>(response);
  }

  static async createGoal(goalData: CreateGoalRequest): Promise<{
    success: boolean;
    message: string;
    goal: Goal;
    insights: Array<{
      type: string;
      message: string;
      action: string;
    }>;
    recommendations: string[];
  }> {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData)
    });
    return this.handleResponse(response);
  }

  static async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const response = await fetch(`/api/goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return this.handleResponse<Goal>(response);
  }

  static async contributeToGoal(
    id: string, 
    amount: number, 
    source: string = 'manual', 
    note?: string
  ): Promise<ContributeResponse> {
    const response = await fetch(`/api/goals/${id}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, source, note })
    });
    return this.handleResponse<ContributeResponse>(response);
  }

  static async deleteGoal(id: string): Promise<void> {
    const response = await fetch(`/api/goals/${id}`, { 
      method: 'DELETE' 
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Delete failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
  }

  // Helper method to get Nigerian goal templates - now properly typed
  static getNigerianTemplates(): IGoalTemplate[] {
    return [
      {
        category: 'emergency_fund',
        title: 'Emergency Fund',
        description: '3 months of expenses for economic stability',
        targetAmount: 150000,
        priority: 'urgent',
        nigerianContext: {
          isEmergencyFund: true,
          targetMonthsCoverage: 3,
          isSalaryLinked: true,
          festiveSeasonBuffer: false,
          isSchoolFeesGoal: false
        },
        milestones: [
          { percentage: 25, amount: 37500, celebrated: false },
          { percentage: 50, amount: 75000, celebrated: false },
          { percentage: 75, amount: 112500, celebrated: false },
          { percentage: 100, amount: 150000, celebrated: false }
        ]
      },
      {
        category: 'school_fees',
        title: 'School Fees',
        description: 'Next term school fees',
        targetAmount: 100000,
        priority: 'high',
        deadline: new Date(new Date().getFullYear() + 1, 0, 15), // January 15th next year
        nigerianContext: {
          isSchoolFeesGoal: true,
          schoolTerm: 'first',
          isSalaryLinked: true,
          festiveSeasonBuffer: false,
          isEmergencyFund: false
        },
        milestones: [
          { percentage: 25, amount: 25000, celebrated: false },
          { percentage: 50, amount: 50000, celebrated: false },
          { percentage: 75, amount: 75000, celebrated: false },
          { percentage: 100, amount: 100000, celebrated: false }
        ]
      },
      {
        category: 'rent_advance',
        title: 'Rent Advance',
        description: 'Annual rent payment',
        targetAmount: 360000,
        priority: 'high',
        nigerianContext: {
          isSalaryLinked: true,
          festiveSeasonBuffer: false,
          isEmergencyFund: false,
          isSchoolFeesGoal: false
        },
        milestones: [
          { percentage: 25, amount: 90000, celebrated: false },
          { percentage: 50, amount: 180000, celebrated: false },
          { percentage: 75, amount: 270000, celebrated: false },
          { percentage: 100, amount: 360000, celebrated: false }
        ]
      },
      {
        category: 'business_capital',
        title: 'Business Capital',
        description: 'Start or expand business',
        targetAmount: 500000,
        priority: 'medium',
        nigerianContext: {
          isSalaryLinked: false,
          festiveSeasonBuffer: false,
          isEmergencyFund: false,
          isSchoolFeesGoal: false
        },
        milestones: [
          { percentage: 25, amount: 125000, celebrated: false },
          { percentage: 50, amount: 250000, celebrated: false },
          { percentage: 75, amount: 375000, celebrated: false },
          { percentage: 100, amount: 500000, celebrated: false }
        ]
      }
    ];
  }

  // Utility method to format Nigerian Naira
  static formatNaira(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦');
  }
}