import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getCareerApplications, updateCareerApplicationStatus } from "@/lib/admin/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await getCareerApplications();
  return NextResponse.json({ success: true, count: applications.length, applications });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
