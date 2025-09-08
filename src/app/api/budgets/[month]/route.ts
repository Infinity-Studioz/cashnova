// src/app/api/budgets/[month]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Budget from '@/models/Budget';
import CategoryBudget from '@/models/CategoryBudget';
import Transaction from '@/models/Transaction';
import { authOptions } from '@/utils/authOptions';

interface RouteParams {
  params: {
    month: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { month } = params;
    const body = await request.json();
    const { totalBudget, categories } = body;

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM (e.g., 2025-10)' },
        { status: 400 }
      );
    }

    // Find existing budget
    const existingBudget = await Budget.findOne({
      userId: session.user.email,
      month
    });

    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Budget not found for this month. Create a budget first.' },
        { status: 404 }
      );
    }

    // Get current spending for the month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const currentSpending = await Transaction.aggregate([
      {
        $match: {
          userId: session.user.email,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const spent = currentSpending[0]?.totalSpent || 0;

    // Update budget
    const updateData: any = {};
    if (totalBudget !== undefined) {
      if (totalBudget <= 0) {
        return NextResponse.json(
          { error: 'Total budget must be a positive number' },
          { status: 400 }
        );
      }
      updateData.totalBudget = totalBudget;
      updateData.remaining = totalBudget - spent;
    }
    updateData.spent = spent;

    const updatedBudget = await Budget.findOneAndUpdate(
      { userId: session.user.email, month },
      updateData,
      { new: true, runValidators: true }
    );

    // Handle category budget updates
    let updatedCategoryBudgets = [];
    if (categories && Array.isArray(categories)) {
      // Validate that category budgets don't exceed total budget
      const totalCategoryBudget = categories.reduce((sum, cat) => sum + cat.allocated, 0);
      const finalTotalBudget = totalBudget || existingBudget.totalBudget;
      
      if (totalCategoryBudget > finalTotalBudget) {
        return NextResponse.json(
          { error: `Category budgets (₦${totalCategoryBudget.toLocaleString()}) exceed total budget (₦${finalTotalBudget.toLocaleString()})` },
          { status: 400 }
        );
      }

      // Get current category spending
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
            spent: { $sum: '$amount' }
          }
        }
      ]);

      const spendingMap = categorySpending.reduce((acc, item) => {
        acc[item._id] = item.spent;
        return acc;
      }, {} as Record<string, number>);

      // Update each category budget
      for (const category of categories) {
        const categorySpent = spendingMap[category.category] || 0;
        
        const updatedCategory = await CategoryBudget.findOneAndUpdate(
          { 
            userId: session.user.email, 
            month, 
            category: category.category 
          },
          {
            allocated: category.allocated,
            spent: categorySpent,
            AIRecommendation: category.allocated < categorySpent ? 
              `Warning: Already spent ₦${categorySpent.toLocaleString()} but budget is only ₦${category.allocated.toLocaleString()}` : 
              undefined
          },
          { 
            new: true, 
            upsert: true, 
            runValidators: true 
          }
        );

        updatedCategoryBudgets.push(updatedCategory);
      }
    } else {
      // Just get existing category budgets with updated spending
      const existingCategoryBudgets = await CategoryBudget.find({
        userId: session.user.email,
        month
      });

      // Update spending for existing categories
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
            spent: { $sum: '$amount' }
          }
        }
      ]);

      const spendingMap = categorySpending.reduce((acc, item) => {
        acc[item._id] = item.spent;
        return acc;
      }, {} as Record<string, number>);

      for (const categoryBudget of existingCategoryBudgets) {
        const spent = spendingMap[categoryBudget.category] || 0;
        categoryBudget.spent = spent;
        await categoryBudget.save();
      }

      updatedCategoryBudgets = existingCategoryBudgets;
    }

    // Generate Nigerian-specific insights for budget update
    const insights = [];
    
    // Check if it's a good time to adjust budget (Nigerian salary context)
    const currentDate = new Date();
    const isEndOfMonth = currentDate.getDate() >= 25;
    
    if (isEndOfMonth) {
      insights.push({
        type: 'timing',
        message: 'Good timing! End of month is ideal for budget adjustments before next salary.',
        action: 'plan_next_month'
      });
    }

    // Budget increase/decrease analysis
    if (totalBudget && totalBudget !== existingBudget.totalBudget) {
      const change = totalBudget - existingBudget.totalBudget;
      const changePercentage = Math.abs(change / existingBudget.totalBudget * 100);
      
      if (change > 0) {
        insights.push({
          type: 'positive',
          message: `Budget increased by ₦${change.toLocaleString()} (${changePercentage.toFixed(1)}%). Consider allocating extra funds to savings or emergency fund.`,
          action: 'allocate_increase'
        });
      } else {
        insights.push({
          type: 'caution',
          message: `Budget reduced by ₦${Math.abs(change).toLocaleString()} (${changePercentage.toFixed(1)}%). Ensure essential categories like housing and food are prioritized.`,
          action: 'review_essentials'
        });
      }
    }

    const response = {
      success: true,
      message: 'Budget updated successfully',
      budget: {
        ...updatedBudget!.toObject(),
        formattedTotalBudget: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(updatedBudget!.totalBudget).replace('NGN', '₦')
      },
      categoryBudgets: updatedCategoryBudgets.map(cat => ({
        ...cat.toObject(),
        formattedAllocated: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(cat.allocated).replace('NGN', '₦')
      })),
      insights,
      summary: {
        totalAllocated: updatedCategoryBudgets.reduce((sum, cat) => sum + cat.allocated, 0),
        totalSpent: spent,
        budgetUtilization: updatedBudget!.totalBudget > 0 ? (spent / updatedBudget!.totalBudget * 100) : 0
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error updating budget:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to update budget. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { month } = params;

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM (e.g., 2025-10)' },
        { status: 400 }
      );
    }

    // Check if budget exists
    const existingBudget = await Budget.findOne({
      userId: session.user.email,
      month
    });

    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Budget not found for this month.' },
        { status: 404 }
      );
    }

    // Check if there are any transactions for this month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    const transactionCount = await Transaction.countDocuments({
      userId: session.user.email,
      date: { $gte: startDate, $lte: endDate }
    });

    // Nigerian-specific warning for current month deletion
    const currentMonth = new Date().toISOString().slice(0, 7);
    let warnings = [];

    if (month === currentMonth) {
      warnings.push('Deleting current month budget will remove spending tracking for ongoing expenses.');
    }

    if (transactionCount > 0) {
      warnings.push(`${transactionCount} transactions exist for this month. Consider archiving instead of deleting.`);
    }

    // Delete budget and related category budgets
    const [deletedBudget] = await Promise.all([
      Budget.findOneAndDelete({ userId: session.user.email, month }),
      CategoryBudget.deleteMany({ userId: session.user.email, month })
    ]);

    const response = {
      success: true,
      message: `Budget for ${month} deleted successfully`,
      deletedBudget: {
        id: deletedBudget!._id,
        month: deletedBudget!.month,
        totalBudget: deletedBudget!.totalBudget,
        formattedTotalBudget: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(deletedBudget!.totalBudget).replace('NGN', '₦')
      },
      warnings,
      impactAnalysis: {
        transactionsAffected: transactionCount,
        categoriesRemoved: await CategoryBudget.countDocuments({ userId: session.user.email, month }),
        nextSteps: transactionCount > 0 ? [
          'Transactions remain unbudgeted',
          'Consider creating a new budget',
          'Review spending categories'
        ] : [
          'Clean deletion - no transactions affected'
        ]
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error deleting budget:', error);

    return NextResponse.json(
      { 
        error: 'Failed to delete budget. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET single budget (already covered in main budgets route, but included for completeness)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { month } = params;

    // Redirect to main budget route with month parameter
    const baseUrl = request.url.replace(`/${month}`, '');
    return NextResponse.redirect(`${baseUrl}?month=${month}`);

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