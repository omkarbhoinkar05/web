import React from "react";
import Link from "next/link";

export function AboutCTA() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#10b981] via-[#059669] to-emerald-900 p-8 sm:p-12 lg:p-14 text-white shadow-xl shadow-emerald-950/10">
          {/* Subtle Abstract Wave Lines SVG in Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg
              className="w-full h-full"
              viewBox="0 0 1200 400"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M-100 400 C 300 300, 500 100, 1300 200"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M-100 350 C 350 250, 550 50, 1300 150"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M-100 300 C 400 200, 600 0, 1300 100"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M-100 250 C 450 150, 650 -50, 1300 50"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white select-none">
                Let&apos;s Build a Brighter Digital Tomorrow
              </h2>
              <p className="text-emerald-100/90 text-base sm:text-lg mt-3 font-normal">
                Ready to turn your ideas into impact?
              </p>
            </div>

            {/* CTA Button */}
            <div className="shrink-0">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[#059669] font-black text-sm sm:text-base bg-white hover:bg-emerald-50 shadow-lg shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all duration-200 group"
              >
                <span>Get In Touch</span>
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
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
