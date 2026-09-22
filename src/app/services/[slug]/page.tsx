import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import prisma from "@/lib/prisma";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  try {
    const service = await prisma.serviceItem.findUnique({ where: { slug } });
    if (service) {
      return {
        title: `${service.title} - Custom Development Solutions | Web`,
        description: service.shortDescription || service.description,
      };
    }
  } catch {}
  return {
    title: "Services & Solutions | Web",
    description: "End-to-end custom digital web and software development solutions.",
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  let service = null;
  try {
    service = await prisma.serviceItem.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.error("Failed to load service detail:", err);
  }

  if (!service || service.status !== "Active") {
    notFound();
  }

  // Parse features
  let featuresList: string[] = [];
  if (service.features) {
    if (service.features.startsWith("[") && service.features.endsWith("]")) {
      try {
        featuresList = JSON.parse(service.features);
      } catch {
        featuresList = service.features.split(",").map((s) => s.trim()).filter(Boolean);
      }
    } else {
      featuresList = service.features.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.25),rgba(0,0,0,0))] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-emerald-400/20 text-xs font-semibold text-emerald-300 mb-6 backdrop-blur-xs">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#services" className="hover:text-white transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-white">{service.title}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            {service.title}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {service.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="px-8 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-xl shadow-black/25 transition-all hover:scale-105"
            >
              Get Started with {service.title} →
            </Link>
            <Link
              href="/#services"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content & Features */}
      <section className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left 2 Cols: Description and Core Capabilities */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2">
                OVERVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Engineered for High Performance & Growth
              </h2>
              <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
                {service.description ||
                  `Our bespoke ${service.title} solutions are engineered specifically to solve operational friction, maximize user engagement, and accelerate your business digital transformation with modern web technologies.`}
              </p>
            </div>

            {/* Features Checklist Grid */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-3">
                WHAT WE DELIVER
              </span>
              <h3 className="text-xl font-bold text-zinc-900 mb-5">
                Key Features & Deliverables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {featuresList.map((feat, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-800">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Standards */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100">
              <h4 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <span className="text-emerald-600">🛡️</span>
                Enterprise Grade Quality Standards
              </h4>
              <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed mt-2">
                Every project is crafted adhering to modern code standards, mobile-first responsive design, sub-second load times, continuous security auditing, and SEO architecture.
              </p>
            </div>
          </div>

          {/* Right Col: Consultation Card */}
          <div className="p-7 rounded-3xl bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50 space-y-6 lg:sticky lg:top-28">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ready to Deploy
              </div>
              <h3 className="text-xl font-black text-zinc-950">
                Kickstart Your Project
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Connect with our technical architects for a free requirements assessment and milestone timeline.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-3 text-xs text-zinc-700 font-medium">
                <span className="w-4 h-4 text-emerald-600">⚡</span>
                <span>Fast 24-hour turnaround</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-700 font-medium">
                <span className="w-4 h-4 text-emerald-600">🔒</span>
                <span>Confidential NDA protected</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-700 font-medium">
                <span className="w-4 h-4 text-emerald-600">💼</span>
                <span>Tailored milestone pricing</span>
              </div>
            </div>

            <Link
              href="/#contact"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <span>{service.buttonText || "Contact Now →"}</span>
            </Link>
          </div>
        </div>
      </section>

      <FloatingActions />
      <Footer />
    </main>
  );
}
