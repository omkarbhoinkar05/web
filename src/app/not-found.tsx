import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "404 - Page Not Found | PixelForge",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative overflow-hidden">
        {/* Subtle Ambient Emerald Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-tr from-emerald-100/50 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-2xs mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
              ERROR 404
            </span>
          </div>

          <h1 className="text-6xl sm:text-8xl font-black text-zinc-900 tracking-tight leading-none">
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-4 tracking-tight">
            Page Not Found
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 mt-3 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 transition-all"
            >
              Back to Home →
            </Link>
            <Link
              href="/#contact"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-50 shadow-2xs transition-all"
            >
              Contact Support
            </Link>
          </div>

          {/* Quick Helpful Directory Links */}
          <div className="mt-12 pt-8 border-t border-zinc-100">
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-3">
              Popular Destinations
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-zinc-600">
              <Link href="/about-us" className="hover:text-emerald-700 transition-colors">
                About Us
              </Link>
              <span>•</span>
              <Link href="/portfolio" className="hover:text-emerald-700 transition-colors">
                Portfolio
              </Link>
              <span>•</span>
              <Link href="/#services" className="hover:text-emerald-700 transition-colors">
                Services
              </Link>
              <span>•</span>
              <Link href="/careers" className="hover:text-emerald-700 transition-colors">
                Careers
              </Link>
              <span>•</span>
              <Link href="/sitemap" className="hover:text-emerald-700 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
