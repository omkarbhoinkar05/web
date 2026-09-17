import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import {
  getLeadById,
  updateLead,
  deleteLead,
  getLeadNotes,
  addLeadNote,
  getActivities,
} from "@/lib/admin/db";
import prisma from "@/lib/prisma";
import { leadUpdateSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "view_leads")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
  }

  const notes = await getLeadNotes(lead.leadId);
  const activities = await getActivities(50, lead.leadId);
  const followUps = await prisma.followUp.findMany({
    where: { leadId: lead.leadId },
    orderBy: { createdAt: "desc" },
  });

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

  if (!hasPermission(session.role, "edit_leads") && !hasPermission(session.role, "all")) {
    return NextResponse.json({ error: "Forbidden: Cannot edit leads" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const parseResult = leadUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updateLead(id, parseResult.data, session.name);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully",
      lead: updated,
    });
  } catch (error) {
    console.error("PUT lead error:", error);
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "delete_records")) {
    return NextResponse.json({ error: "Forbidden: Only Super Admin can delete leads" }, { status: 403 });
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
    const noteText = body.note || body.text;
    const category = body.category || "General Update";
    const status = body.status || undefined;

    if (!noteText || !noteText.trim()) {
      return NextResponse.json({ success: false, error: "Note content is required" }, { status: 400 });
    }

    const lead = await getLeadById(id);
    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const newNote = await addLeadNote(
      lead.leadId,
      noteText.trim(),
      session.name,
      category,
      status
    );
    return NextResponse.json({ success: true, message: "Note added to history", note: newNote });
  } catch (error) {
    console.error("POST lead note error:", error);
    return NextResponse.json({ success: false, error: "Failed to add note" }, { status: 500 });
  }
}
