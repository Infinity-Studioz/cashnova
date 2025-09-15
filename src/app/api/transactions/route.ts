// src/app/api/transactions/route.ts - Enhanced with AI and Nigerian Intelligence
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import AIInsight from '@/models/AIInsight';
import CategoryBudget from '@/models/CategoryBudget';
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const dateRange = searchParams.get('dateRange') || '30days';
    const category = searchParams.get('category') || 'allCats';
    const amountRange = searchParams.get('amountRange') || 'anyAmt';
    const status = searchParams.get('status') || 'allTrans';
    const type = searchParams.get('type');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Enhanced filter query with Nigerian context
    const filter: any = {
      userId: session.user.email
    };

    // Enhanced date range filtering
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
      case 'currentMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        filter.date = { $gte: startDate, $lte: endDate };
        break;
      default:
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    }

    if (dateRange !== 'custom' && dateRange !== 'lastMonth') {
      filter.date = { $gte: startDate };
    }

    // Enhanced category filtering with Nigerian categories
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
        'rent': 'Rent/Housing',
        'emergency': 'Emergency Fund'
      };
      
      filter.$or = [
        { category: categoryMap[category] || category },
        { userCategory: categoryMap[category] || category }
      ];
    }

    // Nigerian Naira amount filtering
    if (amountRange !== 'anyAmt') {
      switch (amountRange) {
        case 'u-5k':
          filter.amount = { $lt: 5000 };
          break;
        case '5k-25k':
          filter.amount = { $gte: 5000, $lte: 25000 };
          break;
        case '25k-100k':
          filter.amount = { $gte: 25000, $lte: 100000 };
          break;
        case 'o-100k':
          filter.amount = { $gt: 100000 };
          break;
        case 'u-50':
          filter.amount = { $lt: 50 * 1000 };
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

    // Enhanced status filtering
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

    // Execute enhanced queries
    const [transactions, totalCount, categoryInsights] = await Promise.all([
      Transaction.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter),
      
      // Enhanced category insights
      Transaction.aggregate([
        { $match: filter },
        {
          $group: {
            _id: { $ifNull: ['$userCategory', '$category'] },
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
            avgAmount: { $avg: '$amount' },
            merchants: { $addToSet: '$merchant' },
            paymentMethods: { $addToSet: '$paymentMethod' },
            lastTransaction: { $max: '$date' }
          }
        },
        { $sort: { totalAmount: -1 } },
        { $limit: 10 }
      ])
    ]);

    // Enhanced summary with Nigerian insights
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
          avgTransactionAmount: { $avg: '$amount' },
          categories: { $addToSet: { $ifNull: ['$userCategory', '$category'] } },
          merchants: { $addToSet: '$merchant' },
          recurringCount: {
            $sum: { $cond: ['$recurring', 1, 0] }
          }
        }
      }
    ];

    const [summaryResult] = await Transaction.aggregate(summaryPipeline);
    
    const summary = summaryResult || {
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: 0,
      avgTransactionAmount: 0,
      categories: [],
      merchants: [],
      recurringCount: 0
    };

    // Enhanced transaction processing with AI insights
    const enhancedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const effectiveCategory = transaction.userCategory || transaction.category;
        
        // Generate AI insights for significant transactions
        let aiInsight = null;
        if (transaction.amount > 50000 && transaction.type === 'expense') {
          try {
            // Check if this is unusual spending for the category
            const categoryAvg = categoryInsights.find(c => c._id === effectiveCategory)?.avgAmount || 0;
            if (transaction.amount > categoryAvg * 2) {
              aiInsight = {
                type: 'unusual_spending',
                message: `This ${effectiveCategory.toLowerCase()} expense is ${Math.round(transaction.amount / categoryAvg)}x your average`,
                severity: 'medium'
              };
            }
          } catch (error) {
            console.error('Error generating transaction insight:', error);
          }
        }

        return {
          ...transaction,
          effectiveCategory,
          formattedAmount: formatNaira(transaction.amount),
          nigerianMerchant: detectNigerianMerchant(transaction.merchant),
          aiInsight,
          categoryConfidence: calculateCategoryConfidence(transaction),
          tags: generateTransactionTags(transaction)
        };
      })
    );

    // Enhanced category breakdown with Nigerian context
    const categoryBreakdown = categoryInsights.map((cat) => {
      const percentage = summary.transactionCount > 0 ? Math.round((cat.count / summary.transactionCount) * 100) : 0;
      
      return {
        category: cat._id,
        amount: cat.totalAmount,
        count: cat.count,
        avgAmount: cat.avgAmount,
        percentage,
        merchants: cat.merchants?.filter(Boolean) || [],
        paymentMethods: cat.paymentMethods || [],
        lastActivity: cat.lastTransaction,
        formattedAmount: formatNaira(cat.totalAmount),
        formattedAvgAmount: formatNaira(cat.avgAmount),
        nigerianInsights: generateCategoryInsights(cat._id, cat.totalAmount, percentage)
      };
    });

    // Generate spending patterns and insights
    const spendingPatterns = await analyzeSpendingPatterns(session.user.email, filter);
    
    const responseData = {
      transactions: enhancedTransactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
        limit
      },
      summary: {
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        netAmount: summary.totalIncome - summary.totalExpenses,
        transactionCount: summary.transactionCount,
        avgTransactionAmount: summary.avgTransactionAmount,
        categoriesUsed: summary.categories?.length || 0,
        merchantsUsed: summary.merchants?.filter(Boolean).length || 0,
        recurringTransactions: summary.recurringCount,
        // Nigerian-formatted amounts
        formattedTotalIncome: formatNaira(summary.totalIncome),
        formattedTotalExpenses: formatNaira(summary.totalExpenses),
        formattedNetAmount: formatNaira(summary.totalIncome - summary.totalExpenses),
        formattedAvgAmount: formatNaira(summary.avgTransactionAmount)
      },
      categoryBreakdown,
      spendingPatterns,
      appliedFilters: {
        dateRange,
        category,
        amountRange,
        status,
        type,
        sortBy,
        sortOrder
      },
      nigerianInsights: generateTransactionInsights(summary, categoryBreakdown)
    };

    return NextResponse.json(responseData);

  } catch (error: unknown) {
    console.error('Error fetching enhanced transactions:', error);
    
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { type, amount, date, note, merchant, location, paymentMethod, recurring, recurringPattern } = body;
    
    // Enhanced validation
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

    // Enhanced Nigerian context validation
    if (amount > 10000000) { // 10 million limit
      return NextResponse.json(
        { error: 'Maximum transaction amount is ₦10,000,000. Contact support for larger transactions.' },
        { status: 400 }
      );
    }

    // Smart auto-categorization using your Transaction model
    let autoCategory: string;
    let userCategory: string | undefined;

    if (body.category) {
      userCategory = body.category;
      autoCategory = Transaction.categorizeTransaction(merchant, note, amount);
    } else {
      autoCategory = Transaction.categorizeTransaction(merchant, note, amount);
    }

    // Enhanced recurring transaction detection
    let isLikelyRecurring = recurring || false;
    let suggestedPattern = recurringPattern;

    if (!recurring && merchant) {
      const recentSimilarTransactions = await Transaction.find({
        userId: session.user.email,
        merchant: { $regex: new RegExp(merchant, 'i') },
        amount: { $gte: amount * 0.9, $lte: amount * 1.1 },
        date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
      }).sort({ date: -1 }).limit(5);

      if (recentSimilarTransactions.length >= 2) {
        isLikelyRecurring = true;
        const dates = recentSimilarTransactions.map(t => t.date);
        const daysDiff = Math.abs(dates[0].getTime() - dates[1].getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff >= 25 && daysDiff <= 35) {
          suggestedPattern = 'monthly';
        } else if (daysDiff >= 6 && daysDiff <= 8) {
          suggestedPattern = 'weekly';
        }
      }
    }

    // Enhanced Nigerian spending analysis
    let flagForReview = false;
    let aiInsight: string | undefined;
    let budgetImpact: any = null;

    if (type === 'expense') {
      // Check against budget
      const currentMonth = new Date().toISOString().slice(0, 7);
      const categoryBudget = await CategoryBudget.findOne({
        userId: session.user.email,
        month: currentMonth,
        category: userCategory || autoCategory
      });

      if (categoryBudget) {
        const newSpent = categoryBudget.spent + amount;
        const percentageUsed = (newSpent / categoryBudget.allocated) * 100;
        
        budgetImpact = {
          category: categoryBudget.category,
          newSpent,
          allocated: categoryBudget.allocated,
          percentageUsed: Math.round(percentageUsed),
          isOverBudget: newSpent > categoryBudget.allocated,
          formattedNewSpent: formatNaira(newSpent),
          formattedAllocated: formatNaira(categoryBudget.allocated)
        };

        // Generate budget alert if needed
        if (percentageUsed >= 90) {
          try {
            await AIInsight.generateBudgetAlert(session.user.email, {
              categoryName: categoryBudget.category,
              percentageUsed: Math.round(percentageUsed),
              remaining: categoryBudget.allocated - newSpent,
              budgetId: categoryBudget._id
            });
          } catch (error) {
            console.error('Error generating budget alert:', error);
          }
        }
      }

      // Advanced spending pattern analysis
      const monthlySpending = await Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: 'expense',
            date: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
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
        
        if (amount > avgTransaction * 2 && amount > 10000) {
          flagForReview = true;
          aiInsight = `This ${autoCategory.toLowerCase()} expense is ${Math.round(amount / avgTransaction)}x your average. Consider reviewing if necessary.`;
        }
      }
    }

    // Create enhanced transaction object
    const transactionData = {
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
      tags: generateTransactionTags({ merchant, note, amount, category: autoCategory })
    };

    // Create the transaction
    const newTransaction = new Transaction(transactionData);
    const savedTransaction = await newTransaction.save();

    // Update category budget if applicable
    if (type === 'expense' && budgetImpact) {
      await CategoryBudget.updateOne(
        {
          userId: session.user.email,
          month: new Date().toISOString().slice(0, 7),
          category: budgetImpact.category
        },
        { $inc: { spent: amount } }
      );
    }

    // Generate AI insights for significant transactions
    const insights = await generateTransactionAIInsights(session.user.email, savedTransaction, budgetImpact);

    // Enhanced response with Nigerian context
    const response = {
      success: true,
      transaction: {
        ...savedTransaction.toJSON(),
        effectiveCategory: savedTransaction.userCategory || savedTransaction.category,
        formattedAmount: formatNaira(savedTransaction.amount)
      },
      aiInsights: {
        autoDetectedCategory: autoCategory,
        categoryConfidence: calculateCategoryConfidence(savedTransaction),
        suggestedRecurring: isLikelyRecurring && !recurring ? {
          recurring: true,
          pattern: suggestedPattern,
          reason: 'Similar transactions detected in recent history'
        } : null,
        flaggedForReview: flagForReview,
        insight: aiInsight,
        tags: transactionData.tags
      },
      budgetImpact,
      insights,
      recommendations: generateTransactionRecommendations(savedTransaction, budgetImpact)
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating enhanced transaction:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create transaction. Please try again.',
        details: process.env.NODE_ENV === 'development' && typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : undefined
      },
      { status: 500 }
    );
  }
}

// Enhanced helper functions
function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

function detectNigerianMerchant(merchant?: string): any {
  if (!merchant) return null;
  
  const nigerianMerchants = {
    'GTBank': { type: 'bank', category: 'Nigerian Bank' },
    'Zenith': { type: 'bank', category: 'Nigerian Bank' },
    'Access': { type: 'bank', category: 'Nigerian Bank' },
    'Uber': { type: 'transport', category: 'Ride Hailing' },
    'Bolt': { type: 'transport', category: 'Ride Hailing' },
    'Jumia': { type: 'ecommerce', category: 'Nigerian E-commerce' },
    'Konga': { type: 'ecommerce', category: 'Nigerian E-commerce' },
    'Shoprite': { type: 'retail', category: 'Retail Chain' },
    'DSTV': { type: 'entertainment', category: 'Subscription' },
    'MTN': { type: 'telecom', category: 'Nigerian Telecom' },
    'Airtel': { type: 'telecom', category: 'Nigerian Telecom' }
  };

  for (const [name, data] of Object.entries(nigerianMerchants)) {
    if (merchant.toLowerCase().includes(name.toLowerCase())) {
      return { name, ...data };
    }
  }
  
  return null;
}

function calculateCategoryConfidence(transaction: any): number {
  let confidence = 70; // Base confidence
  
  if (transaction.merchant) confidence += 15;
  if (transaction.note) confidence += 10;
  if (transaction.amount > 1000) confidence += 5;
  
  return Math.min(100, confidence);
}

function generateTransactionTags(transaction: any): string[] {
  const tags = [];
  
  if (transaction.merchant) {
    if (['Uber', 'Bolt', 'InDrive'].some(app => 
      transaction.merchant.toLowerCase().includes(app.toLowerCase())
    )) {
      tags.push('ride-hailing', 'transport');
    }
    
    if (['GTBank', 'Zenith', 'Access', 'UBA'].some(bank => 
      transaction.merchant.toLowerCase().includes(bank.toLowerCase())
    )) {
      tags.push('banking', 'financial-services');
    }
    
    if (['Jumia', 'Konga'].some(ecom => 
      transaction.merchant.toLowerCase().includes(ecom.toLowerCase())
    )) {
      tags.push('ecommerce', 'online-shopping');
    }
  }
  
  if (transaction.note) {
    if (transaction.note.toLowerCase().includes('emergency')) {
      tags.push('emergency');
    }
    if (['salary', 'bonus', 'allowance'].some(keyword => 
      transaction.note.toLowerCase().includes(keyword)
    )) {
      tags.push('employment', 'income');
    }
  }
  
  if (transaction.amount > 100000) {
    tags.push('large-transaction');
  }
  
  return tags;
}

function generateCategoryInsights(category: string, amount: number, percentage: number): string[] {
  const insights = [];
  
  if (category === 'Transport' && amount > 50000) {
    insights.push('High transport costs - consider BRT or carpooling options');
  }
  
  if (category === 'Food & Dining' && percentage > 30) {
    insights.push('Food expenses are high - try meal planning and local markets');
  }
  
  if (category === 'Bills' && amount > 30000) {
    insights.push('Review utility bills for optimization opportunities');
  }
  
  if (category === 'Family Support' && amount > 20000) {
    insights.push('Significant family support - consider budgeting this category');
  }
  
  return insights;
}

async function analyzeSpendingPatterns(userId: string, filter: any): Promise<any> {
  try {
    const patterns = await Transaction.aggregate([
      { $match: { ...filter, type: 'expense' } },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$date' },
            hour: { $hour: '$date' }
          },
          totalSpent: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return {
      spendingTimes: patterns,
      insights: patterns.length > 0 ? [
        `Most transactions happen on ${getDayName(patterns[0]._id.dayOfWeek)}`,
        `Average transaction: ${formatNaira(patterns[0].avgAmount)}`
      ] : []
    };
  } catch (error) {
    console.error('Error analyzing spending patterns:', error);
    return { spendingTimes: [], insights: [] };
  }
}

async function generateTransactionAIInsights(userId: string, transaction: any, budgetImpact: any): Promise<any[]> {
  const insights = [];
  
  if (budgetImpact?.isOverBudget) {
    insights.push({
      type: 'budget_warning',
      title: 'Budget Exceeded',
      message: `This transaction puts your ${budgetImpact.category} budget over limit`,
      action: 'review_budget'
    });
  }
  
  if (transaction.amount > 50000 && transaction.type === 'expense') {
    insights.push({
      type: 'large_expense',
      title: 'Large Expense Detected',
      message: `Consider if this ${formatNaira(transaction.amount)} expense aligns with your financial goals`,
      action: 'review_goals'
    });
  }
  
  return insights;
}

function generateTransactionRecommendations(transaction: any, budgetImpact: any): any[] {
  const recommendations = [];
  
  if (transaction.type === 'expense' && transaction.amount > 50000) {
    recommendations.push({
      type: 'savings_tip',
      message: 'Consider setting aside 10% of large expenses for your emergency fund',
      action: 'create_savings_goal'
    });
  }
  
  if (budgetImpact?.percentageUsed > 80) {
    recommendations.push({
      type: 'budget_tip',
      message: `Your ${budgetImpact.category} budget is ${budgetImpact.percentageUsed}% used. Consider adjusting spending`,
      action: 'adjust_budget'
    });
  }
  
  return recommendations;
}

function generateTransactionInsights(summary: any, categoryBreakdown: any[]): string[] {
  const insights = [];
  
  if (summary.totalExpenses > summary.totalIncome) {
    insights.push('Expenses exceed income this period - consider budget review');
  }
  
  if (categoryBreakdown.length > 0) {
    const topCategory = categoryBreakdown[0];
    if (topCategory.percentage > 40) {
      insights.push(`${topCategory.category} dominates spending at ${topCategory.percentage}%`);
    }
  }
  
  if (summary.recurringTransactions > summary.transactionCount * 0.3) {
    insights.push('High recurring transactions - good for budgeting predictability');
  }
  
  return insights;
}

function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber - 1] || 'Unknown';
}