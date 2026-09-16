import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Terms & Conditions | PixelForge",
  description: "Terms and conditions governing our digital web development, consulting and software services.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8 border-b border-zinc-100 pb-6">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
            LEGAL INFORMATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-2">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Last Updated: January 2026 • PixelForge Software &amp; Digital Solutions
          </p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-6 text-sm sm:text-base text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing our website or contracting PixelForge for web design, SaaS development, or software engineering services, you agree to comply with and be bound by these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">2. Scope of Services</h2>
            <p>
              PixelForge delivers custom software engineering, website development, UI/UX design, and hosting consultancy according to mutual project proposals, Statements of Work (SOW), or written agreements.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">3. Intellectual Property Rights</h2>
            <p>
              Upon full settlement of agreed project payments, the client is granted full ownership and commercial rights to the deliverables custom-developed for their project, excluding third-party open-source components governed by their respective licenses.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">4. Payment &amp; Deliverables</h2>
            <p>
              Project milestones, advance deposits, and release phases are outlined prior to commencement. Invoices are due within the terms specified in each agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">5. Contact Us</h2>
            <p>
              For any legal questions regarding our terms, reach out to us at{" "}
              <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                dev.omkar05@gmail.com
              </a>{" "}
              or call{" "}
              <a href="tel:+919920818481" className="font-bold text-emerald-700 hover:underline">
                +91 99208 18481
              </a>.
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
