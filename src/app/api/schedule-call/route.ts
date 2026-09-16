import { NextResponse } from "next/server";
import { BookingFormData, ConfirmedBooking } from "@/types/booking";
import { bookingConfig } from "@/config/bookingConfig";
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateIcsFileContent,
} from "@/lib/bookingUtils";
import { createScheduledCall } from "@/lib/admin/db";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`schedule-call:${ip}`, 5, 30 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many booking requests from your network. Please wait ${rateCheck.retryAfterSec} seconds before scheduling another call.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateCheck.retryAfterSec.toString(),
          },
        }
      );
    }

    const body: BookingFormData = await request.json();

    const errors: Record<string, string> = {};

    // 1. Date Validation
    if (!body.date) {
      errors.date = "Please select a date.";
    }

    // 2. Time Validation
    if (!body.time) {
      errors.time = "Please select a time.";
    }

    // 3. Name Validation
    if (!body.fullName || body.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name (minimum 2 characters).";
    }

    // 4. Mobile Number Validation (Indian 10-digit mobile)
    const cleanedMobile = (body.mobileNumber || "").replace(/[\s-]/g, "");
    const mobileRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!cleanedMobile) {
      errors.mobileNumber = "Please enter your mobile number.";
    } else if (!mobileRegex.test(cleanedMobile)) {
      errors.mobileNumber = "Please enter a valid 10-digit mobile number.";
    }

    // 5. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Generate unique booking identifier
    const bookingId = `PF-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmedBooking: ConfirmedBooking = {
      ...body,
      bookingId,
      timezone: body.timezone || bookingConfig.timezone,
      meetingType: body.meetingType || bookingConfig.meetingType,
      createdAt: new Date().toISOString(),
    };

    // Attach Calendar Links
    confirmedBooking.calendar = {
      googleUrl: generateGoogleCalendarUrl(confirmedBooking),
      outlookUrl: generateOutlookCalendarUrl(confirmedBooking),
      icsData: generateIcsFileContent(confirmedBooking),
    };

    // Auto-save to HighTechBirds CRM & Admin store
    const { call, lead } = await createScheduledCall({
      fullName: confirmedBooking.fullName,
      email: confirmedBooking.email,
      mobile: confirmedBooking.mobileNumber,
      service: confirmedBooking.meetingType || "Web Consultation",
      date: confirmedBooking.date,
      time: confirmedBooking.time,
      timezone: confirmedBooking.timezone,
      notes: confirmedBooking.message,
    });

    return NextResponse.json(
      {
        success: true,
        callId: call.callId,
        leadId: lead.leadId,
        message: "Call scheduled successfully",
        booking: confirmedBooking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Schedule Call API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error. Please try again." },
      { status: 500 }
    );
  }
}
