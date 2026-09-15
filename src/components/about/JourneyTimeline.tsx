"use client";

import React from "react";
import Image from "next/image";

interface Milestone {
  year: string;
  title: string;
  description: string;
  topOffset: string; // for desktop positioning along mountain path
}

const milestones: Milestone[] = [
  {
    year: "2020",
    title: "The Beginning",
    description: "Started with a simple idea and big dreams.",
    topOffset: "top-[64%]",
  },
  {
    year: "2021",
    title: "First Projects",
    description: "Turned ideas into real products.",
    topOffset: "top-[60%]",
  },
  {
    year: "2023",
    title: "Growing Together",
    description: "Expanded our team and capabilities.",
    topOffset: "top-[54%]",
  },
  {
    year: "2025",
    title: "Bigger Impact",
    description: "Serving clients and building stronger solutions.",
    topOffset: "top-[58%]",
  },
  {
    year: "Today",
    title: "Building Tomorrow",
    description: "Continuing to create meaningful digital experiences.",
    topOffset: "top-[65%]",
  },
];

export function JourneyTimeline() {
  return (
    <section id="journey" className="relative py-12 lg:py-20 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 relative z-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#059669] shadow-2xs mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[10.5px] font-bold tracking-[0.2em] uppercase">
                OUR HISTORY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950">
              Our Journey
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base mt-2 max-w-md">
              A story of passion, persistence and progress.
            </p>
          </div>

          {/* Handwritten Annotation on Right */}
          <div className="mt-4 md:mt-0 flex items-start gap-2 self-start md:self-auto">
            <div className="font-handwriting text-zinc-700 text-lg sm:text-xl font-bold leading-[1.15] rotate-[-2deg]">
              A Journey<br />
              Of Ideas,<br />
              People and<br />
              Possibilities
            </div>
            <svg
              className="w-10 h-12 text-[#059669] mt-1 shrink-0"
              viewBox="0 0 50 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 5 5 C 25 15, 38 30, 25 50" />
              <path d="M 18 45 L 25 50 L 32 44" />
            </svg>
          </div>
        </div>

        {/* Desktop Interactive Mountain Timeline */}
        <div className="hidden md:block relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-white via-white/80 to-white/95 border border-zinc-100 shadow-sm min-h-[480px] lg:min-h-[560px]">
          {/* Panoramic Mountain Landscape Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/about-mountain.jpg"
              alt="PixelForge Journey Landscape with Mountain Peaks and Emerald Valley"
              fill
              priority
              className="object-cover object-bottom opacity-85"
            />
            {/* Soft Top & Bottom Gradient Fades */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>

          {/* Flowing Emerald Winding Path SVG */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 500"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Soft Green Glow Path */}
              <path
                d="M 100 320 C 220 310, 280 290, 300 290 C 380 290, 450 250, 500 255 C 600 260, 650 280, 700 285 C 800 295, 850 325, 900 330"
                stroke="rgba(16, 185, 129, 0.4)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Sharp White/Emerald Core Path */}
              <path
                d="M 100 320 C 220 310, 280 290, 300 290 C 380 290, 450 250, 500 255 C 600 260, 650 280, 700 285 C 800 295, 850 325, 900 330"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          {/* 5 Milestone Nodes Distributed Across the Landscape */}
          <div className="relative z-20 w-full h-[480px] lg:h-[560px] grid grid-cols-5 px-4 lg:px-8">
            {milestones.map((m) => (
              <div
                key={m.year}
                className={`relative flex flex-col items-center ${m.topOffset} group`}
              >
                {/* Glowing Node Button */}
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#10b981]/25 animate-ping absolute" />
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-[#10b981] shadow-md flex items-center justify-center transition-transform duration-200 group-hover:scale-125">
                    <div className="w-2 h-2 rounded-full bg-[#059669]" />
                  </div>
                </div>

                {/* Milestone Info Card */}
                <div className="mt-3.5 px-3 py-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md shadow-emerald-950/5 text-center max-w-[170px] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-emerald-200">
                  <span className="block text-sm lg:text-base font-black text-zinc-950 tracking-tight">
                    {m.year}
                  </span>
                  <span className="block text-xs font-bold text-[#059669] mt-0.5">
                    {m.title}
                  </span>
                  <span className="block text-[11px] text-zinc-500 leading-tight mt-1">
                    {m.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="block md:hidden relative pl-6 space-y-8 border-l-2 border-emerald-300 ml-3 mt-4">
          {milestones.map((m) => (
            <div key={m.year} className="relative group">
              {/* Glowing Node on Line */}
              <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-white border-2 border-[#10b981] shadow-xs flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#059669]" />
              </div>

              {/* Card */}
              <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-zinc-950">
                    {m.year}
                  </span>
                  <span className="text-xs font-bold text-[#059669]">
                    {m.title}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
