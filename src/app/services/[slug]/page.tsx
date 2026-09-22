import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import prisma from "@/lib/prisma";
import {
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
  SITE_URL,
} from "@/lib/seo/schema";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

const SERVICE_SEO_MAP: Record<
  string,
  {
    title: string;
    description: string;
    category: string;
    faqs: { question: string; answer: string }[];
  }
> = {
  "web-design": {
    title: "Web Design Company | Responsive Website Design | KeyCodeWeb",
    description:
      "Professional web design and UI/UX engineering in Kharghar, Navi Mumbai. Responsive business websites, corporate portals, and high-converting landing pages.",
    category: "Web Design & UI/UX",
    faqs: [
      {
        question: "What is included in KeyCodeWeb's web design services?",
        answer:
          "Our web design process includes interactive wireframing, custom Figma prototypes, mobile-first responsive frontend development, Core Web Vitals optimization, and semantic SEO structure.",
      },
      {
        question: "Do you redesign existing websites?",
        answer:
          "Yes. We conduct complete UI/UX audits, restructure conversion funnels, modernize tech stacks, and improve page speed benchmarks while preserving existing SEO rankings.",
      },
    ],
  },
  "saas-app": {
    title: "SaaS Development Company | Custom SaaS Applications | KeyCodeWeb",
    description:
      "Scalable multi-tenant SaaS application development. Custom architecture, subscription billing, role-based dashboards, and enterprise cloud software.",
    category: "SaaS Development",
    faqs: [
      {
        question: "How do you ensure multi-tenant security in SaaS development?",
        answer:
          "We engineer secure multi-tenant SaaS architectures utilizing tenant isolation at the database layer, cryptographically verified session tokens, role-based access control (RBAC), and automated audit logs.",
      },
      {
        question: "Can you integrate subscription payment gateways?",
        answer:
          "Yes. We integrate global gateways such as Stripe, PayPal, and regional gateways like Razorpay with automated recurring billing, webhooks, prorations, and tax compliance.",
      },
    ],
  },
  "erp-software": {
    title: "ERP Software Development | Custom ERP Solutions | KeyCodeWeb",
    description:
      "Custom ERP software development for business automation. CRM, inventory management, HR/payroll systems, and real-time business intelligence.",
    category: "Enterprise Software",
    faqs: [
      {
        question: "Can custom ERP software replace multiple disconnected business tools?",
        answer:
          "Yes. A custom ERP consolidates CRM, employee payroll, inventory tracking, purchase orders, and sales reporting into a centralized database, eliminating manual data reconciliation.",
      },
      {
        question: "Is employee training provided after ERP deployment?",
        answer:
          "Yes. We deliver role-based documentation, milestone training sessions for administrators and staff, and ongoing SLA maintenance support.",
      },
    ],
  },
  ecommerce: {
    title: "E-Commerce Development Company | B2B & B2C | KeyCodeWeb",
    description:
      "Custom B2B and B2C e-commerce website development. Multi-vendor marketplaces, secure payment gateways, inventory tracking, and seamless checkout.",
    category: "E-Commerce Development",
    faqs: [
      {
        question: "Do you build custom e-commerce platforms or use templates?",
        answer:
          "We build bespoke full-stack e-commerce platforms optimized for fast page loads, high transaction volumes, custom inventory workflows, and seamless payment gateway integrations.",
      },
      {
        question: "How do you optimize e-commerce websites for search engines?",
        answer:
          "We implement Schema.org Product and BreadcrumbList structured data, automated XML sitemaps, canonical tags for faceted filters, and sub-second load times for maximum organic search rankings.",
      },
    ],
  },
  "dynamic-website": {
    title: "Dynamic Website Development | CMS & Web Portals | KeyCodeWeb",
    description:
      "Dynamic website development with flexible CMS backends. Editorial portals, real estate platforms, membership websites, and interactive web directories.",
    category: "Dynamic Web Applications",
    faqs: [
      {
        question: "Can non-technical team members update content easily?",
        answer:
          "Yes. All dynamic websites include customized, secure content management systems (CMS) with intuitive rich-text editing, media uploads, and instant live previews.",
      },
      {
        question: "Can dynamic websites handle high concurrent visitor traffic?",
        answer:
          "Yes. By combining Next.js incremental static regeneration, edge caching, and optimized database indexing, our dynamic platforms easily scale to handle traffic spikes.",
      },
    ],
  },
  "custom-web-app": {
    title: "Custom Web Application Development | KeyCodeWeb",
    description:
      "Bespoke web application development for complex business workflows. Custom dashboards, RESTful APIs, third-party integrations, and automated systems.",
    category: "Custom Web Applications",
    faqs: [
      {
        question: "What technologies are used for custom web application development?",
        answer:
          "We utilize a modern full-stack stack comprising Next.js, React, TypeScript, Node.js, Tailwind CSS, Prisma ORM, and high-performance relational databases such as PostgreSQL or MySQL.",
      },
      {
        question: "Can custom web applications integrate with existing third-party APIs?",
        answer:
          "Yes. We engineer secure RESTful and GraphQL API bridges, webhook handlers, and third-party connector services (such as WhatsApp, CRM, payment, and cloud storage providers).",
      },
    ],
  },
  hosting: {
    title: "Web Hosting & Managed Hosting Services | KeyCodeWeb",
    description:
      "High-performance cloud web hosting, VPS server configuration, SSL certificates, website migration, automated backups, and 24/7 security monitoring.",
    category: "Cloud Hosting & Infrastructure",
    faqs: [
      {
        question: "What is included with KeyCodeWeb managed hosting?",
        answer:
          "Our managed hosting packages include server provisioning, SSL certificate installation, proactive firewall security, daily automated off-site backups, and 99.9% uptime monitoring.",
      },
      {
        question: "Do you handle website and database migration?",
        answer:
          "Yes. We provide complete zero-downtime website and database migrations from your existing provider to high-performance cloud servers.",
      },
    ],
  },
};

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const seoConfig = SERVICE_SEO_MAP[normalizedSlug];

  let title = seoConfig?.title || "Web Development Services | KeyCodeWeb";
  let description =
    seoConfig?.description ||
    "Professional web development and digital engineering solutions by KeyCodeWeb in Kharghar, Navi Mumbai.";

  try {
    const service = await prisma.serviceItem.findUnique({ where: { slug: normalizedSlug } });
    if (service && !seoConfig) {
      title = `${service.title} | KeyCodeWeb`;
      description = service.shortDescription || service.description || description;
    }
  } catch {}

  const canonicalUrl = `${SITE_URL}/services/${normalizedSlug}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "KeyCodeWeb",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 1024,
          height: 341,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const seoConfig = SERVICE_SEO_MAP[normalizedSlug];

  let service = null;
  try {
    service = await prisma.serviceItem.findUnique({
      where: { slug: normalizedSlug },
    });
  } catch (err) {
    console.error("Failed to load service detail:", err);
  }

  // Fallback for static builds or offline DB
  if (!service) {
    const fallbackTitles: Record<string, string> = {
      "web-design": "Web Design",
      "saas-app": "SaaS App Development",
      "erp-software": "ERP Software",
      ecommerce: "E-Commerce",
      "dynamic-website": "Dynamic Website",
      "custom-web-app": "Custom Web App",
      hosting: "Hosting",
    };
    if (fallbackTitles[normalizedSlug]) {
      service = {
        id: normalizedSlug,
        slug: normalizedSlug,
        title: fallbackTitles[normalizedSlug],
        shortDescription: seoConfig?.description || "High-performance digital web solutions.",
        description: null,
        features: "[]",
        image: null,
        icon: null,
        buttonText: "Contact Now →",
        href: "#contact",
        displayOrder: 1,
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  if (!service || service.status !== "Active") {
    notFound();
  }

  // Parse features
  let featuresList: string[] = [];
  if (service.features) {
    if (service.features.startsWith("[") && service.features.endsWith("]")) {
      try {
        featuresList = JSON.parse(service.features);
      } catch {
        featuresList = service.features.split(",").map((s) => s.trim()).filter(Boolean);
      }
    } else {
      featuresList = service.features.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  // Structured Data
  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.shortDescription || service.description || "Web Development Service",
    slug: normalizedSlug,
    serviceType: seoConfig?.category || "Web Development",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.title, url: `/services/${normalizedSlug}` },
  ]);

  const faqs = seoConfig?.faqs || [
    {
      question: `What makes KeyCodeWeb's ${service.title} unique?`,
      answer: `Our ${service.title} solutions are engineered with modern web standards, mobile responsiveness, fast load speeds, and strict clean code principles.`,
    },
    {
      question: `How can I get started with ${service.title}?`,
      answer: `You can reach out via our contact form or schedule a project discussion call with our technical leads.`,
    },
  ];

  const faqSchema = generateFaqSchema(faqs);

  const relatedServices = [
    { slug: "web-design", title: "Web Design" },
    { slug: "saas-app", title: "SaaS App Development" },
    { slug: "erp-software", title: "ERP Software" },
    { slug: "ecommerce", title: "E-Commerce" },
    { slug: "custom-web-app", title: "Custom Web App" },
    { slug: "hosting", title: "Hosting" },
  ].filter((s) => s.slug !== normalizedSlug);

  return (
    <main className="min-h-screen bg-white text-zinc-900 selection:bg-emerald-500 selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.25),rgba(0,0,0,0))] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumbs"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-emerald-400/20 text-xs font-semibold text-emerald-300 mb-6 backdrop-blur-xs"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-white">{service.title}</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            {service.title}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {service.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="px-8 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-xl shadow-black/25 transition-all hover:scale-105"
            >
              Get Started with {service.title} →
            </Link>
            <Link
              href="/services"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content & Features */}
      <section className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left 2 Cols: Description, Features & FAQs */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2">
                OVERVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Engineered for High Performance &amp; Growth
              </h2>
              <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
                {service.description ||
                  `Our bespoke ${service.title} solutions are engineered specifically to solve operational friction, maximize user engagement, and accelerate your business digital transformation with modern web technologies.`}
              </p>
            </div>

            {/* Features Checklist Grid */}
            {featuresList.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-3">
                  WHAT WE DELIVER
                </span>
                <h3 className="text-xl font-bold text-zinc-900 mb-5">
                  Key Features &amp; Deliverables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {featuresList.map((feat, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-zinc-800">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Architecture Standards */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100">
              <h4 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <span className="text-emerald-600">🛡️</span>
                Enterprise Grade Quality Standards
              </h4>
              <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed mt-2">
                Every project is crafted adhering to modern code standards, mobile-first responsive design, sub-second load times, continuous security auditing, and SEO architecture.
              </p>
            </div>

            {/* Service FAQ Accordion */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2">
                COMMON INQUIRIES
              </span>
              <h3 className="text-xl font-bold text-zinc-900 mb-4">
                Frequently Asked Questions About {service.title}
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80"
                  >
                    <h4 className="text-sm font-bold text-zinc-950">{faq.question}</h4>
                    <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Services Links */}
            <div className="pt-6 border-t border-zinc-100">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
                EXPLORE OTHER SERVICES
              </span>
              <div className="flex flex-wrap gap-2">
                {relatedServices.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/services/${rel.slug}`}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-800 text-zinc-700 transition-colors"
                  >
                    {rel.title} →
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Consultation Card */}
          <div className="p-7 rounded-3xl bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50 space-y-6 lg:sticky lg:top-28">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ready to Deploy
              </div>
              <h3 className="text-xl font-black text-zinc-950">
                Kickstart Your Project
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Connect with our technical architects for a free requirements assessment and milestone timeline.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-3 text-xs text-zinc-700 font-medium">
                <span className="w-4 h-4 text-emerald-600">⚡</span>
                <span>Fast 24-hour turnaround</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-700 font-medium">
                <span className="w-4 h-4 text-emerald-600">🔒</span>
                <span>Confidential NDA protected</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-700 font-medium">
                <span className="w-4 h-4 text-emerald-600">💼</span>
                <span>Tailored milestone pricing</span>
              </div>
            </div>

            <Link
              href="/#contact"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <span>{service.buttonText || "Contact Now →"}</span>
            </Link>
          </div>
        </div>
      </section>

      <FloatingActions />
      <Footer />
    </main>
  );
}
