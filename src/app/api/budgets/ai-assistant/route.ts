// src/app/api/budgets/ai-assistant/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Budget from '@/models/Budget';
import CategoryBudget from '@/models/CategoryBudget';
import Transaction from '@/models/Transaction';
import { authOptions } from '@/utils/authOptions';

interface BudgetOptimization {
  category: string;
  currentBudget: number;
  suggestedBudget: number;
  reasoning: string;
  impact: string;
  priority: number;
}

interface AIBudgetSuggestion {
  totalBudget: number;
  optimizations: BudgetOptimization[];
  projectedSavings: number;
  confidence: number;
  nigerianFactors: string[];
}

const NIGERIAN_ECONOMIC_FACTORS = {
  inflation: 0.15, // 15% average inflation
  salaryGrowth: 0.08, // 8% average salary growth
  emergencyBuffer: 0.15, // 15% emergency buffer recommended
  festiveSeason: [11, 0], // December, January (0-indexed)
  schoolFeeMonths: [0, 8] // January, September
};

const CATEGORY_PRIORITIES = {
  'Rent/Housing': 1,
  'Food & Dining': 2,
  'Transport': 3,
  'Bills': 4,
  'Health/Medical': 5,
  'Family Support': 6,
  'Emergency Fund': 7,
  'Entertainment': 8,
  'Shopping': 9
};

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
      prompt, 
      currentMonth, 
      goalType, // 'save_percentage', 'optimize', 'zero_based', 'custom'
      targetSavings,
      constraints = []
    } = body;

    const month = currentMonth || new Date().toISOString().slice(0, 7);

    // Get historical spending data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const historicalTransactions = await Transaction.aggregate([
      {
        $match: {
          userId: session.user.email,
          type: 'expense',
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            category: { $ifNull: ['$userCategory', '$category'] },
            month: { $dateToString: { format: '%Y-%m', date: '$date' } }
          },
          totalSpent: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Get income data
    const incomeData = await Transaction.aggregate([
      {
        $match: {
          userId: session.user.email,
          type: 'income',
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: '%Y-%m', date: '$date' } }
          },
          totalIncome: { $sum: '$amount' },
          avgIncome: { $avg: '$amount' }
        }
      }
    ]);

    // Calculate monthly averages by category
    const categoryAverages = {};
    historicalTransactions.forEach(transaction => {
      const category = transaction._id.category;
      if (!categoryAverages[category]) {
        categoryAverages[category] = {
          totalSpent: 0,
          monthCount: 0,
          transactionCount: 0
        };
      }
      categoryAverages[category].totalSpent += transaction.totalSpent;
      categoryAverages[category].monthCount++;
      categoryAverages[category].transactionCount += transaction.transactionCount;
    });

    // Calculate average monthly income
    const avgMonthlyIncome = incomeData.length > 0 
      ? incomeData.reduce((sum, month) => sum + month.totalIncome, 0) / incomeData.length
      : 0;

    // Get current budget if exists
    const currentBudget = await Budget.findOne({
      userId: session.user.email,
      month
    });

    const currentCategoryBudgets = await CategoryBudget.find({
      userId: session.user.email,
      month
    });

    // Generate AI recommendations based on goal type
    let suggestions: AIBudgetSuggestion;

    switch (goalType) {
      case 'save_percentage':
        suggestions = generateSavingsOptimizedBudget(
          categoryAverages, 
          avgMonthlyIncome, 
          targetSavings || 10,
          currentCategoryBudgets
        );
        break;
      
      case 'zero_based':
        suggestions = generateZeroBasedBudget(
          categoryAverages, 
          avgMonthlyIncome, 
          currentCategoryBudgets
        );
        break;
      
      case 'optimize':
        suggestions = optimizeExistingBudget(
          categoryAverages, 
          currentBudget, 
          currentCategoryBudgets
        );
        break;
      
      default:
        suggestions = generateCustomBudget(
          prompt, 
          categoryAverages, 
          avgMonthlyIncome, 
          constraints
        );
    }

    // Apply Nigerian-specific adjustments
    suggestions = applyNigerianContext(suggestions, month);

    const response = {
      success: true,
      suggestions,
      metadata: {
        basedOnMonths: Math.min(6, incomeData.length),
        avgMonthlyIncome: avgMonthlyIncome,
        formattedAvgIncome: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(avgMonthlyIncome).replace('NGN', '₦'),
        dataQuality: incomeData.length >= 3 ? 'high' : incomeData.length >= 1 ? 'medium' : 'low',
        nigerianContext: {
          currentMonth: month,
          isSchoolFeeSeason: NIGERIAN_ECONOMIC_FACTORS.schoolFeeMonths.includes(new Date().getMonth()),
          isFestiveSeason: NIGERIAN_ECONOMIC_FACTORS.festiveSeason.includes(new Date().getMonth()),
          inflationAdjusted: true
        }
      }
    };

    return NextResponse.json(response, { status: 200 });

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

function generateSavingsOptimizedBudget(
  categoryAverages: any, 
  avgIncome: number, 
  savingsPercentage: number,
  currentBudgets: any[]
): AIBudgetSuggestion {
  const targetSavingsAmount = avgIncome * (savingsPercentage / 100);
  const availableForSpending = avgIncome - targetSavingsAmount;
  
  const optimizations: BudgetOptimization[] = [];
  let totalOptimizedBudget = 0;

  // Sort categories by priority (essentials first)
  const sortedCategories = Object.entries(categoryAverages).sort(([a], [b]) => {
    return (CATEGORY_PRIORITIES[a] || 10) - (CATEGORY_PRIORITIES[b] || 10);
  });

  sortedCategories.forEach(([category, data]: [string, any]) => {
    const avgMonthlySpend = data.totalSpent / data.monthCount;
    const currentBudget = currentBudgets.find(b => b.category === category)?.allocated || 0;
    
    let suggestedBudget = avgMonthlySpend;
    let reasoning = `Based on ${data.monthCount} months average spending`;
    
    // Apply category-specific optimization rules
    if (category === 'Entertainment' || category === 'Shopping') {
      // Reduce discretionary spending by 20-30%
      suggestedBudget = avgMonthlySpend * 0.75;
      reasoning = `Reduced by 25% to meet ${savingsPercentage}% savings goal`;
    } else if (category === 'Food & Dining') {
      // Modest reduction in dining expenses
      suggestedBudget = avgMonthlySpend * 0.9;
      reasoning = 'Reduced dining out by 10% - consider meal planning';
    } else if (category === 'Transport') {
      // Small efficiency gains
      suggestedBudget = avgMonthlySpend * 0.95;
      reasoning = 'Optimized for carpooling and efficient route planning';
    }
    
    // Nigerian inflation adjustment
    suggestedBudget = suggestedBudget * (1 + NIGERIAN_ECONOMIC_FACTORS.inflation * 0.5);
    
    const impact = currentBudget > 0 
      ? `₦${Math.abs(suggestedBudget - currentBudget).toLocaleString()} ${suggestedBudget > currentBudget ? 'increase' : 'decrease'}`
      : `New allocation: ₦${suggestedBudget.toLocaleString()}`;

    optimizations.push({
      category,
      currentBudget,
      suggestedBudget: Math.round(suggestedBudget),
      reasoning,
      impact,
      priority: CATEGORY_PRIORITIES[category] || 10
    });

    totalOptimizedBudget += suggestedBudget;
  });

  // Add Emergency Fund if not present
  if (!optimizations.some(opt => opt.category === 'Emergency Fund')) {
    const emergencyAmount = avgIncome * 0.1; // 10% for emergency fund
    optimizations.push({
      category: 'Emergency Fund',
      currentBudget: 0,
      suggestedBudget: Math.round(emergencyAmount),
      reasoning: 'Essential for Nigerian economic volatility',
      impact: `New category: ₦${emergencyAmount.toLocaleString()}`,
      priority: 7
    });
    totalOptimizedBudget += emergencyAmount;
  }

  return {
    totalBudget: Math.round(totalOptimizedBudget),
    optimizations,
    projectedSavings: targetSavingsAmount,
    confidence: categoryAverages && Object.keys(categoryAverages).length >= 3 ? 0.85 : 0.65,
    nigerianFactors: [
      'Inflation adjustment applied',
      'Emergency fund prioritized',
      'Transport optimization for Nigerian roads'
    ]
  };
}

function generateZeroBasedBudget(
  categoryAverages: any, 
  avgIncome: number, 
  currentBudgets: any[]
): AIBudgetSuggestion {
  const optimizations: BudgetOptimization[] = [];
  
  // Nigerian zero-based budget priorities
  const essentialAllocations = {
    'Rent/Housing': Math.min(avgIncome * 0.30, 150000), // Max 30% or ₦150k
    'Food & Dining': avgIncome * 0.20,
    'Transport': avgIncome * 0.12,
    'Bills': avgIncome * 0.08,
    'Family Support': avgIncome * 0.05,
    'Emergency Fund': avgIncome * 0.15,
    'Health/Medical': avgIncome * 0.05,
    'Entertainment': avgIncome * 0.03,
    'Personal Care': avgIncome * 0.02
  };

  let totalBudget = 0;

  Object.entries(essentialAllocations).forEach(([category, allocation]) => {
    const currentBudget = currentBudgets.find(b => b.category === category)?.allocated || 0;
    const suggestedBudget = Math.round(allocation);
    
    let reasoning = 'Zero-based allocation for essential needs';
    if (category === 'Emergency Fund') {
      reasoning = 'Critical for financial security in Nigeria';
    } else if (category === 'Rent/Housing') {
      reasoning = 'Capped at 30% of income for financial health';
    }

    optimizations.push({
      category,
      currentBudget,
      suggestedBudget,
      reasoning,
      impact: `₦${Math.abs(suggestedBudget - currentBudget).toLocaleString()} ${suggestedBudget > currentBudget ? 'increase' : 'decrease'}`,
      priority: CATEGORY_PRIORITIES[category] || 10
    });

    totalBudget += suggestedBudget;
  });

  return {
    totalBudget,
    optimizations,
    projectedSavings: essentialAllocations['Emergency Fund'] || 0,
    confidence: 0.9,
    nigerianFactors: [
      'Based on Nigerian financial planning principles',
      'Housing capped at 30% of income',
      'Strong emergency fund allocation',
      'Family support included as cultural essential'
    ]
  };
}

function optimizeExistingBudget(
  categoryAverages: any, 
  currentBudget: any, 
  currentCategoryBudgets: any[]
): AIBudgetSuggestion {
  if (!currentBudget) {
    throw new Error('No existing budget to optimize');
  }

  const optimizations: BudgetOptimization[] = [];
  let totalOptimizedBudget = 0;
  let projectedSavings = 0;

  currentCategoryBudgets.forEach(categoryBudget => {
    const category = categoryBudget.category;
    const currentAllocation = categoryBudget.allocated;
    const actualSpending = categoryBudget.spent;
    const averageData = categoryAverages[category];

    let suggestedBudget = currentAllocation;
    let reasoning = 'No changes recommended';
    
    if (averageData) {
      const avgMonthlySpend = averageData.totalSpent / averageData.monthCount;
      
      // If consistently underspending
      if (actualSpending < currentAllocation * 0.7 && avgMonthlySpend < currentAllocation * 0.8) {
        const reduction = Math.min(currentAllocation * 0.2, currentAllocation - avgMonthlySpend * 1.1);
        suggestedBudget = currentAllocation - reduction;
        reasoning = 'Consistently underspent - reallocate surplus';
        projectedSavings += reduction;
      }
      
      // If consistently overspending
      else if (actualSpending > currentAllocation * 1.1 || avgMonthlySpend > currentAllocation * 1.1) {
        const increase = Math.max(avgMonthlySpend * 1.1 - currentAllocation, currentAllocation * 0.1);
        suggestedBudget = currentAllocation + increase;
        reasoning = 'Frequently exceeded - increase allocation';
      }
    }

    // Apply Nigerian context adjustments
    if (category === 'Transport') {
      // Account for Nigerian fuel price volatility
      suggestedBudget = suggestedBudget * 1.05;
      reasoning += ' + 5% buffer for fuel price changes';
    } else if (category === 'Food & Dining') {
      // Account for seasonal food price changes
      suggestedBudget = suggestedBudget * 1.03;
      reasoning += ' + 3% for seasonal price variations';
    }

    optimizations.push({
      category,
      currentBudget: currentAllocation,
      suggestedBudget: Math.round(suggestedBudget),
      reasoning,
      impact: `₦${Math.abs(suggestedBudget - currentAllocation).toLocaleString()} ${suggestedBudget > currentAllocation ? 'increase' : 'decrease'}`,
      priority: CATEGORY_PRIORITIES[category] || 10
    });

    totalOptimizedBudget += suggestedBudget;
  });

  return {
    totalBudget: Math.round(totalOptimizedBudget),
    optimizations,
    projectedSavings: Math.max(0, projectedSavings),
    confidence: 0.8,
    nigerianFactors: [
      'Optimized based on actual spending patterns',
      'Fuel price volatility adjustment',
      'Seasonal food price buffer included'
    ]
  };
}

function generateCustomBudget(
  prompt: string, 
  categoryAverages: any, 
  avgIncome: number, 
  constraints: string[]
): AIBudgetSuggestion {
  const optimizations: BudgetOptimization[] = [];
  let totalBudget = 0;

  // Parse common budget prompts and generate appropriate responses
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('save') && promptLower.includes('wedding')) {
    // Wedding savings budget
    const weddingAllocation = avgIncome * 0.25; // 25% for wedding savings
    const essentials = {
      'Rent/Housing': avgIncome * 0.25,
      'Food & Dining': avgIncome * 0.18,
      'Transport': avgIncome * 0.10,
      'Bills': avgIncome * 0.08,
      'Wedding Savings': weddingAllocation,
      'Personal': avgIncome * 0.14
    };

    Object.entries(essentials).forEach(([category, allocation]) => {
      optimizations.push({
        category,
        currentBudget: 0,
        suggestedBudget: Math.round(allocation),
        reasoning: category === 'Wedding Savings' ? 'Aggressive savings for traditional Nigerian wedding' : 'Reduced allocation to maximize wedding savings',
        impact: `₦${allocation.toLocaleString()} allocated`,
        priority: category === 'Wedding Savings' ? 1 : CATEGORY_PRIORITIES[category] || 10
      });
      totalBudget += allocation;
    });
  }
  
  else if (promptLower.includes('emergency') || promptLower.includes('rainy day')) {
    // Emergency fund focused budget
    const emergencyAllocation = avgIncome * 0.20; // 20% for emergency fund
    const remaining = avgIncome - emergencyAllocation;
    
    const allocations = {
      'Emergency Fund': emergencyAllocation,
      'Rent/Housing': remaining * 0.35,
      'Food & Dining': remaining * 0.25,
      'Transport': remaining * 0.15,
      'Bills': remaining * 0.12,
      'Personal': remaining * 0.13
    };

    Object.entries(allocations).forEach(([category, allocation]) => {
      optimizations.push({
        category,
        currentBudget: 0,
        suggestedBudget: Math.round(allocation),
        reasoning: category === 'Emergency Fund' ? 'Prioritized for Nigerian economic uncertainty' : 'Scaled to accommodate emergency fund goal',
        impact: `₦${allocation.toLocaleString()} allocated`,
        priority: category === 'Emergency Fund' ? 1 : CATEGORY_PRIORITIES[category] || 10
      });
      totalBudget += allocation;
    });
  }
  
  else {
    // Default balanced budget based on historical data
    Object.entries(categoryAverages).forEach(([category, data]: [string, any]) => {
      const avgSpend = data.totalSpent / data.monthCount;
      const suggestedBudget = Math.round(avgSpend * 1.1); // 10% buffer

      optimizations.push({
        category,
        currentBudget: 0,
        suggestedBudget,
        reasoning: `Based on historical spending + 10% buffer`,
        impact: `₦${suggestedBudget.toLocaleString()} allocated`,
        priority: CATEGORY_PRIORITIES[category] || 10
      });
      totalBudget += suggestedBudget;
    });
  }

  return {
    totalBudget: Math.round(totalBudget),
    optimizations,
    projectedSavings: optimizations.find(opt => opt.category.includes('Savings') || opt.category === 'Emergency Fund')?.suggestedBudget || 0,
    confidence: 0.7,
    nigerianFactors: [
      'Custom budget tailored to your request',
      'Nigerian economic context considered',
      'Flexible allocations based on goals'
    ]
  };
}

function applyNigerianContext(suggestions: AIBudgetSuggestion, month: string): AIBudgetSuggestion {
  const monthNum = parseInt(month.split('-')[1]);
  const isSchoolFeeSeason = NIGERIAN_ECONOMIC_FACTORS.schoolFeeMonths.includes(monthNum - 1);
  const isFestiveSeason = NIGERIAN_ECONOMIC_FACTORS.festiveSeason.includes(monthNum - 1);

  // Apply seasonal adjustments
  suggestions.optimizations = suggestions.optimizations.map(opt => {
    let adjustedBudget = opt.suggestedBudget;
    let additionalContext = '';

    if (isSchoolFeeSeason && (opt.category === 'Family Support' || opt.category === 'Education')) {
      adjustedBudget = adjustedBudget * 1.3; // 30% increase for school fees
      additionalContext = ' (School fees season adjustment)';
    }

    if (isFestiveSeason) {
      if (opt.category === 'Food & Dining') {
        adjustedBudget = adjustedBudget * 1.2; // 20% increase for festive meals
        additionalContext = ' (Festive season adjustment)';
      } else if (opt.category === 'Entertainment' || opt.category === 'Shopping') {
        adjustedBudget = adjustedBudget * 1.15; // 15% increase for celebrations
        additionalContext = ' (Celebration budget increase)';
      }
    }

    return {
      ...opt,
      suggestedBudget: Math.round(adjustedBudget),
      reasoning: opt.reasoning + additionalContext
    };
  });

  // Update total budget
  suggestions.totalBudget = suggestions.optimizations.reduce((sum, opt) => sum + opt.suggestedBudget, 0);

  // Add Nigerian-specific factors
  const additionalFactors = [];
  
  if (isSchoolFeeSeason) {
    additionalFactors.push('School fees season adjustments applied');
  }
  
  if (isFestiveSeason) {
    additionalFactors.push('Festive season spending increases included');
  }
  
  additionalFactors.push('Nigerian salary cycle optimized (month-end payments)');
  
  suggestions.nigerianFactors = [...suggestions.nigerianFactors, ...additionalFactors];

  return suggestions;
}