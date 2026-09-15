"use client";

import React from "react";
import Image from "next/image";

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-[600px] lg:max-w-[660px] select-none group">
      {/* Soft Ambient Emerald Backlight Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] bg-gradient-to-tr from-[#10b981]/25 via-[#059669]/20 to-emerald-300/10 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Main Hero Visual Graphic */}
      <div className="relative w-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-[1.015]">
        <Image
          src="/hero-image.png"
          alt="PixelForge - Creative Digital Agency Website on MacBook Pro with Emerald Illuminated Stone"
          width={1024}
          height={819}
          priority
          unoptimized
          className="w-full h-auto object-contain mix-blend-multiply select-none"
        />
      </div>
    </div>
  );
}
