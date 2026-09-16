"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * HashScrollHandler
 * Ensures reliable, smooth cross-page and same-page anchor scrolling.
 * Works around Next.js App Router's client-side hash navigation timing issues.
 */
export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Only attempt hash scroll on client
    if (typeof window === "undefined") return;

    const performScroll = (targetId: string): boolean => {
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 85;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
        return true;
      }
      return false;
    };

    // 1. Check for stored session scroll target (set when clicking cross-page links)
    let target = "";
    try {
      target = sessionStorage.getItem("scroll_target") || "";
      if (target) {
        sessionStorage.removeItem("scroll_target");
      }
    } catch {
      target = "";
    }

    // 2. If not in session, check current window hash
    if (!target && window.location.hash) {
      target = window.location.hash.replace("#", "");
    }

    if (!target) return;

    // Retry mechanism to account for Next.js async page hydration and component mounting
    let attempts = 0;
    const maxAttempts = 12; // up to ~2 seconds
    const delays = [30, 80, 150, 250, 400, 600, 800, 1000, 1300, 1600, 2000, 2500];

    const timerIds: NodeJS.Timeout[] = [];

    const attemptScroll = (delay: number) => {
      const id = setTimeout(() => {
        attempts++;
        const success = performScroll(target);
        if (success || attempts >= maxAttempts) {
          // Clear remaining timeouts
          timerIds.forEach((t) => clearTimeout(t));
        }
      }, delay);
      timerIds.push(id);
    };

    delays.forEach((delay) => attemptScroll(delay));

    // Also listen for runtime hashchange events
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "");
      if (newHash) {
        performScroll(newHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      timerIds.forEach((t) => clearTimeout(t));
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  return null;
}
