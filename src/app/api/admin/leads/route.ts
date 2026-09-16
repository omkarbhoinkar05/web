import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getLeads, createLead } from "@/lib/admin/db";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const leads = await getLeads({
    search,
    status,
    priority,
    service,
    source,
    assignedTo,
    sort,
  });

  // Handle CSV export
  if (isExport) {
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
        "Content-Disposition": `attachment; filename="HighTechBirds_Leads_${new Date().toISOString().split("T")[0]}.csv"`,
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

  try {
    const body = await request.json();
    const { fullName, email, mobile, service, budget, source, status, priority, assignedTo, notes } = body;

    if (!fullName || !mobile || !service) {
      return NextResponse.json(
        { success: false, error: "Name, mobile, and service are required." },
        { status: 400 }
      );
    }

    const lead = await createLead({
      fullName,
      email: email || "",
      mobile,
      service,
      budget: budget || "Not specified",
      source: source || "Direct Inbound",
      status: status || "NEW",
      priority: priority || "Medium",
      assignedTo: assignedTo || session.name,
      notes: notes || "",
    });

    return NextResponse.json({ success: true, message: "Lead created successfully", lead });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create lead" }, { status: 500 });
  }
}
