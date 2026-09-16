"use client";

import React, { useState } from "react";
import { isDateSelectable, formatDateToIso } from "@/lib/bookingUtils";

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (isoDate: string) => void;
  error?: string;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DatePicker({ selectedDate, onSelectDate, error }: DatePickerProps) {
  // Initialize view month based on selectedDate or today
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  const today = new Date();
  const isCurrentMonth =
    currentMonthDate.getFullYear() === today.getFullYear() &&
    currentMonthDate.getMonth() === today.getMonth();

  const handlePrevMonth = () => {
    if (isCurrentMonth) return; // Prevent navigating to past months
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    // Allow navigating up to 3 months ahead
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (currentMonthDate < maxDate) {
      setCurrentMonthDate(
        new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
      );
    }
  };

  // Generate calendar days
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthName = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun, 1 is Mon
  // Shift Sunday (0) to index 6 for Mon-first layout
  const startingDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  // Empty slots before 1st of month
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  // Month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  const todayIso = formatDateToIso(today);

  return (
    <div className="w-full flex flex-col">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
          {monthName}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isCurrentMonth}
            aria-label="Previous month"
            className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-[#CCFBF1] disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 border border-white/[0.12]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-[#CCFBF1] flex items-center justify-center transition-all duration-200 border border-white/[0.12]"
          >
            ›
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {WEEKDAYS.map((wd, idx) => (
          <span
            key={idx}
            className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#CCFBF1]/60 py-1"
          >
            {wd}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5" role="grid" aria-label="Calendar grid">
        {days.map((dateObj, idx) => {
          if (!dateObj) {
            return <div key={`empty-${idx}`} className="h-9 sm:h-10" />;
          }

          const iso = formatDateToIso(dateObj);
          const isSelected = selectedDate === iso;
          const isToday = todayIso === iso;
          const isSelectable = isDateSelectable(dateObj);

          return (
            <button
              key={iso}
              type="button"
              disabled={!isSelectable}
              onClick={() => isSelectable && onSelectDate(iso)}
              aria-label={`${dateObj.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}${isSelected ? " selected" : ""}`}
              aria-pressed={isSelected}
              className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-bold flex flex-col items-center justify-center transition-all duration-200 relative select-none ${
                isSelected
                  ? "bg-gradient-to-tr from-[#10B981] to-[#059669] text-white shadow-md shadow-emerald-500/40 ring-2 ring-emerald-300 scale-105 z-10"
                  : isToday && isSelectable
                  ? "bg-white/[0.12] text-white ring-1 ring-[#CCFBF1] hover:bg-white/[0.22] cursor-pointer"
                  : isSelectable
                  ? "bg-white/[0.05] hover:bg-white/[0.15] text-[#F0FDFA] border border-white/[0.08] cursor-pointer active:scale-95"
                  : "bg-transparent text-white/20 cursor-not-allowed"
              }`}
            >
              <span>{dateObj.getDate()}</span>
              {isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-[#10B981] absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-semibold mt-2 flex items-center gap-1.5">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
