// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';
import CategoryBudget from '@/models/CategoryBudget';
import Goal from '@/models/Goal';
import AIInsight from '@/models/AIInsight';
import Notification from '@/models/Notification';
import { authOptions } from '@/utils/authOptions';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    
    // Date ranges for calculations
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // Parallel data fetching for optimal performance
    const [
      currentMonthTransactions,
      prevMonthTransactions,
      categorySpending,
      weeklyData,
      currentBudget,
      categoryBudgets,
      userGoals,
      pendingInsights,
      recentNotifications,
      unreadNotificationCount
    ] = await Promise.all([
      // Current month transaction summary
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            date: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]),

      // Previous month comparison
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth }
          }
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]),

      // Category spending breakdown
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: 'expense',
            date: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $group: {
            _id: { $ifNull: ['$userCategory', '$category'] },
            amount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { amount: -1 } },
        { $limit: 10 }
      ]),

      // Weekly spending trend (last 4 weeks)
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: 'expense',
            date: { $gte: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { 
              week: { 
                $dateToString: { 
                  format: '%Y-W%U', 
                  date: '$date' 
                } 
              }
            },
            spending: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.week': 1 } }
      ]),

      // Current budget
      Budget.findOne({
        userId: session.user.email,
        month: currentMonth
      }),

      // Category budgets
      CategoryBudget.find({
        userId: session.user.email,
        month: currentMonth
      }),

      // Active goals (top 5 by priority)
      Goal.find({
        userId: session.user.email,
        isActive: true
      }).sort({ priority: 1, deadline: 1 }).limit(5),

      // AI Insights (pending, high priority first)
      AIInsight.getUserPendingInsights(session.user.email).limit(5),

      // Recent notifications
      Notification.find({
        userId: session.user.email,
        status: { $in: ['unread', 'read'] }
      }).sort({ createdAt: -1 }).limit(5),

      // Unread notification count
      Notification.countDocuments({
        userId: session.user.email,
        status: 'unread'
      })
    ]);

    // Calculate financial overview
    const currentIncome = currentMonthTransactions.find(t => t._id === 'income')?.total || 0;
    const currentExpenses = currentMonthTransactions.find(t => t._id === 'expense')?.total || 0;
    const prevIncome = prevMonthTransactions.find(t => t._id === 'income')?.total || 0;
    const prevExpenses = prevMonthTransactions.find(t => t._id === 'expense')?.total || 0;

    const totalBalance = currentIncome - currentExpenses;
    const prevBalance = prevIncome - prevExpenses;

    // Calculate percentage changes
    const balanceChange = prevBalance > 0 ? ((totalBalance - prevBalance) / prevBalance) * 100 : 0;
    const incomeChange = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0;
    const expenseChange = prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 0;

    // Enhanced spending by category with budget comparison
    const categoryColors = {
      'Food & Dining': '#10B981',
      'Transport': '#3B82F6',
      'Rent/Housing': '#8B5CF6',
      'Bills': '#F59E0B',
      'Family Support': '#EF4444',
      'Entertainment': '#EC4899',
      'Health/Medical': '#06B6D4',
      'Shopping': '#84CC16',
      'School Fees': '#F97316',
      'Church/Mosque': '#6366F1',
      'Other Expenses': '#6B7280'
    };

    const spendingByCategory = categorySpending.map(cat => {
      const categoryBudget = categoryBudgets.find(b => b.category === cat._id);
      const percentage = currentExpenses > 0 ? Math.round((cat.amount / currentExpenses) * 100) : 0;
      
      return {
        category: cat._id,
        amount: cat.amount,
        percentage,
        formattedAmount: formatNigerianCurrency(cat.amount),
        color: categoryColors[cat._id] || '#6B7280',
        isOverBudget: categoryBudget ? cat.amount > categoryBudget.allocated : false,
        budgetAmount: categoryBudget?.allocated || 0,
        transactionCount: cat.count
      };
    });

    // Weekly spending with budget projections
    const weeklyBudgetAmount = currentBudget ? currentBudget.totalBudget / 4 : 0;
    const weeklySpending = weeklyData.map((week, index) => ({
      week: `Week ${index + 1}`,
      spending: week.spending,
      budget: weeklyBudgetAmount,
      formattedSpending: formatNigerianCurrency(week.spending),
      formattedBudget: formatNigerianCurrency(weeklyBudgetAmount)
    }));

    // Enhanced AI insights with Nigerian context
    const aiInsights = await generateDashboardInsights(
      session.user.email,
      {
        currentIncome,
        currentExpenses,
        expenseChange,
        spendingByCategory,
        dayOfMonth,
        currentBudget,
        userGoals,
        pendingInsights
      }
    );

    // Enhanced notifications
    const notifications = {
      unreadCount: unreadNotificationCount,
      recent: recentNotifications.map(notification => ({
        id: notification._id.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        createdAt: notification.createdAt.toISOString(),
        actionUrl: getNotificationActionUrl(notification.type, notification.data)
      }))
    };

    // Goals with enhanced progress tracking
    const formattedGoals = userGoals.map(goal => {
      const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
      const daysLeft = goal.deadline ? 
        Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
      
      return {
        id: goal._id.toString(),
        name: goal.title,
        current: goal.currentAmount,
        target: goal.targetAmount,
        deadline: goal.deadline ? goal.deadline.toISOString().split('T')[0] : '',
        progress,
        formattedCurrent: formatNigerianCurrency(goal.currentAmount),
        formattedTarget: formatNigerianCurrency(goal.targetAmount),
        category: goal.category,
        isOnTrack: goal.insights?.isOnTrack !== false,
        daysLeft,
        urgency: !daysLeft ? 'none' : daysLeft < 7 ? 'urgent' : daysLeft < 30 ? 'soon' : 'future'
      };
    });

    // Nigerian economic context
    const isSchoolFeeSeason = [0, 8].includes(currentDate.getMonth());
    const isFestiveSeason = [11, 0].includes(currentDate.getMonth());
    const isSalarySeason = dayOfMonth >= 25;
    
    const nigerianContext = {
      currentMonth,
      salaryExpected: isSalarySeason,
      dayOfMonth,
      isSchoolFeeSeason,
      isFestiveSeason,
      economicInsights: generateEconomicInsights(
        isSchoolFeeSeason,
        isFestiveSeason,
        isSalarySeason,
        currentExpenses,
        currentIncome
      ),
      urgentActions: generateUrgentActions(
        isSchoolFeeSeason,
        isFestiveSeason,
        spendingByCategory,
        currentBudget
      )
    };

    // Quick actions based on user state
    const quickActions = [
      {
        title: 'Add Transaction',
        description: 'Record a new expense or income',
        icon: 'plus',
        url: '/addTransaction'
      },
      {
        title: 'View Budget',
        description: 'Check your monthly budget status',
        icon: 'chart-pie',
        url: '/budget-planner/screen-1',
        badge: spendingByCategory.filter(cat => cat.isOverBudget).length > 0 ? 'Alert' : undefined
      },
      {
        title: 'Set Goal',
        description: 'Create a new savings goal',
        icon: 'bullseye',
        url: '/smartGoals'
      },
      {
        title: 'AI Coach',
        description: 'Get financial advice',
        icon: 'robot',
        url: '/ai-coach'
      }
    ];

    // 30-day cashflow forecast
    const cashflowForecast = generateCashflowForecast(
      totalBalance,
      currentExpenses,
      currentIncome,
      dayOfMonth
    );

    const dashboardData = {
      overview: {
        totalBalance,
        monthlyIncome: currentIncome,
        monthlyExpenses: currentExpenses,
        formattedTotalBalance: formatNigerianCurrency(totalBalance),
        formattedMonthlyIncome: formatNigerianCurrency(currentIncome),
        formattedMonthlyExpenses: formatNigerianCurrency(currentExpenses),
        balanceChange: Math.round(balanceChange),
        incomeChange: Math.round(incomeChange),
        expenseChange: Math.round(expenseChange)
      },
      spendingByCategory,
      weeklySpending,
      aiInsights: aiInsights.slice(0, 4), // Top 4 insights
      notifications,
      goals: formattedGoals,
      cashflowForecast,
      nigerianContext,
      quickActions
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      metadata: {
        lastUpdated: new Date().toISOString(),
        currency: 'NGN',
        period: currentMonth,
        transactionCount: currentMonthTransactions.reduce((sum, t) => sum + t.count, 0),
        notificationCount: unreadNotificationCount,
        dataQuality: calculateDataQuality(currentMonthTransactions, userGoals, currentBudget)
      }
    });

  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function for Nigerian currency formatting
function formatNigerianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

// Generate enhanced AI insights for dashboard
async function generateDashboardInsights(
  userId: string,
  data: any
): Promise<any[]> {
  const insights = [];
  const { currentIncome, currentExpenses, expenseChange, spendingByCategory, dayOfMonth, currentBudget, userGoals, pendingInsights } = data;

  // Add pending AI insights first (from AIInsight model)
  const formattedPendingInsights = pendingInsights.map((insight: any) => ({
    type: insight.type === 'budget_alert' ? 'warning' : 
          insight.type === 'achievement_celebration' ? 'achievement' : 'suggestion',
    title: insight.title,
    message: insight.message,
    action: insight.actions[0]?.label || 'View Details',
    actionUrl: getInsightActionUrl(insight),
    priority: getPriorityNumber(insight.priority),
    isAI: true
  })).slice(0, 2);

  insights.push(...formattedPendingInsights);

  // Spending alerts
  if (expenseChange > 25) {
    insights.push({
      type: 'warning',
      title: 'High Spending Alert',
      message: `You're spending ${Math.round(expenseChange)}% more this month. Consider reviewing your budget.`,
      action: 'Review Budget',
      actionUrl: '/budget-planner/screen-1',
      priority: 1
    });
  }

  // Category-specific insights
  if (spendingByCategory.length > 0) {
    const topCategory = spendingByCategory[0];
    if (topCategory.percentage > 40) {
      insights.push({
        type: 'warning',
        title: 'Category Dominance',
        message: `${topCategory.category} is ${topCategory.percentage}% of your expenses. Consider optimizing.`,
        action: 'View Category',
        actionUrl: `/transactionHistory?category=${encodeURIComponent(topCategory.category)}`,
        priority: 2
      });
    }
  }

  // Nigerian salary cycle insights
  if (dayOfMonth >= 25) {
    insights.push({
      type: 'suggestion',
      title: 'Salary Season Planning',
      message: 'End-of-month salary period approaching! Perfect time to plan next month\'s budget.',
      action: 'Plan Budget',
      actionUrl: '/budget-planner/screen-3',
      priority: 3
    });
  }

  // Goal achievements
  const nearCompletionGoals = userGoals.filter((goal: any) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return progress >= 75 && progress < 100;
  });

  if (nearCompletionGoals.length > 0) {
    insights.push({
      type: 'achievement',
      title: 'Goal Almost Complete!',
      message: `You're ${Math.round((nearCompletionGoals[0].currentAmount / nearCompletionGoals[0].targetAmount) * 100)}% towards your ${nearCompletionGoals[0].title} goal!`,
      action: 'Complete Goal',
      actionUrl: `/smartGoals?goal=${nearCompletionGoals[0]._id}`,
      priority: 2
    });
  }

  // Budget exceeded alerts
  const overBudgetCategories = spendingByCategory.filter(cat => cat.isOverBudget);
  if (overBudgetCategories.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Budget Exceeded',
      message: `${overBudgetCategories.length} categories are over budget this month.`,
      action: 'Adjust Budgets',
      actionUrl: '/budget-planner/screen-2',
      priority: 1
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}

// Generate economic insights based on Nigerian context
function generateEconomicInsights(
  isSchoolFeeSeason: boolean,
  isFestiveSeason: boolean,
  isSalarySeason: boolean,
  currentExpenses: number,
  currentIncome: number
): string[] {
  const insights = [];
  
  if (isSchoolFeeSeason) {
    insights.push('School fees season - budget for education expenses');
  }
  
  if (isFestiveSeason) {
    insights.push('Festive season - monitor increased spending patterns');
  }
  
  if (isSalarySeason) {
    insights.push('End-of-month salary cycle - plan for next month');
  }

  if (currentExpenses > currentIncome * 0.9) {
    insights.push('High expense ratio - consider cost optimization');
  }

  return insights;
}

// Generate urgent actions based on user state
function generateUrgentActions(
  isSchoolFeeSeason: boolean,
  isFestiveSeason: boolean,
  spendingByCategory: any[],
  currentBudget: any
): any[] {
  const actions = [];
  
  if (isSchoolFeeSeason) {
    actions.push({
      message: 'School fees due soon - check your education savings',
      action: 'view_education_goals',
      priority: 'high'
    });
  }
  
  if (isFestiveSeason && spendingByCategory.some(cat => cat.percentage > 30)) {
    actions.push({
      message: 'High festive spending detected - set spending limits',
      action: 'create_festive_budget',
      priority: 'high'
    });
  }

  const overBudgetCount = spendingByCategory.filter(cat => cat.isOverBudget).length;
  if (overBudgetCount > 2) {
    actions.push({
      message: `${overBudgetCount} categories over budget - immediate review needed`,
      action: 'emergency_budget_review',
      priority: 'urgent'
    });
  }

  return actions;
}

// Generate 30-day cashflow forecast
function generateCashflowForecast(
  currentBalance: number,
  monthlyExpenses: number,
  monthlyIncome: number,
  dayOfMonth: number
): any[] {
  const forecast = [];
  const avgDailyExpense = monthlyExpenses / dayOfMonth;
  
  for (let i = 1; i <= 30; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);
    
    let projected = currentBalance - (avgDailyExpense * i);
    
    // Add salary on expected salary days (25th-28th)
    if (futureDate.getDate() >= 25 && futureDate.getDate() <= 28) {
      projected += monthlyIncome;
    }
    
    const confidence = Math.max(60, 90 - (i * 1));
    
    forecast.push({
      date: futureDate.toISOString().split('T')[0],
      projected: Math.round(projected),
      confidence
    });
  }
  
  return forecast;
}

// Helper functions
function getNotificationActionUrl(type: string, data: any): string | undefined {
  switch (type) {
    case 'category_threshold':
    case 'budget_exceeded':
      return '/budget-planner/screen-1';
    case 'goal_milestone':
      return data?.goalId ? `/smartGoals?goal=${data.goalId}` : '/smartGoals';
    case 'salary_reminder':
      return '/budget-planner/screen-3';
    case 'school_fee_alert':
      return '/smartGoals?category=school_fees';
    default:
      return undefined;
  }
}

function getInsightActionUrl(insight: any): string | undefined {
  if (insight.actions && insight.actions[0]) {
    const action = insight.actions[0];
    return action.data?.route || '/dashboard';
  }
  return '/dashboard';
}

function getPriorityNumber(priority: string): number {
  switch (priority) {
    case 'urgent': return 0;
    case 'high': return 1;
    case 'medium': return 2;
    case 'low': return 3;
    default: return 2;
  }
}

function calculateDataQuality(transactions: any[], goals: any[], budget: any): number {
  let score = 0;
  
  if (transactions && transactions.length > 0) score += 30;
  if (goals && goals.length > 0) score += 30;
  if (budget) score += 40;
  
  return score;
}