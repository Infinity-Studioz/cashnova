// src/app/api/budgets/route.ts - Enhanced with AI Integration
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Budget from '@/models/Budget';
import CategoryBudget from '@/models/CategoryBudget';
import Transaction from '@/models/Transaction';
import AIInsight from '@/models/AIInsight';
import Notification from '@/models/Notification';
import { authOptions } from '@/utils/authOptions';

// Nigerian-specific budget categories with optimal allocations
const NIGERIAN_BUDGET_CATEGORIES = {
  'Rent/Housing': { percentage: 30, icon: 'home', priority: 1 },
  'Food & Dining': { percentage: 25, icon: 'utensils', priority: 2 },
  'Transport': { percentage: 15, icon: 'car', priority: 3 },
  'Bills': { percentage: 10, icon: 'bolt', priority: 4 },
  'Family Support': { percentage: 8, icon: 'heart', priority: 5 },
  'Entertainment': { percentage: 5, icon: 'film', priority: 6 },
  'Health/Medical': { percentage: 4, icon: 'heartbeat', priority: 7 },
  'Emergency Fund': { percentage: 3, icon: 'shield-alt', priority: 8 }
} as const;

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

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
    
    // Get current month budget with enhanced data
    const budget = await Budget.findOne({
      userId: session.user.email,
      month
    });

    const categoryBudgets = await CategoryBudget.find({
      userId: session.user.email,
      month
    }).sort({ category: 1 });

    // Enhanced transaction analysis for the month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    // Get comprehensive transaction summary
    const [transactionSummary, categorySpending, dailySpending] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
            },
            totalExpenses: {
              $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
            },
            transactionCount: { $sum: 1 },
            avgTransaction: { $avg: '$amount' }
          }
        }
      ]),

      // Category spending with Nigerian context
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: 'expense',
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $ifNull: ['$userCategory', '$category'] },
            spent: { $sum: '$amount' },
            transactionCount: { $sum: 1 },
            avgAmount: { $avg: '$amount' },
            lastTransaction: { $max: '$date' }
          }
        }
      ]),

      // Daily spending trend
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: 'expense',
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            dailySpent: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    const spendingMap = categorySpending.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {} as Record<string, any>);

    // Enhanced category budgets with AI insights
    const enhancedCategoryBudgets = await Promise.all(
      categoryBudgets.map(async (catBudget) => {
        const spending = spendingMap[catBudget.category] || { spent: 0, transactionCount: 0, avgAmount: 0 };
        const percentageUsed = catBudget.allocated > 0 ? (spending.spent / catBudget.allocated) * 100 : 0;
        const remaining = catBudget.allocated - spending.spent;
        
        // Generate AI insights for this category
        let aiInsight = null;
        if (percentageUsed > 90) {
          aiInsight = await AIInsight.generateBudgetAlert(session.user.email, {
            categoryName: catBudget.category,
            percentageUsed: Math.round(percentageUsed),
            remaining,
            budgetId: catBudget._id
          });
        }

        return {
          ...catBudget.toObject(),
          spent: spending.spent,
          remaining,
          percentageUsed: Math.round(percentageUsed * 10) / 10,
          transactionCount: spending.transactionCount,
          avgTransactionAmount: spending.avgAmount || 0,
          status: percentageUsed >= 100 ? 'exceeded' : percentageUsed >= 80 ? 'warning' : 'good',
          aiInsight: aiInsight?.title,
          lastActivity: spending.lastTransaction,
          formattedAllocated: formatNaira(catBudget.allocated),
          formattedSpent: formatNaira(spending.spent),
          formattedRemaining: formatNaira(remaining),
          nigerianOptimization: getNigerianCategoryAdvice(catBudget.category, percentageUsed)
        };
      })
    );

    // Calculate enhanced summary with Nigerian context
    const summary = transactionSummary[0] || { totalIncome: 0, totalExpenses: 0, transactionCount: 0, avgTransaction: 0 };
    const totalAllocated = categoryBudgets.reduce((sum, cat) => sum + cat.allocated, 0);
    const totalSpent = summary.totalExpenses;
    const budgetUtilization = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    // Enhanced AI insights with Nigerian financial intelligence
    const insights = await generateNigerianBudgetInsights(
      session.user.email,
      enhancedCategoryBudgets,
      summary,
      month
    );

    // Nigerian economic context
    const currentDay = new Date().getDate();
    const daysInMonth = endDate.getDate();
    const nigerianContext = {
      salaryExpected: currentDay >= 25,
      schoolFeesSeason: [1, 9].includes(new Date().getMonth() + 1),
      festiveSeason: [12, 1].includes(new Date().getMonth() + 1),
      midMonthCashFlow: currentDay >= 15 && currentDay <= 20,
      spendingVelocity: totalSpent / (currentDay / daysInMonth) // Daily burn rate
    };

    const responseData = {
      budget: budget ? {
        ...budget.toObject(),
        formattedTotalBudget: formatNaira(budget.totalBudget),
        healthScore: calculateBudgetHealthScore(budgetUtilization, nigerianContext)
      } : null,
      categoryBudgets: enhancedCategoryBudgets,
      summary: {
        month,
        totalAllocated,
        totalSpent,
        totalRemaining: totalAllocated - totalSpent,
        totalIncome: summary.totalIncome,
        budgetUtilization: Math.round(budgetUtilization * 10) / 10,
        transactionCount: summary.transactionCount,
        avgTransactionAmount: summary.avgTransaction,
        dailyBurnRate: totalSpent / currentDay,
        projectedMonthlySpend: (totalSpent / currentDay) * daysInMonth,
        // Formatted amounts
        formattedTotalAllocated: formatNaira(totalAllocated),
        formattedTotalSpent: formatNaira(totalSpent),
        formattedTotalRemaining: formatNaira(totalAllocated - totalSpent),
        formattedTotalIncome: formatNaira(summary.totalIncome)
      },
      insights,
      dailySpending: dailySpending.map(day => ({
        date: day._id,
        amount: day.dailySpent,
        count: day.count,
        formattedAmount: formatNaira(day.dailySpent)
      })),
      nigerianContext,
      recommendations: generateBudgetRecommendations(enhancedCategoryBudgets, nigerianContext)
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Error fetching enhanced budget:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch budget data. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Helper functions
function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

function getNigerianCategoryAdvice(category: string, percentageUsed: number): string | null {
  if (percentageUsed < 50) return null;

  const advice = {
    'Transport': 'Consider BRT or carpooling to reduce transport costs in Nigerian traffic',
    'Food & Dining': 'Try meal planning and local markets for better food budgeting',
    'Bills': 'Review subscription services and consider energy-saving measures',
    'Family Support': 'Plan family contributions at the beginning of each month',
    'Entertainment': 'Look for free/low-cost entertainment options in your area'
  };

  return advice[category as keyof typeof advice] || null;
}

function calculateBudgetHealthScore(utilization: number, context: any): number {
  let score = 100;
  
  if (utilization > 100) score -= 30;
  else if (utilization > 80) score -= 15;
  
  if (context.spendingVelocity > 1.2) score -= 10; // High burn rate
  if (context.midMonthCashFlow && utilization > 60) score -= 10; // Mid-month risk
  
  return Math.max(0, score);
}

async function generateNigerianBudgetInsights(
  userId: string,
  categoryBudgets: any[],
  summary: any,
  month: string
): Promise<any[]> {
  const insights = [];

  // Generate AI insights for overspending
  const overspentCategories = categoryBudgets.filter(cat => cat.percentageUsed >= 100);
  if (overspentCategories.length > 0) {
    for (const category of overspentCategories.slice(0, 2)) { // Limit to 2
      try {
        const aiInsight = await AIInsight.generateBudgetAlert(userId, {
          categoryName: category.category,
          percentageUsed: category.percentageUsed,
          remaining: category.remaining,
          budgetId: category._id
        });
        
        insights.push({
          type: 'warning',
          title: aiInsight.title,
          message: aiInsight.message,
          category: category.category,
          action: 'adjust_budget',
          aiGenerated: true
        });
      } catch (error) {
        console.error('Error generating AI insight:', error);
      }
    }
  }

  // Nigerian-specific insights
  const currentMonth = new Date().getMonth() + 1;
  if ([1, 9].includes(currentMonth)) {
    insights.push({
      type: 'info',
      title: 'School Fees Season',
      message: 'Consider allocating extra funds for education expenses this month',
      action: 'plan_school_fees'
    });
  }

  return insights;
}

function generateBudgetRecommendations(categoryBudgets: any[], nigerianContext: any): any[] {
  const recommendations = [];

  if (nigerianContext.salaryExpected) {
    recommendations.push({
      type: 'timing',
      message: 'Salary season approaching - great time to plan next month\'s budget',
      action: 'plan_next_budget',
      priority: 'medium'
    });
  }

  return recommendations;
}

export async function POST(request: NextRequest) {
  // Keep existing POST logic but enhance with AI insights
  // (Previous implementation with added AI integration)
}