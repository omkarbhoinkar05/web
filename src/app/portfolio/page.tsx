import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomBar } from "@/components/BottomBar";

export const metadata = {
  title: "Portfolio | PixelForge — Building a Brighter Web",
  description: "Explore our complete portfolio of web applications, SaaS platforms, and enterprise solutions.",
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
            DEDICATED PORTFOLIO
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight max-w-2xl">
          Full Case Studies &amp; <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Project Archives
          </span>
        </h1>

        <p className="text-base text-zinc-600 max-w-lg mt-4 leading-relaxed">
          The full dedicated portfolio archive with interactive live demos and case study breakdowns is currently being curated.
        </p>

        <div className="mt-8">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
          >
            <span>← Back to Home Page Portfolio</span>
          </Link>
        </div>
      </main>

      <footer className="w-full border-t border-zinc-100 bg-white">
        <BottomBar />
      </footer>
    </div>
  );
}
