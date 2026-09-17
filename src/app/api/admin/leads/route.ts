import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getLeads, createLead } from "@/lib/admin/db";
import { leadCreateSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "view_leads")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const priority = searchParams.get("priority") || undefined;
  const service = searchParams.get("service") || undefined;
  const source = searchParams.get("source") || undefined;
  const assignedTo = searchParams.get("assignedTo") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const isExport = searchParams.get("export") === "csv";

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const skip = isExport ? undefined : (page - 1) * limit;

  const leads = await getLeads({
    search,
    status,
    priority,
    service,
    source,
    assignedTo,
    sort,
    limit: isExport ? undefined : limit,
    skip,
  });

  // Handle CSV export
  if (isExport) {
    if (!hasPermission(session.role, "export")) {
      return NextResponse.json({ error: "Forbidden: Export permission required" }, { status: 403 });
    }

    const headers = [
      "Lead ID",
      "Full Name",
      "Email",
      "Mobile",
      "Service",
      "Budget",
      "Source",
      "Status",
      "Priority",
      "Assigned To",
      "Next Follow-up",
      "Created At",
    ];

    const rows = leads.map((l) => [
      `"${l.leadId}"`,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.mobile}"`,
      `"${l.service.replace(/"/g, '""')}"`,
      `"${(l.budget || "").replace(/"/g, '""')}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.priority}"`,
      `"${l.assignedTo}"`,
      `"${l.nextFollowUp || ""}"`,
      `"${l.createdAt}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Web_Leads_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({ success: true, count: leads.length, leads });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "edit_leads") && !hasPermission(session.role, "all")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions to create leads" }, { status: 403 });
  }

  try {
    const body = await request.json();

    const parseResult = leadCreateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const validated = parseResult.data;
    const lead = await createLead({
      fullName: validated.fullName,
      email: validated.email,
      mobile: validated.mobile,
      service: validated.service,
      budget: validated.budget,
      source: validated.source,
      status: validated.status,
      priority: validated.priority,
      assignedTo: validated.assignedTo !== "Unassigned" ? validated.assignedTo : session.name,
      notes: validated.notes,
      nextFollowUp: validated.nextFollowUp,
    });

    return NextResponse.json({ success: true, message: "Lead created successfully", lead });
  } catch (error) {
    console.error("POST lead error:", error);
    return NextResponse.json({ success: false, error: "Failed to create lead" }, { status: 500 });
  }
}
