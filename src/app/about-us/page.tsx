import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { AboutHero } from "@/components/about/AboutHero";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { InsidePixelForge } from "@/components/about/InsidePixelForge";
import { FounderSection } from "@/components/about/FounderSection";
import { WhyPixelForge } from "@/components/about/WhyPixelForge";
import { AboutCTA } from "@/components/about/AboutCTA";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { generateBreadcrumbSchema, SITE_URL } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute: "About KeyCodeWeb | Web & Software Development Team Navi Mumbai",
  },
  description:
    "Learn about KeyCodeWeb, our engineering leadership, mission, and how our Kharghar, Navi Mumbai studio crafts high-performance web applications and software solutions for businesses worldwide.",
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    title: "About KeyCodeWeb | Web & Software Development Team Navi Mumbai",
    description:
      "Learn about KeyCodeWeb, our engineering leadership, mission, and how our Kharghar, Navi Mumbai studio crafts high-performance web applications and software solutions for businesses worldwide.",
    url: `${SITE_URL}/about-us`,
    siteName: "KeyCodeWeb",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 341,
        alt: "About KeyCodeWeb - Web Development Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About KeyCodeWeb | Web & Software Development Team Navi Mumbai",
    description:
      "Learn about KeyCodeWeb, our engineering leadership, mission, and how our Kharghar, Navi Mumbai studio crafts high-performance web applications and software solutions for businesses worldwide.",
    images: ["/logo.png"],
  },
};

export default function AboutUsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Background Top Grid & Subtle Ambient Glow */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <AboutHero />
        <JourneyTimeline />
        <InsidePixelForge />
        <FounderSection />
        <WhyPixelForge />
        <AboutCTA />
      </main>

      {/* Modern IT Software Company Footer */}
      <Footer />

      {/* Floating Actions: WhatsApp Chat & Back to Top Arrow */}
      <FloatingActions />
    </div>
  );
}
