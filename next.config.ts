import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Safe Production Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  // Aliases and Clean Navigation Redirects
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/career",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/our-work",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/service",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/saas-development",
        destination: "/services/saas-app",
        permanent: true,
      },
      {
        source: "/services/ecommerce-development",
        destination: "/services/ecommerce",
        permanent: true,
      },
      {
        source: "/services/custom-web-application",
        destination: "/services/custom-web-app",
        permanent: true,
      },
      {
        source: "/process",
        destination: "/#process",
        permanent: false,
      },
      {
        source: "/contact",
        destination: "/#contact",
        permanent: false,
      },
      {
        source: "/contact-us",
        destination: "/#contact",
        permanent: false,
      },
      {
        source: "/team",
        destination: "/about-us",
        permanent: false,
      },
      {
        source: "/portfolio/coreerp",
        destination: "/portfolio/bizerp",
        permanent: true,
      },
      {
        source: "/portfolio/propstream",
        destination: "/portfolio/propnest",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

