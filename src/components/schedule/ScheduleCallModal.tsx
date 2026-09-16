"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { useScheduleCall } from "./ScheduleCallContext";

const emptySubscribe = () => () => {};
import { BookingStepper } from "./BookingStepper";
import { DatePicker } from "./DatePicker";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { BookingDetailsForm } from "./BookingDetailsForm";
import { BookingReview } from "./BookingReview";
import { BookingSuccess } from "./BookingSuccess";

export function ScheduleCallModal() {
  const {
    isOpen,
    closeScheduleCall,
    currentStep,
    setCurrentStep,
    formData,
    updateFormField,
    errors,
    isSubmitting,
    confirmedBooking,
    resetBooking,
    submitBooking,
    validateStep1,
  } = useScheduleCall();

  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility: ESC to close & Focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeScheduleCall();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeScheduleCall]);

  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!isClient || !isOpen) return null;

  const handleStep1Continue = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleDone = () => {
    closeScheduleCall();
    setTimeout(() => {
      resetBooking();
    }, 300);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-call-title"
      aria-describedby="schedule-call-subtitle"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto select-none"
    >
      {/* 1. Backdrop Overlay */}
      <div
        onClick={closeScheduleCall}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        aria-hidden="true"
      />

      {/* 2. Glassmorphic Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[720px] max-h-[92vh] overflow-y-auto rounded-[24px] bg-zinc-950/92 border border-white/[0.22] backdrop-blur-2xl shadow-2xl shadow-emerald-950/70 ring-1 ring-emerald-500/25 p-5 sm:p-7 md:p-8 text-white z-10 custom-scrollbar animate-scale-up"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(16, 185, 129, 0.25)",
        }}
      >
        {/* Soft Ambient Radial Light inside Modal */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Modal Header Row */}
        <div className="relative flex items-start justify-between gap-4 pb-4 sm:pb-5 border-b border-white/[0.10]">
          <div className="flex items-start gap-3.5">
            {/* Emerald/Teal Glass Circle Icon */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#10B981] via-[#059669] to-[#0D9488] p-0.5 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/20">
              <div className="w-full h-full rounded-[14px] bg-zinc-950/40 flex items-center justify-center text-white">
                {/* Calendar & Video Icon */}
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
              </div>
            </div>

            <div>
              <h2
                id="schedule-call-title"
                className="text-xl sm:text-2xl font-black text-white tracking-tight"
              >
                Schedule a Call
              </h2>
              <p
                id="schedule-call-subtitle"
                className="text-xs sm:text-sm text-[#CCFBF1]/80 mt-0.5 max-w-md font-normal leading-relaxed"
              >
                Let’s discuss your project and find the right solution for your business.
              </p>
            </div>
          </div>

          {/* Close "×" Button */}
          <button
            type="button"
            onClick={closeScheduleCall}
            aria-label="Close booking modal"
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-200 border border-white/[0.15] hover:border-emerald-500 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step Indicator (Steps 1 to 3) */}
        {currentStep < 4 && (
          <div className="pt-4 pb-2">
            <BookingStepper currentStep={currentStep} onStepClick={setCurrentStep} />
          </div>
        )}

        {/* Step Contents */}
        <div className="pt-4">
          {/* STEP 01: Date & Time Picker */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Date Picker */}
                <div className="lg:col-span-7 bg-white/[0.04] p-4 sm:p-5 rounded-2xl border border-white/[0.10]">
                  <div className="mb-3">
                    <h3 className="text-sm sm:text-base font-black text-white">
                      Choose a Date
                    </h3>
                    <p className="text-xs text-[#CCFBF1]/70">
                      Select a convenient date for your call.
                    </p>
                  </div>
                  <DatePicker
                    selectedDate={formData.date}
                    onSelectDate={(d) => updateFormField("date", d)}
                    error={errors.date}
                  />
                </div>

                {/* Right Column: Time Slot Picker */}
                <div className="lg:col-span-5 bg-white/[0.04] p-4 sm:p-5 rounded-2xl border border-white/[0.10] flex flex-col justify-between">
                  <div>
                    <div className="mb-3">
                      <h3 className="text-sm sm:text-base font-black text-white">
                        Choose a Time
                      </h3>
                      <p className="text-xs text-[#CCFBF1]/70">
                        Select a suitable time for your call.
                      </p>
                    </div>
                    <TimeSlotPicker
                      selectedDate={formData.date}
                      selectedTime={formData.time}
                      onSelectTime={(t) => updateFormField("time", t)}
                      error={errors.time}
                    />
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!formData.date || !formData.time}
                  onClick={handleStep1Continue}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-full font-black text-sm sm:text-base text-emerald-950 bg-white hover:bg-[#F0FDFA] shadow-lg shadow-emerald-500/25 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                  <span>Continue</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 02: User Details Form */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="mb-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Your Details
                </h3>
                <p className="text-xs text-[#CCFBF1]/70">
                  Tell us how we can reach you for the call.
                </p>
              </div>

              <BookingDetailsForm
                formData={formData}
                errors={errors}
                onChangeField={updateFormField}
                onBack={() => setCurrentStep(1)}
                onContinue={() => setCurrentStep(3)}
              />
            </div>
          )}

          {/* STEP 03: Booking Review & Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="mb-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Review Your Call
                </h3>
                <p className="text-xs text-[#CCFBF1]/70">
                  Please verify your call appointment details before confirming.
                </p>
              </div>

              <BookingReview
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                onEditDetails={() => setCurrentStep(2)}
                onEditDateTime={() => setCurrentStep(1)}
                onConfirm={submitBooking}
              />
            </div>
          )}

          {/* STEP 04: Booking Success Screen */}
          {currentStep === 4 && confirmedBooking && (
            <BookingSuccess booking={confirmedBooking} onDone={handleDone} />
          )}
        </div>
      </div>
    </div>
  );
}
