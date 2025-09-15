// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { rateLimiter, rateLimitConfigs } from "@/lib/rateLimiter";
import { getClientIP } from "@/lib/getClientIP";

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const { fullName, email, password } = await request.json();

    // Rate-limiting check
    const rateLimitResult = await rateLimiter.checkRateLimit(
      clientIP,
      "register",
      rateLimitConfigs.register
    );

    if (!rateLimitResult.success) {
      const resetTime = new Date(rateLimitResult.resetTime).toISOString();

      if (rateLimitResult.blocked && rateLimitResult.blockUntil) {
        const blockUntil = new Date(rateLimitResult.blockUntil).toISOString();
        return NextResponse.json(
          {
            success: false,
            message: `Too many registration attempts. Account creation blocked until ${blockUntil}`,
            rateLimited: true,
            blockUntil: rateLimitResult.blockUntil,
          },
          {
            status: 429,
            headers: {
              "Retry-After": Math.ceil(
                (rateLimitResult.blockUntil - Date.now()) / 1000
              ).toString(),
            },
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Too many registration attempts. Please try again after ${resetTime}`,
          rateLimited: true,
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          },
        }
      );
    }
    const client = await dbConnect;
    const db = client.db();
    const users = db.collection("users");

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      name: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      provider: "credentials",
      emailVerified: null,
      preferences: {
        currency: "NGN",
        theme: "system",
        notifications: {
          email: true,
          push: true,
        },
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    // Reset rate limit on successful registration
    rateLimiter.resetRateLimit(clientIP, "register");

    // Return success (without password)
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: result.insertedId,
          name: newUser.name,
          email: newUser.email,
        },
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining":
            rateLimitConfigs.register.maxAttempts.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate email error from MongoDB
    interface MongoError extends Error {
      code?: number;
    }

    if ((error as MongoError)?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
