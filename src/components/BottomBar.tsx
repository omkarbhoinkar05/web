import React from "react";

export function BottomBar() {
  return (
    <div className="w-full pt-4 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Watch Our Story Banner */}
      <div className="flex justify-end mb-8 pr-4 sm:pr-12">
        <div className="flex items-center gap-3.5">
          {/* Circular Emerald Play Button */}
          <button
            type="button"
            className="w-11 h-11 rounded-full border border-[#059669]/60 text-[#059669] flex items-center justify-center hover:bg-emerald-50 hover:border-[#059669] hover:scale-105 active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] shadow-xs"
            aria-label="Watch Our Story video"
          >
            <svg
              className="w-4 h-4 translate-x-0.5 fill-current"
              viewBox="0 0 24 24"
            >
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </button>
          <div className="flex flex-col text-left">
            <span className="text-sm font-black text-zinc-900 leading-tight">
              Watch Our Story
            </span>
            <span className="text-xs text-zinc-400 font-medium leading-tight mt-0.5">
              See how we turn ideas into powerful websites.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Horizontal Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100">
        {/* Scroll to Explore with Emerald Dot and Line */}
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span className="text-[10.5px] font-bold tracking-[0.22em] text-zinc-500 uppercase">
            SCROLL TO EXPLORE
          </span>
          <div className="w-12 h-[1px] bg-zinc-300 hidden sm:block" />
        </div>

        {/* Brand Tagline Separators */}
        <div className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase flex items-center gap-2 sm:gap-3">
          <span>IDEAS</span>
          <span className="text-zinc-300">/</span>
          <span>WEBSITES</span>
          <span className="text-zinc-300">/</span>
          <span>BRANDS</span>
          <span className="text-zinc-300">/</span>
          <span>A BRIGHTER TOMORROW</span>
        </div>
      </div>
    </div>
  );
}
