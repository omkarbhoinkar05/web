import type { Metadata } from "next";
import { generateBreadcrumbSchema, SITE_URL } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute: "Careers & Job Openings | KeyCodeWeb Navi Mumbai",
  },
  description:
    "Join the KeyCodeWeb engineering and design team in Kharghar, Navi Mumbai. Explore open opportunities for full-stack developers, frontend architects, and UI/UX designers.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers & Job Openings | KeyCodeWeb Navi Mumbai",
    description:
      "Join our engineering studio in Kharghar, Navi Mumbai. Explore high-impact software development, full-stack, and design careers at KeyCodeWeb.",
    url: `${SITE_URL}/careers`,
    siteName: "KeyCodeWeb",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 341,
        alt: "KeyCodeWeb Careers - Software Engineering Jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers & Job Openings | KeyCodeWeb Navi Mumbai",
    description:
      "Join our engineering studio in Kharghar, Navi Mumbai. Explore high-impact software development, full-stack, and design careers at KeyCodeWeb.",
    images: ["/logo.png"],
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Careers", url: "/careers" },
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
