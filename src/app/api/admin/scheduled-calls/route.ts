import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getScheduledCalls, updateScheduledCallStatus } from "@/lib/admin/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "schedule_calls") && !hasPermission(session.role, "all")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  const calls = await getScheduledCalls();
  return NextResponse.json({ success: true, count: calls.length, calls });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "schedule_calls") && !hasPermission(session.role, "all")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status, notes, assignedTo } = body;

    const updated = await updateScheduledCallStatus(id, status, notes, assignedTo);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Call record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Call status updated", call: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update call" }, { status: 500 });
  }
}
