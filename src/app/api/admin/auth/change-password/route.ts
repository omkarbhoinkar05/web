import { NextResponse } from "next/server";
import { getAdminSession, verifyUserPassword } from "@/lib/admin/auth";
import { updateUserPassword } from "@/lib/admin/db";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to change password." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: "All fields are required (Current Password, New Password, Confirm Password)." },
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

    const isCurrentValid = await verifyUserPassword(session.email, currentPassword);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "The current password you entered is incorrect." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, error: "New password must be different from your current password." },
        { status: 400 }
      );
    }

    const updated = await updateUserPassword(session.email, newPassword);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Failed to update password. Administrator profile not found." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error while updating password." },
      { status: 500 }
    );
  }
}
