import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: {
    absolute: "Refund & Cancellation Policy | KeyCodeWeb — Building a Brighter Web",
  },
  description:
    "Review KeyCodeWeb's clear, transparent refund, milestone cancellation, and billing adjustment policies for software and web development services.",
  alternates: {
    canonical: "/refund-policy",
  },
};

export default function RefundPolicyPage() {
  const sections = [
    { id: "overview", title: "1. Policy Overview" },
    { id: "deposits", title: "2. Advance Booking Deposits" },
    { id: "milestones", title: "3. Milestone Delivery Model" },
    { id: "cancellations", title: "4. Project Cancellation & Prorated Refunds" },
    { id: "non-refundable", title: "5. Non-Refundable Expenses" },
    { id: "dissatisfaction", title: "6. Revision & Quality Resolution" },
    { id: "procedure", title: "7. How to Request a Refund" },
    { id: "processing", title: "8. Refund Processing Timeline" },
    { id: "contact", title: "9. Billing & Accounts Desk" },
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
                FAIR BUSINESS PRACTICES
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
              Refund &amp; Cancellation Policy
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 mt-3 max-w-3xl leading-relaxed">
              We believe in transparent, honest, and mutually respectful business relationships. This policy details how payments, milestones, project cancellations, and refunds are handled for all digital engineering contracts.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mt-4 pt-4 border-t border-zinc-200/60">
              <span>Effective Date: January 1, 2026</span>
              <span>•</span>
              <span>Last Reviewed: September 2026</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Transparent Milestone Guarantee</span>
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
                <span className="font-bold text-zinc-800 block mb-1">Billing Support</span>
                <span>Direct accounts email: </span>
                <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                  dev.omkar05@gmail.com
                </a>
              </div>
            </aside>

            {/* Content Body */}
            <div className="lg:col-span-8 space-y-10 text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
              <section id="overview" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  1. Policy Overview
                </h2>
                <p>
                  As an elite software development company, KeyCodeWeb allocates dedicated senior software architects, UI/UX designers, and cloud engineers to each commissioned project. Because custom software engineering involves dedicated labor hours and intellectual capital, our refund policy is linked directly to completed work milestones.
                </p>
              </section>

              <section id="deposits" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  2. Advance Booking Deposits
                </h2>
                <p>
                  Initial advance booking deposits (typically 30% to 50% of the total estimated engagement) serve to reserve dedicated developer calendar hours, initial architecture planning, and wireframe creation.
                </p>
                <div className="my-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950">
                  <span className="font-extrabold text-emerald-900 block mb-0.5">✦ 48-Hour Grace Period</span>
                  If a Client decides to cancel a project within forty-eight (48) hours of paying the advance deposit, and before any architectural or design work has commenced, a 100% refund of the deposit will be issued, minus any third-party transaction or banking fees.
                </div>
              </section>

              <section id="milestones" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  3. Milestone Delivery Model
                </h2>
                <p>
                  Projects are partitioned into clear milestones (e.g. Wireframes, Frontend Assembly, Backend/API Integration, QA/Staging, and Final Launch). Once a milestone deliverable is demonstrated, previewed, and approved by the Client, the payment corresponding to that approved milestone is final and non-refundable.
                </p>
              </section>

              <section id="cancellations" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  4. Project Cancellation &amp; Prorated Refunds
                </h2>
                <p>
                  If a Client chooses to discontinue an engagement midway through a milestone:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
                  <li>Any completely unstarted future milestones will be 100% refunded or cancelled.</li>
                  <li>For the currently active milestone in progress, compensation is calculated strictly on the documented hours and deliverables completed to date.</li>
                  <li>Any remaining balance from advance funds after accounting for verified work is refunded directly to the Client.</li>
                  <li>All developed assets, code repositories, and documentation created up to the cancellation point are delivered to the Client.</li>
                </ul>
              </section>

              <section id="non-refundable" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  5. Non-Refundable Expenses
                </h2>
                <p>
                  Certain direct disbursements procured on behalf of the client cannot be refunded:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
                  <li>Domain name registrations, transfers, and DNS provisioning.</li>
                  <li>Dedicated cloud server provisioning, VPS setups, or hosting packages already invoiced by cloud providers.</li>
                  <li>Third-party software licenses, commercial font packages, premium plugins, or paid API credits purchased specifically for the Client.</li>
                </ul>
              </section>

              <section id="dissatisfaction" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  6. Revision &amp; Quality Resolution
                </h2>
                <p>
                  If a Client is dissatisfied with a visual layout or interactive behavior, we provide up to two (2) complimentary rounds of revision per milestone within the original scope. Our primary commitment is always to resolve concerns collaboratively before any cancellation discussions.
                </p>
              </section>

              <section id="procedure" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  7. How to Request a Refund
                </h2>
                <p>
                  To request a formal review or cancellation:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-1.5 text-sm">
                  <li>Send an official email to <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 underline">dev.omkar05@gmail.com</a> with the subject line: <code>Refund Request — [Project Name / Invoice #]</code>.</li>
                  <li>Specify the reason for the cancellation and summarize completed milestones.</li>
                  <li>Our finance and project management desk will review the request and respond within two (2) business days.</li>
                </ol>
              </section>

              <section id="processing" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  8. Refund Processing Timeline
                </h2>
                <p>
                  Approved refunds are credited back to the original source method (Bank NEFT/RTGS, UPI, or corporate account) within <strong>five (5) to seven (7) business days</strong> of formal reconciliation.
                </p>
              </section>

              <section id="contact" className="scroll-mt-28 pt-4 border-t border-zinc-200">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  9. Billing &amp; Accounts Desk
                </h2>
                <p>
                  For billing queries or milestone verification, our accounts team in Kharghar is ready to help:
                </p>

                <div className="mt-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs sm:text-sm">
                  <div>
                    <strong>Accounts Team:</strong> KeyCodeWeb Billing &amp; Finance
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
                  <div>
                    <strong>Office Location:</strong> Kharghar, Navi Mumbai, India
                  </div>
                </div>
              </section>

              {/* Bottom Quick Switcher */}
              <div className="pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
                <Link href="/privacy-policy" className="text-zinc-600 hover:text-zinc-950 flex items-center gap-1">
                  <span>←</span> Privacy Policy
                </Link>
                <Link href="/cookie-policy" className="text-emerald-700 hover:underline flex items-center gap-1">
                  Cookie Policy <span>→</span>
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
