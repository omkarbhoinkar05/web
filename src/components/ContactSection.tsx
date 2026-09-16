"use client";

import React, { useState } from "react";
import { useScheduleCall } from "@/components/schedule/ScheduleCallContext";

interface FormState {
  fullName: string;
  service: string;
  email: string;
  mobile: string;
  message: string;
  budget: string;
}

interface FormErrors {
  fullName?: string;
  service?: string;
  email?: string;
  mobile?: string;
  message?: string;
}

export function ContactSection() {
  const { openScheduleCall } = useScheduleCall();
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    service: "",
    email: "",
    mobile: "",
    message: "",
    budget: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const serviceOptions = [
    "Web Design",
    "SaaS App Development",
    "ERP Software",
    "E-Commerce",
    "Dynamic Website",
    "Custom Web App",
    "Hosting",
    "Other",
  ];

  const budgetOptions = [
    "₹25,000 – ₹50,000",
    "₹50,000 – ₹1,00,000",
    "₹1,00,000 – ₹2,00,000",
    "₹2,00,000 – ₹5,00,000",
    "₹5,00,000+",
    "Not Sure Yet",
    "Prefer Not to Say",
  ];

  const validateField = (name: keyof FormState, value: string): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return undefined;
      case "service":
        if (!value || value === "") return "Please select a service.";
        return undefined;
      case "email":
        if (!value.trim()) return "Email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address.";
        return undefined;
      case "mobile":
        if (!value.trim()) return "Mobile number is required.";
        const cleanNumber = value.replace(/[\s\-]/g, "");
        const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
        if (!phoneRegex.test(cleanNumber)) {
          return "Please enter a valid 10-digit Indian mobile number.";
        }
        return undefined;
      case "message":
        if (!value.trim()) return "Please describe your project or inquiry.";
        if (value.trim().length < 10) return "Message must be at least 10 characters.";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      const fieldError = validateField(name as keyof FormState, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldError = validateField(name as keyof FormState, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {
      fullName: validateField("fullName", formData.fullName),
      service: validateField("service", formData.service),
      email: validateField("email", formData.email),
      mobile: validateField("mobile", formData.mobile),
      message: validateField("message", formData.message),
    };

    const hasErrors = Object.values(newErrors).some((err) => err !== undefined);

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setStatus("success");
      setFormData({
        fullName: "",
        service: "",
        email: "",
        mobile: "",
        message: "",
        budget: "",
      });

      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again or reach us via WhatsApp.";
      setErrorMessage(msg);
      setTimeout(() => {
        setStatus("idle");
      }, 4000);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-white border-t border-zinc-100 text-zinc-900"
    >
      {/* Background Subtle Ambient Glow */}
      <div
        className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.06),rgba(255,255,255,0))] pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Decorative Dotted Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-0 opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="contact-dots-white" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#000000" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-dots-white)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Top Section Header with Decorative Handwritten Callouts */}
        <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Left Decorative Handwritten Callout (Desktop) */}
          <div className="hidden lg:flex flex-col items-end absolute -left-48 top-3 pointer-events-none">
            <span className="font-handwriting text-emerald-800 text-base sm:text-lg font-bold leading-tight rotate-[-6deg] text-right drop-shadow-xs">
              Your Ideas <br />
              Our Expertise <br />
              Real Growth
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
          <div className="hidden lg:flex flex-col items-start absolute -right-48 top-3 pointer-events-none">
            <span className="font-handwriting text-emerald-800 text-base sm:text-lg font-bold leading-tight rotate-[6deg] text-left drop-shadow-xs">
              Let&apos;s Turn <br />
              Your Vision <br />
              Into Reality
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs shadow-emerald-500/10 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
              CONTACT US
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.12]">
            Let&apos;s Build Something <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-700 bg-clip-text text-transparent">
              Amazing Together
            </span>
          </h2>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl mt-4 sm:mt-5 text-center">
            Have a project in mind? We&apos;d love to hear from you. Get in touch and let&apos;s turn your ideas into powerful digital solutions.
          </p>
        </div>

        {/* Main Contact Layout: LEFT 45% | RIGHT 55% */}
        <div className="mt-14 sm:mt-18 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT SIDE (45% -> lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-7 sm:space-y-8">
            {/* Introduction */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold tracking-wider uppercase text-emerald-800 mb-3">
                <span>✦</span> GET IN TOUCH
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight leading-snug">
                We&apos;re Here to Help You Grow
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed mt-3">
                Whether you need a website, web application, ERP, SaaS solution or simply want to discuss an idea — our team is ready to assist you.
              </p>
            </div>

            {/* Four Compact Contact Information Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* CARD 01 — CALL US */}
              <a
                href="tel:+919920818481"
                className="group p-4 rounded-2xl bg-white hover:bg-emerald-50/25 border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Call Us
                  </span>
                  <span className="text-xs sm:text-sm font-black text-zinc-900 group-hover:text-emerald-700 transition-colors block truncate mt-0.5">
                    +91 99208 18481
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">
                    Mon – Sat, 9:00 AM – 7:00 PM
                  </span>
                </div>
              </a>

              {/* CARD 02 — EMAIL US */}
              <a
                href="mailto:dev.omkar05@gmail.com"
                className="group p-4 rounded-2xl bg-white hover:bg-emerald-50/25 border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Email Us
                  </span>
                  <span className="text-xs sm:text-sm font-black text-zinc-900 group-hover:text-emerald-700 transition-colors block truncate mt-0.5">
                    dev.omkar05@gmail.com
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">
                    We reply within 24 hours
                  </span>
                </div>
              </a>

              {/* CARD 03 — OUR LOCATION */}
              <div className="group p-4 rounded-2xl bg-white hover:bg-emerald-50/25 border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Our Location
                  </span>
                  <span className="text-xs sm:text-sm font-black text-zinc-900 block truncate mt-0.5">
                    Kharghar, Navi Mumbai
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">
                    Visit us at our office
                  </span>
                </div>
              </div>

              {/* CARD 04 — CHAT ON WHATSAPP */}
              <a
                href="https://wa.me/919920818481"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-white hover:bg-emerald-50/25 border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Chat on WhatsApp
                  </span>
                  <span className="text-xs sm:text-sm font-black text-zinc-900 group-hover:text-emerald-700 transition-colors block truncate mt-0.5">
                    +91 99208 18481
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">
                    Get instant support
                  </span>
                </div>
              </a>
            </div>

            {/* Direct Consultation / Schedule a Call Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-zinc-900 leading-tight">
                    Prefer a 1-on-1 Consultation?
                  </h4>
                  <p className="text-[11px] text-zinc-600 mt-0.5">
                    Book a free 30-min discovery call directly with our team.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => openScheduleCall(e.currentTarget)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shrink-0 transition-all cursor-pointer active:scale-95 text-center"
              >
                Schedule a Call →
              </button>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-3">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 flex items-center justify-center text-zinc-700 hover:text-emerald-700 shadow-2xs hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.75-1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 flex items-center justify-center text-zinc-700 hover:text-emerald-700 shadow-2xs hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 flex items-center justify-center text-zinc-700 hover:text-emerald-700 shadow-2xs hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 flex items-center justify-center text-zinc-700 hover:text-emerald-700 shadow-2xs hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Left-Side Visual Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-black text-zinc-900 block">Fast-Track Technical Discussion</span>
                    <span className="text-[10px] text-zinc-600">Direct access to senior solution architects</span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Handwritten Process Milestones */}
              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-handwriting text-emerald-800 font-bold">
                <span>Ideas</span>
                <span className="text-emerald-500">→</span>
                <span>Discussions</span>
                <span className="text-emerald-500">→</span>
                <span>Solutions</span>
                <span className="text-emerald-500">→</span>
                <span className="text-emerald-950">Success!</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — CONTACT FORM (55% -> lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 lg:p-10 shadow-xl shadow-emerald-950/5 relative">
              {/* Form Card Header */}
              <div className="flex items-start gap-4 mb-7 sm:mb-8 pb-5 border-b border-zinc-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                    Send Us a Message
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                    Fill out the form below and our team will get back to you soon.
                  </p>
                </div>
              </div>

              {/* Status Alert Banner */}
              {status === "success" && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <span className="text-sm font-black block">Message Sent Successfully!</span>
                    <span className="text-xs text-emerald-700">
                      Thank you for reaching out. Our solution architects will contact you within 24 hours.
                    </span>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    ✕
                  </div>
                  <div>
                    <span className="text-sm font-bold block">{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Form Grid */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                {/* Row 1: Full Name & Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* FIELD 01 — FULL NAME */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                      Full Name <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your full name"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-50 border text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                          errors.fullName ? "border-rose-400 ring-2 ring-rose-400/20" : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* FIELD 02 — SERVICE */}
                  <div>
                    <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                      Service <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="14" x="2" y="7" rx="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full pl-10 pr-9 py-3 rounded-2xl bg-zinc-50 border text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer appearance-none ${
                          errors.service ? "border-rose-400 ring-2 ring-rose-400/20" : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <option value="">Select a service</option>
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    {errors.service && (
                      <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {errors.service}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email Address & Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* FIELD 03 — EMAIL */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                      Email Address <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email address"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-50 border text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                          errors.email ? "border-rose-400 ring-2 ring-rose-400/20" : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* FIELD 04 — MOBILE NUMBER */}
                  <div>
                    <label htmlFor="mobile" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                      Mobile Number <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. +91 99208 18481"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-50 border text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 ${
                          errors.mobile ? "border-rose-400 ring-2 ring-rose-400/20" : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                    Message <span className="text-emerald-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell us about your project, requirements or any questions..."
                    className={`w-full p-4 rounded-2xl bg-zinc-50 border text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 min-h-[120px] resize-y ${
                      errors.message ? "border-rose-400 ring-2 ring-rose-400/20" : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                      <span>⚠</span> {errors.message}
                    </p>
                  )}
                </div>

                {/* Row 4: Budget (OPTIONAL) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="budget" className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                      Budget
                    </label>
                    <span className="text-[11px] text-zinc-500 font-normal italic">
                      If you want to share (Optional)
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer appearance-none"
                    >
                      <option value="">Select your budget range</option>
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Row 5: CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-extrabold text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 group/btn cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : status === "success" ? (
                      <span>Message Sent ✓</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span className="transition-transform duration-200 group-hover/btn:translate-x-1.5">
                          →
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-zinc-500 font-medium mt-3.5 flex items-center justify-center gap-1.5">
                    <span>🔒</span>
                    <span>Your information is safe with us. We never share your data with anyone.</span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar (4-column on White Theme) */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-3xl bg-zinc-50/80 hover:bg-emerald-50/30 border border-zinc-200/80 shadow-sm transition-colors duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center text-center sm:text-left">
            {/* Item 1: Fast Response */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-black text-zinc-900">Fast Response</h4>
                <p className="text-xs text-zinc-600 mt-0.5">We value your time</p>
              </div>
            </div>

            {/* Item 2: Expert Guidance */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-t sm:border-t-0 sm:border-l border-zinc-200/80 pt-4 sm:pt-0 sm:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-black text-zinc-900">Expert Guidance</h4>
                <p className="text-xs text-zinc-600 mt-0.5">Get the right solutions</p>
              </div>
            </div>

            {/* Item 3: 100% Confidential */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-t sm:border-t-0 lg:border-l border-zinc-200/80 pt-4 sm:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-black text-zinc-900">100% Confidential</h4>
                <p className="text-xs text-zinc-600 mt-0.5">Your data is safe with us</p>
              </div>
            </div>

            {/* Item 4: Dedicated Support */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-t sm:border-t-0 sm:border-l border-zinc-200/80 pt-4 sm:pt-0 sm:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-black text-zinc-900">Dedicated Support</h4>
                <p className="text-xs text-zinc-600 mt-0.5">We&apos;re always here for you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Decorative CTA at Bottom Right */}
        <div className="mt-8 flex justify-end pr-2 sm:pr-8">
          <div className="flex items-center gap-2.5">
            <span className="font-handwriting text-emerald-800 text-sm sm:text-base font-bold rotate-[-3deg] text-right">
              Start Your <br />
              Success Journey <br />
              Today!
            </span>
            <svg
              className="w-8 h-8 text-emerald-600 rotate-12 drop-shadow-xs"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
