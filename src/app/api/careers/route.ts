import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createCareerApplication } from "@/lib/admin/db";
import { careerSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

function sanitizeFilename(filename: string): string {
  const base = path.basename(filename);
  return base
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .substring(0, 100);
}

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`careers:${ip}`, 5, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many job applications submitted. Please try again in ${rateCheck.retryAfterSec} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateCheck.retryAfterSec.toString(),
          },
        }
      );
    }

    const formData = await request.formData();

    const rawData = {
      fullName: (formData.get("fullName") as string) || "",
      mobile: (formData.get("mobile") as string) || "",
      email: (formData.get("email") as string) || "",
      message: (formData.get("message") as string) || "",
    };

    const parseResult = careerSchema.safeParse(rawData);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, mobile, email, message } = parseResult.data;
    const resumeFile = formData.get("resume") as File | null;

    // Validate Resume File
    if (!resumeFile || typeof resumeFile === "string") {
      return NextResponse.json(
        { success: false, errors: { resume: "Please attach your resume file." } },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeFilename(resumeFile.name);
    const extMatch = sanitizedName.lastIndexOf(".");
    const extension = extMatch !== -1 ? sanitizedName.substring(extMatch).toLowerCase() : "";

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { success: false, errors: { resume: "Invalid file type. Only PDF, DOC, or DOCX files are permitted." } },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(resumeFile.type) && resumeFile.type !== "") {
      return NextResponse.json(
        { success: false, errors: { resume: "Invalid file format. Please upload a verified PDF or Word document." } },
        { status: 400 }
      );
    }

    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, errors: { resume: "File size exceeds the 5 MB limit. Please compress or select a smaller file." } },
        { status: 400 }
      );
    }

    if (resumeFile.size === 0) {
      return NextResponse.json(
        { success: false, errors: { resume: "The uploaded file appears to be empty." } },
        { status: 400 }
      );
    }

    // Securely persist resume file to non-public data/resumes directory
    const resumesDir = path.join(process.cwd(), "data", "resumes");
    if (!fs.existsSync(resumesDir)) {
      fs.mkdirSync(resumesDir, { recursive: true });
    }

    const storageFileName = `${Date.now()}-${sanitizedName}`;
    const storageFilePath = path.join(resumesDir, storageFileName);

    const arrayBuffer = await resumeFile.arrayBuffer();
    fs.writeFileSync(storageFilePath, Buffer.from(arrayBuffer));

    // Save into MySQL 'web' database via Prisma
    const appRecord = await createCareerApplication({
      applicantName: fullName,
      email,
      mobile,
      resumeFileName: sanitizedName,
      resumeFilePath: storageFilePath,
      resumeSizeBytes: resumeFile.size,
      resumeMimeType: resumeFile.type || "application/pdf",
      message,
    });

    return NextResponse.json(
      {
        success: true,
        applicationId: appRecord.applicationId,
        message:
          "Your application has been received successfully! Our talent acquisition team will review your profile.",
        candidate: {
          fullName,
          email,
          mobile,
          resumeFileName: sanitizedName,
          resumeSizeBytes: resumeFile.size,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Careers API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process candidate application. Please try again.",
      },
      { status: 500 }
    );
  }
}
