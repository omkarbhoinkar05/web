import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getContactEnquiries, updateEnquiryStatus } from "@/lib/admin/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "contact_enquiries") && !hasPermission(session.role, "all")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  const enquiries = await getContactEnquiries();
  return NextResponse.json({ success: true, count: enquiries.length, enquiries });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "contact_enquiries") && !hasPermission(session.role, "all")) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status, assignedTo } = body;

    const updated = await updateEnquiryStatus(id, status, assignedTo);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Status updated", enquiry: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update enquiry" }, { status: 500 });
  }
}
