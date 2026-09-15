"use client";

import React from "react";
import Link from "next/link";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function ProcessSection() {
  const steps: ProcessStep[] = [
    {
      number: "01",
      title: "Discover &\nUnderstand",
      description:
        "We listen to your ideas, understand your goals and analyze your requirements in detail.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Plan &\nStrategy",
      description:
        "We create a clear strategy, define scope and plan the best solution for your business needs.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Design &\nPrototype",
      description:
        "Our designers create modern, user-friendly designs and prototypes to bring your vision to life.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.562C22 6.5 17.5 2 12 2z" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Development\n& Integration",
      description:
        "We develop robust and scalable solutions with the latest technologies and integrate required features.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" x2="10" y1="4" y2="20" />
        </svg>
      ),
    },
    {
      number: "05",
      title: "Testing &\nLaunch",
      description:
        "We rigorously test everything to ensure quality, performance and a smooth launch without any issues.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      ),
    },
    {
      number: "06",
      title: "Ongoing\nSupport",
      description:
        "We provide continuous support, maintenance and updates to keep your business running smoothly.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="process"
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-white select-none border-t border-zinc-100"
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.10),rgba(255,255,255,0))] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/35 via-teal-50/25 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Decorative Dotted Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-0 opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="process-dots-white" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#000000" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#process-dots-white)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Top Header with Decorative Handwritten Callouts */}
        <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Left Decorative Handwritten Callout (Desktop) */}
          <div className="hidden lg:flex flex-col items-end absolute -left-48 top-4 pointer-events-none">
            <span className="font-handwriting text-emerald-800 text-base sm:text-lg font-bold leading-tight rotate-[-7deg] text-right drop-shadow-xs">
              Your Idea <br />
              Our Process <br />
              Real Results
            </span>
            <svg
              className="w-12 h-10 text-emerald-600 mt-1 rotate-12"
              viewBox="0 0 50 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 5 10 C 25 5, 40 15, 38 32" />
              <path d="M 30 28 L 38 32 L 44 24" />
            </svg>
          </div>

          {/* Right Decorative Handwritten Callout (Desktop) */}
          <div className="hidden lg:flex flex-col items-start absolute -right-52 top-4 pointer-events-none">
            <span className="font-handwriting text-emerald-800 text-base sm:text-lg font-bold leading-tight rotate-[6deg] text-left drop-shadow-xs">
              Let&apos;s Build <br />
              Something Amazing <br />
              Together
            </span>
            <svg
              className="w-12 h-10 text-emerald-600 mt-1 -rotate-12"
              viewBox="0 0 50 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 45 10 C 25 5, 10 15, 12 32" />
              <path d="M 20 28 L 12 32 L 6 24" />
            </svg>
          </div>

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs shadow-emerald-500/10 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
              OUR PROCESS
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15]">
            From Idea to Success <br />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent inline-block">
              Our Simple &amp; Proven Process
            </span>
          </h2>

          {/* Supporting Description */}
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl mt-4 sm:mt-5">
            We follow a clear and transparent process to turn your ideas into powerful digital solutions. With the right strategy, design, development and support — we ensure your success at every step.
          </p>
        </div>

        {/* 6-Step Process Timeline Container */}
        <div className="relative mt-16 sm:mt-24">
          {/* Desktop Connecting Dashed Line Across Timeline */}
          <div className="hidden xl:block absolute top-[44px] left-[6%] right-[6%] h-1 pointer-events-none -z-0">
            <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 1000 30" fill="none">
              <path
                d="M 0 15 C 200 5, 300 25, 500 15 C 700 5, 800 25, 1000 15"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeOpacity="0.4"
              />
            </svg>
          </div>

          {/* Grid of 6 Steps (Desktop 6 cols, Tablet 3/2 cols, Mobile 1 col) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 xl:gap-4 items-stretch">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between h-full p-5 sm:p-6 rounded-3xl bg-white hover:bg-emerald-50/20 border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Step Connector Arrow (Visible between cards on desktop) */}
                {idx < steps.length - 1 && (
                  <div className="hidden xl:flex absolute -right-3 top-[36px] z-20 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 items-center justify-center text-emerald-600 shadow-xs pointer-events-none">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                )}

                <div>
                  {/* Glass Orb Icon Container & Number Badge */}
                  <div className="flex items-center justify-between mb-5">
                    {/* Layered Icon Orb */}
                    <div className="relative w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
                      {step.icon}
                    </div>

                    {/* Number Badge */}
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs font-mono font-black text-emerald-800 tracking-wider shadow-2xs">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight leading-snug whitespace-pre-line group-hover:text-emerald-700 transition-colors">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed mt-2.5">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Accent Indicator */}
                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-emerald-700 font-semibold">
                  <span>STEP {step.number}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust/Statistics Bar & Integrated CTA */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-3xl bg-zinc-50/80 hover:bg-emerald-50/30 border border-zinc-200/80 shadow-sm transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 4 Statistics Columns (lg:col-span-8) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {/* Stat 1 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2.5 text-emerald-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 tracking-tight">
                  250+
                </span>
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider mt-0.5">
                  Happy Clients
                </span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center border-l-0 sm:border-l border-zinc-200/80">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2.5 text-emerald-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                  </svg>
                </div>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 tracking-tight">
                  500+
                </span>
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider mt-0.5">
                  Projects Delivered
                </span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center border-l-0 sm:border-l border-zinc-200/80">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2.5 text-emerald-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 tracking-tight">
                  99%
                </span>
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider mt-0.5">
                  Satisfaction
                </span>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center border-l-0 sm:border-l border-zinc-200/80">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2.5 text-emerald-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 tracking-tight">
                  5+
                </span>
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider mt-0.5">
                  Years Experience
                </span>
              </div>
            </div>

            {/* Compact CTA (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-center gap-3.5 border-t lg:border-t-0 lg:border-l border-zinc-200/80 pt-6 lg:pt-0 lg:pl-8">
              <div className="text-center lg:text-right">
                <span className="text-lg sm:text-xl font-extrabold text-zinc-900 leading-tight block">
                  Ready to Start Your Project?
                </span>
                <span className="text-xs text-zinc-600 font-medium">
                  Let&apos;s build your digital vision together.
                </span>
              </div>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all duration-300 shrink-0"
              >
                <span>Start Your Project →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
