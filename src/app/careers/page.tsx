"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { useScheduleCall } from "@/components/schedule/ScheduleCallContext";

interface FormErrors {
  fullName?: string;
  mobile?: string;
  email?: string;
  resume?: string;
  message?: string;
}

export default function CareersPage() {
  const { openScheduleCall } = useScheduleCall();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    // Mobile Number (Indian 10-digit mobile with optional +91 / 91)
    const cleanedMobile = mobile.replace(/[\s-]/g, "");
    const mobileRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!cleanedMobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(cleanedMobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Resume
    if (!resumeFile) {
      newErrors.resume = "Please choose your resume (PDF, DOC, DOCX).";
    }

    // Message
    if (!message.trim()) {
      newErrors.message = "Please tell us a bit about yourself and your experience.";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate extension
    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      setErrors((prev) => ({
        ...prev,
        resume: "Please upload a PDF, DOC or DOCX file.",
      }));
      setResumeFile(null);
      return;
    }

    // Validate size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size exceeds 5 MB. Please upload a smaller file.",
      }));
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = new FormData();
      data.append("fullName", fullName);
      data.append("mobile", mobile);
      data.append("email", email);
      data.append("message", message);
      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      const response = await fetch("/api/careers", {
        method: "POST",
        body: data,
      });

      const resJson = await response.json();

      if (!response.ok) {
        if (resJson.errors) {
          setErrors(resJson.errors);
        }
        throw new Error(resJson.error || "Failed to submit application");
      }

      setIsSuccess(true);
      setIsSubmitting(false);

      // Reset form
      setFullName("");
      setMobile("");
      setEmail("");
      setResumeFile(null);
      setMessage("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setErrors({});
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(msg);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative w-full overflow-x-hidden">
      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* Main Careers Area with Clean Pure White Theme */}
        <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-white text-zinc-900 border-b border-zinc-100">
          {/* Background Subtle Top Ambient Light */}
          <div
            className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.06),rgba(255,255,255,0))] pointer-events-none -z-0"
            aria-hidden="true"
          />

          {/* Dotted Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none -z-0 opacity-[0.03]" aria-hidden="true">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="careers-dots-white" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#000000" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#careers-dots-white)" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            {/* Top 2-Column Hero Area: Left Culture & Right Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-14 items-start">
              {/* LEFT COLUMN: Careers Introduction + Culture */}
              <div className="lg:col-span-7 flex flex-col justify-center relative">
                {/* 4. CAREERS BADGE */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs mb-5 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
                    CAREERS
                  </span>
                </div>

                {/* 5. MAIN HEADING */}
                <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-zinc-900 tracking-tight leading-[1.12]">
                  Let’s Build a <br />
                  <span className="text-emerald-700">Brighter Future</span> <br />
                  Together
                </h1>

                {/* 6. INTRODUCTION TEXT */}
                <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-[550px] mt-4 sm:mt-5">
                  At KeyCodeWeb, we believe great people create great products. Join our team and be part of a culture that values innovation, collaboration and continuous growth.
                </p>

                {/* 7. CAREER BENEFITS (4 Items) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 sm:mt-10">
                  {/* Benefit 01: Supportive Team */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white hover:bg-emerald-50/25 border border-zinc-200/90 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all">
                    <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 leading-tight">Supportive Team</h4>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">Work with talented people</p>
                    </div>
                  </div>

                  {/* Benefit 02: Learn & Grow */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white hover:bg-emerald-50/25 border border-zinc-200/90 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all">
                    <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                        <path d="M9 18h6" />
                        <path d="M10 22h4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 leading-tight">Learn &amp; Grow</h4>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">Continuous learning opportunities</p>
                    </div>
                  </div>

                  {/* Benefit 03: Make an Impact */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white hover:bg-emerald-50/25 border border-zinc-200/90 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all">
                    <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 leading-tight">Make an Impact</h4>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">Work on real business impact</p>
                    </div>
                  </div>

                  {/* Benefit 04: Work-Life Balance */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white hover:bg-emerald-50/25 border border-zinc-200/90 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all">
                    <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 leading-tight">Work-Life Balance</h4>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">We care about your well-being</p>
                    </div>
                  </div>
                </div>

                {/* 8. DECORATIVE HANDWRITTEN TEXT (Center/Left) */}
                <div className="hidden sm:flex items-center gap-2 mt-8 pointer-events-none">
                  <span className="font-handwriting text-emerald-800 text-base sm:text-lg font-bold rotate-[-4deg]">
                    Good People Build Great Things
                  </span>
                  <svg className="w-10 h-7 text-emerald-600 rotate-12" viewBox="0 0 50 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 5 8 C 22 5, 36 12, 38 26" />
                    <path d="M 30 24 L 38 26 L 42 18" />
                  </svg>
                </div>

                {/* 9. TEAM VISUAL & 10. QUOTE CARD */}
                <div className="relative mt-8 rounded-3xl overflow-hidden border border-zinc-200/90 shadow-xl shadow-zinc-950/5 group">
                  <div className="relative w-full h-64 sm:h-80 md:h-96">
                    <Image
                      src="/careers-team.jpg"
                      alt="KeyCodeWeb team of software engineers and designers collaborating in office"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Subtle Emerald / Dark Overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-transparent to-transparent pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>

                  {/* 10. QUOTE CARD Overlaid on Team Image */}
                  <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-xl text-zinc-900">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl sm:text-4xl font-serif text-emerald-600 leading-none select-none">
                        “
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-relaxed italic">
                          A great place to grow, create and make an impact.
                        </p>
                        <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-wider block mt-1">
                          KeyCodeWeb Engineering &amp; Design Culture
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 11. APPLY NOW FORM */}
              <div className="lg:col-span-5 relative">
                {/* Decorative Handwritten Text on top right */}
                <div className="hidden xl:flex items-center gap-2 absolute -top-10 right-4 pointer-events-none">
                  <span className="font-handwriting text-emerald-800 text-base font-bold rotate-[4deg]">
                    Your Future Starts Here
                  </span>
                  <svg className="w-8 h-6 text-emerald-600 rotate-45" viewBox="0 0 50 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 5 25 C 20 20, 35 15, 38 6" />
                    <path d="M 28 8 L 38 6 L 36 16" />
                  </svg>
                </div>

                {/* Form Card */}
                <div className="rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl shadow-zinc-950/5 bg-white border border-zinc-200/90 hover:border-emerald-200 transition-colors">
                  {/* Form Header */}
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                      {/* Document / Application Icon */}
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                        Apply Now
                      </h2>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-0.5">
                        Take the next step in your career. Fill out the form below or{" "}
                        <button
                          type="button"
                          onClick={(e) => openScheduleCall(e.currentTarget)}
                          className="font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                        >
                          schedule a call
                        </button>{" "}
                        with our hiring team.
                      </p>
                    </div>
                  </div>

                  {/* Submission Success Alert */}
                  {isSuccess && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm animate-fade-in">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          ✓
                        </span>
                        <div>
                          <h5 className="font-extrabold text-emerald-900 text-sm">
                            Application Submitted Successfully!
                          </h5>
                          <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                            Thank you for your interest in joining KeyCodeWeb. Our talent acquisition team will review your application and contact you shortly.
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsSuccess(false)}
                            className="mt-3 text-xs font-bold underline text-emerald-700 hover:text-emerald-900 cursor-pointer"
                          >
                            Submit another response
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* General Error Alert */}
                  {errorMessage && (
                    <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      ⚠ {errorMessage}
                    </div>
                  )}

                  {/* Application Form */}
                  <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                    {/* FIELD 01: Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
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
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                          }}
                          placeholder="Enter your full name"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 bg-zinc-50 border transition-all duration-200 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                            errors.fullName ? "border-rose-400 ring-2 ring-rose-400/20" : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* FIELD 02: Mobile Number */}
                    <div>
                      <label htmlFor="mobile" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
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
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value);
                            if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
                          }}
                          placeholder="Enter your mobile number"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 bg-zinc-50 border transition-all duration-200 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                            errors.mobile ? "border-rose-400 ring-2 ring-rose-400/20" : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.mobile}
                        </p>
                      )}
                    </div>

                    {/* FIELD 03: Email Address */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
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
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                          }}
                          placeholder="Enter your email address"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 bg-zinc-50 border transition-all duration-200 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                            errors.email ? "border-rose-400 ring-2 ring-rose-400/20" : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* FIELD 04: Resume Upload */}
                    <div>
                      <label htmlFor="resume" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Resume <span className="text-emerald-600">*</span>
                      </label>

                      {/* Hidden Real File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="resume"
                        name="resume"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="sr-only"
                      />

                      {/* Custom Upload UX Container */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 bg-zinc-50 ${
                          errors.resume
                            ? "border-rose-400 ring-2 ring-rose-400/20"
                            : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        {!resumeFile ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                              </div>
                              <span className="text-xs text-zinc-600 truncate">
                                Choose your resume (PDF, DOC, DOCX)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs cursor-pointer active:scale-95 transition-all"
                            >
                              Browse
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                                ✓
                              </span>
                              <div className="overflow-hidden">
                                <span className="text-xs font-black text-zinc-900 block truncate">
                                  {resumeFile.name}
                                </span>
                                <span className="text-[10px] text-zinc-500 block">
                                  {formatFileSize(resumeFile.size)} · Ready to upload
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="px-2.5 py-1 rounded-md bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[11px] font-semibold cursor-pointer shrink-0 transition-colors"
                            >
                              Change
                            </button>
                          </div>
                        )}
                      </div>

                      {errors.resume ? (
                        <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.resume}
                        </p>
                      ) : (
                        <p className="text-[10px] text-zinc-400 mt-1">
                          Supported formats: PDF, DOC, DOCX (Max size: 5 MB)
                        </p>
                      )}
                    </div>

                    {/* FIELD 05: Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Message <span className="text-emerald-600">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                        }}
                        placeholder="Tell us about yourself, your experience and why you want to join us..."
                        className={`w-full p-3.5 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 bg-zinc-50 border resize-y min-h-[140px] transition-all duration-200 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
                          errors.message ? "border-rose-400 ring-2 ring-rose-400/20" : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                          <span>⚠</span> {errors.message}
                        </p>
                      )}
                    </div>

                    {/* 18. SUBMIT BUTTON */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-full font-extrabold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group/btn disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Submitting Application...</span>
                          </>
                        ) : isSuccess ? (
                          <>
                            <span>Application Submitted ✓</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Application</span>
                            <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* 19. PRIVACY MESSAGE */}
                    <div className="pt-1 text-center">
                      <p className="text-xs text-zinc-500 font-medium flex items-center justify-center gap-1.5">
                        <span>🔒</span>
                        <span>Your information is safe with us. We never share your data with anyone.</span>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* 23. BOTTOM BENEFITS BAR */}
            <div className="mt-16 sm:mt-20 lg:mt-24 p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border border-zinc-200/90 shadow-xl shadow-zinc-950/5 relative">
              {/* 24. Decorative Text on Right Side */}
              <div className="hidden lg:flex items-center gap-2 absolute -top-8 right-6 pointer-events-none">
                <span className="font-handwriting text-emerald-800 text-base font-bold rotate-[3deg]">
                  Join Us Make a Difference
                </span>
                <svg className="w-8 h-6 text-emerald-600 rotate-12" viewBox="0 0 50 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 5 10 C 20 6, 35 12, 38 24" />
                  <path d="M 28 22 L 38 24 L 40 14" />
                </svg>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Item 1: Meaningful Work */}
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center text-emerald-700 mb-3 shadow-xs">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-zinc-900">Meaningful Work</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed mt-1">
                    Work on real projects that create impact
                  </p>
                </div>

                {/* Item 2: Amazing Team */}
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:border-l-0 lg:border-l border-zinc-200/80 lg:pl-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center text-emerald-700 mb-3 shadow-xs">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-zinc-900">Amazing Team</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed mt-1">
                    Collaborate with talented professionals
                  </p>
                </div>

                {/* Item 3: Continuous Growth */}
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:border-l-0 lg:border-l border-zinc-200/80 lg:pl-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center text-emerald-700 mb-3 shadow-xs">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-zinc-900">Continuous Growth</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed mt-1">
                    Learn new skills and advance your career
                  </p>
                </div>

                {/* Item 4: Positive Culture */}
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:border-l-0 lg:border-l border-zinc-200/80 lg:pl-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center text-emerald-700 mb-3 shadow-xs">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-zinc-900">Positive Culture</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed mt-1">
                    Be yourself and thrive in a supportive environment
                  </p>
                </div>
              </div>
            </div>

            {/* 25. FINAL FOOTER-STYLE MESSAGE */}
            <div className="mt-14 sm:mt-18 text-center pb-4">
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase">
                PEOPLE &nbsp;|&nbsp; INNOVATION &nbsp;|&nbsp; OPPORTUNITY &nbsp;|&nbsp; A BRIGHTER TOMORROW
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modern IT Software Company Footer */}
      <Footer />

      {/* Floating Actions: WhatsApp Chat & Back to Top Arrow */}
      <FloatingActions />
    </div>
  );
}
