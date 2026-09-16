"use client";

import React, { useRef, useEffect } from "react";
import { BookingFormData, BookingFormErrors } from "@/types/booking";

interface BookingDetailsFormProps {
  formData: BookingFormData;
  errors: BookingFormErrors;
  onChangeField: (field: keyof BookingFormData, value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function BookingDetailsForm({
  formData,
  errors,
  onChangeField,
  onBack,
  onContinue,
}: BookingDetailsFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus first field when step 2 mounts
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col space-y-4">
      {/* 1. Full Name */}
      <div>
        <label
          htmlFor="booking-fullName"
          className="block text-xs font-extrabold uppercase tracking-wider text-[#CCFBF1] mb-1.5"
        >
          Full Name <span className="text-emerald-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#CCFBF1]/60">
            {/* User Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <input
            ref={nameInputRef}
            type="text"
            id="booking-fullName"
            name="fullName"
            value={formData.fullName}
            onChange={(e) => onChangeField("fullName", e.target.value)}
            placeholder="Enter your full name"
            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/40 bg-white/[0.08] border transition-all duration-200 focus:outline-none focus:bg-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 ${
              errors.fullName
                ? "border-rose-400 ring-1 ring-rose-400/30"
                : "border-white/[0.18] hover:border-white/[0.30]"
            }`}
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠</span> {errors.fullName}
          </p>
        )}
      </div>

      {/* 2. Mobile Number */}
      <div>
        <label
          htmlFor="booking-mobile"
          className="block text-xs font-extrabold uppercase tracking-wider text-[#CCFBF1] mb-1.5"
        >
          Mobile Number <span className="text-emerald-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#CCFBF1]/60">
            {/* Phone Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <input
            type="tel"
            id="booking-mobile"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={(e) => onChangeField("mobileNumber", e.target.value)}
            placeholder="Enter your 10-digit mobile number"
            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/40 bg-white/[0.08] border transition-all duration-200 focus:outline-none focus:bg-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 ${
              errors.mobileNumber
                ? "border-rose-400 ring-1 ring-rose-400/30"
                : "border-white/[0.18] hover:border-white/[0.30]"
            }`}
          />
        </div>
        {errors.mobileNumber && (
          <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠</span> {errors.mobileNumber}
          </p>
        )}
      </div>

      {/* 3. Email Address */}
      <div>
        <label
          htmlFor="booking-email"
          className="block text-xs font-extrabold uppercase tracking-wider text-[#CCFBF1] mb-1.5"
        >
          Email Address <span className="text-emerald-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#CCFBF1]/60">
            {/* Email Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <input
            type="email"
            id="booking-email"
            name="email"
            value={formData.email}
            onChange={(e) => onChangeField("email", e.target.value)}
            placeholder="Enter your email address"
            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/40 bg-white/[0.08] border transition-all duration-200 focus:outline-none focus:bg-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 ${
              errors.email
                ? "border-rose-400 ring-1 ring-rose-400/30"
                : "border-white/[0.18] hover:border-white/[0.30]"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠</span> {errors.email}
          </p>
        )}
      </div>

      {/* 4. Message (Optional) */}
      <div>
        <label
          htmlFor="booking-message"
          className="block text-xs font-extrabold uppercase tracking-wider text-[#CCFBF1] mb-1.5"
        >
          Message <span className="text-[#CCFBF1]/60 lowercase text-[10px] font-normal">(optional)</span>
        </label>
        <textarea
          id="booking-message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={(e) => onChangeField("message", e.target.value)}
          placeholder="Tell us briefly what you'd like to discuss..."
          className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/40 bg-white/[0.08] border border-white/[0.18] hover:border-white/[0.30] transition-all duration-200 focus:outline-none focus:bg-white/[0.12] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 resize-none"
        />
      </div>

      {/* Action Buttons: Back + Review Booking */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-[#CCFBF1] hover:text-white bg-white/[0.06] hover:bg-white/[0.15] border border-white/[0.15] transition-all duration-200 cursor-pointer"
        >
          ← Back
        </button>

        <button
          type="submit"
          className="flex-1 py-3.5 px-6 rounded-full text-xs sm:text-sm font-extrabold text-emerald-950 bg-white hover:bg-[#F0FDFA] shadow-lg shadow-emerald-500/25 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
        >
          <span>Review Booking</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
}
