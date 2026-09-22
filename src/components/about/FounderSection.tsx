import React from "react";
import Image from "next/image";

interface Specialty {
  name: string;
  tagline: string;
  icon: React.ReactNode;
}

const specialties: Specialty[] = [
  {
    name: "Web Development",
    tagline: "Modern & Scalable",
    icon: (
      <svg
        className="w-4 h-4 text-[#059669]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    name: "Creative UI/UX",
    tagline: "Beautiful & User-focused",
    icon: (
      <svg
        className="w-4 h-4 text-[#059669]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    name: "SEO & Performance",
    tagline: "Rank Higher. Grow Faster.",
    icon: (
      <svg
        className="w-4 h-4 text-[#059669]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    name: "E-commerce",
    tagline: "Built for Growth",
    icon: (
      <svg
        className="w-4 h-4 text-[#059669]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    name: "Digital Strategy",
    tagline: "Plan. Build. Scale.",
    icon: (
      <svg
        className="w-4 h-4 text-[#059669]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

export function FounderSection() {
  return (
    <section id="founder" className="py-12 lg:py-16 bg-zinc-50/50 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Column 1: Founder Portrait */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start">
            <div className="relative w-44 h-52 sm:w-48 sm:h-56 rounded-2xl overflow-hidden shadow-md shadow-zinc-950/10 border-2 border-white bg-zinc-200">
              <Image
                src="/founder-portrait.png"
                alt="Omkar Bhokar — Founder & CEO of KeyCodeWeb"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 208px"
              />
            </div>
          </div>

          {/* Column 2: Founder Quote & Bio */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 text-center lg:text-left">
            <p className="text-base sm:text-lg text-zinc-700 font-medium leading-relaxed italic">
              &ldquo;I started KeyCodeWeb with a simple belief — that every business, big or small, deserves a powerful online presence. Today, we&apos;re helping brands turn their vision into digital reality.&rdquo;
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-zinc-200/60">
              <div>
                <span className="block text-lg font-black text-zinc-950 tracking-tight">
                  Omkar Bhokar
                </span>
                <span className="block text-xs font-bold text-[#059669] uppercase tracking-wider mt-0.5">
                  Founder & CEO
                </span>
              </div>

              {/* Handwritten Signature */}
              <div className="relative font-handwriting text-3xl sm:text-4xl text-zinc-800 -rotate-3 select-none pr-2">
                Omkar
              </div>
            </div>
          </div>

          {/* Column 3: What We Specialize In */}
          <div className="lg:col-span-4 rounded-2xl bg-white p-6 sm:p-7 border border-zinc-200/80 shadow-xs">
            <h3 className="text-lg font-black text-zinc-950 tracking-tight mb-5">
              What We Specialize In
            </h3>

            <div className="space-y-4">
              {specialties.map((s) => (
                <div key={s.name} className="flex items-center gap-3.5 group">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-[#10b981] group-hover:text-white transition-colors duration-150">
                    {s.icon}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-zinc-900 leading-tight">
                      {s.name}
                    </span>
                    <span className="block text-xs text-zinc-400 font-normal leading-tight mt-0.5">
                      {s.tagline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
