import { NextResponse } from "next/server";
import { getPortfolios, getPortfolioBySlug } from "@/lib/admin/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || undefined;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const home = searchParams.get("home") === "true" || searchParams.get("featured") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = home ? 4 : parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    // Single item by slug
    if (slug) {
      const project = await getPortfolioBySlug(slug);
      if (!project || project.status !== "Active") {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404, headers: NO_CACHE_HEADERS }
        );
      }
      const sanitizedProject = {
        ...project,
        projectUrl: project.projectUrl?.startsWith("disabled:") ? null : project.projectUrl,
      };
      return NextResponse.json({ success: true, project: sanitizedProject }, { headers: NO_CACHE_HEADERS });
    }

    // Public endpoint strictly returns Active projects only.
    // When home=true, strictly returns only projects configured with showOnHome = true (up to 4 max).
    const { portfolios, total } = await getPortfolios({
      status: "Active",
      category,
      search,
      showOnHome: home ? true : undefined,
      limit: home ? 4 : limit,
      skip: home ? 0 : skip,
    });

    const sanitizedPortfolios = portfolios.map((p) => ({
      ...p,
      projectUrl: p.projectUrl?.startsWith("disabled:") ? null : p.projectUrl,
    }));

    return NextResponse.json(
      {
        success: true,
        count: sanitizedPortfolios.length,
        total,
        page,
        limit,
        projects: sanitizedPortfolios,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio projects" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
