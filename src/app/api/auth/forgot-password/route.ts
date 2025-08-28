import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { rateLimiter, rateLimitConfigs } from "@/lib/rateLimiter";
import { getClientIP } from "@/lib/getClientIP";
import { generatePasswordResetToken, hashToken } from "@/lib/tokenUtils";
import { sendEmail, generatePasswordResetEmail } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const { email } = await request.json();

    // Rate limiting check
    const rateLimitResult = await rateLimiter.checkRateLimit(
      email?.toLowerCase() || clientIP,
      "password-reset",
      rateLimitConfigs.passwordReset
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitResult.blocked
            ? "Too many password reset attempts. Please try again later."
            : "Please wait before requesting another password reset.",
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    const client = await dbConnect;
    const db = client.db();
    const users = db.collection("users");
    const resetTokens = db.collection("passwordResetTokens");

    // Find user (only credentials provider can reset password)
    const user = await users.findOne({
      email: email.toLowerCase(),
      provider: "credentials",
    });

    // Always return success to prevent email enumeration attacks
    const successMessage =
      "If an account with that email exists, we've sent a password reset link.";

    if (!user) {
      // Don't reveal that the account doesn't exist
      return NextResponse.json({
        success: true,
        message: successMessage,
      });
    }

    // Generate secure reset token
    const { token, hashedToken, expiresAt } = generatePasswordResetToken();

    // Invalidate any existing reset tokens for this user
    await resetTokens.deleteMany({
      email: email.toLowerCase(),
      used: false,
    });

    // Store new reset token
    await resetTokens.insertOne({
      userId: user._id.toString(),
      email: email.toLowerCase(),
      token: hashedToken, // Store hashed version
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    // Generate reset URL
    const resetUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/reset-password?token=${token}`;

    // Send reset email
    const { subject, html } = generatePasswordResetEmail(user.name, resetUrl);
    const emailSent = await sendEmail({
      to: email,
      subject,
      html,
    });

    if (!emailSent) {
      console.error("Failed to send password reset email");
      // Don't reveal email sending failure to user
    }

    // Reset rate limit on successful request
    rateLimiter.resetRateLimit(email.toLowerCase(), "password-reset");

    return NextResponse.json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
