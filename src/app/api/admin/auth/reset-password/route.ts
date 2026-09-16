import { NextResponse } from "next/server";
import { resetPasswordWithOtp } from "@/lib/admin/db";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `reset-password:${ip}`;
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset verification attempts. Please try again in ${rateCheck.retryAfterSec} seconds.`,
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
    const { email, otp, newPassword, confirmPassword } = body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Please provide email, verification code, and new password." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters in length." },
        { status: 400 }
      );
    }

    const result = await resetPasswordWithOtp(email.trim(), otp.trim(), newPassword);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Password reset failed." },
        { status: 400 }
      );
    }

    // Reset rate limiter on successful password change
    resetRateLimit(rateLimitKey);

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while resetting password." },
      { status: 500 }
    );
  }
}

