// src/app/api/goals/templates/route.ts - New endpoint for Nigerian goal templates
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Goal from '@/models/Goal';
import Transaction from '@/models/Transaction';
import { authOptions } from '@/utils/authOptions';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

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

    // Get user's financial data for personalized templates
    const [recentTransactions, monthlyIncome] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId: session.user.email,
            type: 'income',
            date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: null,
            avgMonthlyIncome: { $avg: '$amount' },
            totalIncome: { $sum: '$amount' }
          }
        }
      ]),
      
      Transaction.findOne({
        userId: session.user.email,
        type: 'income'
      }).sort({ date: -1 })
    ]);

    const userMonthlyIncome = recentTransactions[0]?.avgMonthlyIncome || 
                              monthlyIncome?.amount || 
                              200000; // Default Nigerian average

    // Generate personalized Nigerian templates
    const templates = [
      Goal.createNigerianGoalTemplate('emergency_fund', userMonthlyIncome),
      Goal.createNigerianGoalTemplate('school_fees', userMonthlyIncome),
      Goal.createNigerianGoalTemplate('rent_advance', userMonthlyIncome),
      // Additional templates
      {
        category: 'vacation',
        title: 'Nigerian Vacation',
        description: 'Explore Nigeria or international travel',
        targetAmount: userMonthlyIncome * 0.5,
        priority: 'medium',
        nigerianContext: {
          isSalaryLinked: true,
          festiveSeasonBuffer: true,
          isEmergencyFund: false,
          isSchoolFeesGoal: false
        },
        milestones: [
          { percentage: 25, amount: 0, celebrated: false },
          { percentage: 50, amount: 0, celebrated: false },
          { percentage: 75, amount: 0, celebrated: false },
          { percentage: 100, amount: 0, celebrated: false }
        ]
      },
      {
        category: 'business_capital',
        title: 'Business Investment',
        description: 'Start or expand your business',
        targetAmount: userMonthlyIncome * 3,
        priority: 'high',
        nigerianContext: {
          isSalaryLinked: false,
          festiveSeasonBuffer: false,
          isEmergencyFund: false,
          isSchoolFeesGoal: false
        },
        milestones: [
          { percentage: 25, amount: 0, celebrated: false },
          { percentage: 50, amount: 0, celebrated: false },
          { percentage: 75, amount: 0, celebrated: false },
          { percentage: 100, amount: 0, celebrated: false }
        ]
      }
    ].filter(Boolean);

    // Calculate amounts for milestones
    templates.forEach(template => {
      if (template && template.milestones) {
        template.milestones.forEach(milestone => {
          milestone.amount = (template.targetAmount * milestone.percentage) / 100;
        });
      }
    });

    return NextResponse.json({
      success: true,
      templates: templates.map(template => ({
        ...template,
        formattedTargetAmount: formatNaira(template?.targetAmount || 0),
        estimatedMonths: template?.targetAmount ? Math.ceil((template.targetAmount / (userMonthlyIncome * 0.1))) : 0,
        monthlyContribution: Math.round((template?.targetAmount || 0) / 12)
      })),
      userContext: {
        estimatedMonthlyIncome: userMonthlyIncome,
        formattedIncome: formatNaira(userMonthlyIncome),
        recommendedSavingsRate: 20 // 20% for Nigerian context
      },
      nigerianInsights: generateGoalInsights(userMonthlyIncome)
    });

  } catch (error: any) {
    console.error('Error fetching goal templates:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch goal templates. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

function generateGoalInsights(monthlyIncome: number): string[] {
  const insights = [];
  const currentMonth = new Date().getMonth() + 1;
  
  if ([1, 9].includes(currentMonth)) {
    insights.push('School fees season - prioritize education goals');
  }
  
  if ([12, 1].includes(currentMonth)) {
    insights.push('Festive season - maintain emergency fund goals');
  }
  
  insights.push(`With ₦${monthlyIncome.toLocaleString()} monthly income, aim to save 20% (₦${(monthlyIncome * 0.2).toLocaleString()})`);
  
  if (monthlyIncome > 500000) {
    insights.push('Higher income bracket - consider investment and real estate goals');
  }
  
  return insights;
}