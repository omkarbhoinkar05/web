const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SERVICES = [
  {
    id: "serv-web-design",
    slug: "web-design",
    title: "Web Design",
    shortDescription: "Modern, responsive and user-friendly web designs that create a strong online presence.",
    description: "Bespoke, high-converting web designs and corporate digital interfaces engineered for maximum user engagement, brand authority, and seamless cross-device performance.",
    features: JSON.stringify([
      "Corporate Website",
      "Business Website",
      "Landing Page",
      "Portfolio Website",
      "UI/UX Design",
      "Responsive Web Design",
      "Website Redesign",
      "Figma to Website"
    ]),
    image: null,
    icon: "monitor",
    buttonText: "Contact Now →",
    href: "#contact",
    displayOrder: 1,
    status: "Active"
  },
  {
    id: "serv-saas-app",
    slug: "saas-app",
    title: "SaaS App Development",
    shortDescription: "Scalable and secure SaaS solutions tailored for modern businesses.",
    description: "Scalable, multi-tenant cloud software platforms built with modern subscription billing, granular roles and permissions, high-performance APIs, and robust data isolation.",
    features: JSON.stringify([
      "SaaS Platform",
      "Multi-Tenant SaaS",
      "Subscription Management",
      "User Management",
      "Role & Permission System",
      "Admin Dashboard",
      "Analytics Dashboard",
      "API Integration",
      "Payment Integration"
    ]),
    image: null,
    icon: "cloud",
    buttonText: "Contact Now →",
    href: "#contact",
    displayOrder: 2,
    status: "Active"
  },
  {
    id: "serv-erp-software",
    slug: "erp-software",
    title: "ERP Software",
    shortDescription: "Complete ERP solutions to streamline your business operations.",
    description: "Centralized business operating engines uniting inventory, human resources, accounting, CRM, and real-time operational analytics into one cohesive system.",
    features: JSON.stringify([
      "HR & Employee Management",
      "CRM",
      "Inventory Management",
      "Sales Management",
      "Purchase Management",
      "Accounting & Finance",
      "Payroll",
      "Project Management",
      "Reports & Analytics",
      "Admin / Super Admin Panel"
    ]),
    image: null,
    icon: "erp",
    buttonText: "Contact Now →",
    href: "#contact",
    displayOrder: 3,
    status: "Active"
  },
  {
    id: "serv-ecommerce",
    slug: "ecommerce",
    title: "E-Commerce",
    shortDescription: "Feature-rich e-commerce solutions to take your business online.",
    description: "Omnichannel digital storefronts, high-volume multi-vendor marketplaces, and secure multi-currency payment checkout architectures engineered for peak conversions.",
    features: JSON.stringify([
      "B2B E-Commerce",
      "B2C E-Commerce",
      "Multi-Vendor Marketplace",
      "Product Management",
      "Order Management",
      "Payment Gateway",
      "Shipping Integration",
      "Coupon & Offers",
      "Customer Dashboard",
      "Seller Dashboard"
    ]),
    image: null,
    icon: "cart",
    buttonText: "Contact Now →",
    href: "#contact",
    displayOrder: 4,
    status: "Active"
  },
  {
    id: "serv-dynamic-website",
    slug: "dynamic-website",
    title: "Dynamic Website",
    shortDescription: "Powerful dynamic websites with flexible content management.",
    description: "Content-rich, dynamic web platforms with modular CMS control, live data feeds, interactive forms, and authenticated user access for full operational agility.",
    features: JSON.stringify([
      "CMS Website",
      "News / Blog Website",
      "Real Estate Website",
      "Education Website",
      "Booking Website",
      "Directory Website",
      "Membership Website",
      "Content Management",
      "Dynamic Forms",
      "Admin Panel"
    ]),
    image: null,
    icon: "window",
    buttonText: "Contact Now →",
    href: "#contact",
    displayOrder: 5,
    status: "Active"
  },
  {
    id: "serv-custom-web-app",
    slug: "custom-web-app",
    title: "Custom Web App",
    shortDescription: "Tailored web applications to solve your unique business challenges.",
    description: "Mission-critical custom web portals and workflow automation tools tailored precisely to proprietary operational processes and third-party enterprise integrations.",
    features: JSON.stringify([
      "Business Web Applications",
      "Customer Portals",
      "Admin Panels",
      "Custom Dashboards",
      "Workflow Automation",
      "API Development",
      "Third-Party Integrations",
      "OTP Integration",
      "Payment Integration",
      "WhatsApp Integration"
    ]),
    image: null,
    icon: "code",
    buttonText: "Contact Now →",
    href: "#contact",
    displayOrder: 6,
    status: "Active"
  },
  {
    id: "serv-hosting",
    slug: "hosting",
    title: "Hosting",
    shortDescription: "Reliable and secure hosting solutions to keep your business online 24/7.",
    description: "Enterprise cloud hosting, automated backups, zero-downtime server migrations, and robust DDoS protection for continuous uptime and lightning-fast page delivery.",
    features: JSON.stringify([
      "Web Hosting",
      "Cloud Hosting",
      "VPS Hosting",
      "Managed Hosting",
      "Domain Management",
      "SSL Certificate",
      "Business Email",
      "Server Setup",
      "Website Migration",
      "Backup & Security",
      "Performance Optimization"
    ]),
    image: null,
    icon: "server",
    buttonText: "Contact Now →",
    href: "#contact",
    displayOrder: 7,
    status: "Active"
  }
];

async function seed() {
  console.log("Cleaning and seeding exactly the 7 core services...");
  await prisma.serviceItem.deleteMany();
  const now = new Date().toISOString();
  for (const s of SERVICES) {
    await prisma.serviceItem.create({
      data: {
        id: s.id,
        slug: s.slug,
        title: s.title,
        shortDescription: s.shortDescription,
        description: s.description,
        features: s.features,
        image: s.image,
        icon: s.icon,
        buttonText: s.buttonText,
        href: s.href,
        displayOrder: s.displayOrder,
        status: s.status,
        createdAt: now,
        updatedAt: now
      }
    });
    console.log(`Created service: ${s.title} (${s.slug})`);
  }
  const count = await prisma.serviceItem.count();
  console.log(`Successfully seeded ${count} services into web_services!`);
  await prisma.$disconnect();
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
