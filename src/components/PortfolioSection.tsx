"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  image?: string | null;
  projectUrl?: string | null;
  displayOrder?: number;
  mockup?: React.ReactNode;
}

const STATIC_FALLBACK_PROJECTS: ProjectItem[] = [
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
  },
];

function renderProjectMockup(project: ProjectItem) {
  // If a custom image is uploaded via Admin, display it seamlessly
  if (project.image) {
    const isWhiteBg = Boolean(
      project.image.includes("bg=white") ||
      (Array.isArray(project.tags) && project.tags.includes("bg-white"))
    );

    return (
      <div
        className={`w-full h-44 rounded-t-2xl ${
          isWhiteBg
            ? "bg-white border-b border-zinc-200"
            : "bg-zinc-950 border-b border-zinc-800"
        } overflow-hidden relative group/mockup flex items-center justify-center p-3.5`}
      >
        {/* Subtle ambient blurred background */}
        <div
          className={`absolute inset-0 bg-cover bg-center blur-2xl ${
            isWhiteBg ? "opacity-15" : "opacity-25"
          } scale-125 pointer-events-none`}
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <img
          src={project.image}
          alt={project.name}
          className="relative z-10 max-h-full max-w-full object-contain object-center transition-transform duration-300 group-hover/mockup:scale-105 drop-shadow-md"
          onError={(e) => {
            // Hide image and let fallback show if broken
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  // Exact 100% Preserved Mockups for Built-in Showcase Items
  if (project.slug === "edulearn") {
    return (
      <div className="w-full h-44 rounded-t-2xl bg-zinc-950 p-2.5 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
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

        <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-900">
          <span>⚡ Zero Latency Video</span>
          <span className="text-emerald-300 font-semibold">Stripe Checkout Ready</span>
        </div>
      </div>
    );
  }

  if (project.slug === "shopkart") {
    return (
      <div className="w-full h-44 rounded-t-2xl bg-zinc-950 p-2.5 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
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

        <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-900">
          <span>🛡️ Multi-Vendor Escrow</span>
          <span className="text-emerald-400 font-mono font-semibold">Instant Dispatch</span>
        </div>
      </div>
    );
  }

  if (project.slug === "taskpro") {
    return (
      <div className="w-full h-44 rounded-t-2xl bg-zinc-950 p-2.5 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
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

        <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-900">
          <span>Team Velocity: <strong className="text-white">94.2 pts</strong></span>
          <span className="text-emerald-400 font-mono font-semibold">+18% Efficiency</span>
        </div>
      </div>
    );
  }

  if (project.slug === "bizerp") {
    return (
      <div className="w-full h-44 rounded-t-2xl bg-zinc-950 p-2.5 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
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

        <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-900">
          <span>Inventory: <strong className="text-emerald-300">99.8% Optimal</strong></span>
          <span className="text-emerald-400 font-mono font-semibold">Audit Ready</span>
        </div>
      </div>
    );
  }

  // Sleek dynamic browser mockup fallback for any other project
  return (
    <div className="w-full h-44 rounded-t-2xl bg-zinc-950 p-2.5 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
        </div>
        <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[9px] font-mono text-zinc-400 border border-zinc-800">
          {project.slug}.io
        </span>
        <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="my-auto py-1 space-y-2">
        <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[11px] font-bold text-white leading-tight truncate">{project.name}</div>
            <div className="text-[9px] text-emerald-400 font-medium">{project.type}</div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold shrink-0">
            {project.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-[9px] text-zinc-400 px-1">
          <span>Enterprise Ready</span>
          <span className="text-emerald-300 font-mono">100% Scalable</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-zinc-900">
        <span>⚡ High Performance</span>
        <span className="text-emerald-400 font-semibold">Custom Solution</span>
      </div>
    </div>
  );
}

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [projects, setProjects] = useState<ProjectItem[]>(STATIC_FALLBACK_PROJECTS);

  // Fetch dynamic portfolio projects configured for the Home Page from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadPortfolio() {
      try {
        const res = await fetch(`/api/portfolio?home=true&_t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.projects)) {
            if (isMounted) {
              const mapped: ProjectItem[] = data.projects.slice(0, 4).map((p: any) => ({
                id: p.id,
                slug: p.slug,
                name: p.title || p.name,
                category: p.category,
                type: p.type,
                description: p.description,
                features: Array.isArray(p.features)
                  ? p.features
                  : p.features
                  ? p.features.split(",").map((s: string) => s.trim()).filter(Boolean)
                  : [],
                tags: Array.isArray(p.tags)
                  ? p.tags
                  : p.tags
                  ? p.tags.split(",").map((s: string) => s.trim()).filter(Boolean)
                  : ["All Projects"],
                image: p.image || null,
                projectUrl: p.projectUrl?.startsWith("disabled:") ? null : (p.projectUrl || null),
                displayOrder: p.displayOrder,
              }));
              setProjects(mapped);
            }
          }
        }
      } catch (err) {
        // Graceful fallback to initial static items on error
        console.error("PortfolioSection dynamic fetch error:", err);
      }
    }

    loadPortfolio();
    return () => {
      isMounted = false;
    };
  }, []);

  const baseFilters = [
    "All Projects",
    "Web Design",
    "SaaS App",
    "ERP Software",
    "E-Commerce",
    "Web App",
    "Dynamic Website",
  ];

  // Dynamic filters: preserve original filters while including any categories from loaded projects
  const filters = useMemo(() => {
    const categoriesInProjects = projects.map((p) => p.category);
    const combined = [...baseFilters];
    for (const cat of categoriesInProjects) {
      if (cat && !combined.includes(cat)) {
        combined.push(cat);
      }
    }
    return combined;
  }, [projects]);

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (activeFilter === "All Projects") return true;
      return project.tags.includes(activeFilter) || project.category === activeFilter;
    });
  }, [projects, activeFilter]);

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

        {/* Featured Projects Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col justify-between h-full rounded-3xl bg-white hover:bg-emerald-50/20 border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
            >
              {/* Top Project Realistic Mockup / Image Display */}
              <div className="w-full relative transition-transform duration-300 group-hover:scale-[1.01]">
                {renderProjectMockup(project)}
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

                {/* View Case Study & Live Site Buttons */}
                <div className="mt-6 pt-2 flex items-center gap-2">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all duration-200 group/btn"
                  >
                    <span>Case Study</span>
                    <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                  </Link>
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-xs shadow-emerald-500/20 transition-all duration-200"
                      title="Open Live Project in New Tab"
                    >
                      <span>Live Site</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
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
      </div>
    </section>
  );
}
