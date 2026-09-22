import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebSiteSchema,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  metadataBase: new URL("https://keycodeweb.com"),
  title: {
    default: "KeyCodeWeb | Web Development & Software Development Company",
    template: "%s | KeyCodeWeb",
  },
  description:
    "KeyCodeWeb is a professional web development and software development company based in Kharghar, Navi Mumbai. We build custom websites, high-performance web applications, scalable SaaS platforms, ERP systems, and e-commerce solutions for businesses across India and globally.",
  keywords: [
    "Web Development Company",
    "Software Development Company",
    "Web Development Company in Navi Mumbai",
    "Web Development Company in Kharghar",
    "Web Design Company",
    "Custom Web Development",
    "SaaS Development Company",
    "ERP Software Development",
    "E-Commerce Website Development",
    "KeyCodeWeb",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KeyCodeWeb | Web Development & Software Development Company",
    description:
      "Professional web development and custom software solutions in Kharghar, Navi Mumbai. Engineering high-performance websites, SaaS apps, ERP systems, and e-commerce platforms.",
    url: "https://keycodeweb.com",
    siteName: "KeyCodeWeb",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 341,
        alt: "KeyCodeWeb - Web Development & Software Development Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyCodeWeb | Web Development & Software Development Company",
    description:
      "Professional web development and custom software solutions in Kharghar, Navi Mumbai. Engineering high-performance websites, SaaS apps, ERP systems, and e-commerce platforms.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "256x256", type: "image/png" },
      { url: "/logo-icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "256x256", type: "image/png" },
    ],
  },
};

import { HashScrollHandler } from "@/components/HashScrollHandler";
import { ScheduleCallProvider } from "@/components/schedule/ScheduleCallContext";
import { ScheduleCallModal } from "@/components/schedule/ScheduleCallModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebSiteSchema()),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-[#10b981] selection:text-white">
        <ScheduleCallProvider>
          <HashScrollHandler />
          {children}
          <ScheduleCallModal />
        </ScheduleCallProvider>
      </body>
    </html>
  );
}
