import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getFollowUps, createFollowUp, completeFollowUp } from "@/lib/admin/db";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  try {
    const body = await request.json();
    const { leadId, leadName, leadMobile, date, time, type, assignedTo, notes } = body;

    if (!leadId || !date || !time) {
      return NextResponse.json(
        { success: false, error: "Lead, date, and time are required" },
        { status: 400 }
      );
    }

    const newFollowUp = await createFollowUp({
      leadId,
      leadName: leadName || "Lead",
      leadMobile: leadMobile || "",
      date,
      time,
      type: type || "Call",
      assignedTo: assignedTo || session.name,
      status: "Upcoming",
      notes: notes || "",
    });

    return NextResponse.json({ success: true, message: "Follow-up scheduled", followUp: newFollowUp });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create follow-up" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    const completed = await completeFollowUp(id);
    if (!completed) {
      return NextResponse.json({ success: false, error: "Follow-up not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Follow-up marked as completed", followUp: completed });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update follow-up" }, { status: 500 });
  }
}
