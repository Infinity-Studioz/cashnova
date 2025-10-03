// src/app/api/dashboard/route.ts - Enhanced with your models
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Budget from "@/models/Budget";
import CategoryBudget from "@/models/CategoryBudget";
import Goal from "@/models/Goal";
import AIInsight from "@/models/AIInsight";
import Notification from "@/models/Notification";
import Report from "@/models/Report";
import { authOptions } from "@/utils/authOptions";
import { Types } from "mongoose";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();

    // Enhanced date ranges for comprehensive analysis
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startOfPrevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const endOfPrevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    // Parallel data fetching with your enhanced models
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
      unreadNotificationCount,
      monthlyReport,
    ] = await Promise.all([
      // Enhanced transaction aggregation
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
            avgAmount: { $avg: "$amount" },
            categories: {
              $addToSet: { $ifNull: ["$userCategory", "$category"] },
            },
          },
        },
      ]),

      // Previous month comparison with Nigerian context
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
          },
        },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),

      // Enhanced category breakdown with Nigerian merchant detection
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: "expense",
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: { $ifNull: ["$userCategory", "$category"] },
            amount: { $sum: "$amount" },
            count: { $sum: 1 },
            avgTransaction: { $avg: "$amount" },
            merchants: { $addToSet: "$merchant" },
            lastTransaction: { $max: "$date" },
            paymentMethods: { $addToSet: "$paymentMethod" },
          },
        },
        { $sort: { amount: -1 } },
        { $limit: 10 },
      ]),

      // Weekly spending trend with Nigerian economic context
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: "expense",
            date: { $gte: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: {
              week: {
                $dateToString: {
                  format: "%Y-W%U",
                  date: "$date",
                },
              },
            },
            spending: { $sum: "$amount" },
            count: { $sum: 1 },
            categories: {
              $addToSet: { $ifNull: ["$userCategory", "$category"] },
            },
          },
        },
        { $sort: { "_id.week": 1 } },
      ]),

      // Current budget with enhanced data
      Budget.findOne({
        userId: session.user.email,
        month: currentMonth,
      }),

      // Category budgets with spending analysis
      CategoryBudget.find({
        userId: session.user.email,
        month: currentMonth,
      }),

      // Enhanced goals with Nigerian context
      Goal.find({
        userId: session.user.email,
        isActive: true,
      })
        .sort({ priority: 1, deadline: 1 })
        .limit(5),

      // AI Insights from your AIInsight model
      AIInsight.find({
        userId: session.user.email,
        status: "pending",
      })
        .sort({ priority: -1, createdAt: -1 })
        .limit(5)
        .lean(),

      // Recent notifications with Nigerian context
      Notification.find({
        userId: session.user.email,
        status: { $in: ["unread", "read"] },
      })
        .sort({ createdAt: -1 })
        .limit(5),

      // Unread notification count
      Notification.countDocuments({
        userId: session.user.email,
        status: "unread",
      }),

      // Monthly report if available
      Report.findOne({
        userId: session.user.email,
        type: "monthly",
        period: currentMonth,
        status: "completed",
      }),
    ]);

    // Enhanced financial overview with Nigerian context
    const currentIncome =
      currentMonthTransactions.find((t) => t._id === "income")?.total || 0;
    const currentExpenses =
      currentMonthTransactions.find((t) => t._id === "expense")?.total || 0;
    const prevIncome =
      prevMonthTransactions.find((t) => t._id === "income")?.total || 0;
    const prevExpenses =
      prevMonthTransactions.find((t) => t._id === "expense")?.total || 0;

    const totalBalance = currentIncome - currentExpenses;
    const prevBalance = prevIncome - prevExpenses;

    // Calculate percentage changes with Nigerian economic context
    const balanceChange =
      prevBalance > 0 ? ((totalBalance - prevBalance) / prevBalance) * 100 : 0;
    const incomeChange =
      prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0;
    const expenseChange =
      prevExpenses > 0
        ? ((currentExpenses - prevExpenses) / prevExpenses) * 100
        : 0;

    // Enhanced spending by category with Nigerian insights
    const categoryColors = {
      "Food & Dining": "#10B981",
      Transport: "#3B82F6",
      "Rent/Housing": "#8B5CF6",
      Bills: "#F59E0B",
      "Family Support": "#EF4444",
      Entertainment: "#EC4899",
      "Health/Medical": "#06B6D4",
      Shopping: "#84CC16",
      "School Fees": "#F97316",
      "Church/Mosque": "#6366F1",
      "Other Expenses": "#6B7280",
    };

    const spendingByCategory = categorySpending.map((cat) => {
      const categoryBudget = categoryBudgets.find(
        (b) => b.category === cat._id
      );
      const percentage =
        currentExpenses > 0
          ? Math.round((cat.amount / currentExpenses) * 100)
          : 0;

      return {
        category: cat._id,
        amount: cat.amount,
        percentage,
        transactionCount: cat.count,
        avgTransaction: cat.avgTransaction,
        lastActivity: cat.lastTransaction,
        merchants: cat.merchants?.filter(Boolean) || [],
        paymentMethods: cat.paymentMethods || [],
        formattedAmount: formatNaira(cat.amount),
        color: categoryColors[cat._id as keyof typeof categoryColors] || "#6B7280",
        isOverBudget: categoryBudget
          ? cat.amount > categoryBudget.allocated
          : false,
        budgetAmount: categoryBudget?.allocated || 0,
        budgetUtilization: categoryBudget
          ? (cat.amount / categoryBudget.allocated) * 100
          : 0,
        nigerianInsights: generateCategoryInsights(
          cat._id,
          cat.amount,
          percentage
        ),
      };
    });

    // Enhanced weekly spending with budget projections
    const weeklyBudgetAmount = currentBudget
      ? currentBudget.totalBudget / 4
      : 0;
    const weeklySpending = weeklyData.map((week, index) => ({
      week: `Week ${index + 1}`,
      spending: week.spending,
      budget: weeklyBudgetAmount,
      categories: week.categories?.length || 0,
      transactionCount: week.count,
      formattedSpending: formatNaira(week.spending),
      formattedBudget: formatNaira(weeklyBudgetAmount),
      variance:
        weeklyBudgetAmount > 0
          ? ((week.spending - weeklyBudgetAmount) / weeklyBudgetAmount) * 100
          : 0,
    }));

    // Enhanced AI insights using your AIInsight model
    const enhancedAiInsights = await generateEnhancedDashboardInsights(
      session.user.email,
      {
        currentIncome,
        currentExpenses,
        expenseChange,
        spendingByCategory,
        dayOfMonth,
        currentBudget,
        userGoals,
        pendingInsights,
      }
    );

    // Enhanced notifications with Nigerian context
    const notifications = {
      unreadCount: unreadNotificationCount,
      recent: recentNotifications.map((notification) => ({
        id: (notification._id as Types.ObjectId).toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        createdAt: notification.createdAt.toISOString(),
        actionUrl: getNotificationActionUrl(
          notification.type,
          notification.data
        ),
        nigerianContext: notification.metadata?.nigerianContext,
      })),
    };

    // Enhanced goals with Nigerian financial context
    const formattedGoals = userGoals.map((goal) => {
      const progress = Math.min(
        (goal.currentAmount / goal.targetAmount) * 100,
        100
      );
      const daysLeft = goal.deadline
        ? Math.ceil(
            (new Date(goal.deadline).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      return {
        id: (goal._id as Types.ObjectId).toString(),
        name: goal.title,
        current: goal.currentAmount,
        target: goal.targetAmount,
        deadline: goal.deadline
          ? goal.deadline.toISOString().split("T")[0]
          : "",
        progress,
        formattedCurrent: formatNaira(goal.currentAmount),
        formattedTarget: formatNaira(goal.targetAmount),
        category: goal.category,
        isOnTrack: goal.insights?.isOnTrack !== false,
        daysLeft,
        urgency: !daysLeft
          ? "none"
          : daysLeft < 7
            ? "urgent"
            : daysLeft < 30
              ? "soon"
              : "future",
        nigerianContext: goal.nigerianContext,
        monthlyContributionNeeded:
          goal.insights?.monthlyContributionNeeded || 0,
        recentContributions: goal.contributions?.length || 0,
      };
    });

    // Enhanced Nigerian economic context
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
      ),
      inflationImpact: calculateInflationImpact(currentExpenses, prevExpenses),
      cashFlowHealth: calculateCashFlowHealth(totalBalance, currentExpenses),
    };

    // Enhanced quick actions based on AI insights
    const quickActions = generateSmartQuickActions(
      spendingByCategory,
      userGoals,
      currentBudget,
      nigerianContext
    );

    // Enhanced 30-day cashflow forecast with Nigerian context
    const cashflowForecast = generateEnhancedCashflowForecast(
      totalBalance,
      currentExpenses,
      currentIncome,
      dayOfMonth,
      nigerianContext
    );

    const dashboardData = {
      overview: {
        totalBalance,
        monthlyIncome: currentIncome,
        monthlyExpenses: currentExpenses,
        formattedTotalBalance: formatNaira(totalBalance),
        formattedMonthlyIncome: formatNaira(currentIncome),
        formattedMonthlyExpenses: formatNaira(currentExpenses),
        balanceChange: Math.round(balanceChange),
        incomeChange: Math.round(incomeChange),
        expenseChange: Math.round(expenseChange),
        savingsRate:
          currentIncome > 0
            ? ((currentIncome - currentExpenses) / currentIncome) * 100
            : 0,
        healthScore: calculateFinancialHealthScore(
          totalBalance,
          currentIncome,
          currentExpenses
        ),
      },
      spendingByCategory,
      weeklySpending,
      aiInsights: enhancedAiInsights.slice(0, 4),
      notifications,
      goals: formattedGoals,
      cashflowForecast,
      nigerianContext,
      quickActions,
      monthlyReport: monthlyReport
        ? {
            id: monthlyReport._id,
            period: monthlyReport.period,
            summary: monthlyReport.summary,
            createdAt: monthlyReport.createdAt,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      metadata: {
        lastUpdated: new Date().toISOString(),
        currency: "NGN",
        period: currentMonth,
        transactionCount: currentMonthTransactions.reduce(
          (sum, t) => sum + t.count,
          0
        ),
        notificationCount: unreadNotificationCount,
        dataQuality: calculateDataQuality(
          currentMonthTransactions,
          userGoals,
          currentBudget
        ),
        nigerianOptimizations: true,
      },
    });
  } catch (error: any) {
    console.error("Error fetching enhanced dashboard data:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data. Please try again later.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Enhanced helper functions
function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦");
}

function generateCategoryInsights(
  category: string,
  amount: number,
  percentage: number
): string[] {
  const insights = [];

  if (category === "Transport" && amount > 50000) {
    insights.push("High transport costs - consider BRT or carpooling");
  }

  if (category === "Food & Dining" && percentage > 30) {
    insights.push("Food expenses high - try meal planning");
  }

  if (category === "Bills" && amount > 30000) {
    insights.push("Review utility bills for optimization opportunities");
  }

  return insights;
}

async function generateEnhancedDashboardInsights(
  userId: string,
  data: any
): Promise<any[]> {
  const insights = [];
  const { pendingInsights } = data;

  // Add AI-generated insights from your model
  const formattedPendingInsights = pendingInsights
    .map((insight: any) => ({
      type:
        insight.type === "budget_alert"
          ? "warning"
          : insight.type === "achievement_celebration"
            ? "achievement"
            : "suggestion",
      title: insight.title,
      message: insight.message,
      action: insight.actions[0]?.label || "View Details",
      actionUrl: getInsightActionUrl(insight),
      priority: getPriorityNumber(insight.priority),
      isAI: true,
      nigerianContext: insight.nigerianContext,
    }))
    .slice(0, 3);

  insights.push(...formattedPendingInsights);

  // Generate additional insights based on spending patterns
  if (data.expenseChange > 25) {
    insights.push({
      type: "warning",
      title: "High Spending Alert",
      message: `You're spending ${Math.round(data.expenseChange)}% more this month. Consider reviewing your budget.`,
      action: "Review Budget",
      actionUrl: "/budget-planner/screen-1",
      priority: 1,
    });
  }

  return insights;
}

function generateEconomicInsights(
  isSchoolFeeSeason: boolean,
  isFestiveSeason: boolean,
  isSalarySeason: boolean,
  currentExpenses: number,
  currentIncome: number
): string[] {
  const insights = [];

  if (isSchoolFeeSeason) {
    insights.push("School fees season - budget for education expenses");
  }

  if (isFestiveSeason) {
    insights.push("Festive season - monitor increased spending patterns");
  }

  if (isSalarySeason) {
    insights.push("End-of-month salary cycle - plan for next month");
  }

  if (currentExpenses > currentIncome * 0.9) {
    insights.push("High expense ratio - consider cost optimization");
  }

  return insights;
}

function generateUrgentActions(
  isSchoolFeeSeason: boolean,
  isFestiveSeason: boolean,
  spendingByCategory: any[],
  currentBudget: any
): any[] {
  const actions = [];

  if (isSchoolFeeSeason) {
    actions.push({
      message: "School fees due soon - check your education savings",
      action: "view_education_goals",
      priority: "high",
    });
  }

  const overBudgetCount = spendingByCategory.filter(
    (cat) => cat.isOverBudget
  ).length;
  if (overBudgetCount > 2) {
    actions.push({
      message: `${overBudgetCount} categories over budget - immediate review needed`,
      action: "emergency_budget_review",
      priority: "urgent",
    });
  }

  return actions;
}

function generateSmartQuickActions(
  spendingByCategory: any[],
  userGoals: any[],
  currentBudget: any,
  nigerianContext: any
): any[] {
  const actions: Array<{
    title: string;
    description: string;
    icon: string;
    url: string;
    badge?: string;
  }> = [
    {
      title: 'Add Transaction',
      description: 'Record a new expense or income',
      icon: 'plus',
      url: '/addTransaction'
    },
    {
      title: "AI Coach",
      description: "Get Nigerian financial advice",
      icon: "robot",
      url: "/ai-coach",
    },
  ];

  // Smart contextual actions
  if (currentBudget) {
    actions.push({
      title: "View Budget",
      description: "Check your monthly budget status",
      icon: "chart-pie",
      url: "/budget-planner/screen-1",
      badge:
        spendingByCategory.filter((cat) => cat.isOverBudget).length > 0
          ? "Alert"
          : undefined,
    });
  } else {
    actions.push({
      title: "Create Budget",
      description: "Set up your monthly budget",
      icon: "chart-pie",
      url: "/budget-planner/screen-1",
      badge: "New",
    });
  }

  if (userGoals.length === 0) {
    actions.push({
      title: "Set Goal",
      description: "Create your first savings goal",
      icon: "bullseye",
      url: "/smartGoals",
      badge: "Start",
    });
  }

  return actions;
}

function generateEnhancedCashflowForecast(
  currentBalance: number,
  monthlyExpenses: number,
  monthlyIncome: number,
  dayOfMonth: number,
  nigerianContext: any
): any[] {
  const forecast = [];
  const avgDailyExpense = monthlyExpenses / dayOfMonth;

  for (let i = 1; i <= 30; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);

    let projected = currentBalance - avgDailyExpense * i;

    // Add salary on expected salary days (25th-28th) - Nigerian context
    if (futureDate.getDate() >= 25 && futureDate.getDate() <= 28) {
      projected += monthlyIncome;
    }

    // Nigerian economic volatility adjustment
    const confidence = Math.max(60, 90 - i * 1.5);

    forecast.push({
      date: futureDate.toISOString().split("T")[0],
      projected: Math.round(projected),
      confidence,
      formattedProjected: formatNaira(projected),
    });
  }

  return forecast;
}

function calculateInflationImpact(
  currentExpenses: number,
  prevExpenses: number
): number {
  if (prevExpenses === 0) return 0;
  return ((currentExpenses - prevExpenses) / prevExpenses) * 100;
}

function calculateCashFlowHealth(balance: number, expenses: number): string {
  if (balance < 0) return "critical";
  if (balance < expenses * 0.5) return "low";
  if (balance < expenses) return "moderate";
  return "good";
}

function calculateFinancialHealthScore(
  balance: number,
  income: number,
  expenses: number
): number {
  let score = 50; // Base score

  if (balance > 0) score += 20;
  if (income > expenses) score += 20;
  if (balance > expenses) score += 10; // One month buffer

  return Math.min(100, score);
}

function calculateDataQuality(
  transactions: any[],
  goals: any[],
  budget: any
): number {
  let score = 0;

  if (transactions && transactions.length > 0) score += 30;
  if (goals && goals.length > 0) score += 30;
  if (budget) score += 40;

  return score;
}

function getNotificationActionUrl(type: string, data: any): string | undefined {
  switch (type) {
    case "category_threshold":
    case "budget_exceeded":
      return "/budget-planner/screen-1";
    case "goal_milestone":
      return data?.goalId ? `/smartGoals?goal=${data.goalId}` : "/smartGoals";
    case "salary_reminder":
      return "/budget-planner/screen-3";
    case "school_fee_alert":
      return "/smartGoals?category=school_fees";
    default:
      return undefined;
  }
}

function getInsightActionUrl(insight: any): string | undefined {
  if (insight.actions && insight.actions[0]) {
    const action = insight.actions[0];
    return action.data?.route || "/dashboard";
  }
  return "/dashboard";
}

function getPriorityNumber(priority: string): number {
  switch (priority) {
    case "urgent":
      return 0;
    case "high":
      return 1;
    case "medium":
      return 2;
    case "low":
      return 3;
    default:
      return 2;
  }
}
