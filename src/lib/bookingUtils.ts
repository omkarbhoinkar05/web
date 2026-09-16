import { bookingConfig } from "@/config/bookingConfig";
import { ConfirmedBooking } from "@/types/booking";

/**
 * Generates available 30-minute time slots between startTime and endTime
 */
export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = bookingConfig.startTime.split(":").map(Number);
  const [endHour, endMin] = bookingConfig.endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes < endMinutes) {
    const hours24 = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

    const formattedTime = `${hours12.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${period}`;
    slots.push(formattedTime);

    currentMinutes += bookingConfig.slotDuration;
  }

  return slots;
}

/**
 * Checks if a given date is selectable (not in the past and is a working day)
 */
export function isDateSelectable(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  if (checkDate < today) {
    return false;
  }

  const dayOfWeek = checkDate.getDay();
  return bookingConfig.workingDays.includes(dayOfWeek);
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats YYYY-MM-DD to human readable string (e.g., "Monday, 21 September 2026")
 */
export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Parse time string like "04:00 PM" into 24-hour hour & minute
 */
function parseTime12to24(timeStr: string): { hour: number; minute: number } {
  const [timePart, modifier] = timeStr.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours < 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return { hour: hours, minute: minutes };
}

/**
 * Checks if a specific time slot on a date has already elapsed today
 */
export function isTimeSlotPassed(isoDate: string, timeStr: string): boolean {
  const todayIso = formatDateToIso(new Date());
  if (isoDate !== todayIso) return false;

  const now = new Date();
  const { hour, minute } = parseTime12to24(timeStr);

  const slotDate = new Date();
  slotDate.setHours(hour, minute, 0, 0);

  return slotDate <= now;
}

/**
 * Formats ISO string for Calendar events (e.g. 20260921T103000Z)
 */
function getUtcTimestamps(isoDate: string, timeStr: string): { startUtc: string; endUtc: string } {
  const [year, month, day] = isoDate.split("-").map(Number);
  const { hour, minute } = parseTime12to24(timeStr);

  // Note: App is in IST (UTC+5:30)
  // Construct Date in local context then convert to UTC ISO string
  const startDate = new Date(year, month - 1, day, hour, minute);
  const endDate = new Date(startDate.getTime() + bookingConfig.slotDuration * 60 * 1000);

  const formatUtc = (d: Date) =>
    d
      .toISOString()
      .replace(/-|:|\.\d+/g, "")
      .slice(0, 15) + "Z";

  return {
    startUtc: formatUtc(startDate),
    endUtc: formatUtc(endDate),
  };
}

/**
 * Generates Google Calendar Web link
 */
export function generateGoogleCalendarUrl(booking: ConfirmedBooking): string {
  const { startUtc, endUtc } = getUtcTimestamps(booking.date, booking.time);
  const title = encodeURIComponent(`${bookingConfig.companyName} Project Discussion Call`);
  const details = encodeURIComponent(
    `Call scheduled with ${booking.fullName} (${booking.mobileNumber}, ${booking.email}).\n` +
      `Meeting Type: ${booking.meetingType}\n` +
      (booking.message ? `Notes: ${booking.message}\n` : "") +
      `Booking ID: ${booking.bookingId}`
  );
  const location = encodeURIComponent("Online Call (Google Meet)");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;
}

/**
 * Generates Outlook Live Calendar link
 */
export function generateOutlookCalendarUrl(booking: ConfirmedBooking): string {
  const { startUtc, endUtc } = getUtcTimestamps(booking.date, booking.time);
  const title = encodeURIComponent(`${bookingConfig.companyName} Project Discussion Call`);
  const details = encodeURIComponent(
    `Call scheduled with ${booking.fullName} (${booking.mobileNumber}, ${booking.email}).\n` +
      `Meeting Type: ${booking.meetingType}\n` +
      `Booking ID: ${booking.bookingId}`
  );
  const location = encodeURIComponent("Online Call");

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startUtc}&enddt=${endUtc}&body=${details}&location=${location}`;
}

/**
 * Generates standard RFC 5545 .ics Calendar event string
 */
export function generateIcsFileContent(booking: ConfirmedBooking): string {
  const { startUtc, endUtc } = getUtcTimestamps(booking.date, booking.time);
  const nowUtc = new Date().toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15) + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PixelForge//Schedule Call Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${booking.bookingId}@pixelforge.design`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${bookingConfig.companyName} Project Discussion Call`,
    `DESCRIPTION:Project Discussion with ${booking.fullName} (${booking.mobileNumber}). Booking ID: ${booking.bookingId}`,
    "LOCATION:Online Call",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Triggers a browser download of the .ics file
 */
export function downloadIcsFile(booking: ConfirmedBooking) {
  if (typeof window === "undefined") return;

  const icsContent = generateIcsFileContent(booking);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `pixelforge-call-${booking.bookingId}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generates direct WhatsApp confirmation message URL
 */
export function generateWhatsAppUrl(booking: ConfirmedBooking): string {
  const text = encodeURIComponent(
    `Hello ${bookingConfig.companyName}, I have scheduled a call on ${formatDisplayDate(booking.date)} at ${booking.time} (IST). My booking ID is ${booking.bookingId}.`
  );
  return `https://wa.me/${bookingConfig.whatsappNumber}?text=${text}`;
}
