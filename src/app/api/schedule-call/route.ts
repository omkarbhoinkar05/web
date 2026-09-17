import { NextResponse } from "next/server";
import { ConfirmedBooking } from "@/types/booking";
import { bookingConfig } from "@/config/bookingConfig";
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateIcsFileContent,
} from "@/lib/bookingUtils";
import { createScheduledCall } from "@/lib/admin/db";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { scheduleCallSchema } from "@/lib/validations";
import prisma from "@/lib/prisma";

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

    const body = await request.json();

    const parseResult = scheduleCallSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validated = parseResult.data;

    // Check Slot Availability (Prevent duplicate bookings for the exact same slot)
    const existingSlot = await prisma.scheduledCall.findFirst({
      where: {
        date: validated.date,
        time: validated.time,
        status: { in: ["Confirmed", "Pending"] },
      },
    });

    if (existingSlot) {
      return NextResponse.json(
        {
          success: false,
          error: "This time slot has just been booked by another client. Please select another slot.",
          fieldErrors: {
            time: "Time slot unavailable. Please pick a different time.",
          },
        },
        { status: 409 }
      );
    }

    // Generate unique booking identifier
    const bookingId = `PF-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmedBooking: ConfirmedBooking = {
      fullName: validated.fullName,
      email: validated.email,
      mobileNumber: validated.mobileNumber,
      date: validated.date,
      time: validated.time,
      meetingType: validated.meetingType || "Video Call (Google Meet)",
      timezone: validated.timezone || "IST (GMT+5:30)",
      message: validated.message || "",
      bookingId,
      createdAt: new Date().toISOString(),
    };

    // Attach Calendar Links
    confirmedBooking.calendar = {
      googleUrl: generateGoogleCalendarUrl(confirmedBooking),
      outlookUrl: generateOutlookCalendarUrl(confirmedBooking),
      icsData: generateIcsFileContent(confirmedBooking),
    };

    // Persist to MySQL database 'web' via Prisma
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
