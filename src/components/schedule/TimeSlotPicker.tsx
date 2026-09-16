"use client";

import React, { useMemo } from "react";
import { generateTimeSlots, isTimeSlotPassed } from "@/lib/bookingUtils";
import { bookingConfig } from "@/config/bookingConfig";

interface TimeSlotPickerProps {
  selectedDate: string; // YYYY-MM-DD
  selectedTime: string;
  onSelectTime: (time: string) => void;
  error?: string;
}

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onSelectTime,
  error,
}: TimeSlotPickerProps) {
  const allSlots = useMemo(() => generateTimeSlots(), []);

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between mb-3 px-1">
        <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#CCFBF1]">
          Available Slots
        </h4>
        <span className="text-[11px] font-mono text-[#CCFBF1]/70">
          30-min duration
        </span>
      </div>

      {/* Grid of Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
        {allSlots.map((slot) => {
          const isSelected = selectedTime === slot;
          const isPassed = isTimeSlotPassed(selectedDate, slot);

          return (
            <button
              key={slot}
              type="button"
              disabled={isPassed}
              onClick={() => onSelectTime(slot)}
              aria-pressed={isSelected}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-center select-none ${
                isSelected
                  ? "bg-white text-emerald-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400 font-black scale-102"
                  : isPassed
                  ? "bg-white/[0.03] text-white/20 border border-white/[0.05] cursor-not-allowed"
                  : "bg-white/[0.06] hover:bg-white/[0.16] text-[#F0FDFA] border border-white/[0.12] hover:border-emerald-400/50 cursor-pointer active:scale-95"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-semibold mt-2 flex items-center gap-1.5">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Business Hours & Timezone Box */}
      <div className="mt-4 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[#CCFBF1]/80">
        <div className="flex items-center gap-2">
          {/* Clock Icon */}
          <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-white block">Available Mon – Sat</span>
            <span>9:00 AM – 7:00 PM</span>
          </div>
        </div>

        <div className="text-left sm:text-right font-mono text-[10px] text-[#CCFBF1]/60">
          {bookingConfig.timezoneLabel}
        </div>
      </div>
    </div>
  );
}
