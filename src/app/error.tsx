"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log minimal operational diagnostics without exposing sensitive data
    if (process.env.NODE_ENV === "development") {
      console.error("[Runtime Error Boundary caught]:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-white text-zinc-900">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-2xs mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
            APPLICATION NOTICE
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
          Something went wrong
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 mt-3 max-w-md mx-auto leading-relaxed">
          An unexpected error occurred while loading this section. Please try again or return to the home page.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Try Again ↻
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-50 shadow-2xs transition-all"
          >
            Back to Home →
          </Link>
        </div>
      </div>
    </div>
  );
}
