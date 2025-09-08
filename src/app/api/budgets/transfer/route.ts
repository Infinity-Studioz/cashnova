// src/app/api/budgets/transfer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Budget from '@/models/Budget';
import CategoryBudget from '@/models/CategoryBudget';
import { authOptions } from '@/utils/authOptions';

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
      month, 
      fromCategory, 
      toCategory, 
      amount,
      reason 
    } = body;

    // Validate required fields
    if (!month || !fromCategory || !toCategory || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: month, fromCategory, toCategory, amount' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Transfer amount must be positive' },
        { status: 400 }
      );
    }

    if (fromCategory === toCategory) {
      return NextResponse.json(
        { error: 'Cannot transfer to the same category' },
        { status: 400 }
      );
    }

    // Find the budget categories
    const [fromCategoryBudget, toCategoryBudget] = await Promise.all([
      CategoryBudget.findOne({ userId: session.user.email, month, category: fromCategory }),
      CategoryBudget.findOne({ userId: session.user.email, month, category: toCategory })
    ]);

    if (!fromCategoryBudget) {
      return NextResponse.json(
        { error: `Source category "${fromCategory}" not found` },
        { status: 404 }
      );
    }

    // Check if source category has enough unspent budget
    const availableToTransfer = fromCategoryBudget.allocated - fromCategoryBudget.spent;
    if (availableToTransfer < amount) {
      return NextResponse.json(
        { error: `Cannot transfer ₦${amount.toLocaleString()}. Only ₦${availableToTransfer.toLocaleString()} available in ${fromCategory}` },
        { status: 400 }
      );
    }

    // Perform the transfer
    fromCategoryBudget.allocated -= amount;
    
    if (toCategoryBudget) {
      toCategoryBudget.allocated += amount;
      await toCategoryBudget.save();
    } else {
      // Create new category budget if it doesn't exist
      const newCategoryBudget = new CategoryBudget({
        userId: session.user.email,
        month,
        category: toCategory,
        allocated: amount,
        spent: 0,
        AIRecommendation: `Created through transfer from ${fromCategory}`
      });
      await newCategoryBudget.save();
    }

    await fromCategoryBudget.save();

    // Log the transfer for audit
    const transferRecord = {
      timestamp: new Date(),
      from: fromCategory,
      to: toCategory,
      amount,
      reason: reason || 'Budget reallocation',
      remaining: fromCategoryBudget.allocated - fromCategoryBudget.spent
    };

    // Generate Nigerian-specific insights for the transfer
    const insights = [];
    
    // Category-specific transfer insights
    if (toCategory === 'Emergency Fund') {
      insights.push({
        type: 'positive',
        message: 'Smart move! Building your emergency fund is crucial for Nigerian economic volatility.',
        action: 'continue_building_emergency'
      });
    } else if (fromCategory === 'Entertainment' && toCategory === 'Food & Dining') {
      insights.push({
        type: 'practical',
        message: 'Good prioritization - food security comes before entertainment.',
        action: 'maintain_priorities'
      });
    } else if (toCategory === 'Transport' && amount > 10000) {
      insights.push({
        type: 'awareness',
        message: 'Transport costs can be volatile in Nigeria. Consider fuel-efficient options.',
        action: 'optimize_transport'
      });
    }

    // Check if this affects monthly budget balance
    const allCategoryBudgets = await CategoryBudget.find({
      userId: session.user.email,
      month
    });

    const totalAllocated = allCategoryBudgets.reduce((sum, cat) => sum + cat.allocated, 0);
    const budget = await Budget.findOne({ userId: session.user.email, month });

    if (budget && totalAllocated !== budget.totalBudget) {
      insights.push({
        type: 'info',
        message: `Category total (₦${totalAllocated.toLocaleString()}) ${totalAllocated > budget.totalBudget ? 'exceeds' : 'is under'} main budget (₦${budget.totalBudget.toLocaleString()})`,
        action: 'review_total_budget'
      });
    }

    const response = {
      success: true,
      message: `Successfully transferred ₦${amount.toLocaleString()} from ${fromCategory} to ${toCategory}`,
      transfer: {
        ...transferRecord,
        formattedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(amount).replace('NGN', '₦')
      },
      updatedCategories: {
        [fromCategory]: {
          allocated: fromCategoryBudget.allocated,
          spent: fromCategoryBudget.spent,
          remaining: fromCategoryBudget.allocated - fromCategoryBudget.spent,
          formattedAllocated: new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
          }).format(fromCategoryBudget.allocated).replace('NGN', '₦')
        },
        [toCategory]: {
          allocated: toCategoryBudget?.allocated || amount,
          spent: toCategoryBudget?.spent || 0,
          remaining: (toCategoryBudget?.allocated || amount) - (toCategoryBudget?.spent || 0),
          formattedAllocated: new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
          }).format(toCategoryBudget?.allocated || amount).replace('NGN', '₦')
        }
      },
      insights
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error('Error transferring budget:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to transfer budget. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// src/app/api/budgets/categories/route.ts
// Category-specific operations (separate file)
export async function PUT(request: NextRequest) {
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
    const { month, category, allocated, action } = body; // action: 'update', 'create', 'delete'

    if (action === 'create') {
      // Create new category budget
      if (!category || !allocated || allocated <= 0) {
        return NextResponse.json(
          { error: 'Category name and positive allocation amount required' },
          { status: 400 }
        );
      }

      // Check if category already exists
      const existingCategory = await CategoryBudget.findOne({
        userId: session.user.email,
        month,
        category
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: `Category "${category}" already exists for this month` },
          { status: 409 }
        );
      }

      const newCategory = new CategoryBudget({
        userId: session.user.email,
        month,
        category,
        allocated,
        spent: 0,
        AIRecommendation: `New category created - monitor spending patterns`
      });

      await newCategory.save();

      // Check budget balance
      const totalAllocated = await CategoryBudget.aggregate([
        {
          $match: { userId: session.user.email, month }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$allocated' }
          }
        }
      ]);

      const budget = await Budget.findOne({ userId: session.user.email, month });
      const budgetWarning = budget && totalAllocated[0]?.total > budget.totalBudget
        ? `Total category allocations (₦${totalAllocated[0].total.toLocaleString()}) exceed main budget (₦${budget.totalBudget.toLocaleString()})`
        : null;

      return NextResponse.json({
        success: true,
        category: {
          ...newCategory.toObject(),
          formattedAllocated: new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
          }).format(allocated).replace('NGN', '₦')
        },
        warning: budgetWarning
      }, { status: 201 });
    }

    else if (action === 'delete') {
      // Delete category budget
      if (!category) {
        return NextResponse.json(
          { error: 'Category name required' },
          { status: 400 }
        );
      }

      const categoryBudget = await CategoryBudget.findOneAndDelete({
        userId: session.user.email,
        month,
        category
      });

      if (!categoryBudget) {
        return NextResponse.json(
          { error: `Category "${category}" not found` },
          { status: 404 }
        );
      }

      // Warn if category had spending
      const warnings = [];
      if (categoryBudget.spent > 0) {
        warnings.push(`Category had ₦${categoryBudget.spent.toLocaleString()} in spending - transactions remain uncategorized`);
      }

      return NextResponse.json({
        success: true,
        message: `Category "${category}" deleted successfully`,
        freedUpAmount: categoryBudget.allocated,
        formattedFreedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(categoryBudget.allocated).replace('NGN', '₦'),
        warnings
      });
    }

    else {
      return NextResponse.json(
        { error: 'Invalid action. Use "create" or "delete"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error managing category budget:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to manage category budget. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}