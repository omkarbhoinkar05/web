/**
 * Standard Schema.org JSON-LD Structured Data Generators for KeyCodeWeb
 * All information conforms strictly to verified business data and Schema.org standards.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://keycodeweb.com";
export const BRAND_NAME = "KeyCodeWeb";
export const PHONE_NUMBER = "+91 99208 18481";
export const SUPPORT_EMAIL = "dev.omkar05@gmail.com";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 1024,
      height: 341,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-9920818481",
        contactType: "customer service",
        areaServed: ["IN", "Worldwide"],
        availableLanguage: ["English", "Hindi"],
        email: SUPPORT_EMAIL,
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kharghar",
      addressLocality: "Navi Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "410210",
      addressCountry: "IN",
    },
    sameAs: [
      "https://github.com",
      "https://www.linkedin.com",
      "https://twitter.com",
    ],
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: BRAND_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    telephone: "+91-9920818481",
    email: SUPPORT_EMAIL,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sector 10, Kharghar",
      addressLocality: "Navi Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "410210",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.0473,
      longitude: 73.0699,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    areaServed: [
      {
        "@type": "City",
        name: "Navi Mumbai",
      },
      {
        "@type": "City",
        name: "Mumbai",
      },
      {
        "@type": "AdministrativeArea",
        name: "Maharashtra",
      },
      {
        "@type": "Country",
        name: "India",
      },
    ],
    knowsAbout: [
      "Web Development",
      "Custom Software Development",
      "SaaS Development",
      "ERP Software Development",
      "E-Commerce Website Development",
      "UI/UX Web Design",
      "Cloud Hosting & Deployment",
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND_NAME,
    description:
      "KeyCodeWeb is a professional web development and software development company based in Kharghar, Navi Mumbai.",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export interface ServiceSchemaInput {
  name: string;
  description: string;
  slug: string;
  serviceType?: string;
  offers?: string[];
}

export function generateServiceSchema(service: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/${service.slug}#service`,
    name: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    serviceType: service.serviceType || "Web Development",
    areaServed: [
      { "@type": "City", name: "Navi Mumbai" },
      { "@type": "City", name: "Mumbai" },
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Worldwide" },
    ],
    termsOfService: `${SITE_URL}/terms-and-conditions`,
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function generateFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  authorName?: string;
  category?: string;
  tags?: string[];
}

export function generateArticleSchema(article: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${article.slug}#article`,
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}/blog/${article.slug}`,
    datePublished: article.datePublished,
    author: {
      "@type": "Person",
      name: article.authorName || "KeyCodeWeb Engineering Team",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
    keywords: article.tags?.join(", ") || article.category,
  };
}

export interface PortfolioSchemaInput {
  name: string;
  description: string;
  slug: string;
  category: string;
  client?: string;
  techStack?: string[];
}

export function generatePortfolioSchema(project: PortfolioSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/portfolio/${project.slug}#case-study`,
    name: `${project.name} - Case Study`,
    description: project.description,
    url: `${SITE_URL}/portfolio/${project.slug}`,
    author: {
      "@id": `${SITE_URL}/#organization`,
    },
    genre: project.category,
    keywords: project.techStack?.join(", "),
  };
}
