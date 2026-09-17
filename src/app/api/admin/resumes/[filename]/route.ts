import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ filename: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return new NextResponse("Unauthorized. Admin authentication required to access candidate resumes.", {
      status: 401,
    });
  }

  // Enforce RBAC: HR, Admin, and Super Admin only
  if (!hasPermission(session.role, "download_resumes")) {
    return new NextResponse("Forbidden: Access restricted to HR and Administrators.", {
      status: 403,
    });
  }

  const { filename } = await params;
  const decodedFilename = decodeURIComponent(filename);
  const safeFilename = path.basename(decodedFilename);
  const resumesDir = path.join(process.cwd(), "data", "resumes");

  let targetFilePath: string | null = null;
  let originalDisplayName: string = safeFilename;
  let mimeType: string | null = null;

  // 1. Direct path check in data/resumes
  const directPath = path.join(resumesDir, safeFilename);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    targetFilePath = directPath;
  }

  // 2. Query Prisma database to find the application record
  if (!targetFilePath) {
    try {
      const appRecord = await prisma.careerApplication.findFirst({
        where: {
          OR: [
            { resumeFileName: safeFilename },
            { id: safeFilename },
            { applicationId: safeFilename },
            { resumeFilePath: { endsWith: safeFilename } },
          ],
        },
      });

      if (appRecord) {
        originalDisplayName = appRecord.resumeFileName || safeFilename;
        mimeType = appRecord.resumeMimeType;

        // Check if appRecord.resumeFilePath exists
        if (appRecord.resumeFilePath && fs.existsSync(appRecord.resumeFilePath)) {
          targetFilePath = appRecord.resumeFilePath;
        } else if (appRecord.resumeFilePath) {
          const baseNameInDb = path.basename(appRecord.resumeFilePath);
          const candidatePath = path.join(resumesDir, baseNameInDb);
          if (fs.existsSync(candidatePath)) {
            targetFilePath = candidatePath;
          }
        }
      }
    } catch (dbErr) {
      console.error("Database lookup error for resume:", dbErr);
    }
  }

  // 3. Fallback: Search data/resumes directory for any file ending with the filename
  if (!targetFilePath && fs.existsSync(resumesDir)) {
    const files = fs.readdirSync(resumesDir);
    const matched = files.find(
      (f) => f === safeFilename || f.endsWith(`-${safeFilename}`) || f.includes(safeFilename)
    );
    if (matched) {
      targetFilePath = path.join(resumesDir, matched);
    }
  }

  // If found real file on disk, serve it with proper headers
  if (targetFilePath && fs.existsSync(/*turbopackIgnore: true*/ targetFilePath)) {
    const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ targetFilePath);
    const ext = path.extname(originalDisplayName || targetFilePath).toLowerCase();

    let contentType = mimeType || "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".doc") contentType = "application/msword";
    else if (ext === ".docx") {
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    const safeHeaderName = originalDisplayName.replace(/["\r\n]/g, "_");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${safeHeaderName}"; filename*=UTF-8''${encodeURIComponent(originalDisplayName)}`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  }

  // 4. File genuinely not found
  return new NextResponse(
    `Resume file "${safeFilename}" not found on server. Please ask the applicant to re-upload.`,
    {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    }
  );
}
