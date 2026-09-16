import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { readDb } from "@/lib/admin/db";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30days";

  const db = readDb();
  const now = new Date();

  let daysBack = 30;
  if (range === "today") daysBack = 1;
  if (range === "7days") daysBack = 7;
  if (range === "30days") daysBack = 30;
  if (range === "thisMonth") daysBack = now.getDate();

  const cutoff = new Date(now.getTime() - daysBack * 24 * 3600 * 1000).toISOString();
  const filteredLeads = db.leads.filter((l) => l.createdAt >= cutoff);

  const total = filteredLeads.length;
  const won = filteredLeads.filter((l) => l.status === "WON").length;
  const lost = filteredLeads.filter((l) => l.status === "LOST").length;
  const active = total - won - lost;

  const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

  // Source distribution
  const sources: Record<string, number> = {};
  filteredLeads.forEach((l) => {
    sources[l.source] = (sources[l.source] || 0) + 1;
  });

  // Service demand
  const services: Record<string, number> = {};
  filteredLeads.forEach((l) => {
    services[l.service] = (services[l.service] || 0) + 1;
  });

  // Follow-up performance
  const completedFollowUps = db.followUps.filter((f) => f.status === "Completed").length;
  const overdueFollowUps = db.followUps.filter((f) => f.status === "Overdue").length;

  return NextResponse.json({
    success: true,
    range,
    metrics: {
      totalLeads: total,
      wonLeads: won,
      lostLeads: lost,
      activeLeads: active,
      winRate: `${winRate}%`,
      conversionDaysAvg: "14 Days",
      scheduledCalls: db.scheduledCalls.length,
      completedFollowUps,
      overdueFollowUps,
    },
    sources: Object.entries(sources).map(([source, count]) => ({ source, count })),
    services: Object.entries(services)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count),
  });
}
