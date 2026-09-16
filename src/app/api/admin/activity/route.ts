import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getActivities } from "@/lib/admin/db";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const activities = await getActivities(limit);
  return NextResponse.json({ success: true, count: activities.length, activities });
}
