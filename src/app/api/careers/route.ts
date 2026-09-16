import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createCareerApplication } from "@/lib/admin/db";

function sanitizeText(str: string): string {
  return str.replace(/[<>]/g, "").trim();
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .substring(0, 100);
}

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream", // Some browsers report octet-stream for docx
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullName = sanitizeText((formData.get("fullName") as string) || "");
    const mobile = ((formData.get("mobile") as string) || "").replace(/[\s-]/g, "").trim();
    const email = sanitizeText((formData.get("email") as string) || "");
    const message = sanitizeText((formData.get("message") as string) || "");
    const resumeFile = formData.get("resume") as File | null;

    const errors: Record<string, string> = {};

    // 1. Full Name Validation
    if (!fullName || fullName.length < 2) {
      errors.fullName = "Please enter your full name (minimum 2 characters).";
    }

    // 2. Mobile Validation
    const mobileRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!mobile) {
      errors.mobile = "Please enter your mobile number.";
    } else if (!mobileRegex.test(mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    // 3. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    // 4. Message Validation
    if (!message || message.length < 10) {
      errors.message = "Please enter at least 10 characters introducing yourself.";
    }

    // 5. Resume File Security Validation
    if (!resumeFile || typeof resumeFile === "string") {
      errors.resume = "Please attach your resume file.";
    } else {
      const sanitizedName = sanitizeFilename(resumeFile.name);
      const extMatch = sanitizedName.lastIndexOf(".");
      const extension = extMatch !== -1 ? sanitizedName.substring(extMatch).toLowerCase() : "";

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        errors.resume = "Invalid file type. Only PDF, DOC, or DOCX files are permitted.";
      } else if (!ALLOWED_MIME_TYPES.includes(resumeFile.type) && resumeFile.type !== "") {
        errors.resume = "Invalid MIME format. Please upload a verified PDF or Word document.";
      } else if (resumeFile.size > MAX_FILE_SIZE) {
        errors.resume = "File size exceeds the 5 MB limit. Please compress or select a smaller file.";
      } else if (resumeFile.size === 0) {
        errors.resume = "The uploaded file appears to be empty.";
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Securely persist resume file to non-public data/resumes directory
    const resumesDir = path.join(process.cwd(), "data", "resumes");
    if (!fs.existsSync(resumesDir)) {
      fs.mkdirSync(resumesDir, { recursive: true });
    }

    const safeName = sanitizeFilename(resumeFile!.name);
    const storageFileName = `${Date.now()}-${safeName}`;
    const storageFilePath = path.join(resumesDir, storageFileName);

    const arrayBuffer = await resumeFile!.arrayBuffer();
    fs.writeFileSync(storageFilePath, Buffer.from(arrayBuffer));

    // Save into HighTechBirds Admin Database
    const appRecord = await createCareerApplication({
      applicantName: fullName,
      email,
      mobile,
      resumeFileName: safeName,
      resumeFilePath: storageFilePath,
      resumeSizeBytes: resumeFile!.size,
      resumeMimeType: resumeFile!.type || "application/pdf",
      message,
    });

    return NextResponse.json(
      {
        success: true,
        applicationId: appRecord.applicationId,
        message: "Your application has been received successfully! Our talent acquisition team will review your profile.",
        candidate: {
          fullName,
          email,
          mobile,
          resumeFileName: safeName,
          resumeSizeBytes: resumeFile!.size,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process candidate application. Please try again.",
      },
      { status: 500 }
    );
  }
}
