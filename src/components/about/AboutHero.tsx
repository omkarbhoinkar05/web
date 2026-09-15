import React from "react";

export function AboutHero() {
  return (
    <section className="relative overflow-visible pt-6 sm:pt-10 pb-12 lg:pt-8 lg:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Small Label Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#059669] shadow-2xs mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
            OUR STORY
          </span>
        </div>

        {/* 2-Column Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Heading Left */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-black tracking-tight text-zinc-950 leading-[1.06] select-none">
              WE TURN BIG IDEAS <br />
              INTO{" "}
              <span className="bg-gradient-to-r from-[#10b981] via-[#059669] to-teal-800 bg-clip-text text-transparent inline-block">
                DIGITAL
              </span>{" "}
              <br />
              <span className="bg-gradient-to-r from-[#10b981] via-[#059669] to-teal-800 bg-clip-text text-transparent inline-block">
                EXPERIENCES.
              </span>
            </h1>
          </div>

          {/* Description & CTAs Right */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-2 space-y-6">
            <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
              At PixelForge, we believe in the power of ideas, design and technology to create a better digital future. Here&apos;s our journey, our purpose and the people behind it.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {/* Primary CTA */}
              <a
                href="#journey"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-lg shadow-[#10b981]/25 hover:shadow-[#10b981]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
              >
                <span>Our Journey</span>
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

              {/* Secondary CTA */}
              <a
                href="#founder"
                className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full text-zinc-800 font-bold text-sm bg-white hover:bg-zinc-50 border border-zinc-200 shadow-2xs hover:border-zinc-300 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <span className="w-6 h-6 rounded-full border border-[#10b981]/60 text-[#059669] flex items-center justify-center shrink-0">
                  <svg
                    className="w-2.5 h-2.5 translate-x-0.5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                <span>Watch Our Story</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-12 sm:mt-16 pt-8 pb-4 border-t border-zinc-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#10b981] tracking-tight">
                50+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider mt-1">
                Projects
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center border-l-0 md:border-l border-zinc-200/80">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#10b981] tracking-tight">
                30+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider mt-1">
                Clients
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center border-l-0 md:border-l border-zinc-200/80">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#10b981] tracking-tight">
                5+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider mt-1">
                Years
              </span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center border-l-0 md:border-l border-zinc-200/80">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#10b981] tracking-tight">
                99%
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider mt-1">
                Satisfaction
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
