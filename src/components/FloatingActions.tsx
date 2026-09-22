"use client";

import React, { useState, useEffect } from "react";

interface FloatingActionsProps {
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function FloatingActions({
  whatsappNumber = "919920818481",
  whatsappMessage = "Hello KeyCodeWeb, I would like to inquire about a project.",
}: FloatingActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <aside
      aria-label="Floating quick actions"
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex flex-col items-end gap-3 pointer-events-none select-none"
    >
      {/* WhatsApp Chat Button */}
      <div className="relative group pointer-events-auto">
        {/* Tooltip on Desktop */}
        <div
          role="tooltip"
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:flex items-center pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap"
        >
          <span className="px-3 py-1.5 rounded-xl bg-zinc-950/90 backdrop-blur-md text-white text-xs font-semibold shadow-xl border border-zinc-800">
            Chat on WhatsApp
          </span>
          <span className="w-2 h-2 bg-zinc-950/90 rotate-45 -ml-1 border-r border-t border-zinc-800" />
        </div>

        {/* Pulse Aura */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 blur-sm animate-pulse pointer-events-none" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with KeyCodeWeb on WhatsApp"
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] hover:from-[#20ba59] hover:to-[#075E54] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/35 hover:shadow-xl hover:shadow-[#25D366]/45 hover:scale-108 active:scale-95 transition-all duration-300"
        >
          {/* Official WhatsApp SVG Icon */}
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-white drop-shadow-xs"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.3-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.68-2.088-.175-.301-.018-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.678-1.635-.929-2.239-.244-.589-.493-.509-.678-.519-.175-.01-.376-.01-.577-.01-.201 0-.527.075-.803.376-.276.3-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.229 3.113.15.201 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.23 1.379.197 1.9.12.58-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.076-.125-.276-.201-.577-.351zM12.04 2C6.52 2 2.03 6.49 2.03 12.01c0 1.97.57 3.89 1.66 5.54L2 22l4.61-1.63c1.58.97 3.42 1.5 5.43 1.5 5.52 0 10.01-4.49 10.01-10.01C22.05 6.49 17.56 2 12.04 2zm0 18.29c-1.77 0-3.41-.5-4.83-1.37l-.35-.21-2.73.97.98-2.66-.23-.37c-.96-1.52-1.47-3.29-1.47-5.14 0-4.57 3.72-8.29 8.29-8.29 4.57 0 8.29 3.72 8.29 8.29 0 4.57-3.72 8.29-8.29 8.29z" />
          </svg>
        </a>
      </div>

      {/* Scroll to Top Arrow Button */}
      <div
        className={`pointer-events-auto transition-all duration-300 transform ${
          showScrollTop
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-90 pointer-events-none"
        }`}
      >
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Back to top"
          className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-emerald-600 text-zinc-700 hover:text-white border border-emerald-200/90 hover:border-emerald-600 backdrop-blur-md flex items-center justify-center shadow-lg shadow-zinc-950/10 hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {/* Arrow Up SVG Icon */}
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
