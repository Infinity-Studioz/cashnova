// src/app/api/goals/[id]/contribute/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Goal from '@/models/Goal';
import { authOptions } from '@/utils/authOptions';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = params;
    const body = await request.json();
    const { amount, source = 'manual', note } = body;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: 'Invalid goal ID format' },
        { status: 400 }
      );
    }

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Contribution amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { error: 'Minimum contribution is ₦100' },
        { status: 400 }
      );
    }

    if (amount > 10000000) { // 10 million limit
      return NextResponse.json(
        { error: 'Maximum single contribution is ₦10,000,000' },
        { status: 400 }
      );
    }

    const goal = await Goal.findOne({
      _id: id,
      userId: session.user.email,
      isActive: true
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found or inactive' },
        { status: 404 }
      );
    }

    // Check if goal is already completed
    if (goal.isCompleted) {
      return NextResponse.json(
        { error: 'Goal is already completed!' },
        { status: 400 }
      );
    }

    // Store previous state for comparison
    const previousAmount = goal.currentAmount;
    const previousProgress = (previousAmount / goal.targetAmount) * 100;

    // Use the model's built-in method to add contribution
    try {
      await goal.addContribution(amount, source, note);
    } catch (error) {
      // If the model method doesn't exist, add contribution manually
      goal.contributions.push({
        amount,
        date: new Date(),
        source,
        note
      });
      
      goal.currentAmount += amount;
      
      // Check if goal is completed
      if (goal.currentAmount >= goal.targetAmount && !goal.isCompleted) {
        goal.isCompleted = true;
        goal.completedAt = new Date();
      }
      
      // Check milestones
      const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
      goal.milestones.forEach(milestone => {
        if (progressPercentage >= milestone.percentage && !milestone.achievedAt) {
          milestone.achievedAt = new Date();
        }
      });
      
      await goal.save();
    }

    // Calculate new progress
    const newProgress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
    const isCompleted = goal.currentAmount >= goal.targetAmount;

    // Check for milestone achievements
    const newAchievements = goal.milestones.filter(
      milestone => milestone.achievedAt && 
      new Date(milestone.achievedAt).getTime() > Date.now() - 5000 // Last 5 seconds
    );

    // Generate insights and recommendations
    const insights = [];
    const recommendations = [];

    // Progress insights
    const progressJump = newProgress - previousProgress;
    if (progressJump >= 10) {
      insights.push({
        type: 'progress',
        message: `Great jump! You advanced ${progressJump.toFixed(1)}% closer to your goal`,
        metric: `${progressJump.toFixed(1)}%`
      });
    }

    // Time-based insights
    if (goal.deadline) {
      const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const remainingAmount = goal.targetAmount - goal.currentAmount;
      
      if (remainingAmount > 0 && daysLeft > 0) {
        const dailyRequired = Math.ceil(remainingAmount / daysLeft);
        insights.push({
          type: 'planning',
          message: `To reach your goal on time, save approximately ₦${dailyRequired.toLocaleString()} daily`,
          metric: `₦${dailyRequired.toLocaleString()}/day`
        });
      }
    }

    // Nigerian context insights
    const currentDate = new Date();
    const isEndOfMonth = currentDate.getDate() >= 25;
    
    if (isEndOfMonth && source === 'manual') {
      insights.push({
        type: 'timing',
        message: 'Perfect timing! End-of-month contributions align with Nigerian salary cycles',
        action: 'consider_auto_save'
      });
    }

    // Auto-save recommendations
    if (!goal.autoSaveRules?.enabled && goal.contributions.length >= 3) {
      recommendations.push({
        type: 'automation',
        message: 'You\'re building a great saving habit! Consider enabling auto-save for consistency',
        action: 'enable_auto_save',
        priority: 'medium'
      });
    }

    // Goal completion recommendations
    if (isCompleted) {
      recommendations.push({
        type: 'next_steps',
        message: 'Goal completed! Consider setting a new goal to maintain your savings momentum',
        action: 'create_new_goal',
        priority: 'medium'
      });
    } else if (newProgress >= 75 && previousProgress < 75) {
      recommendations.push({
        type: 'final_push',
        message: 'You\'re in the final stretch! Consider a final push to complete this goal',
        action: 'plan_completion',
        priority: 'medium'
      });
    }

    const response = {
      success: true,
      message: isCompleted ? 'Congratulations! Goal completed!' : 'Contribution added successfully!',
      contribution: {
        amount,
        formattedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(amount).replace('NGN', '₦'),
        source,
        note,
        date: new Date()
      },
      goal: {
        id: goal._id,
        title: goal.title,
        currentAmount: goal.currentAmount,
        targetAmount: goal.targetAmount,
        progress: newProgress,
        remaining: goal.targetAmount - goal.currentAmount,
        isCompleted,
        formattedCurrentAmount: goal.formattedCurrentAmount,
        formattedTargetAmount: goal.formattedTargetAmount
      },
      achievements: {
        milestones: newAchievements.map(m => ({
          percentage: m.percentage,
          achievedAt: m.achievedAt
        })),
        completed: isCompleted,
        progressJump: progressJump.toFixed(1) + '%'
      },
      insights,
      recommendations
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error: any) {
    console.error('Error adding contribution:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to add contribution. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}