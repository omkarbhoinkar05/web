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

export const metadata: Metadata = {
  title: "KeyCodeWeb — Modern Web Architecture & Digital Experiences",
  description:
    "We design and develop high-performance websites and digital experiences that help businesses stand out, grow and scale.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "KeyCodeWeb — Modern Web Architecture & Digital Experiences",
    description:
      "We design and develop high-performance websites and digital experiences that help businesses stand out, grow and scale.",
    siteName: "KeyCodeWeb",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyCodeWeb — Modern Web Architecture & Digital Experiences",
    description:
      "We design and develop high-performance websites and digital experiences that help businesses stand out, grow and scale.",
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
