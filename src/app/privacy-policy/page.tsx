import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Privacy Policy | PixelForge — Building a Brighter Web",
  description:
    "Learn how PixelForge collects, utilizes, protects and manages client and visitor data in compliance with modern privacy standards.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "commitment", title: "1. Privacy Commitment" },
    { id: "collection", title: "2. Information We Collect" },
    { id: "usage", title: "3. How We Use Your Data" },
    { id: "confidentiality", title: "4. Client Project Confidentiality" },
    { id: "security", title: "5. Data Security & Storage" },
    { id: "third-parties", title: "6. Third-Party Cloud Services" },
    { id: "cookies", title: "7. Cookies & Tracking" },
    { id: "user-rights", title: "8. Your Privacy Rights" },
    { id: "retention", title: "9. Data Retention" },
    { id: "updates", title: "10. Policy Updates" },
    { id: "contact", title: "11. Contact Our Privacy Officer" },
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
                DATA PROTECTION &amp; PRIVACY
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
              Privacy Policy
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 mt-3 max-w-3xl leading-relaxed">
              At PixelForge, we value your privacy and are committed to protecting your personal data and proprietary business ideas. This policy explains what information we collect, how it is safeguarded, and how you can exercise your privacy rights.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mt-4 pt-4 border-t border-zinc-200/60">
              <span>Effective Date: January 1, 2026</span>
              <span>•</span>
              <span>Last Reviewed: September 2026</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">100% Confidential Guarantee</span>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
            {/* Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-xs">
              <h3 className="text-xs font-mono font-black uppercase tracking-wider text-emerald-800 mb-3">
                Table of Contents
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
                <span className="font-bold text-zinc-800 block mb-1">Privacy Officer</span>
                <span>Direct inquiries: </span>
                <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                  dev.omkar05@gmail.com
                </a>
              </div>
            </aside>

            {/* Content Body */}
            <div className="lg:col-span-8 space-y-10 text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
              <section id="commitment" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  1. Privacy Commitment
                </h2>
                <p>
                  PixelForge (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates as a trusted software engineering and web design partner for businesses worldwide. We strictly adhere to principles of transparency, minimal data collection, purpose limitation, and rigorous technical security.
                </p>
                <p className="mt-2.5">
                  <strong>We do NOT sell, rent, or trade your personal information</strong> with third-party advertisers or data brokers under any circumstances.
                </p>
              </section>

              <section id="collection" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  2. Information We Collect
                </h2>
                <p>
                  We only gather information necessary to provide services and communicate with you:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
                  <li>
                    <strong>Direct Inquiries:</strong> When you submit our project contact form or book a consultation call, we collect your Full Name, Email Address, Mobile Number, Project Budget, and Message details.
                  </li>
                  <li>
                    <strong>Careers &amp; Job Applications:</strong> When applying to join our team, we collect your contact information, resume/curriculum vitae (PDF, DOC), portfolio links, and career background.
                  </li>
                  <li>
                    <strong>Technical Usage Data:</strong> Non-identifying technical information such as browser type, device category, screen resolution, referring URLs, and approximate geographic region to ensure optimal site rendering.
                  </li>
                </ul>
              </section>

              <section id="usage" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  3. How We Use Your Data
                </h2>
                <p>
                  Your information is utilized solely for legitimate operational and business purposes:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
                  <li>To provide architectural proposals, technical quotes, and schedule discovery calls.</li>
                  <li>To execute contracted software engineering milestones and deliver deliverables.</li>
                  <li>To communicate project status updates, deployment milestones, and invoices.</li>
                  <li>To assess job candidate applications for open roles within our engineering team.</li>
                  <li>To maintain network integrity, prevent automated spam, and diagnose technical errors.</li>
                </ul>
              </section>

              <section id="confidentiality" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  4. Client Project Confidentiality &amp; NDA
                </h2>
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950">
                  <span className="font-extrabold text-emerald-900 block mb-0.5">✦ Built-in NDA Protection</span>
                  All client ideas, business plans, software logic, designs, and proprietary code shared with PixelForge are treated as strictly confidential. We readily execute formal Non-Disclosure Agreements (NDAs) prior to receiving proprietary specifications.
                </div>
              </section>

              <section id="security" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  5. Data Security &amp; Storage
                </h2>
                <p>
                  We implement industry-standard encryption protocols (SSL/TLS 256-bit) across all web traffic. Internal repositories and databases utilize two-factor authentication (2FA), restricted role-based permissions, and automated security patches.
                </p>
              </section>

              <section id="third-parties" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  6. Third-Party Cloud Providers
                </h2>
                <p>
                  To deliver modern web performance, we partner with reputable cloud infrastructure providers (such as Vercel, AWS, GitHub, Cloudflare). These providers process data strictly in compliance with global security benchmarks (SOC 2, ISO 27001).
                </p>
              </section>

              <section id="cookies" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  7. Cookies &amp; Tracking Technologies
                </h2>
                <p>
                  We use minimal, essential session cookies and performance telemetry to remember UI preferences (e.g. mobile navigation state) and monitor Core Web Vitals. Please refer to our <Link href="/cookie-policy" className="text-emerald-700 underline font-bold">Cookie Policy</Link> for detailed parameters.
                </p>
              </section>

              <section id="user-rights" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  8. Your Privacy Rights
                </h2>
                <p>
                  You hold full control over your personal records:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
                  <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you.</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate or outdated contact records.</li>
                  <li><strong>Right to Erasure (&ldquo;Forget Me&rdquo;):</strong> Request immediate deletion of your submitted inquiries or resumes from our active records.</li>
                </ul>
              </section>

              <section id="retention" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  9. Data Retention
                </h2>
                <p>
                  Project inquiries and candidate resumes are retained only as long as necessary to fulfill project requirements or recruitment evaluations, after which they are securely archived or purged.
                </p>
              </section>

              <section id="updates" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  10. Updates to this Policy
                </h2>
                <p>
                  We may periodically update this Privacy Policy to reflect regulatory evolutions or enhanced security protocols. Any modifications will be posted here with an updated revision date.
                </p>
              </section>

              <section id="contact" className="scroll-mt-28 pt-4 border-t border-zinc-200">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  11. Contact Our Privacy Officer
                </h2>
                <p>
                  To exercise your privacy rights or discuss data handling practices, contact our representative:
                </p>

                <div className="mt-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs sm:text-sm">
                  <div>
                    <strong>Data Protection Officer:</strong> Omkar Bhoinkar
                  </div>
                  <div>
                    <strong>Company:</strong> PixelForge Software &amp; Digital Solutions
                  </div>
                  <div>
                    <strong>Office Location:</strong> Kharghar, Navi Mumbai, Maharashtra, India
                  </div>
                  <div>
                    <strong>Direct Email:</strong>{" "}
                    <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                      dev.omkar05@gmail.com
                    </a>
                  </div>
                  <div>
                    <strong>Direct Telephone:</strong>{" "}
                    <a href="tel:+919920818481" className="font-bold text-emerald-700 hover:underline">
                      +91 99208 18481
                    </a>
                  </div>
                </div>
              </section>

              {/* Bottom Quick Switcher */}
              <div className="pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
                <Link href="/terms-and-conditions" className="text-zinc-600 hover:text-zinc-950 flex items-center gap-1">
                  <span>←</span> View Terms &amp; Conditions
                </Link>
                <Link href="/refund-policy" className="text-emerald-700 hover:underline flex items-center gap-1">
                  Refund Policy <span>→</span>
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
