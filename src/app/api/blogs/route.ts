import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/admin/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    // Public endpoint strictly returns Published posts only
    const { posts, total } = await getBlogPosts({
      status: "Published",
      search,
      category,
      limit,
      skip,
    });

    return NextResponse.json({
      success: true,
      count: posts.length,
      total,
      page,
      limit,
      posts,
    });
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
