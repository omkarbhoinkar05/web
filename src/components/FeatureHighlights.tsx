import React from "react";

export function FeatureHighlights() {
  const features = [
    {
      title: "Custom Web Solutions",
      subtitle: "Built for Your Goals",
      icon: (
        <svg className="w-5 h-5 text-[#059669]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="5" r="2" />
          <circle cx="12" cy="5" r="2" />
          <circle cx="19" cy="5" r="2" />
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="12" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
        </svg>
      ),
    },
    {
      title: "Modern & Scalable",
      subtitle: "Ready for the Future",
      icon: (
        <svg className="w-5 h-5 text-[#059669]" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="6" height="6" rx="1.5" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" />
          <rect x="4" y="14" width="6" height="6" rx="1.5" />
          <rect x="14" y="14" width="6" height="6" rx="1.5" />
        </svg>
      ),
    },
    {
      title: "Results-Driven",
      subtitle: "More Traffic, More Growth",
      icon: (
        <svg className="w-5 h-5 text-[#059669]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50/90 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs">
            {feature.icon}
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-[13px] font-black text-zinc-900 leading-snug">
              {feature.title}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium leading-tight mt-0.5">
              {feature.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
