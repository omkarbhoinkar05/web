import type { Metadata } from "next";
import { generateBreadcrumbSchema, SITE_URL } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute: "Our Work & Case Studies | KeyCodeWeb Portfolio",
  },
  description:
    "Explore custom web applications, SaaS platforms, ERP architectures, and e-commerce solutions engineered by KeyCodeWeb for growing businesses in India and globally.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Our Work & Case Studies | KeyCodeWeb Portfolio",
    description:
      "Explore custom web applications, SaaS platforms, ERP architectures, and e-commerce solutions engineered by KeyCodeWeb.",
    url: `${SITE_URL}/portfolio`,
    siteName: "KeyCodeWeb",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 341,
        alt: "KeyCodeWeb Portfolio - Web & Software Development Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work & Case Studies | KeyCodeWeb Portfolio",
    description:
      "Explore custom web applications, SaaS platforms, ERP architectures, and e-commerce solutions engineered by KeyCodeWeb.",
    images: ["/logo.png"],
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Portfolio", url: "/portfolio" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
