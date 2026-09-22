import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getPortfolioById, updatePortfolio, deletePortfolio } from "@/lib/admin/db";
import { portfolioItemSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_portfolio")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  const { id } = await params;
  const project = await getPortfolioById(id);

  if (!project) {
    return NextResponse.json({ success: false, error: "Portfolio project not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_portfolio")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const parseResult = portfolioItemSchema.partial().safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updatePortfolio(id, parseResult.data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Portfolio project not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio project updated successfully",
      project: updated,
    });
  } catch (error: any) {
    console.error("PUT /api/admin/portfolio/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update portfolio project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_portfolio")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const success = await deletePortfolio(id);

    if (!success) {
      return NextResponse.json({ success: false, error: "Portfolio project not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio project deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/portfolio/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete portfolio project" },
      { status: 500 }
    );
  }
}
