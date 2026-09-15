import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomBar } from "@/components/BottomBar";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${capitalized} Case Study | PixelForge`,
    description: `Detailed case study breakdown for ${capitalized}.`,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const projectNames: Record<string, string> = {
    edulearn: "EduLearn — Online Learning Platform",
    shopkart: "ShopKart — Multi-Vendor E-Commerce",
    taskpro: "TaskPro — Project Management SaaS",
    bizerp: "BizERP — Complete Business Management",
  };

  const displayName = projectNames[slug.toLowerCase()] || `${slug.toUpperCase()} Case Study`;

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
            CASE STUDY PREVIEW
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight max-w-3xl">
          {displayName}
        </h1>

        <p className="text-base text-zinc-600 max-w-lg mt-4 leading-relaxed">
          Comprehensive architecture documentation, metrics lift, and client interview breakdown for this project are being prepared.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
          >
            <span>← Back to Featured Projects</span>
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-zinc-800 font-bold text-sm bg-white hover:bg-zinc-50 border border-zinc-200 transition-all duration-200"
          >
            <span>Start Similar Project</span>
          </Link>
        </div>
      </main>

      <footer className="w-full border-t border-zinc-100 bg-white">
        <BottomBar />
      </footer>
    </div>
  );
}
