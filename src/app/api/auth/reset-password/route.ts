// src/app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { hashToken, isTokenExpired } from '@/lib/tokenUtils';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validation
    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const client = await dbConnect;
    const db = client.db();
    const users = db.collection('users');
    const resetTokens = db.collection('passwordResetTokens');

    // Hash the provided token to match stored hash
    const hashedToken = hashToken(token);

    // Find valid reset token
    const resetTokenDoc = await resetTokens.findOne({
      token: hashedToken,
      used: false
    });

    if (!resetTokenDoc) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (isTokenExpired(resetTokenDoc.expiresAt)) {
      // Clean up expired token
      await resetTokens.deleteOne({ _id: resetTokenDoc._id });
      
      return NextResponse.json(
        { success: false, message: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await users.findOne({ 
      email: resetTokenDoc.email,
      provider: 'credentials' 
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User account not found' },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );

    // Mark token as used
    await resetTokens.updateOne(
      { _id: resetTokenDoc._id },
      { 
        $set: { 
          used: true,
          usedAt: new Date()
        } 
      }
    );

    // Clean up any other reset tokens for this user
    await resetTokens.deleteMany({
      email: resetTokenDoc.email,
      _id: { $ne: resetTokenDoc._id }
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}