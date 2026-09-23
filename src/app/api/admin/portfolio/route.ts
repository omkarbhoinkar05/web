import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getPortfolios, createPortfolio } from "@/lib/admin/db";
import { portfolioItemSchema } from "@/lib/validations";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_portfolio")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const category = searchParams.get("category") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const skip = (page - 1) * limit;

  const [{ portfolios, total }, totalAll, activeCount, inactiveCount, homeCount, allCategories] =
    await Promise.all([
      getPortfolios({ search, status, category, limit, skip }),
      prisma.portfolioItem.count(),
      prisma.portfolioItem.count({ where: { status: "Active" } }),
      prisma.portfolioItem.count({ where: { status: "Inactive" } }),
      prisma.portfolioItem.count({ where: { showOnHome: true } }),
      prisma.portfolioItem.findMany({
        select: { category: true },
        distinct: ["category"],
      }),
    ]);

  const stats = {
    total: totalAll,
    active: activeCount,
    inactive: inactiveCount,
    homeCount,
    categoriesCount: allCategories.length,
    categories: allCategories.map((c) => c.category),
  };

  return NextResponse.json(
    {
      success: true,
      projects: portfolios,
      total,
      page,
      limit,
      stats,
    },
    { headers: NO_CACHE_HEADERS }
  );
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_portfolio")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parseResult = portfolioItemSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const data = parseResult.data;
    const newProject = await createPortfolio({
      title: data.title,
      slug: data.slug,
      category: data.category,
      type: data.type,
      description: data.description,
      image: data.image,
      projectUrl: data.projectUrl,
      features: data.features,
      tags: data.tags,
      displayOrder: data.displayOrder,
      status: data.status,
      showOnHome: data.showOnHome,
      techStack: data.techStack,
      impactMetric: data.impactMetric,
      impactLabel: data.impactLabel,
    });

    // Revalidate frontend pages
    try {
      revalidatePath("/");
      revalidatePath("/portfolio");
      revalidatePath(`/portfolio/${newProject.slug}`);
      revalidatePath("/api/portfolio");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio project created successfully",
        project: newProject,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("POST /api/admin/portfolio error:", error);
    const isQuotaError = error.message?.includes("Only 4 portfolio projects");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create portfolio project" },
      { status: isQuotaError ? 400 : 500, headers: NO_CACHE_HEADERS }
    );
  }
}
