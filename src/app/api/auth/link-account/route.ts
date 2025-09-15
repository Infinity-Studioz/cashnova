// src/app/api/auth/link-account/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { authOptions } from '@/utils/authOptions';
import { rateLimiter, rateLimitConfigs } from '@/lib/rateLimiter';
// import { getClientIP } from '@/lib/getClientIP';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // const clientIP = getClientIP(request);
    const { action, password, currentPassword } = await request.json();

    // Rate limiting
    const rateLimitResult = await rateLimiter.checkRateLimit(
      session.user.email!,
      'login', // Reuse login rate limiting
      rateLimitConfigs.login
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many attempts. Please try again later.',
          rateLimited: true
        },
        { status: 429 }
      );
    }

    const client = await dbConnect;
    const db = client.db();
    const users = db.collection('users');

    // Find the current user
    const user = await users.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'add-password') {
      // Add password to Google OAuth account
      if (user.provider === 'credentials' && user.password) {
        return NextResponse.json(
          { success: false, message: 'Account already has password authentication' },
          { status: 400 }
        );
      }

      if (!password) {
        return NextResponse.json(
          { success: false, message: 'Password is required' },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return NextResponse.json(
          { success: false, message: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }

      // Hash the new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update user with password and dual provider support
      const updateResult = await users.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            provider: 'dual', // Indicates that both methodsa re available
            updatedAt: new Date()
          }
        }
      );

      console.log('Update result:', updateResult);

      // Reset rate limit on success
      rateLimiter.resetRateLimit(session.user.email!, 'login');

      return NextResponse.json({
        success: true,
        message: 'Password authentication has been added to your account. You can now sign in with either Google or email/password.',
        updated: updateResult.modifiedCount > 0
      });
    }

    if (action === 'add-google') {
      // Link Google OAuth to email/password acct
      if (user.provider === 'google' || user.provider === 'dual') {
        return NextResponse.json(
          { success: false, message: 'Account already has Google authentication' },
          { status: 400 }
        );
      }

      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: 'Current password is required to link Google account' },
          { status: 400 }
        );
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Update user to dual provider
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            provider: 'dual',
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Account is ready for Google linking. Please sign in with Google to complete the process.',
        requiresGoogleSignIn: true
      });
    }

    if (action === 'remove-password') {
      // Remove password authentication (keep Google only)
      if (user.provider === 'credentials') {
        return NextResponse.json(
          { success: false, message: 'Cannot remove password authentication - no alternative login method available' },
          { status: 400 }
        );
      }

      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: 'Current password is required' },
          { status: 400 }
        );
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Remove password and set to Google only
      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            provider: 'google',
            updatedAt: new Date()
          },
          $unset: {
            password: ""
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Password authentication has been removed. You can now only sign in with Google.'
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Account linking error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}