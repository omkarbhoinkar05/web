"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  type: string;
  description: string;
  features: string[];
  techStack: string[];
  impactMetric: string;
  impactLabel: string;
  tags: string[];
  mockup: React.ReactNode;
}

const baseFilterCategories = [
  "All Projects",
  "Web Design",
  "SaaS App",
  "ERP Software",
  "E-Commerce",
  "Web App",
  "Dynamic Website",
];

const staticProjects: ProjectItem[] = [
  {
    id: "edulearn",
    slug: "edulearn",
    name: "EduLearn",
    category: "Education",
    type: "Online Learning Platform",
    description:
      "A modern e-learning platform with live video classes, interactive course modules, student progress dashboard and secure payment gateway.",
    features: ["Live Classes", "Payment Integration", "Student LMS", "Admin Analytics"],
    techStack: ["Next.js 16", "WebRTC", "PostgreSQL", "Tailwind CSS"],
    impactMetric: "+310%",
    impactLabel: "Student Enrollment",
    tags: ["All Projects", "Web App", "Dynamic Website", "Web Design"],
    mockup: (
      <div className="w-full h-48 rounded-t-2xl bg-zinc-950 p-3 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
            edulearn.io/live-class
          </span>
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Interactive Lesson Preview */}
        <div className="my-auto py-1 space-y-2">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">Next.js 16 Masterclass</div>
                <div className="text-[10px] text-zinc-400">Lesson #04 • Full-Stack Architecture</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              1,240 Enrolled
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span>Curriculum Progress</span>
              <span className="text-emerald-400 font-bold">88%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full w-[88%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-900">
          <span>⚡ Ultra-low Latency</span>
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
    type: "Multi-Vendor Marketplace",
    description:
      "A feature-packed multi-vendor marketplace with automated seller onboarding, split escrow payments, order management and real-time tracking.",
    features: ["Multi-Vendor", "Split Escrow", "Dynamic Filter", "Seller Portal"],
    techStack: ["Next.js 16", "Redis", "Stripe Connect", "Prisma ORM"],
    impactMetric: "$2.4M+",
    impactLabel: "Annual GMV",
    tags: ["All Projects", "E-Commerce", "Web App", "Web Design"],
    mockup: (
      <div className="w-full h-48 rounded-t-2xl bg-zinc-950 p-3 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
            shopkart.store/marketplace
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">CART (3)</span>
        </div>

        <div className="my-auto py-1 grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-emerald-400">FEATURED</span>
              <span className="text-[9px] text-amber-300">★ 4.9</span>
            </div>
            <span className="text-xs font-bold text-white truncate">Smart Tech Bundle</span>
            <span className="text-xs font-mono font-extrabold text-emerald-300 mt-1">$249.00</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-teal-400">BESTSELLER</span>
              <span className="text-[9px] text-amber-300">★ 5.0</span>
            </div>
            <span className="text-xs font-bold text-white truncate">Pro Studio Audio</span>
            <span className="text-xs font-mono font-extrabold text-emerald-300 mt-1">$189.50</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-900">
          <span>🛡️ Automated Escrow</span>
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
      "A collaborative SaaS platform to manage agile projects, sprint velocity, automated workflows, and team productivity with real-time sync.",
    features: ["Kanban Sprints", "Gantt Timelines", "Team Analytics", "Automations"],
    techStack: ["React 19", "Node.js", "WebSockets", "Tailwind CSS"],
    impactMetric: "+45%",
    impactLabel: "Team Productivity",
    tags: ["All Projects", "SaaS App", "Web App", "Web Design"],
    mockup: (
      <div className="w-full h-48 rounded-t-2xl bg-zinc-950 p-3 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
            app.taskpro.io/kanban
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">SPRINT #12</span>
        </div>

        <div className="my-auto py-1 grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-emerald-500/30 flex flex-col text-left">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-emerald-400 font-bold">IN PROGRESS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white mt-1">API Integrations</span>
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800 text-[9px] text-zinc-400">
              <span>3 Subtasks</span>
              <span className="text-emerald-300 font-mono">Today</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col text-left">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-zinc-400 font-bold">DONE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-bold text-white mt-1">UX Design Sprint</span>
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800 text-[9px] text-zinc-400">
              <span>100% Passed</span>
              <span className="text-emerald-400 font-mono">✓ Ready</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-900">
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
      "An enterprise Cloud ERP unifying inventory, supply chain, automated invoicing, human resources, and real-time financial reporting.",
    features: ["Inventory Control", "Automated Payroll", "Tax Compliance", "Audit Trail"],
    techStack: ["Next.js", "GraphQL", "PostgreSQL", "Tailwind CSS"],
    impactMetric: "-62%",
    impactLabel: "Operational Overhead",
    tags: ["All Projects", "ERP Software", "Web App", "Dynamic Website"],
    mockup: (
      <div className="w-full h-48 rounded-t-2xl bg-zinc-950 p-3 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
            bizerp.cloud/analytics
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">ENTERPRISE</span>
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

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-900">
          <span>Inventory: <strong className="text-emerald-300">99.8% Optimal</strong></span>
          <span className="text-emerald-400 font-mono font-semibold">Audit Ready</span>
        </div>
      </div>
    ),
  },
  {
    id: "healthpulse",
    slug: "healthpulse",
    name: "HealthPulse",
    category: "Healthcare",
    type: "Telemedicine & EHR Portal",
    description:
      "HIPAA-compliant telehealth platform with secure video appointments, electronic health record vault, and digital prescription routing.",
    features: ["Video Consultations", "EHR Records", "Prescription Routing", "Doctor Calendar"],
    techStack: ["Next.js 16", "WebRTC", "HIPAA Cloud", "Tailwind CSS"],
    impactMetric: "40K+",
    impactLabel: "Monthly Consultations",
    tags: ["All Projects", "Web App", "SaaS App", "Dynamic Website"],
    mockup: (
      <div className="w-full h-48 rounded-t-2xl bg-zinc-950 p-3 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
            healthpulse.med/telehealth
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            HIPAA SECURE
          </span>
        </div>

        <div className="my-auto py-1 space-y-2">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Dr. Sarah Jenkins, MD</span>
                <span className="text-[10px] text-zinc-400">Cardiology • Tele-Session #12</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400">Connected</span>
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] text-zinc-400">
            <span>Patient Vitals: <strong className="text-white">Normal (98 bpm)</strong></span>
            <span className="text-emerald-400 font-mono">Encrypted E2E</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-900">
          <span>Prescription Sync: <strong className="text-emerald-300">Active</strong></span>
          <span className="text-emerald-400 font-mono font-semibold">256-bit AES</span>
        </div>
      </div>
    ),
  },
  {
    id: "propnest",
    slug: "propnest",
    name: "PropNest",
    category: "Real Estate",
    type: "Property Discovery Engine",
    description:
      "High-conversion luxury property portal featuring automated MLS feed sync, dynamic map exploration, 3D tours, and lead CRM.",
    features: ["MLS Feed Sync", "Interactive Maps", "Virtual 3D Tours", "Mortgage Calculator"],
    techStack: ["Next.js 16", "Mapbox GL", "Node.js", "Tailwind CSS"],
    impactMetric: "8.4x",
    impactLabel: "Qualified Inquiries",
    tags: ["All Projects", "Dynamic Website", "Web Design", "Web App"],
    mockup: (
      <div className="w-full h-48 rounded-t-2xl bg-zinc-950 p-3 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
            propnest.estate/villas
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">MAP VIEW</span>
        </div>

        <div className="my-auto py-1 grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col text-left">
            <span className="text-[9px] font-bold text-emerald-400 mb-0.5">EXCLUSIVE VILLA</span>
            <span className="text-xs font-bold text-white truncate">The Azure Bayfront</span>
            <span className="text-xs font-mono font-black text-emerald-300 mt-1">$1,850,000</span>
            <span className="text-[9px] text-zinc-400 mt-1">4 Beds • 3.5 Baths</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-emerald-500/20 flex flex-col justify-center items-center text-center">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-white">3D Virtual Tour</span>
            <span className="text-[8px] text-emerald-400">4K Walkthrough</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-900">
          <span>MLS Status: <strong className="text-emerald-300">Live Feed</strong></span>
          <span className="text-emerald-400 font-mono font-semibold">Verified Title</span>
        </div>
      </div>
    ),
  },
  {
    id: "finedge",
    slug: "finedge",
    name: "FinEdge",
    category: "FinTech",
    type: "Wealth & Portfolio Tracker",
    description:
      "Institutional-grade portfolio management and wealth dashboard with real-time market data, risk models, and automated tax reporting.",
    features: ["Live Market Stream", "Asset Allocation", "Risk Analytics", "Tax Optimization"],
    techStack: ["Next.js", "FastAPI", "WebSockets", "Tailwind CSS"],
    impactMetric: "$120M+",
    impactLabel: "Assets Tracked",
    tags: ["All Projects", "SaaS App", "Web App", "ERP Software"],
    mockup: (
      <div className="w-full h-48 rounded-t-2xl bg-zinc-950 p-3 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
            finedge.capital/terminal
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">PORTFOLIO</span>
        </div>

        <div className="my-auto py-1 space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Net Portfolio Value</span>
              <span className="text-sm font-mono font-black text-white">$1,248,390.20</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
              +24.6% All-Time
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="p-1 rounded bg-zinc-900 border border-zinc-800">
              <span className="text-[8px] text-zinc-400 block">Equities</span>
              <span className="text-[10px] font-mono font-bold text-white">58%</span>
            </div>
            <div className="p-1 rounded bg-zinc-900 border border-zinc-800">
              <span className="text-[8px] text-zinc-400 block">Bonds</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400">24%</span>
            </div>
            <div className="p-1 rounded bg-zinc-900 border border-zinc-800">
              <span className="text-[8px] text-zinc-400 block">Yield</span>
              <span className="text-[10px] font-mono font-bold text-teal-400">18%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-900">
          <span>Risk Score: <strong className="text-emerald-300">Moderate (1.12β)</strong></span>
          <span className="text-emerald-400 font-mono font-semibold">SEC Compliant</span>
        </div>
      </div>
    ),
  },
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(staticProjects);
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Dynamic filter categories derived from both base presets and any category present in active projects
  const filterCategories = useMemo(() => {
    const cats = new Set<string>(baseFilterCategories);
    projects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [projects]);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/portfolio?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && Array.isArray(data.projects)) {
          const dynamicList: ProjectItem[] = data.projects.map((p: any) => {
            const existingStatic = staticProjects.find((s) => s.slug === p.slug);
            return {
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
              techStack: Array.isArray(p.techStack)
                ? p.techStack
                : p.techStack
                ? p.techStack.split(",").map((s: string) => s.trim()).filter(Boolean)
                : ["Next.js 16", "TypeScript", "Tailwind CSS"],
              impactMetric: p.impactMetric || "+100%",
              impactLabel: p.impactLabel || "Efficiency",
              tags: Array.isArray(p.tags)
                ? p.tags
                : p.tags
                ? p.tags.split(",").map((s: string) => s.trim()).filter(Boolean)
                : ["All Projects"],
              mockup: p.image ? (
                <div className="w-full h-48 rounded-t-2xl bg-zinc-950 overflow-hidden relative group/mockup border-b border-zinc-800">
                  <img
                    src={p.image}
                    alt={p.title || p.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/mockup:scale-105"
                  />
                </div>
              ) : (
                existingStatic?.mockup || (
                  <div className="w-full h-48 rounded-t-2xl bg-zinc-950 p-3 flex flex-col justify-between border-b border-zinc-800 overflow-hidden relative group/mockup">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/90">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                        {p.slug}.io
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE
                      </span>
                    </div>
                    <div className="my-auto py-2 text-center">
                      <div className="text-sm font-bold text-white">{p.title || p.name}</div>
                      <div className="text-[10px] text-emerald-400 mt-1">{p.type}</div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-900">
                      <span>⚡ Enterprise UI</span>
                      <span className="text-emerald-300 font-semibold">{p.category}</span>
                    </div>
                  </div>
                )
              ),
            };
          });
          setProjects(dynamicList);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync sticky offset with Navbar's smart hide/show scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          // Scrolling down -> Navbar hides -> Filter bar sticks flush at top-0
          setNavVisible(false);
        } else if (lastScrollY - currentScrollY > 6) {
          // Scrolling up -> Navbar slides in -> Filter bar sits below Navbar
          setNavVisible(true);
        }
      } else {
        // At top of page -> Navbar is visible
        setNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);



  // Filtering + Searching logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter =
        activeFilter === "All Projects" ||
        project.tags.includes(activeFilter) ||
        project.category === activeFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.type.toLowerCase().includes(q) ||
        project.features.some((f) => f.toLowerCase().includes(q)) ||
        project.techStack.some((t) => t.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-white relative text-zinc-900">
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute top-96 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Decorative Dotted Grid */}
      <div className="absolute inset-0 pointer-events-none -z-0 opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="portfolio-page-dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#000000" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#portfolio-page-dots)" />
        </svg>
      </div>

      {/* Main Navbar */}
      <Navbar />

      <main className="flex-1 w-full relative z-10">
        {/* Page Hero Header */}
        <section className="pt-10 sm:pt-14 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Breadcrumb / Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
                OUR COMPLETE WORK PORTFOLIO
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.12]">
              Real Solutions. <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent">
                Measurable Business Impact.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base lg:text-lg text-zinc-600 font-normal leading-relaxed mt-5 max-w-2xl">
              Explore our curated portfolio of bespoke web applications, enterprise software, SaaS platforms, and conversion-engineered digital products built for forward-thinking brands.
            </p>

            {/* Metrics Quick Bar */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">50+</div>
                <div className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider mt-0.5">Projects Delivered</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">99%</div>
                <div className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider mt-0.5">Client Rating</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">8+</div>
                <div className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider mt-0.5">Industry Sectors</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">100%</div>
                <div className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider mt-0.5">On-Time Launch</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar Section (Sticky Fixed on Scroll) */}
        <section
          className={`sticky z-40 bg-white/95 backdrop-blur-xl border-y border-zinc-200/80 shadow-md shadow-zinc-950/5 py-3.5 transition-all duration-300 ease-in-out ${
            navVisible ? "top-20 sm:top-24" : "top-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Filter Pills with Horizontal Scroll on Mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full scrollbar-none py-1 w-full md:w-auto">
              {filterCategories.map((filter) => {
                const isSelected = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 scale-[1.02]"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* Search Input & View Switcher */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64 md:w-56 lg:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, tech..."
                  className="w-full pl-9 pr-8 py-2 rounded-full text-xs sm:text-sm bg-zinc-50 border border-zinc-200/90 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
                <svg
                  className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700 text-xs font-bold"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Mode Toggle (Grid vs List) */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-emerald-600 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "list" ? "bg-white text-emerald-600 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3.01" y1="6" y2="6" />
                    <line x1="3" x2="3.01" y1="12" y2="12" />
                    <line x1="3" x2="3.01" y1="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Display Area */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Summary */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-100 mb-8">
            <span className="text-xs sm:text-sm font-semibold text-zinc-500">
              Showing <strong className="text-zinc-900">{filteredProjects.length}</strong> of {projects.length} curated projects
              {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
            </span>

            {searchQuery || activeFilter !== "All Projects" ? (
              <button
                onClick={() => {
                  setActiveFilter("All Projects");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                Reset all filters
              </button>
            ) : null}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No matching projects found</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Try searching for a different keyword or clear your active category filter.
              </p>
              <button
                onClick={() => {
                  setActiveFilter("All Projects");
                  setSearchQuery("");
                }}
                className="mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                View All Projects
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View: 3 Columns on Large Screens */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 items-stretch">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative flex flex-col justify-between h-full rounded-3xl bg-white hover:bg-emerald-50/15 border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                >
                  {/* Mockup Preview */}
                  <div className="w-full relative transition-transform duration-300 group-hover:scale-[1.01]">
                    {project.mockup}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top Row: Category + Impact Pill */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          {project.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-right">
                          <span className="text-xs font-mono font-black text-emerald-600">{project.impactMetric}</span>
                          <span className="text-[10px] text-zinc-500">{project.impactLabel}</span>
                        </div>
                      </div>

                      {/* Project Name & Subtitle */}
                      <h2 className="text-xl font-black text-zinc-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                        {project.name}
                      </h2>
                      <span className="text-xs font-medium text-emerald-800 block mt-0.5">
                        {project.type}
                      </span>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed mt-3">
                        {project.description}
                      </p>

                      {/* Features Badges */}
                      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap gap-1.5">
                        {project.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-emerald-50/80 border border-emerald-100 text-[10px] font-semibold text-emerald-800"
                          >
                            ✓ {feature}
                          </span>
                        ))}
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="mt-3 flex flex-wrap items-center gap-1">
                        <span className="text-[9px] font-mono text-zinc-400 mr-1">TECH:</span>
                        {project.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-zinc-100 text-[9px] font-mono text-zinc-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-3 border-t border-zinc-100">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-emerald-600 hover:text-white border border-emerald-200/80 hover:border-transparent shadow-2xs hover:shadow-md hover:shadow-emerald-500/20 transition-all duration-300 group/btn"
                      >
                        <span>View Detailed Case Study</span>
                        <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group rounded-2xl bg-white border border-zinc-200 hover:border-emerald-300 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        {project.category}
                      </span>
                      <span className="text-xs font-medium text-zinc-500">{project.type}</span>
                      <span className="text-xs font-mono font-bold text-emerald-600 ml-auto md:ml-2">
                        {project.impactMetric} {project.impactLabel}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-zinc-900 group-hover:text-emerald-700 transition-colors">
                      {project.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-3xl">
                      {project.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {project.features.map((feat, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-semibold text-emerald-800">
                          ✓ {feat}
                        </span>
                      ))}
                      <div className="hidden sm:flex items-center gap-1.5 ml-2">
                        {project.techStack.map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-mono text-zinc-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto">
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-500/20 transition-all duration-200"
                    >
                      <span>View Case Study</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Project Inquiry / Call to Action Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-emerald-50/20 to-white border-t border-zinc-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-emerald-200/90 shadow-xl shadow-emerald-950/5 relative overflow-hidden">
              {/* Subtle ambient corner flare */}
              <div
                className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs mb-4 text-[10px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
                START YOUR PROJECT
              </span>

              <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight leading-tight">
                Have a Project in Mind? <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent">
                  Let&apos;s Build Something Exceptional.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto mt-4 leading-relaxed">
                Whether you need a full SaaS build, an e-commerce platform, or a modern business website — our team turns your technical vision into high-performing reality.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition-all duration-300"
                >
                  <span>Request Free Proposal &amp; Quote</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-bold text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-xs transition-colors"
                >
                  <span>Back to Home</span>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Free Architecture Consultation
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Non-Disclosure Agreement (NDA)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> 24-Hour Proposal Turnaround
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern IT Software Company Footer */}
      <Footer />

      {/* Floating Actions: WhatsApp Chat & Back to Top Arrow */}
      <FloatingActions />
    </div>
  );
}
