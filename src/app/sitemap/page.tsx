import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Sitemap | PixelForge",
  description: "Complete navigation index of all pages, features and sections on PixelForge.",
};

export default function SitemapPage() {
  const sitemapGroups = [
    {
      title: "Core Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { name: "Our Portfolio", href: "/portfolio" },
        { name: "Careers (Join Us)", href: "/careers" },
        { name: "Blog & Insights", href: "/blog" },
      ],
    },
    {
      title: "Home Sections",
      links: [
        { name: "Company Overview", href: "/#about" },
        { name: "Our Services", href: "/#services" },
        { name: "Development Process", href: "/#process" },
        { name: "Featured Portfolio", href: "/#portfolio" },
        { name: "Client Testimonials", href: "/#testimonials" },
        { name: "Contact & Inquiries", href: "/#contact" },
      ],
    },
    {
      title: "Services & Capabilities",
      links: [
        { name: "Web Design & UI/UX", href: "/#services" },
        { name: "SaaS Application Development", href: "/#services" },
        { name: "Custom ERP Software", href: "/#services" },
        { name: "E-Commerce Platforms", href: "/#services" },
        { name: "Dynamic Web Applications", href: "/#services" },
        { name: "Custom Web Solutions", href: "/#services" },
        { name: "Hosting & Cloud Deployment", href: "/#services" },
        { name: "Maintenance & SLA Support", href: "/#services" },
      ],
    },
    {
      title: "Legal & Policies",
      links: [
        { name: "Terms & Conditions", href: "/terms-and-conditions" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Refund & Cancellation Policy", href: "/refund-policy" },
        { name: "Cookie Policy", href: "/cookie-policy" },
        { name: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
            SITE DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 mt-2 tracking-tight">
            PixelForge Sitemap
          </h1>
          <p className="text-sm text-zinc-600 mt-3 font-normal">
            Quickly navigate to any page, service offering, or resource across our entire platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {sitemapGroups.map((group, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-zinc-50/70 border border-zinc-200/90 shadow-xs flex flex-col"
            >
              <h2 className="text-sm font-black text-zinc-900 uppercase tracking-wider border-b border-zinc-200/80 pb-3 mb-4">
                {group.title}
              </h2>
              <ul className="space-y-2.5 flex-1">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      <span className="text-emerald-500 text-xs transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 text-center max-w-xl mx-auto">
          <h3 className="text-lg font-black text-zinc-900">Need Immediate Assistance?</h3>
          <p className="text-xs text-zinc-600 mt-1">
            Our software engineers in Kharghar, Navi Mumbai are ready to help.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            >
              Contact Us →
            </Link>
            <a
              href="tel:+919920818481"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-zinc-800 bg-white border border-zinc-200 shadow-2xs"
            >
              +91 99208 18481
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
