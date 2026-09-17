import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { getBlogPostBySlug, incrementBlogViews } from "@/lib/admin/db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const FALLBACK_POSTS_MAP: Record<
  string,
  {
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    date: string;
    author: string;
    tags: string[];
    content: string;
  }
> = {
  "building-resilient-saas-architectures": {
    title: "Building Resilient SaaS Architectures with Next.js and Micro-Frontends",
    excerpt:
      "A deep dive into how modern engineering teams architect scalable multi-tenant web applications without sacrificing performance or maintainability.",
    category: "Architecture",
    readTime: "6 min read",
    date: "Sep 2026",
    author: "Web Tech Team",
    tags: ["Next.js", "SaaS", "Cloud Architecture"],
    content: `Modern software systems demand high availability, multi-tenant isolation, and zero-downtime deployment pipelines. When engineering high-traffic SaaS products, architecture decisions made in early phases directly dictate organizational agility 12 months down the road.

### Key Architectural Pillars

1. **Domain-Driven Modularization**: Rather than tightly coupling business domains into a single monolithic bundle, we split critical workflows into isolated, independently testable feature modules.
2. **Stateless Authentication with Edge Tokens**: By leveraging cryptographically signed HMAC tokens, sessions can be verified instantaneously across regional serverless runtimes without hitting central database bottlenecks on every request.
3. **Optimistic UI with Background Invalidation**: React 19 transitions and server actions allow enterprise users to experience zero perceived latency while mutations synchronize reliably in the background.

### Operational Resilience

Ensuring data consistency requires robust database connection pooling, idempotent mutations, and graceful degradation during network partitions. In production environments, database read replicas and cached summary views handle high-frequency reporting without blocking OLTP transactional operations.`,
  },
  "principles-of-high-converting-b2b-web-design": {
    title: "10 Principles of High-Converting B2B Web Design for Modern Tech Companies",
    excerpt:
      "Transforming complex technical offerings into crystal-clear value propositions that build trust and drive enterprise inquiries.",
    category: "Design & UX",
    readTime: "5 min read",
    date: "Aug 2026",
    author: "Web Design Studio",
    tags: ["UI/UX", "Conversion", "Enterprise"],
    content: `B2B decision-makers evaluate software and agencies with scrutiny. A corporate web presence cannot merely be aesthetically pleasing; it must communicate value within the first three seconds of interaction.

### 1. The 3-Second Clarity Test
Your hero section must immediately answer three questions:
- What do you build?
- Who is it specifically designed for?
- What measurable outcome does it deliver?

### 2. Proof Over Promises
Enterprise prospects do not buy marketing jargon. They look for tangible case studies, client logos, verifiable speed metrics, and real dashboard previews rather than generic stock imagery.

### 3. Frictionless Conversion Paths
Reduce intake form fields to the absolute minimum required to start a meaningful conversation. Long, intimidating 10-field forms consistently suffer from 70%+ abandonment rates.`,
  },
  "how-we-optimized-core-web-vitals": {
    title: "How We Optimized Core Web Vitals to Achieve 99+ Performance Scores",
    excerpt:
      "A step-by-step breakdown of font sub-setting, modern bundle splitting, and zero-layout-shift asset delivery in production.",
    category: "Performance",
    readTime: "8 min read",
    date: "Jul 2026",
    author: "Performance Lab",
    tags: ["Performance", "SEO", "Web Vitals"],
    content: `Google's Core Web Vitals directly impact search visibility and user conversion rates. Achieving a 99+ Lighthouse performance score on desktop and mobile requires systematic elimination of render-blocking overhead.

### Critical Performance Optimizations

- **Font Subsetting & Preconnect**: Eliminating layout shifts (CLS) by using next/font with zero-runtime fallback font metrics.
- **Image Optimization & Modern Formats**: Delivering responsive AVIF/WebP assets with explicit aspect ratios and priority hints on Largest Contentful Paint (LCP) candidates.
- **CSS Architecture**: Removing heavy runtime CSS-in-JS libraries in favor of zero-runtime Tailwind CSS v4 to keep stylesheets below 20KB uncompressed.`,
  },
  "future-of-custom-erp-solutions": {
    title: "The Future of Custom ERP Solutions: Cloud-Native vs Legacy Monoliths",
    excerpt:
      "Why growing SMBs and mid-market enterprises are transitioning to tailored custom ERPs to streamline inventory, orders, and real-time reporting.",
    category: "Enterprise Software",
    readTime: "7 min read",
    date: "Jun 2026",
    author: "Enterprise Solutions",
    tags: ["ERP", "Automation", "Workflow"],
    content: `Off-the-shelf ERP platforms often burden growing enterprises with bloated subscription fees, rigid workflows, and unnecessary feature bloat. Tailored custom ERP software enables companies to digitalize their exact operational workflows with zero friction.

### Why Custom ERPs Deliver Unmatched ROI

1. **Perfect Process Alignment**: Software adapts to your company's battle-tested operations, not the other way around.
2. **Zero Per-Seat Licensing Penalties**: Scale from 10 to 1,000 team members without skyrocketing SaaS subscription fees.
3. **Direct Data Ownership**: Your transactional data lives securely in your dedicated database with automated backups and complete compliance control.`,
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (post) {
    return {
      title: `${post.title} | Web Insights`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        siteName: "Web",
      },
    };
  }

  const fallback = FALLBACK_POSTS_MAP[slug];
  if (fallback) {
    return {
      title: `${fallback.title} | Web Insights`,
      description: fallback.excerpt,
    };
  }

  return {
    title: "Article Not Found | Web",
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  let title = "";
  let excerpt = "";
  let category = "";
  let readTime = "";
  let author = "";
  let date = "";
  let tags: string[] = [];
  let content = "";
  let views = 0;

  if (post && post.status === "Published") {
    title = post.title;
    excerpt = post.excerpt;
    category = post.category;
    readTime = post.readTime;
    author = post.author;
    date = new Date(post.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    tags = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    content = post.content;
    views = post.views + 1;

    // Increment views in background
    incrementBlogViews(slug).catch(() => {});
  } else if (FALLBACK_POSTS_MAP[slug]) {
    const fb = FALLBACK_POSTS_MAP[slug];
    title = fb.title;
    excerpt = fb.excerpt;
    category = fb.category;
    readTime = fb.readTime;
    author = fb.author;
    date = fb.date;
    tags = fb.tags;
    content = fb.content;
    views = 42;
  } else {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white relative text-zinc-900">
      <Navbar />

      <main className="flex-1 w-full pt-10 sm:pt-14 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-8">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-emerald-700 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-zinc-800 truncate max-w-xs">{title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-10 sm:mb-12">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                {category}
              </span>
              <span className="text-xs text-zinc-400 font-medium">•</span>
              <span className="text-xs text-zinc-500 font-medium">{date}</span>
              <span className="text-xs text-zinc-400 font-medium">•</span>
              <span className="text-xs text-zinc-500 font-medium">{readTime}</span>
              {views > 0 && (
                <>
                  <span className="text-xs text-zinc-400 font-medium">•</span>
                  <span className="text-xs text-emerald-700 font-semibold">
                    👁️ {views} reads
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-[1.18] mb-6">
              {title}
            </h1>

            <p className="text-base sm:text-xl text-zinc-600 leading-relaxed font-normal bg-emerald-50/40 p-5 rounded-2xl border-l-4 border-emerald-600">
              {excerpt}
            </p>

            {/* Author Byline */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                {author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-900 block leading-tight">
                  {author}
                </span>
                <span className="text-[11px] text-zinc-500">
                  Engineering &amp; Architecture Insights
                </span>
              </div>
            </div>
          </header>

          {/* Body Content */}
          <div className="prose prose-zinc max-w-none text-zinc-800 leading-relaxed space-y-6 text-sm sm:text-base font-normal">
            {content.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight pt-4 pb-1"
                  >
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("1. ") || paragraph.startsWith("- ")) {
                return (
                  <div
                    key={idx}
                    className="pl-4 border-l-2 border-emerald-500 space-y-2 py-1 text-zinc-700 font-medium"
                  >
                    {paragraph.split("\n").map((line, lIdx) => (
                      <p key={lIdx}>{line}</p>
                    ))}
                  </div>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-zinc-200/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 mr-2">Tags:</span>
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-100 text-zinc-700 border border-zinc-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Next / Back CTA */}
          <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-black text-zinc-900 leading-snug">
                Want to build something extraordinary?
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                Consult with our senior developers and engineers for your upcoming project.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/blog"
                className="px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-white transition-all"
              >
                ← All Articles
              </Link>
              <Link
                href="/#contact"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                Schedule Consultation →
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
