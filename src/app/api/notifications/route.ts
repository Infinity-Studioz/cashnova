// src/app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import AlertSettings from "@/models/AlertSettings";
import Transaction from "@/models/Transaction";
import Budget from "@/models/Budget";
import { authOptions } from "@/utils/authOptions";
import { INotification } from "@/types";

export async function GET(request: NextRequest) {
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status"); // unread, read, dismissed
    const type = searchParams.get("type"); // category_threshold, budget_exceeded, etc.

    // Build filter
    const filter: any = {
      userId: session.user.email,
    };

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get notifications
    const [notifications, totalCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
    ]);

    // Get counts by status for summary
    const statusCounts = await Notification.aggregate([
      { $match: { userId: session.user.email } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusSummary = {
      unread: statusCounts.find((s) => s._id === "unread")?.count || 0,
      read: statusCounts.find((s) => s._id === "read")?.count || 0,
      dismissed: statusCounts.find((s) => s._id === "dismissed")?.count || 0,
      total: statusCounts.reduce((sum, s) => sum + s.count, 0),
    };

    return NextResponse.json({
      success: true,
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
        limit,
      },
      summary: statusSummary,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch notifications. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Generate notifications based on current budget/spending data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { action } = body;

    if (action === "generate_alerts") {
      const notifications = await generateUserAlerts(session.user.email);

      // Nigerian context
      const currentDate = new Date();
      const nigerianContext = {
        isSchoolFeeSeason: [0, 8].includes(currentDate.getMonth()),
        isSalaryCycle:
          currentDate.getDate() >= 25 && currentDate.getDate() <= 28,
        isFestiveSeason: [11, 0].includes(currentDate.getMonth()),
        currentMonth: currentDate.getMonth() + 1,
        dayOfMonth: currentDate.getDate(),
      };

      return NextResponse.json({
        success: true,
        message: `Generated ${notifications.length} notifications`,
        notifications,
        nigerianContext,
      });
    }

    if (action === "mark_read") {
      const { notificationId } = body;

      if (!notificationId) {
        return NextResponse.json(
          { error: "Notification ID is required" },
          { status: 400 }
        );
      }

      const notification = await Notification.findOne({
        _id: notificationId,
        userId: session.user.email,
      });

      if (!notification) {
        return NextResponse.json(
          { error: "Notification not found" },
          { status: 404 }
        );
      }

      await notification.markAsRead();

      return NextResponse.json({
        success: true,
        message: "Notification marked as read",
        notification: notification.toJSON(),
      });
    }

    if (action === "dismiss") {
      const { notificationId } = body;

      if (!notificationId) {
        return NextResponse.json(
          { error: "Notification ID is required" },
          { status: 400 }
        );
      }

      const notification = await Notification.findOne({
        _id: notificationId,
        userId: session.user.email,
      });

      if (!notification) {
        return NextResponse.json(
          { error: "Notification not found" },
          { status: 404 }
        );
      }

      await notification.dismiss();

      return NextResponse.json({
        success: true,
        message: "Notification dismissed",
        notification: notification.toJSON(),
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use generate_alerts, mark_read, or dismiss." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error processing notification action:", error);

    return NextResponse.json(
      {
        error: "Failed to process notification action. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// // Generate notifications based on current budget/spending data
// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: 'Unauthorized. Please sign in.' },
//         { status: 401 }
//       );
//     }

//     await connectToDatabase();

//     const body = await request.json();
//     const { action } = body;

//     if (action === 'generate_alerts') {
//       const notifications = await generateUserAlerts(session.user.email);

//       return NextResponse.json({
//         success: true,
//         message: `Generated ${notifications.length} notifications`,
//         notifications
//       });
//     }

//     if (action === 'mark_read') {
//       const { notificationId } = body;

//       if (!notificationId) {
//         return NextResponse.json(
//           { error: 'Notification ID is required' },
//           { status: 400 }
//         );
//       }

//       const notification = await Notification.findOne({
//         _id: notificationId,
//         userId: session.user.email
//       });

//       if (!notification) {
//         return NextResponse.json(
//           { error: 'Notification not found' },
//           { status: 404 }
//         );
//       }

//       await notification.markAsRead();

//       return NextResponse.json({
//         success: true,
//         message: 'Notification marked as read',
//         notification: notification.toJSON()
//       });
//     }

//     if (action === 'dismiss') {
//       const { notificationId } = body;

//       if (!notificationId) {
//         return NextResponse.json(
//           { error: 'Notification ID is required' },
//           { status: 400 }
//         );
//       }

//       const notification = await Notification.findOne({
//         _id: notificationId,
//         userId: session.user.email
//       });

//       if (!notification) {
//         return NextResponse.json(
//           { error: 'Notification not found' },
//           { status: 404 }
//         );
//       }

//       await notification.dismiss();

//       return NextResponse.json({
//         success: true,
//         message: 'Notification dismissed',
//         notification: notification.toJSON()
//       });
//     }

//     return NextResponse.json(
//       { error: 'Invalid action. Use generate_alerts, mark_read, or dismiss.' },
//       { status: 400 }
//     );

//   } catch (error: any) {
//     console.error('Error processing notification action:', error);

//     return NextResponse.json(
//       {
//         error: 'Failed to process notification action. Please try again.',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

// Generate alerts for a specific user based on their settings and current data
async function generateUserAlerts(userId: string): Promise<INotification[]> {
  const generatedNotifications: INotification[] = [];

  try {
    // Get user's alert settings
    const alertSettings = await AlertSettings.findOne({ userId });
    if (!alertSettings) {
      return generatedNotifications;
    }

    // Get current month data
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Get current month's budget and spending
    const [currentBudget, monthlySpending] = await Promise.all([
      Budget.findOne({
        userId,
        month: currentDate.toISOString().slice(0, 7),
      }),
      Transaction.aggregate([
        {
          $match: {
            userId,
            type: "expense",
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: { $ifNull: ["$userCategory", "$category"] },
            totalSpent: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const totalMonthlySpent = monthlySpending.reduce(
      (sum, cat) => sum + cat.totalSpent,
      0
    );

    // 1. Check Category Threshold Alerts
    if (alertSettings.categoryThreshold.enabled && currentBudget) {
      const threshold = alertSettings.categoryThreshold.percentage / 100;

      for (const categorySpending of monthlySpending) {
        const categoryName = categorySpending._id;
        const spent = categorySpending.totalSpent;

        // Find budget for this category
        const categoryBudget = currentBudget.categories?.find(
          (cat: any) => cat.name === categoryName
        );

        if (categoryBudget && spent >= categoryBudget.allocated * threshold) {
          const percentage = Math.round(
            (spent / categoryBudget.allocated) * 100
          );

          // Check if we haven't already sent this alert recently
          const recentAlert = await Notification.findOne({
            userId,
            type: "category_threshold",
            "data.category": categoryName,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Within 24 hours
          });

          if (
            !recentAlert &&
            percentage >= alertSettings.categoryThreshold.percentage
          ) {
            const notification = Notification.createNigerianAlert(
              userId,
              "category_threshold",
              "Budget Alert",
              `Heads-up: You're at ${percentage}% of your ${categoryName.toLowerCase()} budget (₦${spent.toLocaleString()}/₦${categoryBudget.allocated.toLocaleString()}).`,
              {
                category: categoryName,
                amount: spent,
                percentage,
                budgetLimit: categoryBudget.allocated,
                threshold: alertSettings.categoryThreshold.percentage,
                progressData: {
                  current: spent,
                  target: categoryBudget.allocated,
                  percentage,
                },
                actions: [
                  {
                    label: "View Breakdown",
                    action: "view_category_breakdown",
                    data: {
                      category: categoryName,
                      route: "/budget-planner/screen-1",
                    },
                  },
                  {
                    label: "Adjust Budget",
                    action: "adjust_budget",
                    data: {
                      category: categoryName,
                      route: "/budget-planner/screen-2",
                    },
                  },
                ],
              },
              "medium"
            );

            const savedNotification = await new Notification(
              notification
            ).save();
            generatedNotifications.push(savedNotification);
          }
        }
      }
    }

    // 2. Check Budget Exceeded Alerts
    if (alertSettings.budgetExceeded.enabled && currentBudget) {
      const budgetLimit = currentBudget.totalBudget || 0;
      const exceedThreshold = 1 + alertSettings.budgetExceeded.percentage / 100;

      if (totalMonthlySpent > budgetLimit * exceedThreshold) {
        const exceedPercentage = Math.round(
          ((totalMonthlySpent - budgetLimit) / budgetLimit) * 100
        );

        // Check if we haven't already sent this alert recently
        const recentAlert = await Notification.findOne({
          userId,
          type: "budget_exceeded",
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });

        if (!recentAlert) {
          const notification = Notification.createNigerianAlert(
            userId,
            "budget_exceeded",
            "Budget Exceeded",
            `Warning: You've exceeded your overall budget by ${exceedPercentage}% this month.`,
            {
              amount: totalMonthlySpent,
              budgetLimit,
              percentage: exceedPercentage,
              actions: [
                {
                  label: "View Breakdown",
                  action: "view_budget_breakdown",
                  data: { route: "/budget-planner/screen-1" },
                },
                {
                  label: "Adjust Budget",
                  action: "adjust_overall_budget",
                  data: { route: "/budget-planner/screen-2" },
                },
              ],
            },
            "high"
          );

          const savedNotification = await new Notification(notification).save();
          generatedNotifications.push(savedNotification);
        }
      }
    }

    // 3. Generate Nigerian-specific alerts
    if (alertSettings.nigerianContext.salaryDayReminders) {
      const dayOfMonth = currentDate.getDate();

      // Salary reminder (25th-28th of month)
      if (dayOfMonth >= 25 && dayOfMonth <= 28) {
        const recentSalaryAlert = await Notification.findOne({
          userId,
          type: "salary_reminder",
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Within 7 days
        });

        if (!recentSalaryAlert) {
          const notification = Notification.createNigerianAlert(
            userId,
            "salary_reminder",
            "Salary Season",
            "Salary season approaches! Time to plan next month's budget and review your spending goals.",
            {
              actions: [
                {
                  label: "Plan Budget",
                  action: "create_next_month_budget",
                  data: { route: "/budget-planner/screen-3" },
                },
                {
                  label: "Review Goals",
                  action: "view_savings_goals",
                  data: { route: "/smartGoals" },
                },
              ],
            },
            "medium"
          );

          const savedNotification = await new Notification(notification).save();
          generatedNotifications.push(savedNotification);
        }
      }
    }

    // 4. School fees alerts (Nigerian context)
    if (alertSettings.nigerianContext.schoolFeeAlerts) {
      const currentMonth = currentDate.getMonth();

      // January and September school fee reminders
      if ([0, 8].includes(currentMonth) && currentDate.getDate() <= 15) {
        const recentSchoolAlert = await Notification.findOne({
          userId,
          type: "school_fee_alert",
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Within 30 days
        });

        if (!recentSchoolAlert) {
          const monthName = currentMonth === 0 ? "January" : "September";
          const notification = Notification.createNigerianAlert(
            userId,
            "school_fee_alert",
            "School Fees Season",
            `${monthName} is school fees season. Don't forget to budget for education expenses this month.`,
            {
              actions: [
                {
                  label: "Add School Fees Budget",
                  action: "add_school_fees_category",
                },
                {
                  label: "View Education Expenses",
                  action: "view_category",
                  data: { category: "School Fees" },
                },
              ],
            },
            "medium"
          );

          const savedNotification = await new Notification(notification).save();
          generatedNotifications.push(savedNotification);
        }
      }
    }

    // 5. Generate savings tips based on spending patterns
    const topSpendingCategory =
      monthlySpending.length > 0
        ? monthlySpending.reduce((prev, current) =>
            prev.totalSpent > current.totalSpent ? prev : current
          )
        : null;

    if (topSpendingCategory && topSpendingCategory.totalSpent > 20000) {
      // High spending category
      const categoryName = topSpendingCategory._id;
      const spent = topSpendingCategory.totalSpent;

      // Check if we haven't sent savings tip for this category recently
      const recentTip = await Notification.findOne({
        userId,
        type: "savings_tip",
        "data.category": categoryName,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });

      if (!recentTip) {
        const potentialSavings = Math.round(spent * 0.2); // Suggest 20% reduction
        const newTarget = spent - potentialSavings;

        const notification = Notification.createNigerianAlert(
          userId,
          "savings_tip",
          "Savings Tip",
          `You could save ₦${potentialSavings.toLocaleString()} this month by reducing ${categoryName.toLowerCase()} from ₦${spent.toLocaleString()} to ₦${newTarget.toLocaleString()}.`,
          {
            category: categoryName,
            currentSpending: spent,
            suggestedTarget: newTarget,
            potentialSavings,
            actions: [
              {
                label: "Apply Suggestion",
                action: "adjust_category_budget",
                data: { category: categoryName, newAmount: newTarget },
              },
              { label: "Maybe Later", action: "dismiss_tip" },
            ],
          },
          "low"
        );

        const savedNotification = await new Notification(notification).save();
        generatedNotifications.push(savedNotification);
      }
    }

    // 6. Check custom alerts
    for (const customAlert of alertSettings.customAlerts) {
      if (!customAlert.enabled) continue;

      const categorySpending = monthlySpending.find(
        (cat) => cat._id === customAlert.category
      );
      if (!categorySpending) continue;

      const spent = categorySpending.totalSpent;
      let shouldAlert = false;
      let alertMessage = "";

      if (customAlert.condition === "spending_reaches") {
        const threshold = customAlert.isPercentage
          ? (currentBudget?.categories?.find(
              (cat: any) => cat.name === customAlert.category
            )?.allocated || 0) *
            (customAlert.threshold / 100)
          : customAlert.threshold;

        if (spent >= threshold) {
          shouldAlert = true;
          alertMessage = customAlert.isPercentage
            ? `Your ${customAlert.category} spending has reached ${Math.round((spent / threshold) * 100)}% of the alert threshold.`
            : `Your ${customAlert.category} spending has reached ₦${spent.toLocaleString()}, hitting your custom alert threshold.`;
        }
      }

      if (shouldAlert) {
        // Check if we haven't already sent this custom alert recently
        const recentCustomAlert = await Notification.findOne({
          userId,
          type: "custom_alert",
          "data.alertId": customAlert.id,
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });

        if (!recentCustomAlert) {
          const notification = Notification.createNigerianAlert(
            userId,
            "custom_alert",
            "Custom Alert",
            alertMessage,
            {
              alertId: customAlert.id,
              category: customAlert.category,
              amount: spent,
              threshold: customAlert.threshold,
              condition: customAlert.condition,
              actions: [
                {
                  label: "View Details",
                  action: "view_category_details",
                  data: { category: customAlert.category },
                },
                {
                  label: "Edit Alert",
                  action: "edit_custom_alert",
                  data: { alertId: customAlert.id },
                },
              ],
            },
            "medium"
          );

          const savedNotification = await new Notification(notification).save();
          generatedNotifications.push(savedNotification);
        }
      }
    }
  } catch (error) {
    console.error("Error generating alerts for user:", userId, error);
  }

  return generatedNotifications;
}
