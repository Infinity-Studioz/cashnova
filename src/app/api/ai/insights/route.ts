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

    // Get user's insights using the model method
    const insights = await AIInsight.getUserPendingInsights(
      session.user.email,
      category || undefined
    );

    // Clean up expired insights
    await AIInsight.cleanupExpiredInsights();

    // Format insights for response
    const formattedInsights = insights.map(insight => ({
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
          const categoryBudget = categoryBudgets.find(b => b.category === spending._id);
          if (categoryBudget) {
            const percentageOfBudget = (spending.totalSpent / categoryBudget.allocated) * 100;
            
            if (percentageOfBudget > 75 || force) {
              const insight = await AIInsight.generateSpendingInsight(session.user.email, {
                category: spending._id,
                percentageOfBudget: Math.round(percentageOfBudget),
                potentialSavings: Math.max(0, spending.totalSpent - categoryBudget.allocated),
                transactionCount: spending.transactionCount
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
            const insight = await AIInsight.generateBudgetAlert(session.user.email, {
              categoryName: categoryBudget.category,
              percentageUsed: Math.round(percentageUsed),
              remaining: categoryBudget.allocated - categoryBudget.spent,
              budgetId: categoryBudget._id.toString()
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
            
            const insight = await AIInsight.generateSavingsOpportunity(session.user.email, {
              category: pattern._id,
              potentialSavings,
              suggestion: `reducing ${pattern._id.toLowerCase()} expenses by 15%`,
              analysisPoints: pattern.count,
              transactionId: null
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
        const economicInsight = await AIInsight.generateNigerianEconomicInsight(session.user.email);
        generatedInsights.push(economicInsight);
      } catch (error) {
        console.error('Error generating Nigerian economic insights:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${generatedInsights.length} new insights`,
      insights: generatedInsights.map(insight => ({
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
    let updatedInsight;
    
    if (action === 'act_upon') {
      updatedInsight = await insight.markAsActedUpon('user_action');
    } else if (action === 'dismiss') {
      updatedInsight = await insight.dismiss();
    } else if (action === 'feedback' && feedbackScore) {
      updatedInsight = await insight.updateEngagement(feedbackScore);
    } else {
      updatedInsight = await insight.markAsDisplayed();
    }

    return NextResponse.json({
      success: true,
      message: 'Insight updated successfully',
      insight: {
        id: updatedInsight._id.toString(),
        status: updatedInsight.status,
        userInteraction: updatedInsight.userInteraction
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