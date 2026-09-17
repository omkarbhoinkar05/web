import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getFollowUps, createFollowUp, completeFollowUp } from "@/lib/admin/db";
import { followUpSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "follow_ups") && !hasPermission(session.role, "all")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const tab = (searchParams.get("tab") as "all" | "overdue" | "today" | "upcoming" | "completed") || "all";

  const followUps = await getFollowUps(tab);
  return NextResponse.json({ success: true, count: followUps.length, followUps });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "follow_ups") && !hasPermission(session.role, "all")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  try {
    const body = await request.json();

    const parseResult = followUpSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { leadId, date, time, type, notes } = parseResult.data;

    const newFollowUp = await createFollowUp({
      leadId,
      leadName: body.leadName || "Lead",
      leadMobile: body.leadMobile || "",
      date,
      time,
      type,
      assignedTo: body.assignedTo || session.name,
      status: "Upcoming",
      notes,
    });

    return NextResponse.json({ success: true, message: "Follow-up scheduled", followUp: newFollowUp });
  } catch (error) {
    console.error("POST follow-up error:", error);
    return NextResponse.json({ success: false, error: "Failed to create follow-up" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "follow_ups") && !hasPermission(session.role, "all")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Follow-up ID required" }, { status: 400 });
    }

    const completed = await completeFollowUp(id, notes);
    if (!completed) {
      return NextResponse.json({ success: false, error: "Follow-up not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Follow-up marked as completed", followUp: completed });
  } catch (error) {
    console.error("PUT follow-up error:", error);
    return NextResponse.json({ success: false, error: "Failed to update follow-up" }, { status: 500 });
  }
}
