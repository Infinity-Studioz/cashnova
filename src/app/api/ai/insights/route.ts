// src/app/api/ai/insights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import AIInsight from '@/models/AIInsight';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';
import CategoryBudget from '@/models/CategoryBudget';
import Goal from '@/models/Goal';
import { authOptions } from '@/utils/authOptions';
import { Types } from 'mongoose';

// GET - Fetch user's pending insights
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
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'pending';

    // Build query
    const query: any = {
      userId: session.user.email,
      status: status
    };

    if (category) {
      query.category = category;
    }

    // Get user's insights
    const insights = await AIInsight.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    // Clean up expired insights (30 days old)
    await AIInsight.deleteMany({
      userId: session.user.email,
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      status: { $in: ['dismissed', 'acted_upon'] }
    });

    // Format insights for response
    const formattedInsights = insights.map((insight: any) => ({
      id: insight._id.toString(),
      type: insight.type,
      category: insight.category,
      title: insight.title,
      message: insight.message,
      priority: insight.priority,
      status: insight.status,
      metrics: insight.metrics,
      nigerianContext: insight.nigerianContext,
      actions: insight.actions,
      createdAt: insight.createdAt,
      tags: insight.tags,
      isPersonalized: insight.isPersonalized
    }));

    return NextResponse.json({
      success: true,
      insights: formattedInsights,
      metadata: {
        total: formattedInsights.length,
        category: category || 'all',
        status,
        hasMore: insights.length === limit
      }
    });

  } catch (error: unknown) {
    console.error('Error fetching AI insights:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch insights. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Generate insights on-demand
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
    const { type, force = false } = body;

    const generatedInsights = [];

    // Generate spending insights
    if (!type || type === 'spending') {
      try {
        // Get recent spending data
        const recentSpending = await Transaction.aggregate([
          {
            $match: {
              userId: session.user.email,
              type: 'expense',
              date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: { $ifNull: ['$userCategory', '$category'] },
              totalSpent: { $sum: '$amount' },
              transactionCount: { $sum: 1 },
              avgAmount: { $avg: '$amount' }
            }
          },
          { $sort: { totalSpent: -1 } },
          { $limit: 5 }
        ]);

        // Get current month budget for comparison
        const currentMonth = new Date().toISOString().slice(0, 7);
        const categoryBudgets = await CategoryBudget.find({
          userId: session.user.email,
          month: currentMonth
        });

        for (const spending of recentSpending) {
          const categoryBudget = categoryBudgets.find((b: any) => b.category === spending._id);
          if (categoryBudget) {
            const percentageOfBudget = (spending.totalSpent / categoryBudget.allocated) * 100;
            
            if (percentageOfBudget > 75 || force) {
              const insight = await AIInsight.create({
                userId: session.user.email,
                type: 'spending_pattern',
                category: spending._id,
                title: `High ${spending._id} Spending Detected`,
                message: `You've spent ${Math.round(percentageOfBudget)}% of your ${spending._id} budget this month. Consider reviewing your spending in this category.`,
                priority: percentageOfBudget > 90 ? 'high' : 'medium',
                status: 'pending',
                confidence: 0.85,
                impact: percentageOfBudget > 90 ? 'high' : 'medium',
                actionable: true,
                metrics: {
                  percentageOfBudget: Math.round(percentageOfBudget),
                  potentialSavings: Math.max(0, spending.totalSpent - categoryBudget.allocated),
                  transactionCount: spending.transactionCount
                },
                actions: [
                  { label: 'View Budget', type: 'navigate', value: '/budget-planner' },
                  { label: 'Review Transactions', type: 'navigate', value: '/transactionHistory' }
                ],
                nigerianContext: {
                  relevantToEconomy: true,
                  seasonalFactor: false
                },
                tags: ['spending', 'budget', 'warning'],
                isPersonalized: true
              });
              
              generatedInsights.push(insight);
            }
          }
        }
      } catch (error) {
        console.error('Error generating spending insights:', error);
      }
    }

    // Generate budget alerts
    if (!type || type === 'budget') {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const categoryBudgets = await CategoryBudget.find({
          userId: session.user.email,
          month: currentMonth
        });

        for (const categoryBudget of categoryBudgets) {
          const percentageUsed = categoryBudget.allocated > 0 ? 
            (categoryBudget.spent / categoryBudget.allocated) * 100 : 0;
          
          if (percentageUsed >= 90 || force) {
            const remaining = categoryBudget.allocated - categoryBudget.spent;
            
            const insight = await AIInsight.create({
              userId: session.user.email,
              type: 'budget_alert',
              category: categoryBudget.category,
              title: `${categoryBudget.category} Budget Alert`,
              message: `You've used ${Math.round(percentageUsed)}% of your ${categoryBudget.category} budget. Only ₦${remaining.toLocaleString()} remaining.`,
              priority: percentageUsed >= 100 ? 'critical' : 'high',
              status: 'pending',
              confidence: 0.95,
              impact: 'high',
              actionable: true,
              metrics: {
                percentageUsed: Math.round(percentageUsed),
                remaining: remaining,
                budgetId: categoryBudget._id.toString()
              },
              actions: [
                { label: 'Adjust Budget', type: 'navigate', value: '/budget-planner' },
                { label: 'View Spending', type: 'navigate', value: '/transactionHistory' }
              ],
              nigerianContext: {
                relevantToEconomy: true,
                seasonalFactor: false
              },
              tags: ['budget', 'alert', 'urgent'],
              isPersonalized: true
            });
            
            generatedInsights.push(insight);
          }
        }
      } catch (error) {
        console.error('Error generating budget alerts:', error);
      }
    }

    // Generate savings opportunities
    if (!type || type === 'savings') {
      try {
        // Analyze transaction patterns for savings opportunities
        const transactionPatterns = await Transaction.aggregate([
          {
            $match: {
              userId: session.user.email,
              type: 'expense',
              date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
            }
          },
          {
            $group: {
              _id: { $ifNull: ['$userCategory', '$category'] },
              totalSpent: { $sum: '$amount' },
              count: { $sum: 1 },
              avgAmount: { $avg: '$amount' }
            }
          },
          { $sort: { totalSpent: -1 } }
        ]);

        // Find categories with potential for savings
        for (const pattern of transactionPatterns.slice(0, 3)) {
          if (pattern.totalSpent > 20000 || force) {
            const potentialSavings = Math.round(pattern.totalSpent * 0.15); // 15% savings potential
            
            const insight = await AIInsight.create({
              userId: session.user.email,
              type: 'savings_opportunity',
              category: pattern._id,
              title: `Savings Opportunity in ${pattern._id}`,
              message: `You could potentially save ₦${potentialSavings.toLocaleString()} by reducing ${pattern._id.toLowerCase()} expenses by 15%.`,
              priority: 'medium',
              status: 'pending',
              confidence: 0.70,
              impact: 'medium',
              actionable: true,
              metrics: {
                potentialSavings,
                currentSpending: pattern.totalSpent,
                analysisPoints: pattern.count
              },
              actions: [
                { label: 'Create Savings Goal', type: 'navigate', value: '/goals' },
                { label: 'Review Category', type: 'navigate', value: '/transactionHistory' }
              ],
              nigerianContext: {
                relevantToEconomy: true,
                seasonalFactor: false
              },
              tags: ['savings', 'opportunity', 'optimization'],
              isPersonalized: true
            });
            
            generatedInsights.push(insight);
          }
        }
      } catch (error) {
        console.error('Error generating savings insights:', error);
      }
    }

    // Generate Nigerian economic insights
    if (!type || type === 'nigerian_economy') {
      try {
        const currentMonth = new Date().getMonth() + 1;
        const isSchoolFeeSeason = [1, 9].includes(currentMonth);
        const isFestiveSeason = [12, 1].includes(currentMonth);
        
        let economicMessage = 'Monitor your spending closely as Nigerian economic conditions remain volatile.';
        let economicTitle = 'Nigerian Economic Update';
        
        if (isSchoolFeeSeason) {
          economicMessage = 'School fees season is here. Ensure you have budgeted for education expenses in January and September.';
          economicTitle = 'School Fees Season Alert';
        } else if (isFestiveSeason) {
          economicMessage = 'Festive season spending is high. Set aside funds for celebrations while maintaining your savings goals.';
          economicTitle = 'Festive Season Financial Planning';
        }
        
        const economicInsight = await AIInsight.create({
          userId: session.user.email,
          type: 'nigerian_economic',
          category: 'Economic Context',
          title: economicTitle,
          message: economicMessage,
          priority: 'medium',
          status: 'pending',
          confidence: 0.90,
          impact: 'medium',
          actionable: true,
          metrics: {},
          actions: [
            { label: 'Review Budget', type: 'navigate', value: '/budget-planner' },
            { label: 'Set Financial Goals', type: 'navigate', value: '/goals' }
          ],
          nigerianContext: {
            relevantToEconomy: true,
            seasonalFactor: isSchoolFeeSeason || isFestiveSeason,
            economicIndicators: {
              inflationAlert: false,
              currencyVolatility: false
            }
          },
          tags: ['nigerian', 'economy', 'seasonal'],
          isPersonalized: true
        });
        
        generatedInsights.push(economicInsight);
      } catch (error) {
        console.error('Error generating Nigerian economic insights:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${generatedInsights.length} new insights`,
      insights: generatedInsights.map((insight: any) => ({
        id: insight._id.toString(),
        type: insight.type,
        title: insight.title,
        message: insight.message,
        priority: insight.priority,
        category: insight.category
      })),
      metadata: {
        generated: generatedInsights.length,
        type: type || 'all',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: unknown) {
    console.error('Error generating insights:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to generate insights. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// PUT - Mark insight as acted upon
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
    const { insightId, action, feedbackScore } = body;

    if (!insightId) {
      return NextResponse.json(
        { error: 'Insight ID is required' },
        { status: 400 }
      );
    }

    // Find the insight
    const insight = await AIInsight.findOne({
      _id: insightId,
      userId: session.user.email
    });

    if (!insight) {
      return NextResponse.json(
        { error: 'Insight not found' },
        { status: 404 }
      );
    }

    // Update insight based on action
    if (action === 'act_upon') {
      insight.status = 'acted_upon';
      insight.userInteraction = {
        viewedAt: new Date(),
        actedUponAt: new Date(),
        actionTaken: 'user_action',
        feedbackScore: feedbackScore || undefined
      };
    } else if (action === 'dismiss') {
      insight.status = 'dismissed';
      insight.userInteraction = {
        viewedAt: new Date(),
        dismissedAt: new Date(),
        feedbackScore: feedbackScore || undefined
      };
    } else if (action === 'feedback' && feedbackScore) {
      if (!insight.userInteraction) {
        insight.userInteraction = {
          viewedAt: new Date()
        };
      }
      insight.userInteraction.feedbackScore = feedbackScore;
    } else {
      // Mark as displayed
      insight.status = 'displayed';
      if (!insight.userInteraction) {
        insight.userInteraction = {
          viewedAt: new Date(),
          lastDisplayedAt: new Date()
        };
      }
    }

    await insight.save();

    return NextResponse.json({
      success: true,
      message: 'Insight updated successfully',
      insight: {
        id: (insight._id as Types.ObjectId).toString(),
        status: insight.status,
        userInteraction: insight.userInteraction
      }
    });

  } catch (error: unknown) {
    console.error('Error updating insight:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to update insight. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}