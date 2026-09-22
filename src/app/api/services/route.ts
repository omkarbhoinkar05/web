import { NextResponse } from "next/server";
import { getServices, getServiceBySlug } from "@/lib/admin/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || undefined;
    const search = searchParams.get("search") || undefined;

    // Single item by slug
    if (slug) {
      const service = await getServiceBySlug(slug);
      if (!service || service.status !== "Active") {
        return NextResponse.json(
          { success: false, error: "Service not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, service });
    }

    // Public endpoint strictly returns Active services only, ordered by displayOrder asc
    const { services, total } = await getServices({
      status: "Active",
      search,
    });

    return NextResponse.json({
      success: true,
      count: services.length,
      total,
      services,
    });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
