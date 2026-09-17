import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "view_reports")) {
    return NextResponse.json({ error: "Forbidden: Access restricted to Super Admin and Admin" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30days";

  const now = new Date();
  let daysBack = 30;
  if (range === "today") daysBack = 1;
  if (range === "7days") daysBack = 7;
  if (range === "30days") daysBack = 30;
  if (range === "thisMonth") daysBack = now.getDate();

  const cutoff = new Date(now.getTime() - daysBack * 24 * 3600 * 1000).toISOString();

  const [
    totalLeads,
    wonLeads,
    lostLeads,
    sourceGroups,
    serviceGroups,
    scheduledCallsCount,
    completedFollowUps,
    overdueFollowUps,
  ] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: cutoff } } }),
    prisma.lead.count({ where: { createdAt: { gte: cutoff }, status: "WON" } }),
    prisma.lead.count({ where: { createdAt: { gte: cutoff }, status: "LOST" } }),
    prisma.lead.groupBy({
      by: ["source"],
      where: { createdAt: { gte: cutoff } },
      _count: { source: true },
    }),
    prisma.lead.groupBy({
      by: ["service"],
      where: { createdAt: { gte: cutoff } },
      _count: { service: true },
    }),
    prisma.scheduledCall.count(),
    prisma.followUp.count({ where: { status: "Completed" } }),
    prisma.followUp.count({
      where: {
        status: { not: "Completed" },
        date: { lt: now.toISOString().split("T")[0] },
      },
    }),
  ]);

  const activeLeads = totalLeads - wonLeads - lostLeads;
  const winRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return NextResponse.json({
    success: true,
    range,
    metrics: {
      totalLeads,
      wonLeads,
      lostLeads,
      activeLeads,
      winRate: `${winRate}%`,
      conversionDaysAvg: "14 Days",
      scheduledCalls: scheduledCallsCount,
      completedFollowUps,
      overdueFollowUps,
    },
    sources: sourceGroups.map((g) => ({ source: g.source, count: g._count.source })),
    services: serviceGroups
      .map((g) => ({ service: g.service, count: g._count.service }))
      .sort((a, b) => b.count - a.count),
  });
}
