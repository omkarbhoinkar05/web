import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ServicesSection } from "@/components/ServicesSection";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import {
  generateBreadcrumbSchema,
  generateFaqSchema,
  SITE_URL,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute: "Web Development Services | Custom Software & Applications | KeyCodeWeb",
  },
  description:
    "Explore end-to-end web development services by KeyCodeWeb in Kharghar, Navi Mumbai. Custom web development, UI/UX design, SaaS applications, ERP systems, e-commerce platforms, and cloud hosting.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Web Development Services | KeyCodeWeb",
    description:
      "Full-stack custom web development, SaaS applications, ERP software, e-commerce, and cloud solutions engineered for performance and scalability.",
    url: `${SITE_URL}/services`,
    siteName: "KeyCodeWeb",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 341,
        alt: "KeyCodeWeb - Web Development Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Services | KeyCodeWeb",
    description:
      "Full-stack custom web development, SaaS applications, ERP software, e-commerce, and cloud solutions engineered for performance and scalability.",
    images: ["/logo.png"],
  },
};

const serviceFaqs = [
  {
    question: "What web development services does KeyCodeWeb offer?",
    answer:
      "KeyCodeWeb provides comprehensive digital engineering services including custom website development, responsive UI/UX design, multi-tenant SaaS application development, custom ERP software, B2B and B2C e-commerce platforms, custom web applications with API integrations, and managed cloud hosting.",
  },
  {
    question: "How long does a custom web development engagement take?",
    answer:
      "Timelines depend on project complexity and scope. A standard corporate or business website typically requires 2 to 4 weeks. Complex SaaS applications, custom ERPs, and multi-vendor marketplaces generally require 8 to 16 weeks partitioned into verified milestone sprints.",
  },
  {
    question: "Can KeyCodeWeb build scalable SaaS applications and custom ERP software?",
    answer:
      "Yes. Our engineering team specializes in architecting scalable SaaS platforms with multi-tenant data isolation, role-based access control, subscription billing, and custom ERP systems for HR, CRM, inventory, and automated sales workflows.",
  },
  {
    question: "Do you provide hosting, domain setup, and ongoing maintenance?",
    answer:
      "Yes. We offer fully managed cloud hosting, domain DNS provisioning, SSL certificate installation, automated daily backups, server maintenance, and Service Level Agreement (SLA) technical support packages.",
  },
  {
    question: "Are websites developed by KeyCodeWeb mobile-friendly and optimized for SEO?",
    answer:
      "Every web application and website we develop is mobile-first, responsive across all screen viewports, structured with semantic HTML5, fast-loading with sub-second asset delivery, and built with standard Schema.org structured data for maximum search engine visibility.",
  },
];

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
  ]);

  const faqSchema = generateFaqSchema(serviceFaqs);

  return (
    <div className="flex flex-col min-h-screen bg-white relative w-full overflow-x-hidden text-zinc-900">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <main className="flex-1 w-full">
        {/* Services Page Hero Header */}
        <section className="relative pt-12 sm:pt-16 pb-12 sm:pb-16 bg-gradient-to-b from-emerald-50/50 via-white to-white border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Trail */}
            <nav
              aria-label="Breadcrumb"
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-6"
            >
              <Link href="/" className="hover:text-emerald-700 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-emerald-800 font-bold">Services</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
                FULL-STACK DIGITAL ENGINEERING
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-tight">
              Web Development Services
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 mt-4 max-w-3xl leading-relaxed">
              We design, build, deploy, and maintain high-performance digital solutions. From custom business websites and scalable SaaS architectures to enterprise ERPs and secure e-commerce systems, explore our full spectrum of web development services.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mt-6 pt-4 border-t border-zinc-200/60">
              <span>Studio: Kharghar, Navi Mumbai</span>
              <span>•</span>
              <span>Delivery: Pan-India &amp; Global</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">End-to-End Milestone Delivery</span>
            </div>
          </div>
        </section>

        {/* Existing Dynamic Services Grid (Identical Look & Feel) */}
        <div className="-mt-8">
          <ServicesSection />
        </div>

        {/* Factual Services FAQ Section for Search Engine Readiness */}
        <section className="py-16 sm:py-24 bg-zinc-50/60 border-t border-zinc-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider block mb-2">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                Frequently Asked Questions About Our Services
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2">
                Clear answers regarding project engagement models, delivery timelines, and technology standards.
              </p>
            </div>

            <div className="space-y-4">
              {serviceFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs"
                >
                  <h3 className="text-sm sm:text-base font-bold text-zinc-950">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-xs sm:text-sm text-zinc-600">
                Have a specialized technical requirement or custom project scope?
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Link
                  href="/#contact"
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
                >
                  Request Consultation →
                </Link>
                <Link
                  href="/portfolio"
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-50 shadow-2xs transition-all"
                >
                  View Case Studies
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
