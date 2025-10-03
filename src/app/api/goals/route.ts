// src/app/api/goals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "@/utils/authOptions";
// import Goal, { IGoal, INigerianContext, IContribution, IMilestone, IAutoSaveRules } from '@/models/Goal';
// import Goal, { IGoal } from "@/models/Goal";
// import {
//   IContribution,
//   IMilestone,
//   INigerianContext,
//   GoalCategory,
//   Priority,
// } from "@/types";

import Goal from '@/models/Goal';
import { IGoal, INigerianContext, IContribution, IAutoSaveRules } from '@/types';

// Define API response interfaces
interface GoalSummary {
  total: number;
  active: number;
  completed: number;
  totalSaved: number;
  totalTargets: number;
  averageProgress: number;
  formattedTotalSaved: string;
  formattedTotalTargets: string;
}

interface EnhancedGoal extends Omit<IGoal, "toObject"> {
  progressPercentage: number;
  remainingAmount: number;
  daysUntilDeadline: number | null;
  timeStatus: "no_deadline" | "overdue" | "urgent" | "approaching" | "on_time";
  nigerianInsights: string[];
  recentActivity: number;
}

interface GoalsApiResponse {
  success: boolean;
  goals: EnhancedGoal[];
  summary: GoalSummary;
  nigerianMarketInsights: string[];
  metadata: {
    total: number;
    hasMore: boolean;
    filters: {
      category?: string;
      status?: string;
      priority?: string;
    };
  };
}

interface CreateGoalRequest {
  title: string;
  description?: string;
  targetAmount: number;
  category: IGoal["category"];
  deadline?: string;
  priority?: IGoal["priority"];
  autoSaveRules?: IAutoSaveRules;
  nigerianContext?: Partial<INigerianContext>;
  currentAmount?: number;
}

interface CreateGoalInsight {
  type: "planning" | "automation" | "timing";
  message: string;
  action: string;
}

interface CreateGoalResponse {
  success: boolean;
  message: string;
  goal: IGoal;
  insights: CreateGoalInsight[];
  recommendations: string[];
}

// Query interface for MongoDB queries
interface GoalQuery {
  userId: string;
  category?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  priority?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // 'active', 'completed', 'all'
    const priority = searchParams.get("priority");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query with proper typing
    const query: GoalQuery = { userId: session.user.email };

    if (category && category !== "all") {
      query.category = category as IGoal["category"];
    }

    if (status === "active") {
      query.isActive = true;
      query.isCompleted = false;
    } else if (status === "completed") {
      query.isCompleted = true;
    } else if (status !== "all") {
      query.isActive = true; // Default to active goals
      query.isCompleted = false;
    }

    if (priority && priority !== "all") {
      query.priority = priority as IGoal["priority"];
    }

    // Fetch goals with sorting
    const goals = await Goal.find(query)
      .sort({ priority: 1, deadline: 1, createdAt: -1 })
      .limit(limit);

    // Enhanced goals with virtual fields and Nigerian context
    const currentDate = new Date();
    const enhancedGoals = goals.map((goal) => {
      const goalObj = goal.toObject({ virtuals: true }) as IGoal;

      // Add calculated fields that match your existing model structure
      const progressPercentage =
        goalObj.progressPercentage ||
        (goalObj.currentAmount / goalObj.targetAmount) * 100;
      const remainingAmount =
        goalObj.remainingAmount || goalObj.targetAmount - goalObj.currentAmount;

      // Add time-based insights
      const daysLeft = goalObj.deadline
        ? Math.ceil(
            (new Date(goalObj.deadline).getTime() - currentDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;
      const timeStatus: EnhancedGoal["timeStatus"] = !daysLeft
        ? "no_deadline"
        : daysLeft < 0
          ? "overdue"
          : daysLeft < 7
            ? "urgent"
            : daysLeft < 30
              ? "approaching"
              : "on_time";

      // Nigerian-specific insights
      const isSchoolFeeSeason = [1, 9].includes(currentDate.getMonth() + 1); // January, September
      const isSalarySeason = currentDate.getDate() >= 25; // End of month salary period

      const nigerianInsights: string[] = [];

      if (goalObj.nigerianContext?.isSchoolFeesGoal && isSchoolFeeSeason) {
        nigerianInsights.push("School fee season - prioritize this goal!");
      }

      if (goalObj.nigerianContext?.isEmergencyFund && progressPercentage < 25) {
        nigerianInsights.push("Build emergency fund for economic stability");
      }

      if (isSalarySeason && goalObj.autoSaveRules?.enabled) {
        nigerianInsights.push("Salary period - auto-save will trigger soon");
      }

      // Recent contribution activity
      const recentContributions = goalObj.contributions.filter(
        (c: IContribution) =>
          new Date(c.date) >
          new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      ).length;

      return {
        ...goalObj,
        progressPercentage,
        remainingAmount,
        daysUntilDeadline: daysLeft,
        timeStatus,
        nigerianInsights,
        recentActivity: recentContributions,
      };
    });

    // Generate summary statistics
    const allUserGoals = await Goal.find({ userId: session.user.email });
    const summary: GoalSummary = {
      total: allUserGoals.length,
      active: allUserGoals.filter((g) => g.isActive && !g.isCompleted).length,
      completed: allUserGoals.filter((g) => g.isCompleted).length,
      totalSaved: allUserGoals.reduce((sum, g) => sum + g.currentAmount, 0),
      totalTargets: allUserGoals.reduce((sum, g) => sum + g.targetAmount, 0),
      averageProgress:
        allUserGoals.length > 0
          ? allUserGoals.reduce(
              (sum, g) =>
                sum + Math.min(100, (g.currentAmount / g.targetAmount) * 100),
              0
            ) / allUserGoals.length
          : 0,
      formattedTotalSaved: new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
      })
        .format(allUserGoals.reduce((sum, g) => sum + g.currentAmount, 0))
        .replace("NGN", "₦"),
      formattedTotalTargets: new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
      })
        .format(allUserGoals.reduce((sum, g) => sum + g.targetAmount, 0))
        .replace("NGN", "₦"),
    };

    // Nigerian market insights - using consistent currentDate variable
    const nigerianMarketInsights: string[] = [];
    const currentMonth = currentDate.getMonth() + 1;

    if ([1, 9].includes(currentMonth)) {
      nigerianMarketInsights.push(
        "School fee season - consider prioritizing education goals"
      );
    }

    if ([12, 1].includes(currentMonth)) {
      nigerianMarketInsights.push(
        "Festive season - budget carefully and maintain emergency funds"
      );
    }

    if (currentDate.getDate() >= 25) {
      nigerianMarketInsights.push(
        "End of month salary period - good time to contribute to goals"
      );
    }

    const response = {
      success: true,
      goals: enhancedGoals,
      summary,
      nigerianMarketInsights,
      metadata: {
        total: enhancedGoals.length,
        hasMore: goals.length === limit,
        filters: {
          category: category || undefined,
          status: status || undefined,
          priority: priority || undefined,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Error fetching goals:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch goals. Please try again later.",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body: CreateGoalRequest = await request.json();
    const {
      title,
      description,
      targetAmount,
      category,
      deadline,
      priority,
      autoSaveRules,
      nigerianContext,
      currentAmount = 0,
    } = body;

    // Validation
    if (!title || !targetAmount || !category) {
      return NextResponse.json(
        { error: "Title, target amount, and category are required" },
        { status: 400 }
      );
    }

    if (targetAmount < 1000) {
      return NextResponse.json(
        { error: "Minimum goal amount is ₦1,000" },
        { status: 400 }
      );
    }

    let deadlineDate: Date | null = null;
    if (deadline) {
      deadlineDate = new Date(deadline);
      if (deadlineDate <= new Date()) {
        return NextResponse.json(
          { error: "Deadline must be in the future" },
          { status: 400 }
        );
      }
    }

    // Check if user already has too many active goals (max 10)
    const activeGoalsCount = await Goal.countDocuments({
      userId: session.user.email,
      isActive: true,
      isCompleted: false,
    });

    if (activeGoalsCount >= 10) {
      return NextResponse.json(
        {
          error:
            "Maximum of 10 active goals allowed. Complete or archive existing goals first.",
        },
        { status: 400 }
      );
    }

    // Build goal data using your model structure
    const goalData: Partial<IGoal> = {
      userId: session.user.email,
      title,
      description,
      targetAmount,
      currentAmount,
      category,
      deadline: deadlineDate || undefined,
      priority: priority || "medium",
      isActive: true,
      isCompleted: false,
      autoSaveRules: autoSaveRules || {
        enabled: false,
        percentage: 5,
        frequency: "monthly",
        minTransactionAmount: 1000
      },
      nigerianContext: nigerianContext || {
        isSchoolFeesGoal: false,
        isEmergencyFund: false,
        isSalaryLinked: false,
        festiveSeasonBuffer: false,
      },
      milestones: [
        {
          percentage: 25,
          amount: Math.round(targetAmount * 0.25),
          celebrated: false,
        },
        {
          percentage: 50,
          amount: Math.round(targetAmount * 0.5),
          celebrated: false,
        },
        {
          percentage: 75,
          amount: Math.round(targetAmount * 0.75),
          celebrated: false,
        },
        { percentage: 100, amount: targetAmount, celebrated: false },
      ],
      contributions: [],
      tags: [],
    };

    // Category-specific Nigerian optimizations
    const updatedNigerianContext = { ...goalData.nigerianContext };

    switch (category) {
      case "emergency_fund":
        updatedNigerianContext.isEmergencyFund = true;
        updatedNigerianContext.targetMonthsCoverage = 3;
        updatedNigerianContext.isSalaryLinked = true;
        break;

      case "school_fees":
        const currentMonth = new Date().getMonth() + 1;
        updatedNigerianContext.isSchoolFeesGoal = true;
        updatedNigerianContext.schoolTerm =
          currentMonth <= 4 ? "second" : currentMonth <= 8 ? "third" : "first";
        updatedNigerianContext.isSalaryLinked = true;
        break;

      case "rent_advance":
        updatedNigerianContext.isSalaryLinked = true;
        break;

      case "business_capital":
        updatedNigerianContext.isSalaryLinked = false;
        break;
    }

    goalData.nigerianContext = updatedNigerianContext;

    // Create goal
    const goal = new Goal(goalData);
    await goal.save();

    // Generate creation insights
    const insights: CreateGoalInsight[] = [];

    if (deadlineDate) {
      const daysUntilDeadline = Math.ceil(
        (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      const dailyRequired = Math.round(goal.targetAmount / daysUntilDeadline);

      insights.push({
        type: "planning",
        message: `To reach your goal, save approximately ₦${dailyRequired.toLocaleString()} daily`,
        action: "set_daily_target",
      });
    }

    if (autoSaveRules?.enabled) {
      insights.push({
        type: "automation",
        message: `Auto-save enabled! ${autoSaveRules.percentage}% of eligible transactions will be automatically saved`,
        action: "configure_auto_save",
      });
    }

    const response: CreateGoalResponse = {
      success: true,
      message: "Goal created successfully!",
      goal: goal.toObject({ virtuals: true }),
      insights,
      recommendations: [
        "Set up automatic contributions for consistent progress",
        "Review and adjust monthly based on income changes",
        "Celebrate milestone achievements to stay motivated",
      ],
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating goal:", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        const validationError = error as any;
        const validationErrors = Object.values(validationError.errors).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          { error: "Validation failed", details: validationErrors },
          { status: 400 }
        );
      }

      if ((error as any).code === 11000) {
        return NextResponse.json(
          { error: "A similar goal already exists" },
          { status: 409 }
        );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to create goal. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
