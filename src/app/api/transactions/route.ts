// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction, { ITransaction } from '@/models/Transaction';
import { authOptions } from '@/utils/authOptions';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const dateRange = searchParams.get('dateRange') || '30days';
    const category = searchParams.get('category') || 'allCats';
    const amountRange = searchParams.get('amountRange') || 'anyAmt';
    const status = searchParams.get('status') || 'allTrans';
    const type = searchParams.get('type'); // income, expense, or null for both
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter query
    const filter: any = {
      userId: session.user.email // Using email as userId for now
    };

    // Date range filtering
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '7days':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case '30days':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case '3months':
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        break;
      case '6months':
        startDate = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
        break;
      default:
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    }

    if (dateRange !== 'custom') {
      filter.date = { $gte: startDate };
    }

    // Category filtering
    if (category !== 'allCats') {
      const categoryMap: { [key: string]: string } = {
        'food': 'Food & Dining',
        'shopping': 'Shopping',
        'transportation': 'Transport',
        'entertainment': 'Entertainment',
        'utilities': 'Bills',
        'salary': 'Salary',
        'schoolFees': 'School Fees',
        'church': 'Church/Mosque',
        'family': 'Family Support',
        'health': 'Health/Medical',
        'rent': 'Rent/Housing'
      };
      
      filter.$or = [
        { category: categoryMap[category] || category },
        { userCategory: categoryMap[category] || category }
      ];
    }

    // Amount range filtering
    if (amountRange !== 'anyAmt') {
      switch (amountRange) {
        case 'u-50':
          filter.amount = { $lt: 50 * 1000 }; // Convert to Naira (₦50,000)
          break;
        case '50-200':
          filter.amount = { $gte: 50 * 1000, $lte: 200 * 1000 };
          break;
        case '200-500':
          filter.amount = { $gte: 200 * 1000, $lte: 500 * 1000 };
          break;
        case 'o-500':
          filter.amount = { $gt: 500 * 1000 };
          break;
      }
    }

    // Status filtering
    if (status !== 'allTrans') {
      switch (status) {
        case 'review':
          filter.status = 'flagged';
          break;
        case 'recurring':
          filter.recurring = true;
          break;
        case 'oneTime':
          filter.recurring = false;
          break;
        default:
          filter.status = status;
      }
    }

    // Type filtering
    if (type && (type === 'income' || type === 'expense')) {
      filter.type = type;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObj: { [key: string]: 1 | -1 } = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter)
    ]);

    // Calculate summary statistics for the filtered results
    const summaryPipeline = [
      { $match: filter },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
            }
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
            }
          },
          transactionCount: { $sum: 1 },
          avgTransactionAmount: { $avg: '$amount' }
        }
      }
    ];

    const [summaryResult] = await Transaction.aggregate(summaryPipeline);
    
    const summary = summaryResult || {
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: 0,
      avgTransactionAmount: 0
    };

    // Get category breakdown for the current filter
    const categoryPipeline = [
      { $match: { ...filter, type: 'expense' } },
      {
        $group: {
          _id: { $ifNull: ['$userCategory', '$category'] },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 as -1 } },
      { $limit: 10 }
    ];

    const categoryBreakdown = await Transaction.aggregate(categoryPipeline);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Response data
    const responseData = {
      transactions: transactions.map(transaction => ({
        ...transaction,
        effectiveCategory: transaction.userCategory || transaction.category,
        // Format amount for Nigerian Naira
        formattedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(transaction.amount).replace('NGN', '₦')
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        limit
      },
      summary: {
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        netAmount: summary.totalIncome - summary.totalExpenses,
        transactionCount: summary.transactionCount,
        avgTransactionAmount: summary.avgTransactionAmount,
        // Nigerian-formatted amounts
        formattedTotalIncome: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(summary.totalIncome).replace('NGN', '₦'),
        formattedTotalExpenses: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(summary.totalExpenses).replace('NGN', '₦'),
        formattedNetAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(summary.totalIncome - summary.totalExpenses).replace('NGN', '₦')
      },
      categoryBreakdown: categoryBreakdown.map((cat: { _id: string; totalAmount: number; count: number }) => ({
        category: cat._id,
        amount: cat.totalAmount,
        count: cat.count,
        percentage: totalCount > 0 ? Math.round((cat.count / totalCount) * 100) : 0,
        formattedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(cat.totalAmount).replace('NGN', '₦')
      })),
      appliedFilters: {
        dateRange,
        category,
        amountRange,
        status,
        type,
        sortBy,
        sortOrder
      }
    };

    return NextResponse.json(responseData);

  } catch (error: unknown) {
    console.error('Error fetching transactions:', error);
    
    // Handle specific MongoDB errors
    if (typeof error === 'object' && error !== null && 'name' in error) {
      if ((error as { name: string }).name === 'CastError') {
        return NextResponse.json(
          { error: 'Invalid query parameters provided.' },
          { status: 400 }
        );
      }
      if ((error as { name: string }).name === 'ValidationError') {
        return NextResponse.json(
          { error: 'Invalid filter criteria provided.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch transactions. Please try again later.',
        details: process.env.NODE_ENV === 'development' && typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const { type, amount, date, note, merchant, location, paymentMethod, recurring, recurringPattern } = body;
    
    if (!type || !amount || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: type, amount, and date are required.' },
        { status: 400 }
      );
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type. Must be "income" or "expense".' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number.' },
        { status: 400 }
      );
    }

    // Validate recurring pattern if recurring is true
    if (recurring && !recurringPattern) {
      return NextResponse.json(
        { error: 'Recurring pattern is required when transaction is marked as recurring.' },
        { status: 400 }
      );
    }

    if (recurring && !['daily', 'weekly', 'monthly', 'yearly'].includes(recurringPattern)) {
      return NextResponse.json(
        { error: 'Invalid recurring pattern. Must be daily, weekly, monthly, or yearly.' },
        { status: 400 }
      );
    }

    // Smart auto-categorization
    let autoCategory: string;
    let userCategory: string | undefined;

    if (body.category) {
      // User provided a category, use it as userCategory
      userCategory = body.category;
      autoCategory = Transaction.categorizeTransaction(merchant, note, amount);
    } else {
      // No category provided, use smart categorization
      autoCategory = Transaction.categorizeTransaction(merchant, note, amount);
    }

    // Detect potential recurring transactions based on merchant and amount patterns
    let isLikelyRecurring = recurring || false;
    let suggestedPattern = recurringPattern;

    if (!recurring && merchant) {
      // Check if this merchant/amount combination exists in recent transactions
      const recentSimilarTransactions = await Transaction.find({
        userId: session.user.email,
        merchant: { $regex: new RegExp(merchant, 'i') },
        amount: { $gte: amount * 0.9, $lte: amount * 1.1 }, // Within 10% of amount
        date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // Last 90 days
      }).sort({ date: -1 }).limit(5);

      if (recentSimilarTransactions.length >= 2) {
        isLikelyRecurring = true;
        // Analyze dates to suggest pattern
        const dates = recentSimilarTransactions.map(t => t.date);
        const daysDiff = Math.abs(dates[0].getTime() - dates[1].getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff >= 25 && daysDiff <= 35) {
          suggestedPattern = 'monthly';
        } else if (daysDiff >= 6 && daysDiff <= 8) {
          suggestedPattern = 'weekly';
        }
      }
    }

    // Detect spending patterns for AI insights
    let flagForReview = false;
    let aiInsight: string | undefined;

    if (type === 'expense') {
      // Check if this is unusually high spending for this category in the current month
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);
      
      const monthlySpending = await Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: 'expense',
            date: { $gte: currentMonth },
            $or: [
              { category: autoCategory },
              { userCategory: autoCategory }
            ]
          }
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$amount' },
            avgTransaction: { $avg: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);

      if (monthlySpending.length > 0) {
        const { totalSpent, avgTransaction } = monthlySpending[0];
        
        // Flag if this transaction is significantly higher than average
        if (amount > avgTransaction * 2 && amount > 10000) { // > 2x average and > ₦10,000
          flagForReview = true;
          aiInsight = `This ${autoCategory.toLowerCase()} expense is ${Math.round(amount / avgTransaction)}x your average. Consider reviewing if necessary.`;
        }
        
        // Flag if monthly spending in category is unusually high
        const lastMonthSpending = await Transaction.aggregate([
          {
            $match: {
              userId: session.user.email,
              type: 'expense',
              date: { 
                $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
                $lt: currentMonth
              },
              $or: [
                { category: autoCategory },
                { userCategory: autoCategory }
              ]
            }
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: '$amount' }
            }
          }
        ]);

        if (lastMonthSpending.length > 0) {
          const lastMonthTotal = lastMonthSpending[0].totalSpent;
          const projectedMonthlySpend = totalSpent + amount;
          
          if (projectedMonthlySpend > lastMonthTotal * 1.5) {
            flagForReview = true;
            aiInsight = `Your ${autoCategory.toLowerCase()} spending is ${Math.round((projectedMonthlySpend / lastMonthTotal - 1) * 100)}% higher than last month.`;
          }
        }
      }
    }

    // Create transaction object
    const transactionData: {
      userId: string;
      type: string;
      amount: number;
      category: string;
      userCategory?: string;
      note?: string;
      merchant?: string;
      location?: string;
      paymentMethod: string;
      date: Date;
      recurring: boolean;
      recurringPattern?: string;
      status: string;
      autoCategory: string;
      tags: string[];
    } = {
      userId: session.user.email,
      type,
      amount,
      category: autoCategory,
      userCategory,
      note: note?.trim(),
      merchant: merchant?.trim(),
      location: location?.trim(),
      paymentMethod: paymentMethod || 'cash',
      date: new Date(date),
      recurring: isLikelyRecurring,
      recurringPattern: suggestedPattern,
      status: flagForReview ? 'flagged' : 'completed',
      autoCategory,
      tags: []
    };

    // Add Nigerian-specific tags
    if (merchant) {
      if (['Uber', 'Bolt', 'InDrive'].some(app => merchant.toLowerCase().includes(app.toLowerCase()))) {
        transactionData.tags.push('ride-hailing');
      }
      if (['GTBank', 'First Bank', 'Zenith', 'Access', 'UBA'].some(bank => 
        merchant.toLowerCase().includes(bank.toLowerCase())
      )) {
        transactionData.tags.push('banking');
      }
    }

    if (note) {
      if (note.toLowerCase().includes('emergency')) {
        transactionData.tags.push('emergency');
      }
      if (['salary', 'bonus', 'allowance'].some(keyword => 
        note.toLowerCase().includes(keyword)
      )) {
        transactionData.tags.push('employment');
      }
    }

    // Create the transaction
    const newTransaction = new Transaction(transactionData);
    const savedTransaction = await newTransaction.save();

    // Prepare response with AI insights
    const response: {
      success: boolean;
      transaction: ITransaction;
      aiInsights: {
        autoDetectedCategory: string;
        suggestedRecurring: {
          recurring: boolean;
          pattern?: string;
          reason?: string;
        } | null;
        flaggedForReview: boolean;
        insight?: string;
        tags: string[];
      };
      recommendations: { type: string; message: string; action: string }[];
    } = {
      success: true,
      transaction: {
        ...savedTransaction.toJSON(),
        effectiveCategory: savedTransaction.userCategory || savedTransaction.category,
        formattedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(savedTransaction.amount).replace('NGN', '₦')
      },
      aiInsights: {
        autoDetectedCategory: autoCategory,
        suggestedRecurring: isLikelyRecurring && !recurring ? {
          recurring: true,
          pattern: suggestedPattern,
          reason: 'Similar transactions detected in recent history'
        } : null,
        flaggedForReview: flagForReview,
        insight: aiInsight,
        tags: transactionData.tags
      },
      recommendations: []
    };

    // Add smart recommendations based on transaction
    if (type === 'expense' && amount > 50000) {
      response.recommendations.push({
        type: 'savings_tip',
        message: 'Consider setting aside 10% of large expenses for your emergency fund.',
        action: 'create_savings_goal'
      });
    }

    if (autoCategory === 'Food & Dining' && amount > 15000) {
      response.recommendations.push({
        type: 'budget_tip',
        message: 'Food expenses are high this month. Consider meal planning to save costs.',
        action: 'create_budget'
      });
    }

    if (autoCategory === 'Transport' && paymentMethod === 'cash') {
      response.recommendations.push({
        type: 'efficiency_tip',
        message: 'Using ride-hailing apps or digital payments can help track transport expenses better.',
        action: 'update_payment_method'
      });
    }

    return NextResponse.json(response, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating transaction:', error);

    // Handle specific MongoDB errors
    if (typeof error === 'object' && error !== null && 'name' in error && (error as { name: string }).name === 'ValidationError') {
      const validationErrors = Object.values((error as unknown as { errors: Record<string, { message: string }> }).errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate transaction detected.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create transaction. Please try again.',
        details: process.env.NODE_ENV === 'development' && typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : undefined
      },
      { status: 500 }
    );
  }
}