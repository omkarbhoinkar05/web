import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/admin/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return NextResponse.json({ success: true, unreadCount, notifications });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      await markAllNotificationsRead();
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (id) {
      await markNotificationRead(id);
      return NextResponse.json({ success: true, message: "Notification marked as read" });
    }

    return NextResponse.json({ success: false, error: "id or markAll is required" }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update notification" }, { status: 500 });
  }
}
