"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  checklist: string[];
  buttonText: string;
  href: string;
  icon: React.ReactNode;
}

interface RawDbService {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description?: string | null;
  features: string;
  image?: string | null;
  icon?: string | null;
  buttonText?: string | null;
  href?: string | null;
  displayOrder: number;
  status: string;
}

function renderServiceIcon(iconKey?: string | null, slug?: string): React.ReactNode {
  const key = (iconKey || slug || "").toLowerCase();

  if (key === "monitor" || key.includes("web-design")) {
    return (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
        <circle cx="6" cy="7" r="1" />
        <circle cx="9" cy="7" r="1" />
      </svg>
    );
  }

  if (key === "cloud" || key.includes("saas")) {
    return (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        <path d="M12 13h.01" />
        <path d="M10 13a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1" />
      </svg>
    );
  }

  if (key === "erp" || key.includes("erp")) {
    return (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    );
  }

  if (key === "cart" || key.includes("ecom") || key.includes("commerce")) {
    return (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    );
  }

  if (key === "window" || key.includes("dynamic")) {
    return (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    );
  }

  if (key === "code" || key.includes("custom") || key.includes("app")) {
    return (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" x2="10" y1="4" y2="20" />
      </svg>
    );
  }

  if (key === "server" || key.includes("hosting")) {
    return (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="8" x="2" y="2" rx="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
      </svg>
    );
  }

  // Generic fallback
  return (
    <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function parseFeatures(features: string): string[] {
  if (!features) return [];
  if (features.startsWith("[") && features.endsWith("]")) {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback
    }
  }
  return features.split(",").map((s) => s.trim()).filter(Boolean);
}

// Initial Static Fallback to guarantee immediate zero-shift hydration
const STATIC_FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: "web-design",
    number: "01",
    title: "Web Design",
    description: "Modern, responsive and user-friendly web designs that create a strong online presence.",
    checklist: [
      "Corporate Website",
      "Business Website",
      "Landing Page",
      "Portfolio Website",
      "UI/UX Design",
      "Responsive Web Design",
      "Website Redesign",
      "Figma to Website",
    ],
    buttonText: "Contact Now →",
    href: "#contact",
    icon: renderServiceIcon("monitor", "web-design"),
  },
  {
    id: "saas-app",
    number: "02",
    title: "SaaS App Development",
    description: "Scalable and secure SaaS solutions tailored for modern businesses.",
    checklist: [
      "SaaS Platform",
      "Multi-Tenant SaaS",
      "Subscription Management",
      "User Management",
      "Role & Permission System",
      "Admin Dashboard",
      "Analytics Dashboard",
      "API Integration",
      "Payment Integration",
    ],
    buttonText: "Contact Now →",
    href: "#contact",
    icon: renderServiceIcon("cloud", "saas-app"),
  },
  {
    id: "erp-software",
    number: "03",
    title: "ERP Software",
    description: "Complete ERP solutions to streamline your business operations.",
    checklist: [
      "HR & Employee Management",
      "CRM",
      "Inventory Management",
      "Sales Management",
      "Purchase Management",
      "Accounting & Finance",
      "Payroll",
      "Project Management",
      "Reports & Analytics",
      "Admin / Super Admin Panel",
    ],
    buttonText: "Contact Now →",
    href: "#contact",
    icon: renderServiceIcon("erp", "erp-software"),
  },
  {
    id: "ecommerce",
    number: "04",
    title: "E-Commerce",
    description: "Feature-rich e-commerce solutions to take your business online.",
    checklist: [
      "B2B E-Commerce",
      "B2C E-Commerce",
      "Multi-Vendor Marketplace",
      "Product Management",
      "Order Management",
      "Payment Gateway",
      "Shipping Integration",
      "Coupon & Offers",
      "Customer Dashboard",
      "Seller Dashboard",
    ],
    buttonText: "Contact Now →",
    href: "#contact",
    icon: renderServiceIcon("cart", "ecommerce"),
  },
  {
    id: "dynamic-website",
    number: "05",
    title: "Dynamic Website",
    description: "Powerful dynamic websites with flexible content management.",
    checklist: [
      "CMS Website",
      "News / Blog Website",
      "Real Estate Website",
      "Education Website",
      "Booking Website",
      "Directory Website",
      "Membership Website",
      "Content Management",
      "Dynamic Forms",
      "Admin Panel",
    ],
    buttonText: "Contact Now →",
    href: "#contact",
    icon: renderServiceIcon("window", "dynamic-website"),
  },
  {
    id: "custom-web-app",
    number: "06",
    title: "Custom Web App",
    description: "Tailored web applications to solve your unique business challenges.",
    checklist: [
      "Business Web Applications",
      "Customer Portals",
      "Admin Panels",
      "Custom Dashboards",
      "Workflow Automation",
      "API Development",
      "Third-Party Integrations",
      "OTP Integration",
      "Payment Integration",
      "WhatsApp Integration",
    ],
    buttonText: "Contact Now →",
    href: "#contact",
    icon: renderServiceIcon("code", "custom-web-app"),
  },
  {
    id: "hosting",
    number: "07",
    title: "Hosting",
    description: "Reliable and secure hosting solutions to keep your business online 24/7.",
    checklist: [
      "Web Hosting",
      "Cloud Hosting",
      "VPS Hosting",
      "Managed Hosting",
      "Domain Management",
      "SSL Certificate",
      "Business Email",
      "Server Setup",
      "Website Migration",
      "Backup & Security",
      "Performance Optimization",
    ],
    buttonText: "Contact Now →",
    href: "#contact",
    icon: renderServiceIcon("server", "hosting"),
  },
];

export function ServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>(STATIC_FALLBACK_SERVICES);

  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.services) && data.services.length > 0) {
            const mapped: ServiceItem[] = data.services.map((item: RawDbService, idx: number) => {
              const orderNum = String(item.displayOrder || idx + 1).padStart(2, "0");
              const feats = parseFeatures(item.features);

              return {
                id: item.id || item.slug,
                number: orderNum,
                title: item.title,
                description: item.shortDescription || item.description || "",
                checklist: feats,
                buttonText: item.buttonText || "Contact Now →",
                href: item.href || "#contact",
                icon: renderServiceIcon(item.icon, item.slug),
              };
            });

            if (isMounted) {
              setServices(mapped);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic services, using static fallback:", err);
      }
    }

    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="services"
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-white select-none border-t border-zinc-100"
    >
      {/* Background Subtle Ambient Glow & Pattern */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.10),rgba(255,255,255,0))] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-100/40 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Decorative Dotted Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-0 opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="services-dots-white" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#000000" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#services-dots-white)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header: Badge, Heading, and Description */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs shadow-emerald-500/10 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
              OUR SERVICES
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15]">
            Complete Digital Solutions <br />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent inline-block">
              for Your Business
            </span>
          </h2>

          {/* Supporting Description */}
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl mt-4 sm:mt-5">
            From idea to launch, we provide end-to-end digital solutions to help you grow, automate and succeed in the modern world.
          </p>
        </div>

        {/* Main Services Grid: Dynamic Service Cards + 1 Custom Requirement CTA Card */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Dynamic Service Cards */}
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between h-full p-6 sm:p-7 rounded-3xl bg-white hover:bg-emerald-50/20 border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 hover:-translate-y-1.5"
            >
              <div>
                {/* Top Row: Number Badge & Service Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-mono font-bold text-emerald-700 tracking-wider">
                    {service.number}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs">
                    {service.icon}
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed mt-2.5">
                  {service.description}
                </p>

                {/* Checklist */}
                <div className="my-5 pt-4 border-t border-zinc-100 space-y-2">
                  {service.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-left">
                      <span className="text-emerald-600 font-bold text-xs shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="text-xs text-zinc-700 font-medium leading-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Explore Button */}
              <div className="pt-4">
                <Link
                  href={service.href}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-emerald-600 hover:text-white border border-emerald-200/80 hover:border-transparent shadow-2xs hover:shadow-md hover:shadow-emerald-500/25 transition-all duration-300 group/btn"
                >
                  <span>{service.buttonText}</span>
                </Link>
              </div>
            </div>
          ))}

          {/* 8th Card: Custom Requirement CTA Card (Striking Dark Emerald Glass Hero) - PRESERVED 100% */}
          <div className="relative group flex flex-col justify-between h-full p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white border border-emerald-700/50 shadow-xl shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden">
            {/* Subtle corner abstract green graphic */}
            <div
              className="absolute -bottom-10 -right-10 w-44 h-44 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            <div>
              {/* Small Label */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-emerald-400/30 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-[10px] font-extrabold tracking-[0.16em] uppercase text-white">
                  LET&apos;S WORK TOGETHER
                </span>
              </div>

              {/* Main CTA Heading */}
              <h3 className="text-2xl sm:text-[26px] font-black text-white tracking-tight leading-tight">
                Have a <br />
                <span className="text-emerald-300">Custom Requirement?</span>
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-emerald-100/90 font-normal leading-relaxed mt-3">
                Let&apos;s discuss your project and build the right solution for you.
              </p>

              {/* Primary CTA Button */}
              <div className="mt-6">
                <Link
                  href="#contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-black text-emerald-950 bg-white hover:bg-emerald-50 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>Get a Free Consultation →</span>
                </Link>
              </div>

              {/* Three Feature Rows Below Button */}
              <div className="mt-6 pt-5 border-t border-emerald-700/50 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-white font-semibold">
                  <span className="text-emerald-300">⚡</span>
                  <span>Fast Response</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white font-semibold">
                  <span className="text-emerald-300">👤</span>
                  <span>Expert Guidance</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white font-semibold">
                  <span className="text-emerald-300">⚙</span>
                  <span>Tailored Solutions</span>
                </div>
              </div>
            </div>

            {/* Handwritten-style quote at bottom */}
            <div className="mt-6 pt-4 border-t border-emerald-700/50 flex items-center justify-between">
              <span className="font-handwriting text-emerald-200 text-lg sm:text-xl font-bold rotate-[-3deg] leading-tight">
                Turn Your Ideas <br />
                Into Reality
              </span>
              <svg className="w-7 h-7 text-emerald-300 rotate-12 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
