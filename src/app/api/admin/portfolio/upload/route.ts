import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .substring(0, 80);
}

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_portfolio")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "Please provide an image file to upload." },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeFilename(file.name);
    const extMatch = sanitizedName.lastIndexOf(".");
    const extension = extMatch !== -1 ? sanitizedName.substring(extMatch).toLowerCase() : "";

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only PNG, JPG, JPEG, WebP, SVG, and GIF are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid image format detected." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds the 5 MB limit. Please choose a smaller image." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: "The uploaded image file is empty." },
        { status: 400 }
      );
    }

    // Target upload directory in public/uploads/portfolio/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "portfolio");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFileName = `portfolio_${Date.now()}_${sanitizedName}`;
    const storagePath = path.join(uploadDir, uniqueFileName);

    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(storagePath, Buffer.from(arrayBuffer));

    const publicUrl = `/uploads/portfolio/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFileName,
    });
  } catch (error: any) {
    console.error("POST /api/admin/portfolio/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
