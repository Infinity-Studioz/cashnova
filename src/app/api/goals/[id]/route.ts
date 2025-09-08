// src/app/api/goals/[id]/route.ts
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

// GET individual goal
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
    const { id } = params;

    const goal = await Goal.findOne({
      _id: id,
      userId: session.user.email
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      goal: goal.toObject({ virtuals: true })
    });

  } catch (error: any) {
    console.error('Error fetching goal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

// PUT - Update goal
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
    const { id } = params;
    const updates = await request.json();

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: 'Invalid goal ID format' },
        { status: 400 }
      );
    }

    const goal = await Goal.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.email
      },
      updates,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Goal updated successfully',
      goal: goal.toObject({ virtuals: true })
    });

  } catch (error: any) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE goal
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
    const { id } = params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: 'Invalid goal ID format' },
        { status: 400 }
      );
    }

    const goal = await Goal.findOneAndDelete({
      _id: id,
      userId: session.user.email
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}