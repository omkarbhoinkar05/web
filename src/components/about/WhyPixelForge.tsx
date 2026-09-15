import React from "react";

interface Differentiator {
  num: string;
  title: string;
  description: string;
}

const points: Differentiator[] = [
  {
    num: "01",
    title: "Creative Thinking",
    description: "We think beyond templates to craft bespoke digital identities.",
  },
  {
    num: "02",
    title: "Modern Technology",
    description: "We build with reliable, modern technology for speed and resilience.",
  },
  {
    num: "03",
    title: "Performance First",
    description: "Beautiful digital experiences should also load in milliseconds.",
  },
  {
    num: "04",
    title: "Business Focused",
    description: "Every line of code and pixel serves measurable business growth.",
  },
  {
    num: "05",
    title: "Long-Term Partnership",
    description: "We don't just launch and leave — we scale alongside our clients.",
  },
];

export function WhyPixelForge() {
  return (
    <section className="py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Story Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#059669] shadow-2xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="text-[10.5px] font-bold tracking-[0.2em] uppercase">
              THE PHILOSOPHY
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 leading-[1.1]">
            FROM AN IDEA <br />
            <span className="bg-gradient-to-r from-[#10b981] via-[#059669] to-teal-800 bg-clip-text text-transparent">
              TO A BRIGHTER WEB.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed mt-4">
            PixelForge started with a conviction that web development was losing its human craft. Clunky templates and cookie-cutter agencies were treating visionary founders like just another ticket. We set out to change that by fusing bespoke aesthetic artistry with cutting-edge engineering rigor. Today, we empower bold brands with high-performance digital flagships that command trust, drive conversions, and stand the test of time.
          </p>
        </div>

        {/* Why PixelForge 5 Points Grid */}
        <div className="pt-8 border-t border-zinc-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Why PixelForge?
            </h3>
            <span className="text-xs sm:text-sm font-semibold text-[#059669] uppercase tracking-wider mt-1 sm:mt-0">
              5 Principles of Excellence
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {points.map((p) => (
              <div
                key={p.num}
                className="p-5 rounded-2xl bg-white border border-zinc-200/70 shadow-2xs hover:border-emerald-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <span className="block text-3xl font-black text-[#10b981]/30 group-hover:text-[#10b981] transition-colors duration-200">
                    {p.num}
                  </span>
                  <h4 className="text-base font-black text-zinc-900 tracking-tight mt-3 mb-1.5">
                    {p.title}
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-emerald-200/60 rounded-full mt-4 group-hover:w-full group-hover:bg-[#10b981] transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
