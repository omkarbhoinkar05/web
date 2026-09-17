import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getSettings, updateSettings } from "@/lib/admin/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "settings")) {
    return NextResponse.json({ error: "Forbidden: Access restricted to Super Admin and Admin" }, { status: 403 });
  }

  const settings = await getSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "settings")) {
    return NextResponse.json(
      { success: false, error: "Access denied. Only Super Admin can modify system settings." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const updated = await updateSettings(body);
    return NextResponse.json({ success: true, message: "Settings updated successfully", settings: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
