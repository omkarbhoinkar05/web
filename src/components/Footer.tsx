"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useScheduleCall } from "@/components/schedule/ScheduleCallContext";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterError, setNewsletterError] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/" || pathname === "";
  const { openScheduleCall } = useScheduleCall();

  // Mobile accordion open states
  const [servicesOpen, setServicesOpen] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);

  // Smart Link Click Handler for cross-page & same-page anchors
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // 1. If it's a hash anchor on the home page (e.g. /#services, /#contact, /#process, etc.)
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (isHome) {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 85;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
          window.history.pushState(null, "", href);
        }
      } else {
        // Navigating from /about-us, /portfolio, /careers, etc. to Home section
        e.preventDefault();
        try {
          sessionStorage.setItem("scroll_target", targetId);
        } catch {}
        router.push(href);
      }
      return;
    }

    // 2. If it's link to Home and we are already on Home
    if (href === "/" && isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      return;
    }

    // 3. If clicking current page link (e.g. on /about-us and clicking /about-us)
    if (href === pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterError("Please enter your email address.");
      setNewsletterStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail.trim())) {
      setNewsletterError("Please enter a valid email address.");
      setNewsletterStatus("error");
      return;
    }

    setNewsletterError("");
    setNewsletterStatus("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setNewsletterStatus("success");
      setNewsletterEmail("");
      setTimeout(() => setNewsletterStatus("idle"), 5000);
    } catch {
      setNewsletterStatus("error");
      setNewsletterError("Something went wrong. Please try again.");
      setTimeout(() => setNewsletterStatus("idle"), 4000);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const serviceLinks = [
    { name: "Web Design", href: "/#services" },
    { name: "SaaS App Development", href: "/#services" },
    { name: "ERP Software", href: "/#services" },
    { name: "E-Commerce", href: "/#services" },
    { name: "Dynamic Website", href: "/#services" },
    { name: "Custom Web App", href: "/#services" },
    { name: "Hosting & Domain", href: "/#services" },
    { name: "Maintenance & Support", href: "/#services" },
    { name: "Other IT Solutions", href: "/#services" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Our Services", href: "/#services" },
    { name: "Our Process", href: "/#process" },
    { name: "Our Portfolio", href: "/portfolio" },
    { name: "Careers", href: "/careers" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Blog / Insights", href: "/blog" },
    { name: "Contact Us", href: "/#contact" },
  ];

  const legalLinks = [
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Disclaimer", href: "/disclaimer" },
    { name: "Sitemap", href: "/sitemap" },
  ];

  const trustPoints = [
    {
      title: "Innovative Solutions",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      ),
    },
    {
      title: "Reliable & Secure",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Expert Team",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Ongoing Support",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-white text-zinc-900 select-none border-t border-zinc-100">
      {/* Background Subtle Ambient Glow */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.10),rgba(255,255,255,0))] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/35 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-gradient-to-tl from-emerald-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Decorative Dotted Grid */}
      <div className="absolute inset-0 pointer-events-none -z-0 opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-dots-white" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#000000" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-dots-white)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 z-10">
        {/* TOP CTA BANNER with DECORATIVE CTA TEXT */}
        <div className="relative mb-16 sm:mb-20 rounded-3xl bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-emerald-50/70 border border-emerald-200/90 p-8 sm:p-10 lg:p-12 shadow-sm overflow-hidden">
          {/* Ambient subtle glow inside banner */}
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left side text */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 max-w-2xl">
              <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight leading-tight">
                  Ready to Turn Your Ideas Into Reality?
                </h3>
                <p className="text-sm sm:text-base text-zinc-600 mt-2 font-normal">
                  Let&apos;s discuss your project and build something amazing together.
                </p>
              </div>
            </div>

            {/* Right side CTA buttons + Handwritten callout */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative">
              <Link
                href="/#contact"
                onClick={(e) => handleLinkClick(e, "/#contact")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-500/20 active:scale-95 transition-all duration-300 group/cta cursor-pointer"
              >
                <span>Start Your Project</span>
                <span className="transition-transform duration-200 group-hover/cta:translate-x-1">→</span>
              </Link>

              <button
                type="button"
                onClick={(e) => openScheduleCall(e.currentTarget)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-2xs active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span>Schedule a Call</span>
              </button>

              {/* Handwritten text on the far right */}
              <div className="hidden xl:flex items-center gap-1.5 absolute -right-44 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-8 h-8 text-emerald-600 rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-handwriting text-emerald-800 text-sm font-bold leading-tight text-left">
                  Let&apos;s <br />
                  Build Together
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN FOOTER AREA (5 Columns on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-zinc-100">
          {/* COLUMN 01 — BRAND (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Real Project Logo */}
            <Link
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="inline-flex items-center group focus:outline-none"
              aria-label="KeyCodeWeb Homepage"
            >
              <Image
                src="/logo-trimmed.png"
                alt="KeyCodeWeb - Ideas | Code | Digital Growth"
                width={220}
                height={51}
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Tagline & Description */}
            <p className="text-sm font-bold text-emerald-800">
              Digital Solutions for a Better Tomorrow
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm">
              We are a software development company passionate about creating innovative digital solutions that help businesses grow, automate and succeed in the modern world.
            </p>

            {/* Brand Trust Features */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {trustPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-200/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    {point.icon}
                  </div>
                  <span className="text-[11px] font-bold text-zinc-800 truncate">{point.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 02 — OUR SERVICES (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center justify-between cursor-pointer md:cursor-default"
            >
              <h4 className="text-sm font-black text-zinc-950 tracking-wider uppercase flex items-center gap-2">
                <span>Our Services</span>
              </h4>
              <span className="md:hidden text-lg text-emerald-600 font-bold">{servicesOpen ? "−" : "+"}</span>
            </div>

            <ul className={`mt-4 space-y-2 text-xs sm:text-sm ${servicesOpen ? "block" : "hidden md:block"}`}>
              {serviceLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="group inline-flex items-center gap-1.5 text-zinc-600 hover:text-emerald-700 transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="text-emerald-500 text-xs transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 03 — QUICK LINKS with OUR TEAM (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div
              onClick={() => setQuickLinksOpen(!quickLinksOpen)}
              className="flex items-center justify-between cursor-pointer md:cursor-default"
            >
              <h4 className="text-sm font-black text-zinc-950 tracking-wider uppercase flex items-center gap-2">
                <span>Quick Links</span>
              </h4>
              <span className="md:hidden text-lg text-emerald-600 font-bold">{quickLinksOpen ? "−" : "+"}</span>
            </div>

            <ul className={`mt-4 space-y-2 text-xs sm:text-sm ${quickLinksOpen ? "block" : "hidden md:block"}`}>
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="group inline-flex items-center gap-1.5 text-zinc-600 hover:text-emerald-700 transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="text-emerald-500 text-xs transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 04 — LEGAL (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div
              onClick={() => setLegalOpen(!legalOpen)}
              className="flex items-center justify-between cursor-pointer md:cursor-default"
            >
              <h4 className="text-sm font-black text-zinc-950 tracking-wider uppercase flex items-center gap-2">
                <span>Legal</span>
              </h4>
              <span className="md:hidden text-lg text-emerald-600 font-bold">{legalOpen ? "−" : "+"}</span>
            </div>

            <ul className={`mt-4 space-y-2 text-xs sm:text-sm ${legalOpen ? "block" : "hidden md:block"}`}>
              {legalLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="group inline-flex items-center gap-1.5 text-zinc-600 hover:text-emerald-700 transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="text-emerald-500 text-xs transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 05 — GET IN TOUCH & SOCIAL MEDIA (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-zinc-950 tracking-wider uppercase">
              Get in Touch
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* Phone */}
              <a href="tel:+919920818481" className="flex items-start gap-2.5 text-zinc-600 hover:text-emerald-700 group">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-zinc-900 group-hover:text-emerald-700 block">+91 99208 18481</span>
                  <span className="text-[10px] text-zinc-500">Mon – Sat, 9am – 7pm</span>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:dev.omkar05@gmail.com" className="flex items-start gap-2.5 text-zinc-600 hover:text-emerald-700 group">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-zinc-900 group-hover:text-emerald-700 block truncate">dev.omkar05@gmail.com</span>
                  <span className="text-[10px] text-zinc-500">24-hr turnaround</span>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-2.5 text-zinc-600">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-zinc-900 block">Kharghar</span>
                  <span className="text-[10px] text-zinc-500">Navi Mumbai, India</span>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919920818481"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-zinc-600 hover:text-emerald-700 group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-zinc-900 group-hover:text-emerald-700 block">WhatsApp Chat</span>
                  <span className="text-[10px] text-zinc-500">Instant Support</span>
                </div>
              </a>
            </div>

            {/* Social Media */}
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                Follow Us
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 flex items-center justify-center text-zinc-700 hover:text-emerald-700 hover:scale-110 transition-all shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.75-1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 flex items-center justify-center text-zinc-700 hover:text-emerald-700 hover:scale-110 transition-all shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 flex items-center justify-center text-zinc-700 hover:text-emerald-700 hover:scale-110 transition-all shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 flex items-center justify-center text-zinc-700 hover:text-emerald-700 hover:scale-110 transition-all shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* NEWSLETTER SECTION */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-zinc-50/80 hover:bg-emerald-50/30 border border-zinc-200/80 flex flex-col lg:flex-row items-center justify-between gap-6 transition-colors shadow-2xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-black text-zinc-950">Subscribe to Our Newsletter</h4>
              <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                Get the latest updates, insights and offers straight to your inbox.
              </p>
            </div>
          </div>

          <form onSubmit={handleNewsletterSubmit} noValidate className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterError) setNewsletterError("");
                }}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-full bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {newsletterError && (
                <span className="absolute -bottom-5 left-3 text-[10px] text-rose-600 font-semibold">
                  {newsletterError}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={newsletterStatus === "loading"}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-500/20 active:scale-95 transition-all duration-200 shrink-0 cursor-pointer disabled:opacity-75"
            >
              {newsletterStatus === "loading" ? "Subscribing..." : newsletterStatus === "success" ? "Subscribed ✓" : "Subscribe →"}
            </button>
          </form>
        </div>

        {/* TRUST / BENEFITS BAR (4 Items) */}
        <div className="mt-10 pt-8 border-t border-zinc-100 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          {/* Trust Item 1 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-zinc-900 block">100% Confidential</span>
              <span className="text-[11px] text-zinc-500">Your data is safe with us</span>
            </div>
          </div>

          {/* Trust Item 2 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-zinc-900 block">Dedicated Support</span>
              <span className="text-[11px] text-zinc-500">We&apos;re always here for you</span>
            </div>
          </div>

          {/* Trust Item 3 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-zinc-900 block">Trusted by 250+ Clients</span>
              <span className="text-[11px] text-zinc-500">Across multiple industries</span>
            </div>
          </div>

          {/* Trust Item 4 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-zinc-900 block">5+ Years Experience</span>
              <span className="text-[11px] text-zinc-500">Delivering real business value</span>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER BAR with SCROLL TO TOP */}
        <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            <span>© 2026 KeyCodeWeb. All rights reserved.</span>
          </div>

          <div className="text-center font-medium">
            <span>Made with ❤️ in India | Innovate • Develop • Grow Together</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 text-xs font-bold text-zinc-700 hover:text-emerald-700 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
              aria-label="Back to Top"
            >
              <span>Back to Top</span>
              <span>↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
