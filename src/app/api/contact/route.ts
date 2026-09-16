import { NextResponse } from "next/server";
import { createContactEnquiry } from "@/lib/admin/db";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

interface ContactPayload {
  fullName?: string;
  service?: string;
  email?: string;
  mobile?: string;
  message?: string;
  budget?: string;
}

function sanitizeText(str: string): string {
  return str.replace(/[<>]/g, "").trim();
}

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

    const body: ContactPayload = await request.json();

    const fullName = sanitizeText(body.fullName || "");
    const service = sanitizeText(body.service || "");
    const email = sanitizeText(body.email || "");
    const mobile = (body.mobile || "").replace(/[\s-]/g, "").trim();
    const message = sanitizeText(body.message || "");
    const budget = sanitizeText(body.budget || "");

    const errors: Record<string, string> = {};

    // 1. Full Name Validation
    if (!fullName || fullName.length < 2) {
      errors.fullName = "Full name is required (minimum 2 characters).";
    }

    // 2. Service Validation
    if (!service) {
      errors.service = "Please select a service.";
    }

    // 3. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    // 4. Mobile Validation (Indian 10-digit mobile number)
    const mobileRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    // 5. Message Validation
    if (!message || message.length < 10) {
      errors.message = "Message must be at least 10 characters describing your inquiry.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Auto-save to HighTechBirds CRM & Admin store
    const { enquiry, lead } = await createContactEnquiry({
      fullName,
      email,
      mobile,
      service,
      budget: budget || "Not specified",
      message,
      source: "Website Contact Form",
    });

    return NextResponse.json(
      {
        success: true,
        inquiryId: enquiry.enquiryId,
        leadId: lead.leadId,
        message: "Thank you! Your inquiry has been received. Our team will get in touch within 24 hours.",
        data: {
          fullName,
          service,
          email,
          mobile,
          budget: budget || "Not specified",
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process inquiry. Please try again or reach us via WhatsApp.",
      },
      { status: 500 }
    );
  }
}
