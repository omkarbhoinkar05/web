import { BookingConfig } from "@/types/booking";

export const bookingConfig: BookingConfig = {
  workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday (0 is Sunday)
  startTime: "09:00",
  endTime: "19:00",
  slotDuration: 30, // 30-minute intervals
  timezone: "Asia/Kolkata",
  timezoneLabel: "All times are in IST (UTC+5:30)",
  companyName: "KeyCodeWeb",
  whatsappNumber: "919920818481",
  contactEmail: "dev.omkar05@gmail.com",
  meetingType: "Online Call (Google Meet) / Phone",
};
