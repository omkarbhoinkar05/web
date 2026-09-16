import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Privacy Policy | PixelForge",
  description: "Privacy policy describing how PixelForge collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 border-b border-zinc-100 pb-6">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
            PRIVACY &amp; DATA
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-2">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Last Updated: January 2026 • PixelForge Software &amp; Digital Solutions
          </p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-6 text-sm sm:text-base text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">1. Information We Collect</h2>
            <p>
              We only collect information you voluntarily provide when contacting us, requesting a consultation, or submitting a job application (such as name, phone number, email address, project requirements, and resumes).
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">2. How We Use Your Information</h2>
            <p>
              Your information is strictly used to evaluate your inquiries, reply to your project requirements, communicate project milestones, or review job candidate applications. We never sell, rent, or trade your personal data with third-party marketers.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">3. Data Security &amp; Confidentiality</h2>
            <p>
              We enforce enterprise-grade digital security and non-disclosure standards (NDA) to safeguard your proprietary project details and confidential business data.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">4. Contact Our Data Representative</h2>
            <p>
              If you have any questions or wish to delete your submitted contact records, email us directly at{" "}
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
