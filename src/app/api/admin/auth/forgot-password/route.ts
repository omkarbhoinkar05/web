import { NextResponse } from "next/server";
import { createPasswordReset } from "@/lib/admin/db";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`forgot-password:${ip}`, 3, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset requests. Please try again in ${rateCheck.retryAfterSec} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateCheck.retryAfterSec.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your administrator work email address." },
        { status: 400 }
      );
    }

    const resetData = await createPasswordReset(email.trim());
    if (!resetData) {
      return NextResponse.json(
        {
          success: false,
          error: "No administrator or team account was found matching this email address.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code generated successfully. Valid for 15 minutes.",
      ...(process.env.NODE_ENV !== "production" ? { otp: resetData.otp } : {}),
      expiresAt: resetData.expiresAt,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing reset request." },
      { status: 500 }
    );
  }
}

