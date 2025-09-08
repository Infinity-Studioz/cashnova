// src/app/api/budgets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Budget from '@/models/Budget';
import CategoryBudget from '@/models/CategoryBudget';
import Transaction from '@/models/Transaction';
import { authOptions } from '@/utils/authOptions';

// Nigerian-specific budget categories with typical allocations
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
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    // Get current month budget
    const budget = await Budget.findOne({
      userId: session.user.email,
      month
    });

    // Get category budgets for the month
    const categoryBudgets = await CategoryBudget.find({
      userId: session.user.email,
      month
    }).sort({ category: 1 });

    // Calculate spending from transactions for the month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    // Get transaction summary for the month
    const transactionSummary = await Transaction.aggregate([
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
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    // Get spending by category
    const categorySpending = await Transaction.aggregate([
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
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    // Create a map of category spending
    const spendingMap = categorySpending.reduce((acc, item) => {
      acc[item._id] = {
        spent: item.spent,
        transactionCount: item.transactionCount
      };
      return acc;
    }, {} as Record<string, { spent: number; transactionCount: number }>);

    // Enhance category budgets with spending data
    const enhancedCategoryBudgets = categoryBudgets.map(catBudget => {
      const spending = spendingMap[catBudget.category] || { spent: 0, transactionCount: 0 };
      const percentageUsed = catBudget.allocated > 0 ? (spending.spent / catBudget.allocated) * 100 : 0;
      const remaining = catBudget.allocated - spending.spent;
      
      return {
        ...catBudget.toObject(),
        spent: spending.spent,
        remaining,
        percentageUsed: Math.round(percentageUsed * 10) / 10,
        transactionCount: spending.transactionCount,
        status: percentageUsed >= 100 ? 'exceeded' : percentageUsed >= 80 ? 'warning' : 'good',
        formattedAllocated: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(catBudget.allocated).replace('NGN', '₦'),
        formattedSpent: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(spending.spent).replace('NGN', '₦'),
        formattedRemaining: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(remaining).replace('NGN', '₦')
      };
    });

    // Calculate totals
    const summary = transactionSummary[0] || { totalIncome: 0, totalExpenses: 0, transactionCount: 0 };
    const totalAllocated = categoryBudgets.reduce((sum, cat) => sum + cat.allocated, 0);
    const totalSpent = summary.totalExpenses;
    const totalRemaining = totalAllocated - totalSpent;
    const budgetUtilization = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    // Generate AI insights based on spending patterns
    const insights = [];
    
    // Check for overspending categories
    const overspentCategories = enhancedCategoryBudgets.filter(cat => cat.percentageUsed >= 100);
    if (overspentCategories.length > 0) {
      insights.push({
        type: 'warning',
        category: overspentCategories[0].category,
        message: `You've exceeded your ${overspentCategories[0].category} budget by ${overspentCategories[0].formattedSpent}`,
        action: 'adjust_budget'
      });
    }

    // Check for underspent categories that could be reallocated
    const underspentCategories = enhancedCategoryBudgets.filter(cat => cat.percentageUsed < 50 && cat.allocated > 10000);
    if (underspentCategories.length > 0 && overspentCategories.length > 0) {
      insights.push({
        type: 'suggestion',
        message: `Consider moving ₦${Math.min(underspentCategories[0].remaining, overspentCategories[0].spent - overspentCategories[0].allocated).toLocaleString()} from ${underspentCategories[0].category} to ${overspentCategories[0].category}`,
        action: 'transfer_budget'
      });
    }

    // Nigerian-specific insights
    const currentDay = new Date().getDate();
    const daysInMonth = endDate.getDate();
    const expectedSpendingRate = (currentDay / daysInMonth) * totalAllocated;
    
    if (totalSpent > expectedSpendingRate * 1.2) {
      insights.push({
        type: 'alert',
        message: `You're spending faster than expected this month. At this rate, you'll exceed your budget by ₦${Math.round(totalSpent * (daysInMonth / currentDay) - totalAllocated).toLocaleString()}`,
        action: 'slow_spending'
      });
    }

    const responseData = {
      budget: budget ? {
        ...budget.toObject(),
        formattedTotalBudget: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(budget.totalBudget).replace('NGN', '₦')
      } : null,
      categoryBudgets: enhancedCategoryBudgets,
      summary: {
        month,
        totalAllocated,
        totalSpent,
        totalRemaining,
        totalIncome: summary.totalIncome,
        budgetUtilization: Math.round(budgetUtilization * 10) / 10,
        transactionCount: summary.transactionCount,
        // Formatted amounts
        formattedTotalAllocated: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(totalAllocated).replace('NGN', '₦'),
        formattedTotalSpent: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(totalSpent).replace('NGN', '₦'),
        formattedTotalRemaining: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(totalRemaining).replace('NGN', '₦'),
        formattedTotalIncome: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(summary.totalIncome).replace('NGN', '₦')
      },
      insights,
      nigerianContext: {
        salaryExpected: currentDay >= 25, // Most Nigerian salaries come end of month
        schoolFeesSeason: [1, 9].includes(new Date().getMonth() + 1), // January and September
        festiveSeason: [12, 1].includes(new Date().getMonth() + 1), // December and January
        midMonthCashFlow: currentDay >= 15 && currentDay <= 20 // Critical cash flow period
      }
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Error fetching budget:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch budget data. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

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
    const { month, totalBudget, categories, generateFromHistory } = body;

    if (!month) {
      return NextResponse.json(
        { error: 'Month is required (format: YYYY-MM)' },
        { status: 400 }
      );
    }

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM (e.g., 2025-10)' },
        { status: 400 }
      );
    }

    let budgetData;
    let categoryData = [];

    if (generateFromHistory) {
      // Generate budget based on historical spending
      const startDate = new Date(month + '-01');
      const previousMonthStart = new Date(startDate.getFullYear(), startDate.getMonth() - 3, 1);
      const previousMonthEnd = new Date(startDate.getFullYear(), startDate.getMonth(), 0);

      // Get average spending from last 3 months
      const historicalSpending = await Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: 'expense',
            date: { $gte: previousMonthStart, $lte: previousMonthEnd }
          }
        },
        {
          $group: {
            _id: { $ifNull: ['$userCategory', '$category'] },
            avgSpending: { $avg: '$amount' },
            totalSpending: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);

      const totalHistoricalSpending = historicalSpending.reduce((sum, cat) => sum + cat.totalSpending, 0);
      const avgMonthlySpending = totalHistoricalSpending / 3;

      // Add 10% buffer for Nigerian economic conditions
      const recommendedBudget = Math.round(avgMonthlySpending * 1.1);

      budgetData = {
        userId: session.user.email,
        month,
        totalBudget: recommendedBudget,
        spent: 0,
        remaining: recommendedBudget,
        AIWarning: historicalSpending.length === 0 ? 'No historical data available. Budget created based on Nigerian salary patterns.' : undefined
      };

      // Generate category budgets based on historical data
      categoryData = historicalSpending.map(cat => {
        const avgAmount = Math.round(cat.avgSpending * 1.1); // Add 10% buffer
        return {
          userId: session.user.email,
          month,
          category: cat._id,
          allocated: avgAmount,
          spent: 0,
          AIRecommendation: cat.count < 3 ? `Limited data: Based on ${cat.count} transactions` : undefined
        };
      });

      // Ensure essential Nigerian categories are included
      const existingCategories = new Set(categoryData.map(c => c.category));
      Object.entries(NIGERIAN_BUDGET_CATEGORIES).forEach(([category, data]) => {
        if (!existingCategories.has(category)) {
          const recommendedAmount = Math.round(recommendedBudget * (data.percentage / 100));
          if (recommendedAmount > 5000) { // Only add if significant amount
            categoryData.push({
              userId: session.user.email,
              month,
              category,
              allocated: recommendedAmount,
              spent: 0,
              AIRecommendation: 'Added based on Nigerian spending patterns'
            });
          }
        }
      });

    } else {
      // Manual budget creation
      if (!totalBudget || totalBudget <= 0) {
        return NextResponse.json(
          { error: 'Total budget must be a positive number' },
          { status: 400 }
        );
      }

      budgetData = {
        userId: session.user.email,
        month,
        totalBudget,
        spent: 0,
        remaining: totalBudget
      };

      // Handle category budgets
      if (categories && Array.isArray(categories)) {
        const totalCategoryBudget = categories.reduce((sum, cat) => sum + cat.allocated, 0);
        
        if (totalCategoryBudget > totalBudget) {
          return NextResponse.json(
            { error: 'Category budgets exceed total budget' },
            { status: 400 }
          );
        }

        categoryData = categories.map(cat => ({
          userId: session.user.email,
          month,
          category: cat.category,
          allocated: cat.allocated,
          spent: 0,
          AIRecommendation: cat.allocated > totalBudget * 0.4 ? 
            `${cat.category} takes ${Math.round((cat.allocated / totalBudget) * 100)}% of your budget. Consider reviewing.` : 
            undefined
        }));
      }
    }

    // Check if budget already exists for this month
    const existingBudget = await Budget.findOne({
      userId: session.user.email,
      month
    });

    let budget;
    if (existingBudget) {
      // Update existing budget
      budget = await Budget.findOneAndUpdate(
        { userId: session.user.email, month },
        budgetData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new budget
      budget = new Budget(budgetData);
      await budget.save();
    }

    // Handle category budgets - delete existing and create new
    await CategoryBudget.deleteMany({
      userId: session.user.email,
      month
    });

    const savedCategoryBudgets = await CategoryBudget.insertMany(categoryData);

    // Generate Nigerian-specific recommendations
    const recommendations = [];
    
    if (budgetData.totalBudget > 500000) { // High earners
      recommendations.push({
        type: 'investment',
        message: 'Consider allocating 20% to investments and savings for long-term growth',
        action: 'create_investment_category'
      });
    }

    if (!categoryData.some(c => c.category === 'Emergency Fund')) {
      recommendations.push({
        type: 'safety',
        message: 'Add an Emergency Fund category (3-6 months expenses) for Nigerian economic volatility',
        action: 'add_emergency_fund'
      });
    }

    const housingBudget = categoryData.find(c => c.category === 'Rent/Housing');
    if (housingBudget && (housingBudget.allocated / budgetData.totalBudget) > 0.35) {
      recommendations.push({
        type: 'warning',
        message: 'Housing costs exceed 35% of income. Consider relocating or increasing income.',
        action: 'review_housing'
      });
    }

    const response = {
      success: true,
      budget: {
        ...budget.toObject(),
        formattedTotalBudget: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(budget.totalBudget).replace('NGN', '₦')
      },
      categoryBudgets: savedCategoryBudgets.map(cat => ({
        ...cat.toObject(),
        formattedAllocated: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(cat.allocated).replace('NGN', '₦')
      })),
      recommendations,
      method: generateFromHistory ? 'ai_generated' : 'manual',
      nigerianOptimizations: generateFromHistory ? [
        'Added 10% buffer for economic volatility',
        'Included essential Nigerian categories',
        'Optimized for monthly salary cycles'
      ] : []
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error: any) {
    console.error('Error creating budget:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Budget for this month already exists. Use PUT to update.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create budget. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}