import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { AboutHero } from "@/components/about/AboutHero";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { InsidePixelForge } from "@/components/about/InsidePixelForge";
import { FounderSection } from "@/components/about/FounderSection";
import { WhyPixelForge } from "@/components/about/WhyPixelForge";
import { AboutCTA } from "@/components/about/AboutCTA";
import { BottomBar } from "@/components/BottomBar";

export const metadata: Metadata = {
  title: "About Us | PixelForge — Building a Brighter Web",
  description:
    "Discover the story, vision, mission and people behind PixelForge — a creative web development company building modern digital experiences for growing businesses.",
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    title: "About Us | PixelForge — Building a Brighter Web",
    description:
      "Discover the story, vision, mission and people behind PixelForge — a creative web development company building modern digital experiences for growing businesses.",
    url: "https://pixelforge.design/about-us",
    siteName: "PixelForge",
  },
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white relative">
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

      {/* Reused Website Footer */}
      <footer className="w-full border-t border-zinc-100 bg-white">
        <BottomBar />
      </footer>
    </div>
  );
}
