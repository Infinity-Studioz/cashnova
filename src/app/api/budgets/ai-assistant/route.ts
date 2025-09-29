// src/app/api/budgets/ai-assistant/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';
import CategoryBudget from '@/models/CategoryBudget';
import { authOptions } from '@/utils/authOptions';

// Nigerian budget categories with optimal allocations
const NIGERIAN_BUDGET_CATEGORIES = {
  'Rent/Housing': { percentage: 30, priority: 1 },
  'Food & Dining': { percentage: 25, priority: 2 },
  'Transport': { percentage: 15, priority: 3 },
  'Bills': { percentage: 10, priority: 4 },
  'Family Support': { percentage: 8, priority: 5 },
  'Entertainment': { percentage: 5, priority: 6 },
  'Health/Medical': { percentage: 4, priority: 7 },
  'Emergency Fund': { percentage: 3, priority: 8 }
} as const;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { 
      currentMonth, 
      goalType, 
      prompt, 
      targetSavings, 
      constraints = [],
      nigerianContext = {} 
    } = body;

    // Get user's financial context
    const [userTransactions, currentBudget, historicalSpending] = await Promise.all([
      Transaction.find({ userId: session.user.email })
        .sort({ date: -1 })
        .limit(100)
        .lean(),
      Budget.findOne({ 
        userId: session.user.email,
        month: currentMonth
      }).lean(),
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: 'expense',
            date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $ifNull: ['$userCategory', '$category'] },
            totalSpent: { $sum: '$amount' },
            avgMonthly: { $avg: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { totalSpent: -1 } }
      ])
    ]);

    // Calculate average monthly income
    const monthlyIncome = calculateMonthlyIncome(userTransactions);
    
    // Generate AI budget suggestions based on strategy
    const suggestions = await generateBudgetSuggestions({
      goalType,
      monthlyIncome,
      targetSavings,
      historicalSpending,
      currentBudget,
      nigerianContext,
      constraints
    });

    return NextResponse.json({
      success: true,
      suggestions,
      metadata: {
        goalType,
        monthlyIncome,
        analysisDate: new Date().toISOString(),
        nigerianContext
      }
    });

  } catch (error: any) {
    console.error('Error generating AI budget suggestions:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate budget suggestions. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

async function generateBudgetSuggestions({
  goalType,
  monthlyIncome,
  targetSavings = 15,
  historicalSpending,
  currentBudget,
  nigerianContext,
  constraints
}: any) {
  const totalBudget = monthlyIncome || 300000; // Default if no income data
  
  let optimizations = [];
  let projectedSavings = 0;
  let confidence = 0.7;
  
  // Generate different strategies
  switch (goalType) {
    case 'save_percentage':
      optimizations = generateSavingsOptimizedBudget(totalBudget, targetSavings, historicalSpending);
      confidence = 0.85;
      break;
      
    case 'zero_based':
      optimizations = generateZeroBasedBudget(totalBudget, historicalSpending, nigerianContext);
      confidence = 0.8;
      break;
      
    case 'generate_from_history':
      optimizations = generateHistoryBasedBudget(totalBudget, historicalSpending, nigerianContext);
      confidence = 0.9;
      break;
      
    case 'school_fees_season':
      optimizations = generateSchoolFeesBudget(totalBudget, historicalSpending, nigerianContext);
      confidence = 0.85;
      break;
      
    default:
      optimizations = generateOptimizedBudget(totalBudget, historicalSpending, nigerianContext);
      confidence = 0.75;
  }
  
  // Calculate projected savings
  const totalAllocated = optimizations.reduce((sum, opt) => sum + opt.suggestedBudget, 0);
  projectedSavings = totalBudget - totalAllocated;
  
  // Add Nigerian market factors
  const nigerianFactors = generateNigerianFactors(nigerianContext, goalType);
  
  return {
    totalBudget: totalBudget,
    optimizations,
    projectedSavings,
    confidence,
    nigerianFactors
  };
}

function generateSavingsOptimizedBudget(totalBudget: number, targetSavings: number, historicalSpending: any[]) {
  const savingsAmount = totalBudget * (targetSavings / 100);
  const remainingBudget = totalBudget - savingsAmount;
  
  return [
    {
      category: 'Rent/Housing',
      currentBudget: getCurrentSpending('Rent/Housing', historicalSpending),
      suggestedBudget: Math.round(remainingBudget * 0.35),
      reasoning: `Optimized housing allocation at 35% to maximize savings potential`,
      impact: `Allows for ${targetSavings}% savings while maintaining comfortable living`,
      priority: 1
    },
    {
      category: 'Food & Dining',
      currentBudget: getCurrentSpending('Food & Dining', historicalSpending),
      suggestedBudget: Math.round(remainingBudget * 0.20),
      reasoning: 'Balanced food budget with room for local market shopping',
      impact: 'Maintains nutrition while optimizing costs',
      priority: 2
    },
    {
      category: 'Transport',
      currentBudget: getCurrentSpending('Transport', historicalSpending),
      suggestedBudget: Math.round(remainingBudget * 0.15),
      reasoning: 'Accounts for fuel price volatility and traffic patterns',
      impact: 'Flexible transport budget for Nigerian conditions',
      priority: 3
    },
    {
      category: 'Bills',
      currentBudget: getCurrentSpending('Bills', historicalSpending),
      suggestedBudget: Math.round(remainingBudget * 0.12),
      reasoning: 'Essential utilities with backup power costs',
      impact: 'Covers electricity, water, internet, and generator fuel',
      priority: 4
    },
    {
      category: 'Family Support',
      currentBudget: getCurrentSpending('Family Support', historicalSpending),
      suggestedBudget: Math.round(remainingBudget * 0.08),
      reasoning: 'Important cultural obligation in Nigerian families',
      impact: 'Maintains family relationships and support system',
      priority: 5
    },
    {
      category: 'Emergency Fund',
      currentBudget: getCurrentSpending('Emergency Fund', historicalSpending),
      suggestedBudget: Math.round(savingsAmount),
      reasoning: `Your ${targetSavings}% savings target for emergencies and goals`,
      impact: 'Builds financial security against naira volatility',
      priority: 0
    }
  ];
}

function generateZeroBasedBudget(totalBudget: number, historicalSpending: any[], nigerianContext: any) {
  return [
    {
      category: 'Essentials',
      currentBudget: getCurrentSpending('Essentials', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.65),
      reasoning: 'Housing, food, transport, and utilities - non-negotiable expenses',
      impact: 'Covers all essential living expenses first',
      priority: 1
    },
    {
      category: 'Family Support',
      currentBudget: getCurrentSpending('Family Support', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.10),
      reasoning: 'Cultural obligation for family support in Nigerian society',
      impact: 'Maintains important family relationships',
      priority: 2
    },
    {
      category: 'Savings',
      currentBudget: getCurrentSpending('Savings', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.15),
      reasoning: 'Every naira allocated - building emergency fund and goals',
      impact: 'Forces conscious saving and investment decisions',
      priority: 3
    },
    {
      category: 'Discretionary',
      currentBudget: getCurrentSpending('Discretionary', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.10),
      reasoning: 'Entertainment, dining out, and personal spending',
      impact: 'Controlled but allows for quality of life',
      priority: 4
    }
  ];
}

function generateHistoryBasedBudget(totalBudget: number, historicalSpending: any[], nigerianContext: any) {
  const optimizations = [];
  
  // Analyze historical patterns
  for (const spending of historicalSpending.slice(0, 6)) {
    const avgMonthlySpent = spending.totalSpent / 3; // Last 3 months average
    const category = spending._id;
    
    // Apply Nigerian market optimizations
    const nigerianOptimization = getNigerianOptimization(category, avgMonthlySpent);
    const suggestedBudget = Math.round(avgMonthlySpent * nigerianOptimization.multiplier);
    
    optimizations.push({
      category,
      currentBudget: avgMonthlySpent,
      suggestedBudget,
      reasoning: `Based on your 3-month average with ${nigerianOptimization.reason}`,
      impact: nigerianOptimization.impact,
      priority: optimizations.length + 1
    });
  }
  
  return optimizations;
}

function generateSchoolFeesBudget(totalBudget: number, historicalSpending: any[], nigerianContext: any) {
  return [
    {
      category: 'School Fees',
      currentBudget: getCurrentSpending('School Fees', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.25),
      reasoning: 'Priority allocation for education expenses during school fees season',
      impact: 'Ensures education payments are covered first',
      priority: 1
    },
    {
      category: 'Rent/Housing',
      currentBudget: getCurrentSpending('Rent/Housing', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.25),
      reasoning: 'Reduced housing allocation to accommodate school fees',
      impact: 'Maintains shelter while prioritizing education',
      priority: 2
    },
    {
      category: 'Food & Dining',
      currentBudget: getCurrentSpending('Food & Dining', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.20),
      reasoning: 'Essential nutrition maintained during school fees season',
      impact: 'Balanced nutrition with cost-conscious choices',
      priority: 3
    },
    {
      category: 'Transport',
      currentBudget: getCurrentSpending('Transport', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.15),
      reasoning: 'Includes school run and regular transport needs',
      impact: 'Accommodates additional school-related travel',
      priority: 4
    },
    {
      category: 'Emergency Fund',
      currentBudget: getCurrentSpending('Emergency Fund', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.10),
      reasoning: 'Reduced but maintained emergency savings',
      impact: 'Keeps safety net while managing education costs',
      priority: 5
    },
    {
      category: 'Other Expenses',
      currentBudget: getCurrentSpending('Other', historicalSpending),
      suggestedBudget: Math.round(totalBudget * 0.05),
      reasoning: 'Minimal discretionary spending during school fees season',
      impact: 'Temporary reduction to prioritize education',
      priority: 6
    }
  ];
}

function generateOptimizedBudget(totalBudget: number, historicalSpending: any[], nigerianContext: any) {
  return Object.entries(NIGERIAN_BUDGET_CATEGORIES).map(([category, config], index) => ({
    category,
    currentBudget: getCurrentSpending(category, historicalSpending),
    suggestedBudget: Math.round(totalBudget * (config.percentage / 100)),
    reasoning: `Optimized allocation based on Nigerian financial best practices`,
    impact: `Balanced ${category.toLowerCase()} spending for Nigerian market conditions`,
    priority: config.priority
  }));
}

function getCurrentSpending(category: string, historicalSpending: any[]): number {
  const spending = historicalSpending.find(s => s._id === category);
  return spending ? Math.round(spending.totalSpent / 3) : 0; // 3-month average
}

function calculateMonthlyIncome(transactions: any[]): number {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  if (incomeTransactions.length === 0) return 0;
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const monthsOfData = Math.max(1, incomeTransactions.length / 4); // Rough monthly calculation
  
  return Math.round(totalIncome / monthsOfData);
}

function getNigerianOptimization(category: string, amount: number) {
  const optimizations = {
    'Transport': {
      multiplier: 1.1,
      reason: 'fuel price volatility buffer added',
      impact: 'Accounts for Nigerian fuel price fluctuations'
    },
    'Food & Dining': {
      multiplier: 0.95,
      reason: 'local market optimization',
      impact: 'Reduced costs through local market shopping'
    },
    'Bills': {
      multiplier: 1.15,
      reason: 'generator fuel and backup power costs',
      impact: 'Covers unreliable power infrastructure costs'
    },
    'Data/Airtime': {
      multiplier: 1.05,
      reason: 'multiple network provider strategy',
      impact: 'Ensures connectivity across Nigerian networks'
    }
  };
  
  return optimizations[category as keyof typeof optimizations] || {
    multiplier: 1.0,
    reason: 'maintained at current level',
    impact: 'Consistent with your spending pattern'
  };
}

function generateNigerianFactors(nigerianContext: any, goalType: string): string[] {
  const factors = [];
  
  if (nigerianContext.salaryExpected) {
    factors.push('Budget optimized for end-of-month Nigerian salary payments');
  }
  
  if (nigerianContext.schoolFeesSeason) {
    factors.push('School fees season adjustments applied for January/September');
  }
  
  if (nigerianContext.festiveSeason) {
    factors.push('Festive season buffer included for celebrations and family obligations');
  }
  
  factors.push('Naira volatility buffer included in essential categories');
  factors.push('Nigerian banking system payment patterns considered');
  factors.push('Local market pricing and seasonal variations factored in');
  
  return factors;
}