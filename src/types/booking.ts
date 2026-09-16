export type BookingStep = 1 | 2 | 3 | 4; // 1: Date & Time, 2: Details, 3: Review, 4: Success

export interface BookingConfig {
  workingDays: number[]; // 0: Sun, 1: Mon, ... 6: Sat
  startTime: string; // "09:00"
  endTime: string; // "19:00"
  slotDuration: number; // in minutes (30)
  timezone: string; // "Asia/Kolkata"
  timezoneLabel: string; // "IST (India Standard Time) • UTC+5:30"
  companyName: string;
  whatsappNumber: string;
  contactEmail: string;
  meetingType: string;
}

export interface BookingFormData {
  date: string; // YYYY-MM-DD
  time: string; // "04:00 PM"
  timezone: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  message: string;
  meetingType: string;
}

export interface BookingFormErrors {
  date?: string;
  time?: string;
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  message?: string;
}

export interface ConfirmedBooking extends BookingFormData {
  bookingId: string;
  createdAt: string;
  calendar?: {
    googleUrl: string;
    outlookUrl: string;
    icsData: string;
  };
}
