import { NextResponse } from "next/server";
import { getPortfolios, getPortfolioBySlug } from "@/lib/admin/db";

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
        return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, project });
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

    return NextResponse.json({
      success: true,
      count: portfolios.length,
      total,
      page,
      limit,
      projects: portfolios,
    });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio projects" },
      { status: 500 }
    );
  }
}
