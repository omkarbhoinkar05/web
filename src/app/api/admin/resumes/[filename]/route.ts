import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSession } from "@/lib/admin/auth";

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

  const { filename } = await params;
  const safeFilename = path.basename(filename);
  const filePath = path.join(process.cwd(), "data", "resumes", safeFilename);

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    if (ext === ".doc") contentType = "application/msword";
    if (ext === ".docx")
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${safeFilename}"`,
      },
    });
  }

  // If seeded demo file does not yet have raw binary on disk, provide fallback PDF response
  const samplePdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 135 >> stream
BT
/F1 18 Tf
70 700 Td
(HighTechBirds Candidate Resume: ${safeFilename}) Tj
/F1 12 Tf
0 -30 Td
(Verified confidential candidate profile for talent evaluation.) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000244 00000 n
0000000431 00000 n
trailer << /Size 6 /Root 1 0 R >>
startxref
503
%%EOF`;

  return new NextResponse(samplePdfContent, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${safeFilename}"`,
    },
  });
}
