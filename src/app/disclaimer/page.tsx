import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Disclaimer | PixelForge",
  description: "General disclaimer regarding information published on PixelForge digital channels.",
};

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 border-b border-zinc-100 pb-6">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
            LEGAL NOTICE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-2">
            Disclaimer
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Last Updated: January 2026 • PixelForge Software &amp; Digital Solutions
          </p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-6 text-sm sm:text-base text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">1. General Information Only</h2>
            <p>
              The content provided across our website, articles, portfolio case studies, and engineering breakdowns is intended for general informational and demonstration purposes regarding software capabilities.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">2. Portfolio Metrics &amp; Case Studies</h2>
            <p>
              Metrics cited in case studies (such as speed improvements or conversion percentages) reflect specific client engagements, architectures, and testing benchmarks. Individual client outcomes depend on business context and external market variables.
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
