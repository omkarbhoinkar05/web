"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  review: string;
  tags: string[];
  initials: string;
}

export function TestimonialsSection() {
  const testimonials: TestimonialItem[] = [
    {
      id: "rahul-sharma",
      name: "Rahul Sharma",
      role: "Founder & CEO",
      company: "EduLearn",
      rating: 5.0,
      initials: "RS",
      review:
        "“Amazing experience! The team understood our requirements perfectly and delivered a high-quality e-learning platform. Their support and professionalism are truly commendable.”",
      tags: ["Web Application", "Education", "Long-term Support"],
    },
    {
      id: "priya-mehta",
      name: "Priya Mehta",
      role: "Marketing Head",
      company: "ShopKart",
      rating: 5.0,
      initials: "PM",
      review:
        "“Our e-commerce platform was delivered beyond our expectations. The design, features and performance are outstanding. Highly recommended for any business looking for a reliable tech partner.”",
      tags: ["E-Commerce", "Multi-Vendor", "Payment Integration"],
    },
    {
      id: "amit-deshpande",
      name: "Amit Deshpande",
      role: "Operations Manager",
      company: "BizERP",
      rating: 5.0,
      initials: "AD",
      review:
        "“The ERP solution has completely transformed our business operations. The team delivered a scalable, secure and user-friendly system with excellent post-launch support.”",
      tags: ["ERP Software", "Business Automation", "Dedicated Support"],
    },
    {
      id: "neha-kapoor",
      name: "Neha Kapoor",
      role: "Product Lead",
      company: "TaskPro",
      rating: 5.0,
      initials: "NK",
      review:
        "“Working with PixelForge was a breeze. They turned our complex SaaS workflows into an intuitive, high-velocity platform that our global users absolutely adore.”",
      tags: ["SaaS Platform", "Team Management", "Analytics"],
    },
    {
      id: "vikram-malhotra",
      name: "Dr. Vikram Malhotra",
      role: "Director of Operations",
      company: "HealthPulse",
      rating: 5.0,
      initials: "VM",
      review:
        "“The telemedicine architecture is rock-solid, HIPAA-compliant and has drastically reduced patient wait times. The engineering team delivered ahead of schedule.”",
      tags: ["Telemedicine", "WebRTC Video", "HIPAA Security"],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = testimonials.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Subtle Autoplay
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Helper to get 3 visible cards on desktop centered around currentIndex
  const getVisibleCards = () => {
    const prevIdx = (currentIndex - 1 + total) % total;
    const currIdx = currentIndex;
    const nextIdx = (currentIndex + 1) % total;
    return [
      { item: testimonials[prevIdx], position: "prev" as const },
      { item: testimonials[currIdx], position: "active" as const },
      { item: testimonials[nextIdx], position: "next" as const },
    ];
  };

  const visibleCards = getVisibleCards();

  const trustedBrands = [
    { name: "EduLearn", category: "EdTech" },
    { name: "ShopKart", category: "E-Commerce" },
    { name: "TaskPro", category: "SaaS" },
    { name: "BizERP", category: "Enterprise" },
    { name: "HealthPulse", category: "HealthTech" },
    { name: "PropNest", category: "RealEstate" },
  ];

  return (
    <section
      id="testimonials"
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-white select-none border-t border-zinc-100 text-zinc-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Subtle Ambient Glow & Pastel Blur Blobs */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/40 via-teal-50/25 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -right-20 w-[450px] h-[450px] bg-gradient-to-tl from-emerald-100/35 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Decorative Dotted Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-0 opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="testimonials-dots-white" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#000000" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonials-dots-white)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* 3. TOP HEADER with 4. DECORATIVE CALLOUTS */}
        <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Left Decorative Handwritten Callout (Desktop) */}
          <div className="hidden lg:flex flex-col items-end absolute -left-48 top-4 pointer-events-none">
            <span className="font-handwriting text-emerald-800 text-base sm:text-lg font-bold leading-tight rotate-[-6deg] text-right drop-shadow-xs">
              Happy Clients <br />
              Stronger <br />
              Together
            </span>
            <svg
              className="w-12 h-10 text-emerald-600 mt-1 rotate-12"
              viewBox="0 0 50 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 5 10 C 25 5, 40 15, 38 32" />
              <path d="M 30 28 L 38 32 L 44 24" />
            </svg>
          </div>

          {/* Right Decorative Handwritten Callout (Desktop) */}
          <div className="hidden lg:flex flex-col items-start absolute -right-48 top-4 pointer-events-none">
            <span className="font-handwriting text-emerald-800 text-base sm:text-lg font-bold leading-tight rotate-[6deg] text-left drop-shadow-xs">
              Your Success <br />
              Is Our <br />
              Motivation
            </span>
            <svg
              className="w-12 h-10 text-emerald-600 mt-1 -rotate-12"
              viewBox="0 0 50 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 45 10 C 25 5, 10 15, 12 32" />
              <path d="M 20 28 L 12 32 L 6 24" />
            </svg>
          </div>

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
              TESTIMONIALS
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-[1.12]">
            What Our Clients Say
          </h2>

          {/* Highlighted Secondary Line */}
          <p className="text-lg sm:text-xl font-extrabold text-emerald-700 tracking-tight mt-3">
            Real People. Real Stories. Real Results.
          </p>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl mt-3 sm:mt-4 text-center">
            We take pride in building long-term relationships with our clients. Here’s what they have to say about their experience working with us.
          </p>
        </div>

        {/* 5. TESTIMONIAL CAROUSEL CONTAINER */}
        <div
          className="mt-14 sm:mt-18 relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Controls on sides (Desktop) */}
          <div className="absolute top-1/2 -left-4 sm:-left-6 -translate-y-1/2 z-20 hidden md:block">
            <button
              onClick={handlePrev}
              type="button"
              className="w-12 h-12 rounded-full bg-white hover:bg-emerald-600 text-zinc-700 hover:text-white border border-zinc-200 hover:border-emerald-600 flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-emerald-600/20 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </div>

          <div className="absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 z-20 hidden md:block">
            <button
              onClick={handleNext}
              type="button"
              className="w-12 h-12 rounded-full bg-white hover:bg-emerald-600 text-zinc-700 hover:text-white border border-zinc-200 hover:border-emerald-600 flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-emerald-600/20 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Desktop Layout: 3 Cards Simultaneously */}
          <div className="hidden md:grid grid-cols-3 gap-6 items-stretch">
            {visibleCards.map(({ item, position }) => {
              const isActive = position === "active";
              return (
                <div
                  key={item.id}
                  className={`group relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 ${
                    isActive
                      ? "bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-600/15 scale-[1.03] z-10 ring-4 ring-emerald-500/10"
                      : "bg-zinc-50/70 hover:bg-white border border-zinc-200 shadow-md shadow-zinc-900/5 opacity-90 hover:opacity-100 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-emerald-500/10"
                  }`}
                >
                  {/* Decorative Quotation Mark in Upper Right */}
                  <div
                    className="absolute top-5 right-6 text-6xl font-serif text-emerald-100 select-none pointer-events-none leading-none"
                    aria-hidden="true"
                  >
                    “
                  </div>

                  <div>
                    {/* Client Header: Initials Monogram Avatar (NO client photo per user instruction) */}
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg tracking-wider shadow-md flex items-center justify-center shrink-0">
                        {item.initials}
                      </div>
                      <div className="text-left overflow-hidden">
                        <h4 className="text-base font-black text-zinc-900 tracking-tight leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs font-semibold text-zinc-500 mt-0.5 truncate">
                          {item.role}
                        </p>
                        <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                          {item.company}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating: 5.0 (Yellow/Gold stars) */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="flex text-[#FBBF24] text-sm" aria-label="5 out of 5 stars">
                        {"★★★★★"}
                      </div>
                      <span className="text-xs font-black text-zinc-900 ml-1 font-mono">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-sm text-zinc-700 font-normal leading-relaxed italic">
                      {item.review}
                    </p>
                  </div>

                  {/* Testimonial Tags */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[10px] font-semibold text-emerald-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Layout: 1 Card at a Time with swipe */}
          <div className="md:hidden">
            {testimonials.map((item, idx) => {
              if (idx !== currentIndex) return null;
              return (
                <div
                  key={item.id}
                  className="relative flex flex-col justify-between rounded-3xl p-6 bg-white border-2 border-emerald-500 shadow-xl"
                >
                  <div
                    className="absolute top-4 right-5 text-5xl font-serif text-emerald-100 select-none pointer-events-none leading-none"
                    aria-hidden="true"
                  >
                    “
                  </div>

                  <div>
                    {/* Client Header: Monogram Avatar */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-base shadow-md flex items-center justify-center shrink-0">
                        {item.initials}
                      </div>
                      <div className="text-left">
                        <h4 className="text-base font-black text-zinc-900">{item.name}</h4>
                        <p className="text-xs font-semibold text-zinc-500">{item.role}</p>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">{item.company}</span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex text-[#FBBF24] text-sm">★★★★★</div>
                      <span className="text-xs font-black text-zinc-900 font-mono">{item.rating.toFixed(1)}</span>
                    </div>

                    {/* Review */}
                    <p className="text-xs text-zinc-700 leading-relaxed italic">{item.review}</p>
                  </div>

                  {/* Tags */}
                  <div className="mt-5 pt-3 border-t border-zinc-100 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[9px] font-semibold text-emerald-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Mobile Prev / Next Buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                type="button"
                className="w-10 h-10 rounded-full bg-white text-zinc-700 border border-zinc-200 flex items-center justify-center shadow-xs active:scale-95"
                aria-label="Previous testimonial"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                type="button"
                className="w-10 h-10 rounded-full bg-white text-zinc-700 border border-zinc-200 flex items-center justify-center shadow-xs active:scale-95"
                aria-label="Next testimonial"
              >
                →
              </button>
            </div>
          </div>

          {/* 15. Pagination Dots */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
            {testimonials.map((_, dotIdx) => {
              const isDotActive = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isDotActive ? "w-8 bg-emerald-600" : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* 18. TRUST STATISTICS BAR & 19. CTA AREA */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/60 border border-emerald-100/80 shadow-xl shadow-emerald-950/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 4 Statistics Columns (lg:col-span-8) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {/* Stat 1: Happy Clients */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center mb-2.5 text-emerald-700 shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                  250+
                </span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                  Happy Clients
                </span>
              </div>

              {/* Stat 2: Projects Delivered */}
              <div className="flex flex-col items-center border-l-0 sm:border-l border-zinc-200/80">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center mb-2.5 text-emerald-700 shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                  </svg>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                  500+
                </span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                  Projects Delivered
                </span>
              </div>

              {/* Stat 3: Client Satisfaction */}
              <div className="flex flex-col items-center border-l-0 sm:border-l border-zinc-200/80">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center mb-2.5 text-emerald-700 shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                  99%
                </span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                  Satisfaction
                </span>
              </div>

              {/* Stat 4: Years of Experience */}
              <div className="flex flex-col items-center border-l-0 sm:border-l border-zinc-200/80">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center mb-2.5 text-emerald-700 shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                  5+
                </span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                  Years Experience
                </span>
              </div>
            </div>

            {/* Compact CTA (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-center gap-3.5 border-t lg:border-t-0 lg:border-l border-zinc-200/80 pt-6 lg:pt-0 lg:pl-8 text-center lg:text-right">
              <div>
                <span className="text-lg sm:text-xl font-black text-zinc-900 leading-snug block">
                  Join Our Happy Clients and Start Your Success Story!
                </span>
                <span className="text-xs text-zinc-600 font-medium block mt-1">
                  Ready to turn your technical vision into reality?
                </span>
              </div>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all duration-300 shrink-0 group/cta"
              >
                <span>Get a Free Consultation</span>
                <span className="transition-transform duration-200 group-hover/cta:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 20. TRUSTED CLIENTS / PROJECTS AREA */}
        <div className="mt-14 sm:mt-18 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-6">
            Trusted by Businesses Across Industries
          </span>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {trustedBrands.map((brand, idx) => (
              <div
                key={idx}
                className="px-5 py-2.5 rounded-2xl bg-white hover:bg-emerald-50/60 border border-zinc-200/80 hover:border-emerald-300 shadow-xs text-zinc-800 font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2 transition-all hover:scale-105"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{brand.name}</span>
                <span className="text-[10px] font-mono text-emerald-700 font-normal ml-1">({brand.category})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
