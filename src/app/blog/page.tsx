import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import prisma from "@/lib/prisma";
import { generateBreadcrumbSchema, SITE_URL } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute: "Engineering Blog & Web Insights | KeyCodeWeb",
  },
  description:
    "Explore practical engineering insights, software architecture deep dives, web design trends, and modern full-stack development best practices from the KeyCodeWeb engineering team.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Engineering Blog & Web Insights | KeyCodeWeb",
    description:
      "Explore practical engineering insights, software architecture deep dives, web design trends, and modern full-stack development best practices from the KeyCodeWeb engineering team.",
    url: `${SITE_URL}/blog`,
    siteName: "KeyCodeWeb",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 341,
        alt: "KeyCodeWeb Engineering Blog & Web Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Blog & Web Insights | KeyCodeWeb",
    description:
      "Explore practical engineering insights, software architecture deep dives, web design trends, and modern full-stack development best practices from the KeyCodeWeb engineering team.",
    images: ["/logo.png"],
  },
};

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  tags: string[];
}

const FALLBACK_ARTICLES: ArticleItem[] = [
  {
    id: "1",
    slug: "building-resilient-saas-architectures",
    title: "Building Resilient SaaS Architectures with Next.js and Micro-Frontends",
    excerpt:
      "A deep dive into how modern engineering teams architect scalable multi-tenant web applications without sacrificing performance or maintainability.",
    category: "Architecture",
    readTime: "6 min read",
    date: "Sep 2026",
    tags: ["Next.js", "SaaS", "Cloud Architecture"],
  },
  {
    id: "2",
    slug: "principles-of-high-converting-b2b-web-design",
    title: "10 Principles of High-Converting B2B Web Design for Modern Tech Companies",
    excerpt:
      "Transforming complex technical offerings into crystal-clear value propositions that build trust and drive enterprise inquiries.",
    category: "Design & UX",
    readTime: "5 min read",
    date: "Aug 2026",
    tags: ["UI/UX", "Conversion", "Enterprise"],
  },
  {
    id: "3",
    slug: "how-we-optimized-core-web-vitals",
    title: "How We Optimized Core Web Vitals to Achieve 99+ Performance Scores",
    excerpt:
      "A step-by-step breakdown of font sub-setting, modern bundle splitting, and zero-layout-shift asset delivery in production.",
    category: "Performance",
    readTime: "8 min read",
    date: "Jul 2026",
    tags: ["Performance", "SEO", "Web Vitals"],
  },
  {
    id: "4",
    slug: "future-of-custom-erp-solutions",
    title: "The Future of Custom ERP Solutions: Cloud-Native vs Legacy Monoliths",
    excerpt:
      "Why growing SMBs and mid-market enterprises are transitioning to tailored custom ERPs to streamline inventory, orders, and real-time reporting.",
    category: "Enterprise Software",
    readTime: "7 min read",
    date: "Jun 2026",
    tags: ["ERP", "Automation", "Workflow"],
  },
];

async function getPublishedArticles(): Promise<ArticleItem[]> {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { status: "Published" },
      orderBy: { createdAt: "desc" },
    });

    if (dbPosts.length > 0) {
      return dbPosts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        readTime: p.readTime,
        date: new Date(p.createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        tags: p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : ["Web"],
      }));
    }
  } catch (error) {
    console.error("Error fetching articles from database:", error);
  }

  return FALLBACK_ARTICLES;
}

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white relative text-zinc-900">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <main className="flex-1 w-full">
        {/* Header Area */}
        <section className="pt-12 sm:pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-xs mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-emerald-800">
                WEB INSIGHTS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.12]">
              Knowledge, Technology <br />
              <span className="text-emerald-700">&amp; Digital Innovation.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 mt-4 leading-relaxed max-w-2xl font-normal">
              Practical engineering insights, architectural teardowns, and design thinking from our digital craftsmen and software engineers.
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-12 sm:mt-16">
            {articles.map((article) => (
              <article
                key={article.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-zinc-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed font-normal line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono font-medium text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-1 transition-all"
                  >
                    <span>Read Article</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 sm:mt-18 p-8 sm:p-10 rounded-3xl bg-zinc-50 border border-zinc-200/90 text-center max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900">
              Have a project in mind?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">
              Let&apos;s build something extraordinary together. Talk directly with our tech team.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#contact"
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all"
              >
                Contact Our Team →
              </Link>
              <a
                href="https://wa.me/919920818481"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-50 shadow-2xs transition-all"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
