import { NextResponse } from "next/server";
import { getBlogPostBySlug, incrementBlogViews } from "@/lib/admin/db";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post || post.status !== "Published") {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    // Increment view count asynchronously
    incrementBlogViews(slug).catch(() => {});

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        views: post.views + 1,
      },
    });
  } catch (error) {
    console.error("GET /api/blogs/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load article" },
      { status: 500 }
    );
  }
}
