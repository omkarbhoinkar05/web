"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("home");
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/" || pathname === "";

  const navLinks = [
    { name: "Home", href: "/", active: isHome && activeSection === "home" },
    { name: "About Us", href: "/#about", active: isHome && activeSection === "about" },
    { name: "Services", href: "/#services", active: isHome && activeSection === "services" },
    { name: "Our Process", href: "/#process", active: isHome && activeSection === "process" },
    { name: "Portfolio", href: "/#portfolio", active: isHome && activeSection === "portfolio" },
    { name: "Contact Us", href: "/#contact", active: isHome && activeSection === "contact" },
  ];

  // Smart Scroll: Hide when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setIsScrolled(true);
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          // Scrolling down -> hide navbar
          setIsVisible(false);
          setMobileMenuOpen(false);
        } else if (lastScrollY - currentScrollY > 6) {
          // Scrolling up -> show navbar
          setIsVisible(true);
        }
      } else {
        // At top
        setIsScrolled(false);
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Scroll Spy for active section highlight on Home Page
  useEffect(() => {
    if (!isHome) return;

    const sectionIds = ["contact", "testimonials", "portfolio", "process", "services", "about"];
    const handleScrollSpy = () => {
      const scrollY = window.scrollY;
      if (scrollY < 250) {
        setActiveSection("home");
        return;
      }
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [isHome]);

  // Smooth scroll handler for anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (isHome) {
        e.preventDefault();
        const elem = document.getElementById(targetId);
        if (elem) {
          const headerOffset = 85;
          const elementPosition = elem.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
          window.history.pushState(null, "", href);
          setActiveSection(targetId);
        }
      } else {
        // Navigating from /about-us, /portfolio, /careers, etc. to Home section
        e.preventDefault();
        try {
          sessionStorage.setItem("scroll_target", targetId);
        } catch {}
        router.push(href);
      }
      return;
    }

    if (href === "/" && isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      setActiveSection("home");
      return;
    }

    if (href === pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  };

  // Home link click handler
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      setActiveSection("home");
    }
  };

  return (
    <>
      {/* Fixed Smart Header */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-white shadow-md shadow-zinc-950/5 border-b border-zinc-200/80"
            : "bg-white border-b border-zinc-100/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <Link
            href="/"
            onClick={handleHomeClick}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] rounded-lg"
            aria-label="PixelForge Homepage"
          >
            {/* Stylized Emerald 'P' Mark */}
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <svg
                className="w-9 h-9"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="10" fill="transparent" />
                {/* Modern Ribbon P Icon */}
                <path
                  d="M10 8H23C27.9706 8 32 12.0294 32 17C32 21.9706 27.9706 26 23 26H17V33C17 34.1046 16.1046 35 15 35H12C10.8954 35 10 34.1046 10 33V8Z"
                  fill="url(#paint0_linear)"
                />
                <path
                  d="M17 14H22.5C24.433 14 26 15.567 26 17.5C26 19.433 24.433 21 22.5 21H17V14Z"
                  fill="white"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="10"
                    y1="8"
                    x2="32"
                    y2="35"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#10b981" />
                    <stop offset="1" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 leading-none">
                PixelForge
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.22em] text-zinc-400 uppercase mt-1">
                BUILDING A BRIGHTER WEB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-6 lg:gap-8"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <div key={link.name} className="relative py-2 flex flex-col items-center">
                <Link
                  href={link.href}
                  onClick={(e) =>
                    link.href === "/" ? handleHomeClick(e) : handleNavClick(e, link.href)
                  }
                  className={`text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] rounded-md px-1 ${
                    link.active
                      ? "text-[#059669] font-semibold"
                      : "text-zinc-600 hover:text-zinc-950 font-medium"
                  }`}
                  aria-current={link.active ? "page" : undefined}
                >
                  {link.name}
                </Link>
                {link.active && (
                  <div className="absolute -bottom-1 flex flex-col items-center">
                    <div className="w-6 h-0.5 rounded-full bg-[#059669]" />
                    <div className="w-1 h-1 rounded-full bg-[#059669] mt-0.5" />
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Button & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+919920818481"
              className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-full text-white bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#10b981] active:scale-95"
              aria-label="Call PixelForge directly at +91 99208 18481"
            >
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              <span>Call Now</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200/80 bg-white shadow-lg px-4 pt-2 pb-6 space-y-2">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) =>
                    link.href === "/" ? handleHomeClick(e) : handleNavClick(e, link.href)
                  }
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    link.active
                      ? "bg-emerald-50 text-[#059669] font-semibold"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-zinc-100">
              <a
                href="tel:+919920818481"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] font-semibold text-sm shadow-md shadow-emerald-500/25"
              >
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                </svg>
                <span>Call Now (+91 99208 18481)</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent layout shift beneath the fixed navbar */}
      <div className="h-20 sm:h-24 w-full shrink-0" aria-hidden="true" />
    </>
  );
}
