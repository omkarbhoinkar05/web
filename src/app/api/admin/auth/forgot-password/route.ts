import { NextResponse } from "next/server";
import { createPasswordReset } from "@/lib/admin/db";

export async function POST(request: Request) {
  try {
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
      otp: resetData.otp, // Displayed in local demo alert banner so user can easily test
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
