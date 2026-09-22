import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getServiceById, updateService, deleteService } from "@/lib/admin/db";
import { serviceItemSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_services")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, service });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_services")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const parseResult = serviceItemSchema.partial().safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updateService(id, parseResult.data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      service: updated,
    });
  } catch (error: any) {
    console.error("PUT /api/admin/services/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_services")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const success = await deleteService(id);

    if (!success) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/services/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete service" },
      { status: 500 }
    );
  }
}
