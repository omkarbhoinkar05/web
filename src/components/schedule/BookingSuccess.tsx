"use client";

import React from "react";
import { ConfirmedBooking } from "@/types/booking";
import { formatDisplayDate, downloadIcsFile, generateWhatsAppUrl } from "@/lib/bookingUtils";

interface BookingSuccessProps {
  booking: ConfirmedBooking;
  onDone: () => void;
}

export function BookingSuccess({ booking, onDone }: BookingSuccessProps) {
  const handleDownloadIcs = () => {
    downloadIcsFile(booking);
  };

  const whatsappUrl = generateWhatsAppUrl(booking);

  return (
    <div className="w-full flex flex-col items-center text-center space-y-5 animate-fade-in py-2">
      {/* Animated Glowing Checkmark Icon */}
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#10B981] to-[#059669] flex items-center justify-center text-white shadow-xl shadow-emerald-500/40 border-2 border-emerald-300 ring-8 ring-emerald-500/20">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <div>
        <span className="text-[11px] font-mono font-black text-emerald-400 uppercase tracking-widest block mb-1">
          BOOKING CONFIRMED • {booking.bookingId}
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Call Scheduled Successfully!
        </h3>
        <p className="text-xs sm:text-sm text-[#CCFBF1]/80 mt-1.5 max-w-md mx-auto leading-relaxed">
          Your call has been scheduled. We look forward to speaking with you and discussing your project.
        </p>
      </div>

      {/* Booking Summary Card */}
      <div className="w-full rounded-2xl p-4 sm:p-5 bg-white/[0.06] border border-white/[0.14] text-left space-y-2.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <span className="text-[#CCFBF1]/70 font-medium">Date:</span>
          <span className="font-bold text-white text-right">{formatDisplayDate(booking.date)}</span>
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <span className="text-[#CCFBF1]/70 font-medium">Time:</span>
          <span className="font-bold text-emerald-300 text-right">{booking.time} (IST)</span>
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <span className="text-[#CCFBF1]/70 font-medium">Attendee:</span>
          <span className="font-bold text-white text-right">{booking.fullName}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#CCFBF1]/70 font-medium">Meeting:</span>
          <span className="font-medium text-[#CCFBF1] text-right">{booking.meetingType}</span>
        </div>
      </div>

      {/* Calendar Add Buttons */}
      <div className="w-full space-y-2.5 pt-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#CCFBF1]/70 block">
          Add to Your Calendar
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Google Calendar */}
          {booking.calendar?.googleUrl && (
            <a
              href={booking.calendar.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-[#F0FDFA] hover:text-white border border-white/[0.14] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>📅</span>
              <span>Google Cal</span>
            </a>
          )}

          {/* Outlook Calendar */}
          {booking.calendar?.outlookUrl && (
            <a
              href={booking.calendar.outlookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-[#F0FDFA] hover:text-white border border-white/[0.14] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>📆</span>
              <span>Outlook Cal</span>
            </a>
          )}

          {/* Download .ics */}
          <button
            type="button"
            onClick={handleDownloadIcs}
            className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-[#F0FDFA] hover:text-white border border-white/[0.14] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>💾</span>
            <span>Download .ics</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Assistance Option */}
      <div className="w-full pt-2 border-t border-white/[0.10] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-emerald-300 hover:text-white transition-colors font-bold"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Need help? Chat on WhatsApp (+91 99208 18481)</span>
        </a>

        {/* Done Button */}
        <button
          type="button"
          onClick={onDone}
          className="w-full sm:w-auto px-7 py-2.5 rounded-full font-black text-xs sm:text-sm text-emerald-950 bg-white hover:bg-[#F0FDFA] shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
        >
          Done ✓
        </button>
      </div>
    </div>
  );
}
