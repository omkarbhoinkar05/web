"use client";

import React from "react";
import { BookingFormData, BookingFormErrors } from "@/types/booking";
import { formatDisplayDate } from "@/lib/bookingUtils";
import { bookingConfig } from "@/config/bookingConfig";

interface BookingReviewProps {
  formData: BookingFormData;
  errors: BookingFormErrors;
  isSubmitting: boolean;
  onEditDetails: () => void;
  onEditDateTime: () => void;
  onConfirm: () => void;
}

export function BookingReview({
  formData,
  errors,
  isSubmitting,
  onEditDetails,
  onEditDateTime,
  onConfirm,
}: BookingReviewProps) {
  return (
    <div className="w-full flex flex-col space-y-5">
      {/* Summary Card */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white/[0.06] border border-white/[0.14] backdrop-blur-md space-y-4">
        {/* Date & Time Header Row */}
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.10]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#CCFBF1]/70 block">
              Call Schedule
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base sm:text-lg font-black text-white">
                {formatDisplayDate(formData.date)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-emerald-300 font-bold">
              <span>🕐 {formData.time}</span>
              <span>•</span>
              <span className="text-[#CCFBF1]/70 font-normal">{bookingConfig.timezoneLabel}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditDateTime}
            className="text-xs font-bold text-[#CCFBF1] hover:text-white underline px-2 py-1 rounded hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
          >
            Change
          </button>
        </div>

        {/* Contact Details Row */}
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.10]">
          <div className="space-y-1 text-xs sm:text-sm">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#CCFBF1]/70 block mb-1.5">
              Your Information
            </span>
            <div className="flex items-center gap-2 text-white font-bold">
              <span className="text-[#CCFBF1]">👤</span>
              <span>{formData.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-[#CCFBF1]">📱</span>
              <span>{formData.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-[#CCFBF1]">✉</span>
              <span className="truncate max-w-[220px] sm:max-w-[320px]">{formData.email}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditDetails}
            className="text-xs font-bold text-[#CCFBF1] hover:text-white underline px-2 py-1 rounded hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
          >
            Edit
          </button>
        </div>

        {/* Meeting Type & Platform */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#CCFBF1]">
            <span>🌐</span>
            <span className="font-medium text-white">{formData.meetingType}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Confirmed via Link
          </span>
        </div>

        {/* Optional Notes / Message Preview */}
        {formData.message && (
          <div className="pt-2 border-t border-white/[0.08] text-xs text-[#CCFBF1]/80 italic">
            <span className="font-bold text-white not-italic block mb-0.5">Discussion Topic:</span>
            &ldquo;{formData.message}&rdquo;
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errors.message && (
        <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
          <span>⚠</span>
          <span>{errors.message}</span>
        </div>
      )}

      {/* Confirm CTA Button */}
      <div className="pt-1">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onConfirm}
          className="w-full py-4 px-6 rounded-full font-black text-sm sm:text-base text-emerald-950 bg-white hover:bg-emerald-500 hover:text-white shadow-xl shadow-emerald-500/30 active:scale-98 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5 text-emerald-950" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Scheduling Your Call...</span>
            </>
          ) : (
            <>
              <span>Confirm &amp; Schedule Call</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-[#CCFBF1]/60 mt-2.5 flex items-center justify-center gap-1.5">
          <span>🔒</span>
          <span>No payment required • 100% free consultation call</span>
        </p>
      </div>
    </div>
  );
}
