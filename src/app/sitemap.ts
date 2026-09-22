import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://keycodeweb.com";
  const now = new Date();

  // 1. Core Primary & Secondary Landing Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  // 2. Dynamic Service Landing Pages
  let serviceSlugs = [
    "web-design",
    "saas-app",
    "erp-software",
    "ecommerce",
    "dynamic-website",
    "custom-web-app",
    "hosting",
  ];
  try {
    const dbServices = await prisma.serviceItem.findMany({
      where: { status: "Active" },
      select: { slug: true, updatedAt: true },
    });
    if (dbServices.length > 0) {
      serviceSlugs = Array.from(new Set([...serviceSlugs, ...dbServices.map((s) => s.slug)]));
    }
  } catch (e) {
    console.error("Sitemap dynamic services error:", e);
  }

  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 3. Dynamic Portfolio Case Study Pages
  let portfolioSlugs = [
    "edulearn",
    "shopkart",
    "taskpro",
    "bizerp",
    "healthpulse",
    "propnest",
    "finedge",
    "dineflow",
  ];
  try {
    const dbPortfolio = await prisma.portfolioItem.findMany({
      where: { status: "Published" },
      select: { slug: true, updatedAt: true },
    });
    if (dbPortfolio.length > 0) {
      portfolioSlugs = Array.from(new Set([...portfolioSlugs, ...dbPortfolio.map((p) => p.slug)]));
    }
  } catch (e) {
    console.error("Sitemap dynamic portfolio error:", e);
  }

  const caseStudyPages: MetadataRoute.Sitemap = portfolioSlugs.map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // 4. Dynamic Blog Post Pages
  let blogSlugs = [
    "building-resilient-saas-architectures",
    "principles-of-high-converting-b2b-web-design",
  ];
  try {
    const dbBlogs = await prisma.blogPost.findMany({
      where: { status: "Published" },
      select: { slug: true, updatedAt: true },
    });
    if (dbBlogs.length > 0) {
      blogSlugs = Array.from(new Set([...blogSlugs, ...dbBlogs.map((b) => b.slug)]));
    }
  } catch (e) {
    console.error("Sitemap dynamic blogs error:", e);
  }

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...caseStudyPages, ...blogPages];
}
