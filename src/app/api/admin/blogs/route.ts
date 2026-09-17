import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getBlogPosts, createBlogPost } from "@/lib/admin/db";
import { blogPostSchema } from "@/lib/validations";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_blogs")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const category = searchParams.get("category") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const skip = (page - 1) * limit;

  const [{ posts, total }, totalAll, publishedCount, draftCount, viewsAggregate] =
    await Promise.all([
      getBlogPosts({ search, status, category, limit, skip }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: "Published" } }),
      prisma.blogPost.count({ where: { status: "Draft" } }),
      prisma.blogPost.aggregate({ _sum: { views: true } }),
    ]);

  const stats = {
    total: totalAll,
    published: publishedCount,
    drafts: draftCount,
    totalViews: viewsAggregate._sum.views || 0,
  };

  return NextResponse.json({
    success: true,
    posts,
    total,
    page,
    limit,
    stats,
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_blogs")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parseResult = blogPostSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const newPost = await createBlogPost({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      category: data.category,
      readTime: data.readTime,
      author: data.author || session.name,
      tags: data.tags,
      status: data.status,
    });

    return NextResponse.json({
      success: true,
      message: "Blog post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("POST /api/admin/blogs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
