import { NextResponse } from "next/server";
import { BookingFormData, ConfirmedBooking } from "@/types/booking";
import { bookingConfig } from "@/config/bookingConfig";
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateIcsFileContent,
} from "@/lib/bookingUtils";

export async function POST(request: Request) {
  try {
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

    // Log confirmed appointment for operations
    console.log("[PixelForge Appointment Confirmed]:", {
      bookingId,
      date: confirmedBooking.date,
      time: confirmedBooking.time,
      name: confirmedBooking.fullName,
      mobile: confirmedBooking.mobileNumber,
      email: confirmedBooking.email,
    });

    return NextResponse.json(
      {
        success: true,
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
