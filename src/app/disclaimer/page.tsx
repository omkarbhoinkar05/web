import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: {
    absolute: "Disclaimer | KeyCodeWeb — Building a Brighter Web",
  },
  description:
    "Read the legal disclaimer, liability limitations, and case study notices regarding information presented by KeyCodeWeb.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  const sections = [
    { id: "general", title: "1. General Information Only" },
    { id: "accuracy", title: "2. Accuracy & Updates" },
    { id: "case-studies", title: "3. Case Studies & ROI Metrics" },
    { id: "third-parties", title: "4. Third-Party Services & Links" },
    { id: "professional-advice", title: "5. Professional Advice Notice" },
    { id: "availability", title: "6. 'As Is' Availability" },
    { id: "trademarks", title: "7. Trademarks & Brand Names" },
    { id: "contact", title: "8. Inquiries & Clarifications" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Page Header */}
        <section className="relative pt-12 sm:pt-16 pb-12 sm:pb-16 bg-gradient-to-b from-emerald-50/40 via-white to-white border-b border-zinc-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
                LEGAL NOTICES &amp; CLARIFICATIONS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
              Website Disclaimer
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 mt-3 max-w-3xl leading-relaxed">
              This Disclaimer outlines the limitations of liability, informational boundaries, and representations regarding our engineering portfolio case studies, technology estimations, and digital services.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mt-4 pt-4 border-t border-zinc-200/60">
              <span>Effective Date: January 1, 2026</span>
              <span>•</span>
              <span>Last Reviewed: September 2026</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Official Publication</span>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
            {/* Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-xs">
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-emerald-800 mb-3">
                Contents Index
              </h3>
              <nav className="space-y-1.5 text-xs">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block py-1 text-zinc-600 hover:text-emerald-700 hover:translate-x-0.5 transition-all font-medium truncate"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-5 border-t border-zinc-200/80 text-[11px] text-zinc-500">
                <span className="font-bold text-zinc-800 block mb-1">Direct Counsel</span>
                <span>Contact legal desk: </span>
                <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                  dev.omkar05@gmail.com
                </a>
              </div>
            </aside>

            {/* Content Body */}
            <div className="lg:col-span-8 space-y-10 text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
              <section id="general" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  1. General Information Only
                </h2>
                <p>
                  The information provided on this website by KeyCodeWeb (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is for general informational and demonstration purposes only. While we endeavor to keep all code samples, service descriptions, and technical specifications up to date and correct, we make no representations or warranties of any kind, express or implied, regarding completeness or availability.
                </p>
              </section>

              <section id="accuracy" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  2. Accuracy &amp; Code Estimates
                </h2>
                <p>
                  Any technical specifications, budget calculators, sprint estimates, or timeline ranges published on this website are approximate and intended as preliminary guides. Formal engineering commitments, pricing, and project milestones are established exclusively via signed contractual Statements of Work (SOW).
                </p>
              </section>

              <section id="case-studies" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  3. Case Studies &amp; Performance Metrics
                </h2>
                <p>
                  Performance benchmarks, Core Web Vitals scores (such as 99+ Speed Index), and commercial growth metrics (e.g. &ldquo;+310% Enrollment&rdquo; or &ldquo;8.4x Inquiries&rdquo;) cited in our Portfolio and case studies represent specific past client implementations under defined test environments.
                </p>
                <div className="my-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs sm:text-sm text-zinc-700">
                  <span className="font-bold text-zinc-900 block mb-0.5">✦ Business Variability</span>
                  Individual outcomes for your enterprise will naturally depend on numerous variables beyond our control, including market demand, product quality, third-party hosting conditions, and user acquisition campaigns.
                </div>
              </section>

              <section id="third-parties" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  4. Third-Party Services &amp; External Links
                </h2>
                <p>
                  Our website contains external links to third-party services (such as GitHub, WhatsApp, Google Calendar, and social media platforms). We do not control, endorse, or assume responsibility for the content, privacy practices, or availability of any third-party websites or services.
                </p>
              </section>

              <section id="professional-advice" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  5. No Legal, Financial or Tax Advice
                </h2>
                <p>
                  Content published on our blog, insights, or service pages relating to e-commerce, cloud compliance (e.g. HIPAA, PCI-DSS), or corporate software does not constitute formal legal, financial, or tax counsel. Clients must consult certified legal and compliance professionals for jurisdictional regulatory requirements.
                </p>
              </section>

              <section id="availability" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  6. &ldquo;As Is&rdquo; and &ldquo;As Available&rdquo;
                </h2>
                <p>
                  This website and its digital assets are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of uninterrupted operation, freedom from transient transmission errors, or immunity from third-party cyber attacks on public networks.
                </p>
              </section>

              <section id="trademarks" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  7. Trademarks &amp; Attribution
                </h2>
                <p>
                  All logos, company marks, and product names (such as Next.js, React, Node.js, AWS, Tailwind CSS, Google, Apple) referenced across our website remain the property of their respective trademark holders. Their mention indicates technological interoperability and does not imply direct commercial endorsement.
                </p>
              </section>

              <section id="contact" className="scroll-mt-28 pt-4 border-t border-zinc-200">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  8. Inquiries &amp; Clarifications
                </h2>
                <p>
                  For any questions regarding this Disclaimer or to request formal verification:
                </p>

                <div className="mt-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs sm:text-sm">
                  <div>
                    <strong>Organization:</strong> KeyCodeWeb Software &amp; Digital Solutions
                  </div>
                  <div>
                    <strong>Location:</strong> Kharghar, Navi Mumbai, Maharashtra, India
                  </div>
                  <div>
                    <strong>Telephone:</strong>{" "}
                    <a href="tel:+919920818481" className="font-bold text-emerald-700 hover:underline">
                      +91 99208 18481
                    </a>
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                      dev.omkar05@gmail.com
                    </a>
                  </div>
                </div>
              </section>

              {/* Bottom Quick Switcher */}
              <div className="pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
                <Link href="/cookie-policy" className="text-zinc-600 hover:text-zinc-950 flex items-center gap-1">
                  <span>←</span> Cookie Policy
                </Link>
                <Link href="/sitemap" className="text-emerald-700 hover:underline flex items-center gap-1">
                  View Sitemap <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
