import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getCareerApplications, updateCareerApplicationStatus } from "@/lib/admin/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "view_careers")) {
    return NextResponse.json({ error: "Forbidden: Access restricted to HR and Administrators" }, { status: 403 });
  }

  const applications = await getCareerApplications();
  return NextResponse.json({ success: true, count: applications.length, applications });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_careers")) {
    return NextResponse.json({ error: "Forbidden: Access restricted to HR and Administrators" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status, notes } = body;

    const updated = await updateCareerApplicationStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Application status updated", application: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update application" }, { status: 500 });
  }
}
