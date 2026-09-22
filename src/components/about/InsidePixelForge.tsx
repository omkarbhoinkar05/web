import React from "react";

interface Pillar {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

const pillars: Pillar[] = [
  {
    title: "Our Vision",
    subtitle: "Where we want to go.",
    description:
      "To create a brighter digital future where great ideas become meaningful experiences.",
    icon: (
      <svg
        className="w-5 h-5 text-[#059669]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Our Mission",
    subtitle: "Why we exist.",
    description:
      "To empower businesses through thoughtful design, modern technology and powerful digital solutions.",
    icon: (
      <svg
        className="w-5 h-5 text-[#059669]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
  {
    title: "Our People",
    subtitle: "Who makes it happen.",
    description:
      "A creative team of designers, developers and strategists passionate about solving real problems.",
    icon: (
      <svg
        className="w-5 h-5 text-[#059669]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Our Values",
    subtitle: "What we believe in.",
    description:
      "Creativity, collaboration, integrity, performance and long-term partnerships.",
    icon: (
      <svg
        className="w-5 h-5 text-[#059669]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h12l4 6-10 12L2 9z" />
        <path d="M11 3 8 9l4 12 4-12-3-6" />
        <path d="M2 9h20" />
      </svg>
    ),
  },
];

export function InsidePixelForge() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-950">
            Inside KeyCodeWeb
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base mt-1">
            The purpose, people and principles behind our work.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                {/* Icon Badge */}
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center shrink-0 mb-4 group-hover:scale-110 group-hover:bg-emerald-100/70 transition-transform duration-200">
                  {item.icon}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                  {item.title}
                </h3>
                <span className="block text-xs font-semibold text-[#059669] mt-0.5 mb-3">
                  {item.subtitle}
                </span>

                {/* Content */}
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
