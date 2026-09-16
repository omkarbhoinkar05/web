"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type TabKey = "strategy" | "design" | "development" | "growth";

interface TabData {
  id: TabKey;
  label: string;
  badge: string;
  title: string;
  description: string;
  icon: (active: boolean) => React.ReactNode;
}

export function HomeAboutSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("strategy");
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const tabs: TabData[] = [
    {
      id: "strategy",
      label: "Strategy",
      badge: "01. Architecture",
      title: "Conversion-Led Strategy",
      description: "Data-driven roadmaps & user journeys built to dominate markets.",
      icon: (active) => (
        <svg
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors shrink-0 ${
            active ? "text-emerald-600" : "text-zinc-500"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
    {
      id: "design",
      label: "Design",
      badge: "02. Visual System",
      title: "World-Class UI/UX",
      description: "Bespoke design tokens, fluid motion, and unforgettable identity.",
      icon: (active) => (
        <svg
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors shrink-0 ${
            active ? "text-emerald-600" : "text-zinc-500"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
        </svg>
      ),
    },
    {
      id: "development",
      label: "Development",
      badge: "03. Engineering",
      title: "Sub-Second Performance",
      description: "Modern Next.js 16 + React 19 architecture with zero latency.",
      icon: (active) => (
        <svg
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors shrink-0 ${
            active ? "text-emerald-600" : "text-zinc-500"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      id: "growth",
      label: "Growth",
      badge: "04. Impact",
      title: "Measurable Business ROI",
      description: "SEO authority, analytics funnels, and continuous conversion optimization.",
      icon: (active) => (
        <svg
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors shrink-0 ${
            active ? "text-emerald-600" : "text-zinc-500"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
  ];

  // Auto-play tab progression
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTab((current) => {
        const order: TabKey[] = ["strategy", "design", "development", "growth"];
        const currentIndex = order.indexOf(current);
        const nextIndex = (currentIndex + 1) % order.length;
        return order[nextIndex];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section
      id="about"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-white select-none scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Ambient background glow orbs */}
      <div
        className="absolute top-1/4 right-0 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-gradient-to-br from-emerald-200/35 via-teal-100/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-0 w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] bg-gradient-to-tr from-emerald-100/40 via-emerald-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-14 items-center">
          {/* Left Column: Bold Typography, Narrative, Checklist & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left z-20">
            {/* Glowing Eyebrow Pill */}
            <div className="inline-flex items-center justify-center lg:justify-start mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs shadow-emerald-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.16em] sm:tracking-[0.18em] uppercase text-emerald-800">
                  ABOUT PIXELFORGE · DIGITAL STUDIO
                </span>
              </div>
            </div>

            {/* High-Impact Headline */}
            <h2 className="text-[28px] xs:text-3xl sm:text-4xl lg:text-[45px] xl:text-[50px] font-black tracking-tight text-zinc-950 leading-[1.1] sm:leading-[1.07]">
              IDEAS ARE EASY. <br />
              TURNING THEM INTO <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent inline-block">
                IMPACT IS OUR
              </span>{" "}
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent inline-block">
                SPECIALTY.
              </span>
            </h2>

            {/* Persuasive Narrative Copy */}
            <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0 mt-4 sm:mt-5">
              We blend relentless creativity, conversion psychology, and cutting-edge engineering to build digital experiences that command attention and drive measurable enterprise growth.
            </p>

            {/* 3 Micro-Checkpoints */}
            <div className="mt-5 sm:mt-6 space-y-2 sm:space-y-2.5 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-zinc-800">
                  Sub-second load speeds & 99+ Lighthouse guarantee
                </span>
              </div>
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-zinc-800">
                  Bespoke, award-caliber UI/UX design systems
                </span>
              </div>
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-zinc-800">
                  Conversion-first architecture engineered for revenue
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-6 sm:pt-7">
              {/* Primary CTA */}
              <Link
                href="/about-us"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 rounded-full text-white font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/45 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group text-center"
              >
                <span>Explore Our Journey</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0"
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

              {/* Secondary CTA */}
              <Link
                href="/about-us#journey"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3 rounded-full text-zinc-800 font-bold text-xs sm:text-sm bg-white hover:bg-zinc-50 border border-zinc-200 shadow-xs hover:border-zinc-300 hover:-translate-y-0.5 transition-all duration-200 group text-center"
              >
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 translate-x-0.5 fill-current" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                <span>How We Work</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Space Black Retina Display Mockup with Live Tabs */}
          <div
            className="lg:col-span-7 flex flex-col items-center justify-center relative w-full"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Interactive Process Navigation Pill Bar (Responsive Horizontal Tabs) */}
            <div className="w-full max-w-[560px] flex items-center justify-between p-1 sm:p-1.5 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-zinc-100/95 backdrop-blur-md border border-zinc-200/80 shadow-inner gap-1 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[72px] sm:min-w-0 relative flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-white text-zinc-950 shadow-sm sm:shadow-md shadow-zinc-950/10 scale-[1.02]"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-white/50"
                    }`}
                  >
                    {tab.icon(isActive)}
                    <span className="truncate">{tab.label}</span>
                    {isActive && (
                      <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Container for Device Mockup + Floating HUD Badges */}
            <div className="relative w-full max-w-[560px]">
              {/* Backlight Ambient Glow Ring */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[260px] sm:h-[380px] bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-emerald-200/10 rounded-[40px] blur-3xl pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* Floating HUD Badge 1 (Top-Left): Performance Score - Desktop Only */}
              <div className="hidden sm:flex items-center gap-3 absolute -top-5 -left-4 z-30 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-100/80 shadow-xl shadow-emerald-950/8 animate-float-subtle transition-transform hover:scale-105">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30 shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-zinc-950">99.8% Speed</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">Lighthouse Perfection</span>
                </div>
              </div>

              {/* Floating HUD Badge 2 (Top-Right): Verified Design Tokens - Desktop Only */}
              <div className="hidden sm:flex items-center gap-2.5 absolute -top-4 -right-3 z-30 px-3.5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200/80 shadow-xl shadow-zinc-950/8 animate-float-delayed transition-transform hover:scale-105">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 text-emerald-400 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-zinc-900">Pixel-Perfect UI</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Figma to Production</span>
                </div>
              </div>

              {/* Floating HUD Badge 3 (Bottom-Left): Elite Team - Desktop Only */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-4 -left-3 z-30 px-4 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-zinc-200/80 shadow-xl shadow-zinc-950/8 animate-float-delayed transition-transform hover:scale-105">
                <div className="flex -space-x-2 overflow-hidden">
                  <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gradient-to-tr from-emerald-500 to-teal-400 text-[9px] font-bold text-white flex items-center justify-center">
                    JD
                  </span>
                  <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gradient-to-tr from-zinc-700 to-zinc-900 text-[9px] font-bold text-white flex items-center justify-center">
                    AK
                  </span>
                  <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gradient-to-tr from-teal-500 to-emerald-600 text-[9px] font-bold text-white flex items-center justify-center">
                    SL
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-black text-zinc-900 leading-tight">
                    Elite Studio Team
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Senior Engineers Only
                  </span>
                </div>
              </div>

              {/* Floating HUD Badge 4 (Bottom-Right): Impact Lift - Desktop Only */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -right-2 z-30 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-100/80 shadow-xl shadow-emerald-950/8 animate-float-subtle transition-transform hover:scale-105">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-emerald-700">+248% Revenue</span>
                  <span className="text-[10px] text-zinc-500 font-medium">Avg Client Growth</span>
                </div>
              </div>

              {/* Refined Hand-drawn Callout (Desktop Only) */}
              <div className="hidden md:flex items-center gap-1 absolute -top-10 right-10 z-20 pointer-events-none">
                <span className="font-handwriting text-emerald-700 text-base lg:text-lg font-bold rotate-[-6deg] drop-shadow-xs whitespace-nowrap">
                  Crafted for Leaders
                </span>
                <svg
                  className="w-6 h-6 text-emerald-600 rotate-12"
                  viewBox="0 0 30 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M 5 5 C 15 10, 22 18, 20 25" />
                  <path d="M 14 23 L 20 25 L 23 19" />
                </svg>
              </div>

              {/* The Space Black MacBook Pro Device Frame */}
              <div className="relative mx-auto w-full bg-zinc-950 rounded-xl sm:rounded-3xl p-2 sm:p-4 shadow-2xl shadow-zinc-950/30 border border-zinc-800">
                {/* Screen Top Bar / Camera Notch */}
                <div className="relative w-full pb-1.5 sm:pb-2 flex items-center justify-between border-b border-zinc-800/80 px-1 sm:px-2 text-zinc-400">
                  {/* Traffic Light Dots */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>

                  {/* Top Notch / Camera with Privacy Green LED */}
                  <div className="flex items-center gap-1 px-2 sm:px-3 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] sm:text-[10px] text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="font-mono text-[8px] sm:text-[9px] text-zinc-300 truncate max-w-[120px] sm:max-w-none">
                      pixelforge.design/live
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="text-[9px] sm:text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                    ONLINE
                  </div>
                </div>

                {/* Inner Screen Display (Interactive Tab Stage) */}
                <div className="relative w-full min-h-[250px] xs:min-h-[270px] sm:min-h-[320px] rounded-lg sm:rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 text-white overflow-hidden p-3 sm:p-5 flex flex-col justify-between transition-all duration-300">
                  {/* Screen Glare Diagonal Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-white/[0.01] to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* TAB 1: STRATEGY SCREEN */}
                  {activeTab === "strategy" && (
                    <div className="h-full flex flex-col justify-between animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-zinc-800/70 pb-2 sm:pb-3">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                            01
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-base font-bold text-white leading-tight">
                              Digital Strategy & Roadmap
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-zinc-400 line-clamp-1">
                              Conversion architecture for high-growth ventures
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 shrink-0">
                          Active
                        </span>
                      </div>

                      {/* Interactive Blueprint Flow Chart */}
                      <div className="my-2.5 sm:my-3 grid grid-cols-3 gap-1.5 sm:gap-2">
                        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex flex-col">
                          <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold">Stage 1</span>
                          <span className="text-[11px] sm:text-xs font-bold text-white mt-0.5 sm:mt-1 leading-tight">
                            Discovery
                          </span>
                          <span className="text-[8px] sm:text-[9px] text-emerald-400 mt-1 font-mono">100% Done</span>
                        </div>
                        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col">
                          <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold">Stage 2</span>
                          <span className="text-[11px] sm:text-xs font-bold text-white mt-0.5 sm:mt-1 leading-tight">
                            UX Blueprint
                          </span>
                          <span className="text-[8px] sm:text-[9px] text-emerald-300 mt-1 font-mono">Active</span>
                        </div>
                        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex flex-col">
                          <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold">Stage 3</span>
                          <span className="text-[11px] sm:text-xs font-bold text-white mt-0.5 sm:mt-1 leading-tight">
                            Launch
                          </span>
                          <span className="text-[8px] sm:text-[9px] text-zinc-500 mt-1 font-mono">Queued</span>
                        </div>
                      </div>

                      {/* Micro KPI Bar */}
                      <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-zinc-800/40 border border-zinc-800 text-[10px] sm:text-xs">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400" />
                          <span className="text-zinc-300 text-[10px] sm:text-[11px]">Conversion Forecast</span>
                        </div>
                        <span className="text-emerald-400 font-bold font-mono text-[11px] sm:text-xs">+340% Lift</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DESIGN SCREEN */}
                  {activeTab === "design" && (
                    <div className="h-full flex flex-col justify-between animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-zinc-800/70 pb-2 sm:pb-3">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                            02
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-base font-bold text-white leading-tight">
                              Figma-to-Code System
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-zinc-400 line-clamp-1">
                              Tailored typography, fluid components & luxury
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-teal-500/15 text-teal-400 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border border-teal-500/30 shrink-0">
                          Tokens
                        </span>
                      </div>

                      {/* Design Tokens Palette Visual */}
                      <div className="my-2 sm:my-3 space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400">
                          <span>Harmonious Color Palette</span>
                          <span className="font-mono text-zinc-500 text-[9px] sm:text-[10px]">OKLCH / HEX</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                          <div className="h-8 sm:h-10 rounded-md sm:rounded-lg bg-emerald-500 flex items-end p-1 sm:p-1.5 text-[8px] sm:text-[9px] font-mono font-bold text-white shadow-xs">
                            #10B981
                          </div>
                          <div className="h-8 sm:h-10 rounded-md sm:rounded-lg bg-teal-600 flex items-end p-1 sm:p-1.5 text-[8px] sm:text-[9px] font-mono font-bold text-white shadow-xs">
                            #0D9488
                          </div>
                          <div className="h-8 sm:h-10 rounded-md sm:rounded-lg bg-zinc-900 border border-zinc-700 flex items-end p-1 sm:p-1.5 text-[8px] sm:text-[9px] font-mono font-bold text-zinc-300">
                            #18181B
                          </div>
                          <div className="h-8 sm:h-10 rounded-md sm:rounded-lg bg-emerald-50 border border-emerald-200 flex items-end p-1 sm:p-1.5 text-[8px] sm:text-[9px] font-mono font-bold text-emerald-950">
                            #ECFDF5
                          </div>
                        </div>
                      </div>

                      {/* Component Preview Mock */}
                      <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-zinc-800/40 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-emerald-500 flex items-center justify-center text-white text-[9px] sm:text-[10px]">
                            ✦
                          </div>
                          <span className="text-zinc-200 text-[11px] sm:text-xs font-semibold">Interactive Button</span>
                        </div>
                        <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[10px] font-bold border border-emerald-500/30">
                          Hover Active
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: DEVELOPMENT SCREEN */}
                  {activeTab === "development" && (
                    <div className="h-full flex flex-col justify-between animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-zinc-800/70 pb-2 sm:pb-3">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                            03
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-base font-bold text-white leading-tight">
                              Next.js 16 + React 19
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-zinc-400 line-clamp-1">
                              Zero-bloat code, Turbopack, and automated CI/CD
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 shrink-0">
                          Compiled
                        </span>
                      </div>

                      {/* Mini Code Editor Visual */}
                      <div className="my-1.5 sm:my-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-black/60 border border-zinc-800 font-mono text-[9px] sm:text-[11px] leading-relaxed text-zinc-300 overflow-x-auto scrollbar-none">
                        <div className="text-zinc-500">// Turbo Server Component</div>
                        <div>
                          <span className="text-pink-400">export default async function</span>{" "}
                          <span className="text-emerald-400">App</span>() &#123;
                        </div>
                        <div className="pl-3 sm:pl-4">
                          <span className="text-pink-400">return</span> &lt;
                          <span className="text-cyan-400">Engine</span> speed=&#123;
                          <span className="text-amber-300">"100/100"</span>&#125; /&gt;;
                        </div>
                        <div>&#125;</div>
                      </div>

                      {/* Speed Metrics */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                        <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-zinc-800/50 border border-zinc-700/60">
                          <div className="text-[9px] sm:text-[10px] text-zinc-400">TTFB</div>
                          <div className="text-[11px] sm:text-xs font-bold text-emerald-400 font-mono">18ms</div>
                        </div>
                        <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-zinc-800/50 border border-zinc-700/60">
                          <div className="text-[9px] sm:text-[10px] text-zinc-400">Bundle</div>
                          <div className="text-[11px] sm:text-xs font-bold text-emerald-400 font-mono">38 KB</div>
                        </div>
                        <div className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-zinc-800/50 border border-zinc-700/60">
                          <div className="text-[9px] sm:text-[10px] text-zinc-400">Lighthouse</div>
                          <div className="text-[11px] sm:text-xs font-bold text-emerald-400 font-mono">100/100</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: GROWTH SCREEN */}
                  {activeTab === "growth" && (
                    <div className="h-full flex flex-col justify-between animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-zinc-800/70 pb-2 sm:pb-3">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                            04
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-base font-bold text-white leading-tight">
                              Growth Analytics
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-zinc-400 line-clamp-1">
                              Transforming traffic into scalable company equity
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 shrink-0">
                          +248% YoY
                        </span>
                      </div>

                      {/* Growth Metrics & SVG Chart */}
                      <div className="my-1.5 sm:my-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-zinc-800/40 border border-zinc-800">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <span className="text-[10px] sm:text-[11px] text-zinc-400 font-semibold">Monthly Revenue</span>
                          <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">$184,200</span>
                        </div>
                        {/* Animated Green Line Chart */}
                        <svg className="w-full h-10 sm:h-14" viewBox="0 0 300 60" fill="none">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 0 50 Q 50 45, 100 38 T 200 22 T 300 8"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 0 50 Q 50 45, 100 38 T 200 22 T 300 8 L 300 60 L 0 60 Z"
                            fill="url(#chartGrad)"
                          />
                          <circle cx="300" cy="8" r="4" fill="#10b981" className="animate-pulse" />
                        </svg>
                      </div>

                      {/* Stat summary */}
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-300">
                        <span>Acquisition Cost: <strong className="text-emerald-400">-42%</strong></span>
                        <span>Traffic: <strong className="text-emerald-400">+310%</strong></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Laptop Lower Hinge & Metallic Edge */}
                <div className="mt-1.5 sm:mt-2 w-full flex items-center justify-center">
                  <div className="w-20 sm:w-24 h-1 rounded-full bg-zinc-700/60" />
                </div>
              </div>

              {/* Laptop Keyboard Base & Trackpad Reflection */}
              <div className="relative mx-auto w-[92%] h-2.5 sm:h-3.5 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-b-lg sm:rounded-b-xl border-x border-b border-zinc-700/80 shadow-xl flex items-center justify-center">
                <div className="w-12 sm:w-16 h-0.5 sm:h-1 rounded-full bg-zinc-600/70" />
              </div>

              {/* Dedicated Mobile HUD Feature Grid (Visible ONLY on Mobile < 640px) */}
              <div className="grid grid-cols-2 gap-2 mt-4 sm:hidden">
                {/* Mobile HUD 1 */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-zinc-950">99.8% Speed</span>
                    <span className="text-[9px] text-zinc-500">Lighthouse 100</span>
                  </div>
                </div>

                {/* Mobile HUD 2 */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 text-emerald-400 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-zinc-950">Pixel-Perfect</span>
                    <span className="text-[9px] text-emerald-600 font-bold">Figma System</span>
                  </div>
                </div>

                {/* Mobile HUD 3 */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 shadow-xs">
                  <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                    <span className="inline-block h-5 w-5 rounded-full ring-1 ring-white bg-emerald-500 text-[8px] font-bold text-white flex items-center justify-center">
                      JD
                    </span>
                    <span className="inline-block h-5 w-5 rounded-full ring-1 ring-white bg-zinc-800 text-[8px] font-bold text-white flex items-center justify-center">
                      AK
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-zinc-950">Elite Team</span>
                    <span className="text-[9px] text-zinc-500">Senior Eng</span>
                  </div>
                </div>

                {/* Mobile HUD 4 */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-emerald-700">+248% Lift</span>
                    <span className="text-[9px] text-zinc-500">Avg Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High-Impact Performance Metrics Bar (Bottom) - Fully Responsive Grid */}
        <div className="mt-12 sm:mt-20 lg:mt-24 pt-8 sm:pt-10 border-t border-zinc-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {/* Metric 1 */}
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-50/70 hover:bg-emerald-50/40 border border-zinc-100 hover:border-emerald-200/70 transition-all duration-300 group flex flex-col items-center text-center">
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight group-hover:scale-105 transition-transform">
                150+
              </span>
              <span className="text-[11px] sm:text-sm font-bold text-zinc-800 uppercase tracking-wider mt-1 sm:mt-2">
                Digital Projects
              </span>
              <span className="text-[9px] sm:text-[11px] text-zinc-500 font-medium mt-0.5">
                From startups to enterprise
              </span>
            </div>

            {/* Metric 2 */}
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-50/70 hover:bg-emerald-50/40 border border-zinc-100 hover:border-emerald-200/70 transition-all duration-300 group flex flex-col items-center text-center">
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight group-hover:scale-105 transition-transform">
                30+
              </span>
              <span className="text-[11px] sm:text-sm font-bold text-zinc-800 uppercase tracking-wider mt-1 sm:mt-2">
                Venture Partners
              </span>
              <span className="text-[9px] sm:text-[11px] text-zinc-500 font-medium mt-0.5">
                Across US, Europe & Asia
              </span>
            </div>

            {/* Metric 3 */}
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-50/70 hover:bg-emerald-50/40 border border-zinc-100 hover:border-emerald-200/70 transition-all duration-300 group flex flex-col items-center text-center">
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight group-hover:scale-105 transition-transform">
                5+
              </span>
              <span className="text-[11px] sm:text-sm font-bold text-zinc-800 uppercase tracking-wider mt-1 sm:mt-2">
                Years Innovation
              </span>
              <span className="text-[9px] sm:text-[11px] text-zinc-500 font-medium mt-0.5">
                Pioneering modern standards
              </span>
            </div>

            {/* Metric 4 */}
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-50/70 hover:bg-emerald-50/40 border border-zinc-100 hover:border-emerald-200/70 transition-all duration-300 group flex flex-col items-center text-center">
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight group-hover:scale-105 transition-transform">
                99.4%
              </span>
              <span className="text-[11px] sm:text-sm font-bold text-zinc-800 uppercase tracking-wider mt-1 sm:mt-2">
                Satisfaction Rate
              </span>
              <span className="text-[9px] sm:text-[11px] text-zinc-500 font-medium mt-0.5">
                Retained partnerships
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
