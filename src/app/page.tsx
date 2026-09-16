import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HomeAboutSection } from "@/components/HomeAboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white relative w-full overflow-x-hidden">
      {/* Background Top Grid & Subtle Ambient Glow */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Main Navbar */}
      <Navbar />

      {/* Hero and Sections */}
      <main className="flex-1 flex flex-col w-full overflow-x-hidden">
        <Hero />
        <HomeAboutSection />
        <ServicesSection />
        <ProcessSection />
        <PortfolioSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Modern IT Software Company Footer */}
      <Footer />

      {/* Floating Actions: WhatsApp Chat & Back to Top Arrow */}
      <FloatingActions />
    </div>
  );
}
