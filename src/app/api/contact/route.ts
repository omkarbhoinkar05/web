import { NextResponse } from "next/server";
import { createContactEnquiry } from "@/lib/admin/db";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions from your network. Please wait ${rateCheck.retryAfterSec} seconds before sending another inquiry.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateCheck.retryAfterSec.toString(),
          },
        }
      );
    }

    const body = await request.json();

    const parseResult = contactSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, mobile, service, budget, message } = parseResult.data;

    // Persist to MySQL database 'web' via Prisma
    const { enquiry, lead } = await createContactEnquiry({
      fullName,
      email,
      mobile,
      service,
      budget,
      message,
      source: "Website Contact Form",
    });

    return NextResponse.json(
      {
        success: true,
        inquiryId: enquiry.enquiryId,
        leadId: lead.leadId,
        message:
          "Thank you! Your inquiry has been received. Our team will get in touch within 24 hours.",
        data: {
          fullName,
          service,
          email,
          mobile,
          budget,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process inquiry at this moment. Please try again later.",
      },
      { status: 500 }
    );
  }
}
