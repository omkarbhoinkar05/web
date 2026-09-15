import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { HomeAboutSection } from "@/components/HomeAboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { BottomBar } from "@/components/BottomBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Background Top Grid & Subtle Ambient Glow */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Main Navbar */}
      <Navbar />

      {/* Hero and Sections */}
      <main className="flex-1 flex flex-col">
        <Hero />
        <TrustBar />
        <HomeAboutSection />
        <ServicesSection />
        <ProcessSection />
      </main>

      {/* Bottom Information & Action Bar */}
      <footer className="w-full border-t border-zinc-100 bg-white">
        <BottomBar />
      </footer>
    </div>
  );
}
