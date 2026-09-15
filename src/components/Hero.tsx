import React from "react";
import { FeatureHighlights } from "./FeatureHighlights";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="relative overflow-visible pt-4 sm:pt-8 pb-12 lg:pt-6 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-center lg:text-left z-20">
            {/* Small Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase">
                  WEBSITE DEVELOPMENT COMPANY
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-black tracking-tight text-zinc-950 leading-[1.08] select-none">
              WE BUILD <br />
              <span className="bg-gradient-to-r from-[#10b981] via-[#059669] to-teal-800 bg-clip-text text-transparent inline-block">
                DIGITAL EXPERIENCES
              </span>{" "}
              <br />
              THAT GROW YOUR <br />
              BUSINESS{" "}
              <span className="text-[#10b981] font-light inline-block -ml-1 animate-blink">
                |
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-500 max-w-lg mx-auto lg:mx-0 font-normal leading-relaxed">
              From idea to impact — we design, develop and deliver high-performance websites that help brands stand out, get more customers and scale faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              {/* Primary CTA: Start Your Project */}
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-white font-bold text-sm bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-lg shadow-[#10b981]/30 hover:shadow-[#10b981]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
              >
                <span>Start Your Project</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

              {/* Secondary CTA: View Our Work with circular play icon */}
              <a
                href="#portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-zinc-800 font-bold text-sm bg-white hover:bg-zinc-50/90 border border-zinc-200 shadow-xs hover:border-zinc-300 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
              >
                <span className="w-6 h-6 rounded-full border border-[#10b981]/50 text-[#059669] flex items-center justify-center shrink-0">
                  <svg
                    className="w-2.5 h-2.5 translate-x-0.5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                <span>View Our Work</span>
              </a>
            </div>

            {/* Three Feature Items */}
            <FeatureHighlights />
          </div>

          {/* Right Column: Hero Visual with Real Laptop on Sculpted Rock */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end relative">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
