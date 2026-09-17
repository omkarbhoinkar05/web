import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/admin/db";
import { blogPostSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_blogs")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, post });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_blogs")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const parseResult = blogPostSchema.partial().safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updateBlogPost(id, parseResult.data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully",
      post: updated,
    });
  } catch (error) {
    console.error("PUT /api/admin/blogs/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_blogs")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const success = await deleteBlogPost(id);

    if (!success) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/blogs/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
