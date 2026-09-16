import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getContactEnquiries, updateEnquiryStatus } from "@/lib/admin/db";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;

  const enquiries = await getContactEnquiries(search);
  return NextResponse.json({ success: true, count: enquiries.length, enquiries });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    const updated = await updateEnquiryStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Status updated", enquiry: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update enquiry" }, { status: 500 });
  }
}
