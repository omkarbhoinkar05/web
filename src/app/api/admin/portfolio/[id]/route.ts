import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getPortfolioById, updatePortfolio, deletePortfolio } from "@/lib/admin/db";
import { portfolioItemSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  if (!hasPermission(session.role, "manage_portfolio")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403, headers: NO_CACHE_HEADERS });
  }

  const { id } = await params;
  const project = await getPortfolioById(id);

  if (!project) {
    return NextResponse.json(
      { success: false, error: "Portfolio project not found" },
      { status: 404, headers: NO_CACHE_HEADERS }
    );
  }

  return NextResponse.json({ success: true, project }, { headers: NO_CACHE_HEADERS });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  if (!hasPermission(session.role, "manage_portfolio")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403, headers: NO_CACHE_HEADERS });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const parseResult = portfolioItemSchema.partial().safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const updated = await updatePortfolio(id, parseResult.data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Portfolio project not found" },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    // Revalidate frontend
    try {
      revalidatePath("/");
      revalidatePath("/portfolio");
      revalidatePath(`/portfolio/${updated.slug}`);
      revalidatePath("/api/portfolio");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio project updated successfully",
        project: updated,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("PUT /api/admin/portfolio/[id] error:", error);
    const isQuotaError = error.message?.includes("Only 4 portfolio projects");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update portfolio project" },
      { status: isQuotaError ? 400 : 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  if (!hasPermission(session.role, "manage_portfolio")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403, headers: NO_CACHE_HEADERS });
  }

  try {
    const { id } = await params;
    const existing = await getPortfolioById(id);
    const success = await deletePortfolio(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Portfolio project not found" },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    // Revalidate frontend
    try {
      revalidatePath("/");
      revalidatePath("/portfolio");
      if (existing?.slug) {
        revalidatePath(`/portfolio/${existing.slug}`);
      }
      revalidatePath("/api/portfolio");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio project deleted successfully",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("DELETE /api/admin/portfolio/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete portfolio project" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
