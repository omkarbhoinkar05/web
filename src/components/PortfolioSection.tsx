"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  type: string;
  description: string;
  features: string[];
  tags: string[];
  mockup: React.ReactNode;
}

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const filters = [
    "All Projects",
    "Web Design",
    "SaaS App",
    "ERP Software",
    "E-Commerce",
    "Web App",
    "Dynamic Website",
  ];

  const projects: ProjectItem[] = [
    {
      id: "edulearn",
      slug: "edulearn",
      name: "EduLearn",
      category: "Education",
      type: "Online Learning Platform",
      description:
        "A modern e-learning platform with live classes, course management, student dashboard and secure payment integration.",
      features: ["Web App", "Payment Integration", "Admin Panel"],
      tags: ["All Projects", "Web App", "Dynamic Website", "Web Design"],
      mockup: (
        <div className="w-full h-44 rounded-t-2xl bg-zinc-950 p-2.5 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
          {/* Browser header */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[9px] font-mono text-zinc-400 border border-zinc-800">
              edulearn.io/live-class
            </span>
            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Video Lesson / Dashboard Preview */}
          <div className="my-auto py-1 space-y-2">
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-white leading-tight">Interactive Lesson #04</div>
                  <div className="text-[9px] text-zinc-400">Next.js 16 &amp; UI Architecture</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">1,240 Enrolled</span>
            </div>

            {/* Course Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[9px] text-zinc-400">
                <span>Curriculum Progress</span>
                <span className="text-emerald-400 font-bold">88%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full w-[88%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Quick stats footer */}
          <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-900">
            <span>⚡ Zero Latency Video</span>
            <span className="text-emerald-300 font-semibold">Stripe Checkout Ready</span>
          </div>
        </div>
      ),
    },
    {
      id: "shopkart",
      slug: "shopkart",
      name: "ShopKart",
      category: "E-Commerce",
      type: "Multi-Vendor E-Commerce",
      description:
        "A feature-rich marketplace with multiple sellers, secure payments, order management and real-time tracking.",
      features: ["Multi-Vendor", "Payment Gateway", "Order Management"],
      tags: ["All Projects", "E-Commerce", "Web App", "Web Design"],
      mockup: (
        <div className="w-full h-44 rounded-t-2xl bg-zinc-950 p-2.5 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
          {/* Browser header */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[9px] font-mono text-zinc-400 border border-zinc-800">
              shopkart.store/marketplace
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">CART (3)</span>
          </div>

          {/* E-Commerce Product Showcase */}
          <div className="my-auto py-1 grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-emerald-400">FEATURED</span>
                <span className="text-[9px] text-amber-300">★ 4.9</span>
              </div>
              <span className="text-[11px] font-bold text-white truncate">Smart Tech Bundle</span>
              <span className="text-xs font-mono font-extrabold text-emerald-300 mt-1">$249.00</span>
            </div>
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-teal-400">BESTSELLER</span>
                <span className="text-[9px] text-amber-300">★ 5.0</span>
              </div>
              <span className="text-[11px] font-bold text-white truncate">Pro Studio Audio</span>
              <span className="text-xs font-mono font-extrabold text-emerald-300 mt-1">$189.50</span>
            </div>
          </div>

          {/* Checkout Status footer */}
          <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-900">
            <span>🛡️ Multi-Vendor Escrow</span>
            <span className="text-emerald-400 font-mono font-semibold">Instant Dispatch</span>
          </div>
        </div>
      ),
    },
    {
      id: "taskpro",
      slug: "taskpro",
      name: "TaskPro",
      category: "SaaS App",
      type: "Project Management SaaS",
      description:
        "A SaaS platform to manage projects, teams, tasks and productivity with a clean and intuitive interface.",
      features: ["SaaS Platform", "Team Management", "Analytics"],
      tags: ["All Projects", "SaaS App", "Web App", "Web Design"],
      mockup: (
        <div className="w-full h-44 rounded-t-2xl bg-zinc-950 p-2.5 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
          {/* Browser header */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[9px] font-mono text-zinc-400 border border-zinc-800">
              app.taskpro.io/kanban
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">SPRINT #12</span>
          </div>

          {/* Kanban / Task Cards */}
          <div className="my-auto py-1 grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-emerald-500/30 flex flex-col text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-emerald-400 font-bold">IN PROGRESS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[11px] font-bold text-white mt-1">API Integrations</span>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800 text-[8px] text-zinc-400">
                <span>3 Subtasks</span>
                <span className="text-emerald-300 font-mono">Today</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-zinc-400 font-bold">DONE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] font-bold text-white mt-1">UX Design Sprint</span>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800 text-[8px] text-zinc-400">
                <span>100% Passed</span>
                <span className="text-emerald-400 font-mono">✓ Done</span>
              </div>
            </div>
          </div>

          {/* Velocity Bar */}
          <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-900">
            <span>Team Velocity: <strong className="text-white">94.2 pts</strong></span>
            <span className="text-emerald-400 font-mono font-semibold">+18% Efficiency</span>
          </div>
        </div>
      ),
    },
    {
      id: "bizerp",
      slug: "bizerp",
      name: "BizERP",
      category: "ERP Software",
      type: "Complete Business Management",
      description:
        "A custom ERP solution for inventory, sales, purchase, HR, finance and more — all in one powerful platform.",
      features: ["Inventory", "HR Management", "Reports"],
      tags: ["All Projects", "ERP Software", "Web App", "Dynamic Website"],
      mockup: (
        <div className="w-full h-44 rounded-t-2xl bg-zinc-950 p-2.5 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
          {/* Browser header */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[9px] font-mono text-zinc-400 border border-zinc-800">
              bizerp.cloud/analytics
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">ENTERPRISE</span>
          </div>

          {/* ERP Dashboard Stats & Sparkline */}
          <div className="my-auto py-1 space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Total Pipeline Revenue</span>
                <span className="text-sm font-mono font-black text-white">$482,900.00</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                +38.4% YoY
              </span>
            </div>

            {/* Sparkline Graph */}
            <svg className="w-full h-8" viewBox="0 0 200 30" fill="none">
              <path
                d="M 0 25 Q 30 20, 60 18 T 120 10 T 170 14 T 200 4"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="200" cy="4" r="3" fill="#10B981" className="animate-pulse" />
            </svg>
          </div>

          {/* Quick ERP Health status footer */}
          <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-900">
            <span>Inventory: <strong className="text-emerald-300">99.8% Optimal</strong></span>
            <span className="text-emerald-400 font-mono font-semibold">Audit Ready</span>
          </div>
        </div>
      ),
    },
  ];

  // Filter projects based on selected category
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "All Projects") return true;
    return project.tags.includes(activeFilter) || project.category === activeFilter;
  });

  return (
    <section
      id="portfolio"
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-white select-none border-t border-zinc-100 scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Subtle Ambient Glow Background */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.10),rgba(255,255,255,0))] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-100/35 via-teal-50/25 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Decorative Dotted Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-0 opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="portfolio-dots-white" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#000000" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#portfolio-dots-white)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Top Header with Decorative Handwritten Callouts */}
        <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Left Decorative Handwritten Callout */}
          <div className="hidden lg:flex flex-col items-end absolute -left-48 top-3 pointer-events-none">
            <span className="font-handwriting text-emerald-800 text-base sm:text-lg font-bold leading-tight rotate-[-6deg] text-right drop-shadow-xs">
              Ideas <br />
              Built <br />
              Into Reality
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

          {/* Right Decorative Handwritten Callout */}
          <div className="hidden lg:flex flex-col items-start absolute -right-52 top-3 pointer-events-none">
            <span className="font-handwriting text-emerald-800 text-base sm:text-lg font-bold leading-tight rotate-[6deg] text-left drop-shadow-xs">
              Your Success <br />
              Our Best <br />
              Work
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
              OUR PORTFOLIO
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15]">
            Real Projects. <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent inline-block">
              Real Results.
            </span>
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl mt-4 sm:mt-5 text-center">
            Explore some of our recent work and see how we turn ideas into powerful digital solutions. Each project is crafted with strategy, creativity and a focus on real business impact.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="mt-10 sm:mt-12 flex items-center justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-zinc-100/90 border border-zinc-200/80 shadow-inner overflow-x-auto max-w-full scrollbar-none">
            {filters.map((filter) => {
              const isSelected = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 scale-[1.02]"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-white/70"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Featured Projects Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col justify-between h-full rounded-3xl bg-white hover:bg-emerald-50/20 border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
            >
              {/* Top Project Realistic Mockup Display */}
              <div className="w-full relative transition-transform duration-300 group-hover:scale-[1.01]">
                {project.mockup}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category Pill & Project Type */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-500 truncate">
                      {project.type}
                    </span>
                  </div>

                  {/* Project Name */}
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed mt-2.5">
                    {project.description}
                  </p>

                  {/* Key Features Pill List */}
                  <div className="mt-4 pt-3.5 border-t border-zinc-100 flex flex-wrap gap-1.5">
                    {project.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-50/80 border border-emerald-100 text-[10px] font-semibold text-emerald-800"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Case Study Button (Full-width inside card) */}
                <div className="mt-6 pt-2">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-emerald-600 hover:text-white border border-emerald-200/80 hover:border-transparent shadow-2xs hover:shadow-md hover:shadow-emerald-500/20 transition-all duration-300 group/btn"
                  >
                    <span>View Case Study</span>
                    <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Projects CTA Gateway */}
        <div className="mt-14 sm:mt-18 flex flex-col items-center justify-center text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
          >
            <span>View More Projects</span>
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
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-3">
            Explore our complete portfolio and detailed case studies.
          </p>
        </div>

        {/* Bottom Portfolio Statistics Bar */}
        <div className="mt-16 sm:mt-20 p-6 sm:p-8 rounded-3xl bg-zinc-50/80 hover:bg-emerald-50/30 border border-zinc-200/80 shadow-sm transition-colors duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center text-center">
            {/* Stat 1: Projects Completed */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2.5 text-emerald-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                  <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                  <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                </svg>
              </div>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight">
                50+
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-800 uppercase tracking-wider mt-0.5">
                Projects Completed
              </span>
            </div>

            {/* Stat 2: Happy Clients */}
            <div className="flex flex-col items-center border-l-0 sm:border-l border-zinc-200/80">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2.5 text-emerald-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight">
                30+
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-800 uppercase tracking-wider mt-0.5">
                Happy Clients
              </span>
            </div>

            {/* Stat 3: Client Satisfaction */}
            <div className="flex flex-col items-center border-l-0 lg:border-l border-zinc-200/80">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2.5 text-emerald-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight">
                98%
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-800 uppercase tracking-wider mt-0.5">
                Client Satisfaction
              </span>
            </div>

            {/* Stat 4: Industries Served */}
            <div className="flex flex-col items-center border-l-0 sm:border-l border-zinc-200/80">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2.5 text-emerald-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight">
                5+
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-800 uppercase tracking-wider mt-0.5">
                Industries Served
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Statement */}
        <div className="mt-12 text-center">
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase">
            INNOVATION &nbsp;|&nbsp; DESIGN &nbsp;|&nbsp; DEVELOPMENT &nbsp;|&nbsp; REAL IMPACT
          </p>
        </div>
      </div>
    </section>
  );
}
