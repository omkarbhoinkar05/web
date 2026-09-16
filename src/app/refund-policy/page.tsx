import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | PixelForge",
  description: "Information about PixelForge's service cancellation and refund policies for software projects.",
};

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 border-b border-zinc-100 pb-6">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
            BILLING &amp; REFUNDS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-2">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Last Updated: January 2026 • PixelForge Software &amp; Digital Solutions
          </p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-6 text-sm sm:text-base text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">1. Milestone-Based Engagements</h2>
            <p>
              PixelForge structures custom development work into transparent sprint milestones (Design Wireframes, Architecture, Frontend/Backend Implementation, QA Testing, and Deployment). Each milestone is reviewed and signed off prior to advancing.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">2. Advance Deposits &amp; Work in Progress</h2>
            <p>
              Advance booking deposits secure engineering allocation and research time. In the event of early project cancellation by the client before milestone completion, any unspent hours or unstarted phases are eligible for prorated adjustment or refund as defined in the master contract.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">3. Questions or Inquiries</h2>
            <p>
              Please direct any billing questions to{" "}
              <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                dev.omkar05@gmail.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-100 flex items-center justify-between">
          <Link href="/" className="text-xs sm:text-sm font-bold text-emerald-700 hover:underline">
            ← Back to Home
          </Link>
          <Link href="/terms-and-conditions" className="text-xs sm:text-sm font-bold text-zinc-600 hover:text-zinc-900">
            Terms &amp; Conditions →
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
