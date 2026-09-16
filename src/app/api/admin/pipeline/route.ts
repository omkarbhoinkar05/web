import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getLeads, updateLead } from "@/lib/admin/db";
import { LeadStatus, Lead } from "@/lib/admin/types";

const STAGES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "REQUIREMENT DISCUSSED",
  "QUOTATION SENT",
  "FOLLOW-UP",
  "NEGOTIATION",
  "WON",
  "LOST",
];

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allLeads = await getLeads();

  const pipeline: Record<LeadStatus, { count: number; leads: Lead[] }> = {
    NEW: { count: 0, leads: [] },
    CONTACTED: { count: 0, leads: [] },
    QUALIFIED: { count: 0, leads: [] },
    "REQUIREMENT DISCUSSED": { count: 0, leads: [] },
    "QUOTATION SENT": { count: 0, leads: [] },
    "FOLLOW-UP": { count: 0, leads: [] },
    NEGOTIATION: { count: 0, leads: [] },
    WON: { count: 0, leads: [] },
    LOST: { count: 0, leads: [] },
  };

  allLeads.forEach((lead) => {
    if (pipeline[lead.status]) {
      pipeline[lead.status].leads.push(lead);
      pipeline[lead.status].count++;
    }
  });

  return NextResponse.json({ success: true, stages: STAGES, pipeline });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { leadId, newStatus, closingNote, lostReason } = body;

    if (!leadId || !newStatus) {
      return NextResponse.json({ success: false, error: "leadId and newStatus are required" }, { status: 400 });
    }

    const updated = await updateLead(
      leadId,
      {
        status: newStatus,
        closingNote,
        lostReason,
      },
      session.name
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Pipeline stage updated", lead: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update pipeline stage" }, { status: 500 });
  }
}
