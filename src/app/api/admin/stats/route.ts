import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getDashboardStats } from "@/lib/admin/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getDashboardStats();
  return NextResponse.json({ success: true, stats });
}
