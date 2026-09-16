"use client";

import React from "react";
import { BookingStep } from "@/types/booking";

interface BookingStepperProps {
  currentStep: BookingStep;
  onStepClick?: (step: BookingStep) => void;
}

const steps = [
  { step: 1 as BookingStep, number: "01", label: "Date & Time" },
  { step: 2 as BookingStep, number: "02", label: "Your Details" },
  { step: 3 as BookingStep, number: "03", label: "Confirm" },
];

export function BookingStepper({ currentStep, onStepClick }: BookingStepperProps) {
  // If in success step (4), do not render stepper
  if (currentStep === 4) return null;

  return (
    <nav aria-label="Booking Progress" className="w-full">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-white/[0.05] border border-white/[0.12] backdrop-blur-md">
        {steps.map((item) => {
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          const isClickable = onStepClick && isCompleted;

          return (
            <button
              key={item.step}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(item.step)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 select-none ${
                isActive
                  ? "bg-white text-emerald-950 shadow-md shadow-emerald-950/20"
                  : isCompleted
                  ? "bg-emerald-500/20 text-[#CCFBF1] hover:bg-emerald-500/30 cursor-pointer"
                  : "bg-transparent text-[#CCFBF1]/50 cursor-default"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={`text-[10px] sm:text-xs font-mono font-black ${
                  isActive ? "text-emerald-700" : isCompleted ? "text-emerald-400" : "text-emerald-300/40"
                }`}
              >
                {item.number}
              </span>
              <span className="truncate hidden xs:inline">{item.label}</span>
              {isCompleted && (
                <span className="text-[11px] text-emerald-400 font-bold ml-0.5">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
