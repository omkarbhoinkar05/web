import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Cookie Policy | PixelForge",
  description: "Learn how PixelForge uses cookies and local storage to ensure optimal site performance.",
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 border-b border-zinc-100 pb-6">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
            TRACKING &amp; PREFERENCES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-2">
            Cookie Policy
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Last Updated: January 2026 • PixelForge Software &amp; Digital Solutions
          </p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-6 text-sm sm:text-base text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">1. What Are Cookies?</h2>
            <p>
              Cookies and local browser storage are small data tokens stored on your device that enable our web application to deliver high-speed navigation, smooth scrolling, and remember functional UI preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">2. How We Use Them</h2>
            <p>
              We exclusively utilize technical session tokens and non-invasive aggregate analytics to track page performance, optimize Core Web Vitals, and ensure seamless navigation between sections.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">3. Managing Preferences</h2>
            <p>
              You can instruct your browser to refuse all cookies or notify you when a cookie is sent. Disabling essential cookies may slightly alter your site navigation experience.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-100 flex items-center justify-between">
          <Link href="/" className="text-xs sm:text-sm font-bold text-emerald-700 hover:underline">
            ← Back to Home
          </Link>
          <Link href="/privacy-policy" className="text-xs sm:text-sm font-bold text-zinc-600 hover:text-zinc-900">
            Privacy Policy →
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
