// src/app/api/alert-settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import AlertSettings from '@/models/AlertSettings';
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

    // Get user's alert settings or create default ones
    let alertSettings = await AlertSettings.findOne({
      userId: session.user.email
    });

    if (!alertSettings) {
      // Create default settings for new user
      const defaultSettings = AlertSettings.getDefaultSettings(session.user.email);
      alertSettings = new AlertSettings(defaultSettings);
      await alertSettings.save();
    }

    return NextResponse.json({
      success: true,
      alertSettings: alertSettings.toJSON()
    });

  } catch (error: any) {
    console.error('Error fetching alert settings:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch alert settings. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

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
    const {
      categoryThreshold,
      budgetExceeded,
      weeklySummary,
      customAlerts,
      notificationPreferences,
      nigerianContext
    } = body;

    // Validate input data
    if (categoryThreshold && (
      typeof categoryThreshold.enabled !== 'boolean' ||
      typeof categoryThreshold.percentage !== 'number' ||
      categoryThreshold.percentage < 1 ||
      categoryThreshold.percentage > 100
    )) {
      return NextResponse.json(
        { error: 'Invalid category threshold settings.' },
        { status: 400 }
      );
    }

    if (budgetExceeded && (
      typeof budgetExceeded.enabled !== 'boolean' ||
      typeof budgetExceeded.percentage !== 'number' ||
      budgetExceeded.percentage < 1 ||
      budgetExceeded.percentage > 50
    )) {
      return NextResponse.json(
        { error: 'Invalid budget exceeded settings.' },
        { status: 400 }
      );
    }

    // Find existing settings or create new ones
    let alertSettings = await AlertSettings.findOne({
      userId: session.user.email
    });

    if (!alertSettings) {
      // Create new settings
      const defaultSettings = AlertSettings.getDefaultSettings(session.user.email);
      alertSettings = new AlertSettings(defaultSettings);
    }

    // Update settings
    if (categoryThreshold) {
      alertSettings.categoryThreshold = {
        ...alertSettings.categoryThreshold,
        ...categoryThreshold
      };
    }

    if (budgetExceeded) {
      alertSettings.budgetExceeded = {
        ...alertSettings.budgetExceeded,
        ...budgetExceeded
      };
    }

    if (weeklySummary) {
      alertSettings.weeklySummary = {
        ...alertSettings.weeklySummary,
        ...weeklySummary
      };
    }

    if (customAlerts) {
      // Validate custom alerts
      const validatedCustomAlerts = customAlerts.map((alert: any) => {
        if (!alert.id || !alert.category || !alert.condition || typeof alert.threshold !== 'number') {
          throw new Error('Invalid custom alert configuration');
        }
        return {
          id: alert.id,
          enabled: Boolean(alert.enabled),
          category: alert.category,
          condition: alert.condition,
          threshold: alert.threshold,
          isPercentage: Boolean(alert.isPercentage),
          notificationTiming: alert.notificationTiming || 'immediate'
        };
      });
      
      alertSettings.customAlerts = validatedCustomAlerts;
    }

    if (notificationPreferences) {
      alertSettings.notificationPreferences = {
        ...alertSettings.notificationPreferences,
        ...notificationPreferences
      };
    }

    if (nigerianContext) {
      alertSettings.nigerianContext = {
        ...alertSettings.nigerianContext,
        ...nigerianContext
      };
    }

    await alertSettings.save();

    return NextResponse.json({
      success: true,
      message: 'Alert settings updated successfully',
      alertSettings: alertSettings.toJSON()
    });

  } catch (error: any) {
    console.error('Error updating alert settings:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to update alert settings. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST endpoint to add a new custom alert
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
    const { category, condition, threshold, isPercentage, notificationTiming } = body;

    // Validate required fields
    if (!category || !condition || typeof threshold !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: category, condition, and threshold are required.' },
        { status: 400 }
      );
    }

    if (!['spending_reaches', 'daily_exceeds', 'weekly_exceeds'].includes(condition)) {
      return NextResponse.json(
        { error: 'Invalid condition. Must be spending_reaches, daily_exceeds, or weekly_exceeds.' },
        { status: 400 }
      );
    }

    // Find or create alert settings
    let alertSettings = await AlertSettings.findOne({
      userId: session.user.email
    });

    if (!alertSettings) {
      const defaultSettings = AlertSettings.getDefaultSettings(session.user.email);
      alertSettings = new AlertSettings(defaultSettings);
    }

    // Create new custom alert
    const newAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      enabled: true,
      category,
      condition,
      threshold,
      isPercentage: Boolean(isPercentage),
      notificationTiming: notificationTiming || 'immediate'
    };

    alertSettings.customAlerts.push(newAlert);
    await alertSettings.save();

    return NextResponse.json({
      success: true,
      message: 'Custom alert created successfully',
      alert: newAlert,
      alertSettings: alertSettings.toJSON()
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating custom alert:', error);

    return NextResponse.json(
      { 
        error: 'Failed to create custom alert. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}