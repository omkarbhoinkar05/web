import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BottomBar } from "@/components/BottomBar";

interface CaseStudyData {
  slug: string;
  name: string;
  category: string;
  type: string;
  tagline: string;
  overview: string;
  client: string;
  duration: string;
  deliverables: string[];
  challenge: string;
  solution: string;
  metrics: { value: string; label: string }[];
  techStack: string[];
  features: { title: string; desc: string }[];
}

const caseStudies: Record<string, CaseStudyData> = {
  edulearn: {
    slug: "edulearn",
    name: "EduLearn",
    category: "EdTech",
    type: "Interactive Online Learning & Live Class Platform",
    tagline: "Empowering 50,000+ students with ultra-low latency live classes and automated LMS.",
    overview:
      "EduLearn required a modern digital transformation to scale live classroom streaming, manage multi-tier course enrollments, track student attendance automatically, and handle global credit card and local UPI transactions securely.",
    client: "EduLearn Global Academy",
    duration: "10 Weeks",
    deliverables: ["Next.js LMS Architecture", "WebRTC Video Engine", "Stripe Checkout", "Teacher Analytics"],
    challenge:
      "The legacy platform suffered from high video lag during peak lecture hours, clunky student onboarding, and disjointed course progress tracking that led to high drop-off rates.",
    solution:
      "We engineered a custom Next.js 16 and WebRTC architecture with edge-cached course assets, interactive real-time quiz popups, automated certificate issuance, and frictionless checkout.",
    metrics: [
      { value: "+310%", label: "Student Enrollment Growth" },
      { value: "0.2s", label: "Average Lesson Load Time" },
      { value: "99.98%", label: "Platform Uptime SLA" },
      { value: "4.9/5", label: "Student Satisfaction Score" },
    ],
    techStack: ["Next.js 16", "TypeScript", "Tailwind CSS", "WebRTC", "PostgreSQL", "Prisma", "Stripe"],
    features: [
      {
        title: "Sub-Second Live Video Streaming",
        desc: "Built-in low latency video rooms with screen sharing, participant hand-raising, and live chat moderations.",
      },
      {
        title: "Automated Student Assessment",
        desc: "Interactive quizzes and assignments graded instantaneously with real-time feedback and performance analytics.",
      },
      {
        title: "Multi-Currency Global Checkout",
        desc: "Secure international and domestic payment flows with automated VAT invoicing and receipt generation.",
      },
    ],
  },
  shopkart: {
    slug: "shopkart",
    name: "ShopKart",
    category: "E-Commerce",
    type: "High-Scale Multi-Vendor Marketplace",
    tagline: "Unifying 200+ merchants and thousands of daily shoppers on a blazingly fast store.",
    overview:
      "ShopKart needed an enterprise multi-vendor e-commerce platform capable of handling flash sales, complex seller commission splits, real-time inventory synchronization, and automated courier tracking.",
    client: "ShopKart Retail Technologies",
    duration: "12 Weeks",
    deliverables: ["Merchant Dashboard", "Buyer Experience Portal", "Stripe Connect Escrow", "Shipping API Integration"],
    challenge:
      "Previous storefront struggled with high cart abandonment due to multi-second page loads, poor mobile UI, and tedious manual reconciliation of vendor commission payouts.",
    solution:
      "We built a headless e-commerce experience using Next.js 16, Redis caching, and automated vendor commission routing via Stripe Connect, bringing checkout time down by 65%.",
    metrics: [
      { value: "$2.4M+", label: "Annual Gross Merchandise Value" },
      { value: "65%", label: "Faster Checkout Completion" },
      { value: "4.8x", label: "Mobile Conversion Surge" },
      { value: "200+", label: "Active Onboarded Merchants" },
    ],
    techStack: ["Next.js 16", "Redis", "Tailwind CSS", "Stripe Connect", "PostgreSQL", "ShipStation API"],
    features: [
      {
        title: "Multi-Vendor Escrow & Split Payments",
        desc: "Automated calculations that deduct marketplace fees and deposit net merchant earnings automatically.",
      },
      {
        title: "Instant Faceted Product Search",
        desc: "Sub-millisecond filtering across 50,000+ SKUs by brand, category, price, and customer rating.",
      },
      {
        title: "Real-Time Courier Tracking",
        desc: "Live courier milestone notifications sent directly to buyers via automated WhatsApp and SMS alerts.",
      },
    ],
  },
  taskpro: {
    slug: "taskpro",
    name: "TaskPro",
    category: "SaaS App",
    type: "Agile Project Management & Team Collaboration Suite",
    tagline: "Streamlining workflow velocity for high-output product and engineering teams.",
    overview:
      "TaskPro is a modern SaaS platform designed to eliminate project clutter, synchronize cross-functional teams, and provide automated sprint reporting without bloated enterprise complexity.",
    client: "TaskPro Systems Inc.",
    duration: "9 Weeks",
    deliverables: ["Full SaaS Architecture", "Real-time Kanban", "Gantt Timeline Engine", "Role-based Access"],
    challenge:
      "Competitor tools were either overly complicated or lacked real-time websocket synchronization, causing sync conflicts and slowing team velocity.",
    solution:
      "Engineered an ultra-responsive UI with optimistic UI updates, drag-and-drop Kanban boards, automated time tracking, and bi-directional GitHub/Slack integrations.",
    metrics: [
      { value: "+45%", label: "Team Velocity Efficiency" },
      { value: "18,000+", label: "Active Daily Tasks Managed" },
      { value: "35ms", label: "WebSocket Sync Latency" },
      { value: "99.4%", label: "User Retention Rate" },
    ],
    techStack: ["React 19", "Next.js", "WebSockets", "Node.js", "Tailwind CSS", "PostgreSQL"],
    features: [
      {
        title: "Optimistic Kanban Drag-and-Drop",
        desc: "Instant card reordering with zero UI stutter, synced seamlessly across all connected teammates.",
      },
      {
        title: "Automated Sprint Burndown",
        desc: "Visual charts calculating projected delivery dates based on historical team velocity.",
      },
      {
        title: "Granular Team Permissions",
        desc: "Enterprise RBAC supporting owner, admin, contributor, and read-only client guest roles.",
      },
    ],
  },
  bizerp: {
    slug: "bizerp",
    name: "BizERP",
    category: "ERP Software",
    type: "Cloud ERP & Enterprise Resource Planning",
    tagline: "Consolidating finance, HR, warehouse inventory, and sales into one central single source of truth.",
    overview:
      "BizERP provides small-to-midsize enterprises with enterprise-grade resource planning, automated invoice generation, real-time stock alerts, and financial audit readiness.",
    client: "Apex Manufacturing & Trading",
    duration: "14 Weeks",
    deliverables: ["Warehouse Inventory Hub", "Payroll & Attendance Engine", "Invoicing & GST Module", "Executive Dashboard"],
    challenge:
      "The client used multiple disconnected spreadsheets, causing stockouts, billing discrepancies, and delayed financial month-end closes that took over two weeks.",
    solution:
      "Built a unified Cloud ERP system with automated barcode scanning, instant GST/VAT tax compliance, role-based approval hierarchies, and live cash flow forecasting.",
    metrics: [
      { value: "-62%", label: "Operational Overhead Reduction" },
      { value: "2 Days", label: "Month-End Close (from 14 days)" },
      { value: "99.8%", label: "Inventory Accuracy" },
      { value: "$480K+", label: "Quarterly Cost Savings" },
    ],
    techStack: ["Next.js 16", "GraphQL", "PostgreSQL", "Tailwind CSS", "Docker", "Node.js"],
    features: [
      {
        title: "Automated Stock Level Alerts",
        desc: "Predictive replenishment alerts trigger purchase orders when inventory hits threshold levels.",
      },
      {
        title: "One-Click GST & Tax Invoicing",
        desc: "Compliant digital tax invoices with QR codes, itemized discounts, and automated ledger postings.",
      },
      {
        title: "Biometric & Attendance Sync",
        desc: "Integrated employee biometric logging directly calculates monthly payroll and leave deductions.",
      },
    ],
  },
  healthpulse: {
    slug: "healthpulse",
    name: "HealthPulse",
    category: "Healthcare",
    type: "Telemedicine & EHR Clinical Portal",
    tagline: "Connecting patients with certified medical specialists in secure, HIPAA-compliant virtual rooms.",
    overview:
      "HealthPulse needed a secure, accessible web portal where patients can schedule consultations, join encrypted video calls, and securely download certified medical prescriptions.",
    client: "PulseCare Health Network",
    duration: "11 Weeks",
    deliverables: ["HIPAA WebRTC Portal", "Patient Health Record Vault", "Doctor Scheduling System", "Prescription Dispatcher"],
    challenge:
      "Strict data privacy regulations, complex doctor availability management, and unreliable video feeds on low-bandwidth rural connections.",
    solution:
      "Implemented an adaptive bitrate WebRTC pipeline, 256-bit AES encrypted EHR storage, and an automated SMS/WhatsApp calendar reminder service.",
    metrics: [
      { value: "40,000+", label: "Consultations Completed" },
      { value: "100%", label: "HIPAA & GDPR Compliance" },
      { value: "-75%", label: "Patient No-Show Rate" },
      { value: "4.9/5", label: "Patient Care Score" },
    ],
    techStack: ["Next.js 16", "WebRTC", "HIPAA Compliant Cloud", "Tailwind CSS", "Prisma"],
    features: [
      {
        title: "Encrypted HD Video Consultations",
        desc: "Browser-based video calls requiring zero downloads or plugins, optimized for both desktop and mobile.",
      },
      {
        title: "Digital Prescription Vault",
        desc: "Tamper-proof digital prescription generator signed with doctor cryptographic keys.",
      },
      {
        title: "Automated SMS Appointment Reminders",
        desc: "Multi-channel reminders dramatically reduce missed appointments and optimize clinic schedules.",
      },
    ],
  },
  propnest: {
    slug: "propnest",
    name: "PropNest",
    category: "Real Estate",
    type: "Luxury Property Discovery & MLS Portal",
    tagline: "Reimagining real estate exploration with dynamic map search and interactive virtual tours.",
    overview:
      "PropNest transforms luxury real estate shopping with interactive Mapbox geospatial mapping, high-definition 3D virtual walkthroughs, and an automated buyer-to-agent lead routing system.",
    client: "PropNest Realty Group",
    duration: "8 Weeks",
    deliverables: ["Geospatial Property Search", "MLS Automated Sync", "Virtual Tour Viewer", "Lead Conversion Funnel"],
    challenge:
      "Existing listing sites were cluttered, slow on mobile devices, and suffered from stale inventory data due to manual listing updates.",
    solution:
      "Built a blazingly responsive search experience with instant vector tile map clustering, automated hourly MLS sync, and mortgage calculator lead capture forms.",
    metrics: [
      { value: "8.4x", label: "Increase in Lead Inquiries" },
      { value: "1.2s", label: "Map Search Interaction Speed" },
      { value: "50,000+", label: "Monthly Active Homebuyers" },
      { value: "$180M+", label: "Real Estate Listed" },
    ],
    techStack: ["Next.js 16", "Mapbox GL", "Node.js", "Tailwind CSS", "PostgreSQL", "MLS API"],
    features: [
      {
        title: "Geospatial Boundary & Polygon Search",
        desc: "Draw custom search boundaries on the map to find homes in specific school districts and neighborhoods.",
      },
      {
        title: "3D Virtual Walkthrough Integration",
        desc: "Embedded 4K Matterport virtual tours allowing buyers to inspect properties room-by-room.",
      },
      {
        title: "Automated Mortgage Calculator",
        desc: "Live amortization and tax calculations calculate monthly commitments and pre-qualify leads.",
      },
    ],
  },
  finedge: {
    slug: "finedge",
    name: "FinEdge",
    category: "FinTech",
    type: "Wealth Management & Real-Time Portfolio Terminal",
    tagline: "Empowering investors with real-time portfolio analytics, automated rebalancing, and tax reporting.",
    overview:
      "FinEdge is an institutional-grade portfolio dashboard tracking cross-asset investments including equities, fixed income, commodities, and alternative assets with live streaming telemetry.",
    client: "FinEdge Capital Advisors",
    duration: "10 Weeks",
    deliverables: ["Trading Terminal UI", "WebSocket Market Feed", "Asset Rebalancer", "Tax Optimization Export"],
    challenge:
      "High volume of tick data from multiple exchanges caused browser UI lag and inaccurate calculations in legacy desktop software.",
    solution:
      "Engineered a lightweight canvas and SVG charting engine with WebSocket streaming, local state batching, and automated capital gains tax calculation.",
    metrics: [
      { value: "$120M+", label: "Assets Under Management Tracked" },
      { value: "15ms", label: "Market Telemetry Latency" },
      { value: "99.99%", label: "Calculation Accuracy" },
      { value: "+32%", label: "Advisory Team Productivity" },
    ],
    techStack: ["Next.js", "FastAPI", "WebSockets", "Tailwind CSS", "Python Engine", "Redis"],
    features: [
      {
        title: "Cross-Asset Portfolio Telemetry",
        desc: "Consolidated real-time valuation of multi-currency assets with automated FX conversions.",
      },
      {
        title: "Automated Risk & Variance Modeling",
        desc: "Monte Carlo risk projections and Value at Risk (VaR) calculations updated in real time.",
      },
      {
        title: "Automated Tax Loss Harvesting",
        desc: "Smart suggestions identify tax optimization opportunities before fiscal year deadlines.",
      },
    ],
  },
  dineflow: {
    slug: "dineflow",
    name: "DineFlow",
    category: "Hospitality",
    type: "Restaurant Cloud POS & Kitchen Order System",
    tagline: "Accelerating table turnaround and kitchen fulfillment with touchless QR menus and live KDS.",
    overview:
      "DineFlow connects restaurant dining rooms, bars, and kitchen line cooks through real-time touchless order orchestration, reducing wait times and eliminating ordering errors.",
    client: "DineFlow Hospitality Suite",
    duration: "8 Weeks",
    deliverables: ["QR Dine-In Ordering", "Kitchen Display System (KDS)", "Waiter Mobile App", "Manager Dashboard"],
    challenge:
      "Staff shortages led to long wait times for menus and checks, while printed paper tickets in the kitchen resulted in misplaced orders and food waste.",
    solution:
      "Built a seamless mobile web QR ordering experience with instant table-side digital payment and real-time synchronized kitchen ticket displays (KDS).",
    metrics: [
      { value: "3.2x", label: "Faster Table Turnaround" },
      { value: "-80%", label: "Kitchen Order Errors" },
      { value: "+22%", label: "Average Check Size Increase" },
      { value: "100%", label: "Paper Ticket Elimination" },
    ],
    techStack: ["Next.js 16", "Socket.io", "Stripe Terminal", "Tailwind CSS", "Node.js"],
    features: [
      {
        title: "Touchless QR Menu & Instant Bill Pay",
        desc: "Guests scan, order, split bills, and pay with Apple Pay or Google Pay directly from their smartphone.",
      },
      {
        title: "Color-Coded Kitchen Display (KDS)",
        desc: "Cooking line orders update with preparation timers and priority alerts for expedited fulfillment.",
      },
      {
        title: "Dynamic Menu Stock Management",
        desc: "Sold-out items automatically disappear from digital menus instantly across all dining tables.",
      },
    ],
  },
};

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = caseStudies[slug.toLowerCase()];
  if (!project) {
    return {
      title: "Case Study | PixelForge",
      description: "Detailed client case study and project breakdown.",
    };
  }
  return {
    title: `${project.name} Case Study | PixelForge`,
    description: project.overview,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = caseStudies[slug.toLowerCase()];

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white relative text-zinc-900">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none -z-0"
        aria-hidden="true"
      />

      <Navbar />

      <main className="flex-1 w-full relative z-10">
        {/* Top Breadcrumb & Hero Header */}
        <section className="pt-8 sm:pt-12 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-zinc-900 transition-colors">Portfolio</Link>
            <span>/</span>
            <span className="text-emerald-700 font-bold">{project.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Header Info (col 8) */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
                  {project.category} CASE STUDY
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
                {project.name} — <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent">
                  {project.type}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed mt-5 max-w-3xl">
                {project.tagline}
              </p>

              <div className="mt-8 pt-6 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Client</span>
                  <span className="text-sm font-black text-zinc-900 mt-1 block">{project.client}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Duration</span>
                  <span className="text-sm font-black text-zinc-900 mt-1 block">{project.duration}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Service Category</span>
                  <span className="text-sm font-black text-emerald-700 mt-1 block">{project.category}</span>
                </div>
              </div>
            </div>

            {/* Right Quick Action Card (col 4) */}
            <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-sm">
              <h3 className="text-base font-black text-zinc-900">Project Deliverables</h3>
              <ul className="mt-4 space-y-2.5">
                {project.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-zinc-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-zinc-200/80">
                <Link
                  href="/#contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-500/25 transition-all duration-200"
                >
                  <span>Build a Similar Solution</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/portfolio"
                  className="w-full mt-2.5 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-zinc-700 hover:text-zinc-950 bg-white border border-zinc-200 transition-colors"
                >
                  <span>← All Projects</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Bar */}
        <section className="py-8 bg-zinc-50 border-y border-zinc-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
                  <div className="text-2xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-zinc-600 uppercase tracking-wider mt-1">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Challenge & Solution Section */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* The Challenge */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-zinc-200/90 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-500 block mb-2">
                01. THE PROBLEM
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                The Core Challenge
              </h2>
              <p className="text-sm text-zinc-600 font-normal leading-relaxed mt-4">
                {project.challenge}
              </p>
            </div>

            {/* The Solution */}
            <div className="p-7 sm:p-9 rounded-3xl bg-emerald-50/40 border border-emerald-200/90 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700 block mb-2">
                02. OUR APPROACH
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                The Engineering Solution
              </h2>
              <p className="text-sm text-zinc-700 font-normal leading-relaxed mt-4">
                {project.solution}
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Breakdown */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-100">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              FEATURE HIGHLIGHTS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 mt-3 tracking-tight">
              Architected For Maximum Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {project.features.map((feat, idx) => (
              <div key={idx} className="p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-mono font-black text-emerald-700 mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-black text-zinc-900 tracking-tight">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mt-2">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Pills */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-zinc-50 border border-zinc-200">
            <div>
              <h3 className="text-lg font-black text-zinc-900">Technologies &amp; Frameworks Deployed</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Engineered with modern, scalable, enterprise-tested stacks.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-xs font-mono font-bold text-zinc-800 shadow-2xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Consultation Callout */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-emerald-50/30 border-t border-zinc-100 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Ready to create your next digital success story?
            </h2>
            <p className="text-sm text-zinc-600 mt-3 max-w-xl mx-auto">
              Get in touch with our engineering team for a detailed discovery discussion and a comprehensive project roadmap.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <span>Request Free Proposal &amp; Timeline</span>
              </Link>
              <Link
                href="/portfolio"
                className="w-full sm:w-auto px-7 py-4 rounded-full text-sm font-bold text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-200 transition-colors"
              >
                <span>View More Case Studies</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-zinc-100 bg-white">
        <BottomBar />
      </footer>
    </div>
  );
}
