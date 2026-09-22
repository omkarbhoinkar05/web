import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Cookie Policy | KeyCodeWeb — Building a Brighter Web",
  description:
    "Understand how KeyCodeWeb uses cookies, local storage and technical session tokens to ensure fast, secure and reliable browsing.",
  alternates: {
    canonical: "/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  const sections = [
    { id: "what-are-cookies", title: "1. What Are Cookies?" },
    { id: "types", title: "2. Types of Cookies We Use" },
    { id: "necessary", title: "3. Strictly Necessary Cookies" },
    { id: "performance", title: "4. Performance & Telemetry" },
    { id: "third-parties", title: "5. Third-Party Cookies" },
    { id: "local-storage", title: "6. HTML5 Local & Session Storage" },
    { id: "management", title: "7. How to Manage Cookies" },
    { id: "updates", title: "8. Updates to this Policy" },
    { id: "contact", title: "9. Contact Us" },
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
                BROWSER PREFERENCES &amp; SPEED
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
              Cookie Policy
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 mt-3 max-w-3xl leading-relaxed">
              This Cookie Policy explains how KeyCodeWeb uses cookies, local browser storage, and related tracking technologies to optimize website load speeds, manage user sessions, and deliver a smooth browsing experience.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mt-4 pt-4 border-t border-zinc-200/60">
              <span>Effective Date: January 1, 2026</span>
              <span>•</span>
              <span>Last Reviewed: September 2026</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Zero Invasive Ad-Trackers</span>
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
                <span className="font-bold text-zinc-800 block mb-1">Tech Desk</span>
                <span>Questions regarding storage: </span>
                <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                  dev.omkar05@gmail.com
                </a>
              </div>
            </aside>

            {/* Content Body */}
            <div className="lg:col-span-8 space-y-10 text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
              <section id="what-are-cookies" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  1. What Are Cookies?
                </h2>
                <p>
                  Cookies are tiny text files stored in your web browser by websites you visit. They are widely used to make web pages function properly, record user preferences, maintain session state during page transitions, and provide diagnostic performance insights.
                </p>
              </section>

              <section id="types" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  2. Types of Cookies We Use
                </h2>
                <div className="space-y-3 mt-3">
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="font-bold text-zinc-900 block text-sm">Essential &amp; Functional Cookies</span>
                    <p className="text-xs text-zinc-600 mt-1">
                      Required for basic navigation, security tokens, mobile drawer states, and cross-page anchor scrolling.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="font-bold text-zinc-900 block text-sm">Speed &amp; Performance Telemetry</span>
                    <p className="text-xs text-zinc-600 mt-1">
                      Aggregated metrics to monitor Core Web Vitals (Largest Contentful Paint, Cumulative Layout Shift).
                    </p>
                  </div>
                </div>
              </section>

              <section id="necessary" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  3. Strictly Necessary Cookies
                </h2>
                <p>
                  These cookies are vital for the core functionality of our web application. Without them, features such as contact inquiry submission, form error preservation, and smooth anchor routing between routes cannot operate reliably.
                </p>
              </section>

              <section id="performance" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  4. Performance &amp; Analytics
                </h2>
                <p>
                  We collect anonymous, aggregated technical metrics (such as page load duration, asset caching success, and viewport sizes). This data helps our engineering team optimize code delivery and minimize server response times. <strong>No personal identifying information is associated with these metrics.</strong>
                </p>
              </section>

              <section id="third-parties" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  5. Third-Party Services
                </h2>
                <p>
                  When you access embedded maps or external calendar links (e.g. Google Calendar or Outlook), those external platforms may place their own functional cookies in your browser in accordance with their respective privacy policies.
                </p>
              </section>

              <section id="local-storage" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  6. HTML5 Session &amp; Local Storage
                </h2>
                <p>
                  In addition to standard HTTP cookies, we utilize modern browser <code>sessionStorage</code> to store temporary state tokens (such as <code>scroll_target</code>) so that navigating from an individual page (e.g. Careers or About Us) to a Home section (e.g. Services) scrolls down smoothly without layout jumping.
                </p>
              </section>

              <section id="management" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  7. How to Manage &amp; Disable Cookies
                </h2>
                <p>
                  You can configure or disable cookies directly in your browser settings:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li><strong>Apple Safari:</strong> Preferences → Privacy → Block all cookies</li>
                  <li><strong>Mozilla Firefox:</strong> Settings → Privacy &amp; Security → Enhanced Tracking Protection</li>
                  <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions</li>
                </ul>
                <p className="mt-2 text-xs text-zinc-500">
                  <em>Note: Disabling technical session storage may impact smooth navigation between pages.</em>
                </p>
              </section>

              <section id="updates" className="scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  8. Updates to this Policy
                </h2>
                <p>
                  We review our cookie parameters whenever new interactive modules or cloud delivery networks are deployed to ensure continuous compliance with data protection laws.
                </p>
              </section>

              <section id="contact" className="scroll-mt-28 pt-4 border-t border-zinc-200">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-3">
                  9. Contact Us
                </h2>
                <p>
                  If you have questions about our use of cookies or technical storage, contact us:
                </p>

                <div className="mt-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs sm:text-sm">
                  <div>
                    <strong>Company:</strong> KeyCodeWeb Software &amp; Digital Solutions
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:dev.omkar05@gmail.com" className="font-bold text-emerald-700 hover:underline">
                      dev.omkar05@gmail.com
                    </a>
                  </div>
                  <div>
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+919920818481" className="font-bold text-emerald-700 hover:underline">
                      +91 99208 18481
                    </a>
                  </div>
                  <div>
                    <strong>Address:</strong> Kharghar, Navi Mumbai, Maharashtra, India
                  </div>
                </div>
              </section>

              {/* Bottom Quick Switcher */}
              <div className="pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
                <Link href="/refund-policy" className="text-zinc-600 hover:text-zinc-950 flex items-center gap-1">
                  <span>←</span> Refund Policy
                </Link>
                <Link href="/disclaimer" className="text-emerald-700 hover:underline flex items-center gap-1">
                  Disclaimer <span>→</span>
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
