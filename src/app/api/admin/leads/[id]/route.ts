import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import {
  getLeadById,
  updateLead,
  deleteLead,
  getLeadNotes,
  addLeadNote,
  readDb,
} from "@/lib/admin/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
  }

  const notes = await getLeadNotes(lead.leadId);
  const db = readDb();
  const activities = db.activities.filter((a) => a.leadId === lead.leadId);
  const followUps = db.followUps.filter((f) => f.leadId === lead.leadId);

  return NextResponse.json({
    success: true,
    lead,
    notes,
    activities,
    followUps,
  });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateLead(id, body, session.name);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully",
      lead: updated,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteLead(id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Lead deleted successfully" });
}

export async function POST(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { note } = body;

    if (!note || !note.trim()) {
      return NextResponse.json({ success: false, error: "Note content is required" }, { status: 400 });
    }

    const lead = await getLeadById(id);
    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const newNote = await addLeadNote(lead.leadId, note.trim(), session.name);
    return NextResponse.json({ success: true, message: "Note added", note: newNote });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to add note" }, { status: 500 });
  }
}
