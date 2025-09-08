// src/app/api/transactions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { authOptions } from '@/utils/authOptions';
import mongoose from 'mongoose';

interface RouteParams {
  params: {
    id: string;
  };
}

// PUT - Update existing transaction
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID format.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const body = await request.json();
    const { type, amount, category, note, merchant, location, paymentMethod, date, recurring, recurringPattern, status } = body;

    // Find the existing transaction
    const existingTransaction = await Transaction.findOne({
      _id: id,
      userId: session.user.email
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found or you do not have permission to edit it.' },
        { status: 404 }
      );
    }

    // Validate input if provided
    if (type && !['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type. Must be "income" or "expense".' },
        { status: 400 }
      );
    }

    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
      return NextResponse.json(
        { error: 'Amount must be a positive number.' },
        { status: 400 }
      );
    }

    if (recurring && recurringPattern && !['daily', 'weekly', 'monthly', 'yearly'].includes(recurringPattern)) {
      return NextResponse.json(
        { error: 'Invalid recurring pattern. Must be daily, weekly, monthly, or yearly.' },
        { status: 400 }
      );
    }

    if (status && !['completed', 'pending', 'flagged'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be completed, pending, or flagged.' },
        { status: 400 }
      );
    }

    // Prepare update data
    interface UpdateTransactionData {
      type?: 'income' | 'expense';
      amount?: number;
      note?: string;
      merchant?: string;
      location?: string;
      paymentMethod?: string;
      date?: Date;
      recurring?: boolean;
      recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
      status?: 'completed' | 'pending' | 'flagged';
      userCategory?: string;
      autoCategory?: string;
      category?: string;
    }
    const updateData: UpdateTransactionData = {};

    // Only update fields that are provided
    if (type !== undefined) updateData.type = type;
    if (amount !== undefined) updateData.amount = amount;
    if (note !== undefined) updateData.note = note?.trim();
    if (merchant !== undefined) updateData.merchant = merchant?.trim();
    if (location !== undefined) updateData.location = location?.trim();
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (date !== undefined) updateData.date = new Date(date);
    if (recurring !== undefined) updateData.recurring = recurring;
    if (recurringPattern !== undefined) updateData.recurringPattern = recurringPattern;
    if (status !== undefined) updateData.status = status;

    // Handle category updates
    if (category !== undefined) {
      // User is setting a category override
      updateData.userCategory = category;
      
      // Re-run smart categorization to update autoCategory if merchant/note changed
      if (merchant !== undefined || note !== undefined) {
        updateData.autoCategory = Transaction.categorizeTransaction(
          merchant || existingTransaction.merchant, 
          note || existingTransaction.note, 
          amount || existingTransaction.amount
        );
      }
    }

    // Re-categorize if merchant or note changed but no category override
    if (!category && (merchant !== undefined || note !== undefined)) {
      const newAutoCategory = Transaction.categorizeTransaction(
        merchant || existingTransaction.merchant,
        note || existingTransaction.note,
        amount || existingTransaction.amount
      );
      
      updateData.autoCategory = newAutoCategory;
      
      // If user hasn't overridden category, update the main category too
      if (!existingTransaction.userCategory) {
        updateData.category = newAutoCategory;
      }
    }

    // Smart insights for significant changes
    let aiInsight: string | undefined;
    const insights: string[] = [];

    if (amount !== undefined && Math.abs(amount - existingTransaction.amount) > existingTransaction.amount * 0.2) {
      const percentChange = Math.round(((amount - existingTransaction.amount) / existingTransaction.amount) * 100);
      insights.push(`Amount changed by ${percentChange > 0 ? '+' : ''}${percentChange}%`);
    }

    if (category !== undefined && category !== existingTransaction.category && category !== existingTransaction.userCategory) {
      insights.push(`Category changed from "${existingTransaction.userCategory || existingTransaction.category}" to "${category}"`);
    }

    if (type !== undefined && type !== existingTransaction.type) {
      insights.push(`Transaction type changed from ${existingTransaction.type} to ${type}`);
    }

    if (insights.length > 0) {
      aiInsight = `Updated: ${insights.join(', ')}`;
    }

    // Update the transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    // Response data
    const response = {
      success: true,
      transaction: {
        ...updatedTransaction!.toJSON(),
        effectiveCategory: updatedTransaction!.userCategory || updatedTransaction!.category,
        formattedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(updatedTransaction!.amount).replace('NGN', '₦')
      },
      changes: updateData,
      aiInsight: aiInsight
    };

    return NextResponse.json(response);

  } catch (error: unknown) {
    console.error('Error updating transaction:', error);

    if (typeof error === 'object' && error !== null && 'name' in error) {
      if ((error as { name: string }).name === 'ValidationError') {
        const validationErrors = Object.values((error as unknown as { errors: Record<string, { message: string }> }).errors)
          .map((err: { message: string }) => err.message);
        return NextResponse.json(
          { error: 'Validation failed', details: validationErrors },
          { status: 400 }
        );
      }

      if ((error as { name: string }).name === 'CastError') {
        return NextResponse.json(
          { error: 'Invalid data format provided.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to update transaction. Please try again.',
        details: process.env.NODE_ENV === 'development' && typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove transaction
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID format.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find and delete the transaction
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: session.user.email
    });

    if (!deletedTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found or you do not have permission to delete it.' },
        { status: 404 }
      );
    }

    // Log the deletion for audit purposes (in production, you might want to soft delete instead)
    console.log(`Transaction deleted: ${id} by user ${session.user.email}`);

    // Check if this was a recurring transaction and warn user
    let warningMessage: string | undefined;
    if (deletedTransaction.recurring) {
      warningMessage = "This was a recurring transaction. You may want to review similar future transactions.";
    }

    // Calculate impact on monthly budget if this was a current month transaction
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    let budgetImpact: string | undefined;
    if (deletedTransaction.date >= currentMonth && deletedTransaction.type === 'expense') {
      budgetImpact = `This ${deletedTransaction.effectiveCategory || deletedTransaction.category} expense of ${new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
      }).format(deletedTransaction.amount).replace('NGN', '₦')} has been removed from your current month's spending.`;
    }

    const response = {
      success: true,
      message: 'Transaction deleted successfully.',
      deletedTransaction: {
        id: deletedTransaction._id,
        type: deletedTransaction.type,
        amount: deletedTransaction.amount,
        category: deletedTransaction.userCategory || deletedTransaction.category,
        date: deletedTransaction.date,
        formattedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(deletedTransaction.amount).replace('NGN', '₦')
      },
      warnings: warningMessage ? [warningMessage] : [],
      budgetImpact: budgetImpact
    };

    return NextResponse.json(response);

  } catch (error: unknown) {
    console.error('Error deleting transaction:', error);

    return NextResponse.json(
      { 
        error: 'Failed to delete transaction. Please try again.',
        details: process.env.NODE_ENV === 'development' && typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : undefined
      },
      { status: 500 }
    );
  }
}

// GET - Get single transaction details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID format.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the transaction
    const transaction = await Transaction.findOne({
      _id: id,
      userId: session.user.email
    }).lean();

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found.' },
        { status: 404 }
      );
    }

    // Get similar transactions for pattern analysis
    const similarTransactions = await Transaction.find({
      userId: session.user.email,
      merchant: transaction.merchant ? { $regex: new RegExp(transaction.merchant, 'i') } : { $exists: false },
      _id: { $ne: id }
    }).sort({ date: -1 }).limit(5).lean();

    const response = {
      success: true,
      transaction: {
        ...transaction,
        effectiveCategory: transaction.userCategory || transaction.category,
        formattedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(transaction.amount).replace('NGN', '₦')
      },
      similarTransactions: similarTransactions.map(t => ({
        ...t,
        effectiveCategory: t.userCategory || t.category,
        formattedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(t.amount).replace('NGN', '₦')
      })),
      insights: {
        isRecurring: transaction.recurring,
        similarCount: similarTransactions.length,
        categoryConsistency: similarTransactions.filter(t => 
          (t.userCategory || t.category) === (transaction.userCategory || transaction.category)
        ).length
      }
    };

    return NextResponse.json(response);

  } catch (error: unknown) {
    console.error('Error fetching transaction:', error);

    return NextResponse.json(
      { 
        error: 'Failed to fetch transaction. Please try again.',
        details: process.env.NODE_ENV === 'development' && typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : undefined
      },
      { status: 500 }
    );
  }
}