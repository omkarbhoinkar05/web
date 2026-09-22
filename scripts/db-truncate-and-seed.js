const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function truncateAndSeed() {
  console.log("==================================================");
  console.log("DATABASE TRUNCATION & CLEAN SEED (WEB PRODUCTION)");
  console.log("==================================================");

  try {
    // 1. Truncate tables with foreign key constraints disabled
    console.log("\n[1] Disabling foreign key checks & truncating tables...");
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");

    const tables = [
      "web_notes",
      "web_activities",
      "web_follow_ups",
      "web_contact_enquiries",
      "web_scheduled_calls",
      "web_career_applications",
      "web_leads",
      "web_notifications",
      "web_password_resets",
      "web_team",
      "web_settings",
      "web_blogs",
      "web_portfolios",
    ];

    for (const table of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\`;`);
      console.log(`  ✓ Truncated table: ${table}`);
    }

    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("  ✓ Foreign key checks re-enabled.");

    // 2. Clean sample files from data/resumes/
    console.log("\n[2] Cleaning uploaded test files in data/resumes/...");
    const resumesDir = path.join(process.cwd(), "data", "resumes");
    if (fs.existsSync(resumesDir)) {
      const files = fs.readdirSync(resumesDir);
      for (const file of files) {
        if (file !== ".gitkeep") {
          try {
            fs.unlinkSync(path.join(resumesDir, file));
            console.log(`  ✓ Removed test resume: ${file}`);
          } catch (e) {
            console.error(`  Could not remove ${file}:`, e.message);
          }
        }
      }
    } else {
      fs.mkdirSync(resumesDir, { recursive: true });
    }
    console.log("  ✓ Resumes directory is clean and ready.");

    // 3. Seed Fresh Clean Team Members
    console.log("\n[3] Seeding clean administrative team members...");
    const now = new Date().toISOString();

    const teamMembers = [
      {
        id: "team-super",
        name: "Admin User",
        email: "admin@web.com",
        role: "Super Admin",
        password: "Admin@123",
        status: "Active",
        phone: "+91 99999 99999",
        createdAt: now,
      },
      {
        id: "team-admin",
        name: "Siddharth Shinde",
        email: "siddharth@web.com",
        role: "Admin",
        password: "Admin@123",
        status: "Active",
        phone: "+91 98200 11223",
        createdAt: now,
      },
      {
        id: "team-sales",
        name: "Anjali Dave",
        email: "anjali@web.com",
        role: "Sales",
        password: "Admin@123",
        status: "Active",
        phone: "+91 98190 33445",
        createdAt: now,
      },
      {
        id: "team-hr",
        name: "Pooja Hegde",
        email: "pooja@web.com",
        role: "HR",
        password: "Admin@123",
        status: "Active",
        phone: "+91 97115 66778",
        createdAt: now,
      },
    ];

    for (const member of teamMembers) {
      await prisma.teamMember.create({ data: member });
      console.log(`  ✓ Seeded ${member.role}: ${member.name} (${member.email})`);
    }

    // 4. Default Enterprise CRM & Booking Settings
    console.log("\n[4] Seeding core enterprise CRM configuration...");
    const initialSettings = {
      companyName: "Web",
      tagline: "Ideas | Innovation | Growth",
      supportEmail: "support@web.com",
      supportPhone: "+91 99999 99999",
      bookingSettings: {
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        workingHoursStart: "09:00 AM",
        workingHoursEnd: "07:00 PM",
        timezone: "IST (GMT+5:30)",
        callDurationMinutes: 30,
      },
      leadSettings: {
        statuses: [
          "NEW",
          "CONTACTED",
          "QUALIFIED",
          "REQUIREMENT DISCUSSED",
          "QUOTATION SENT",
          "FOLLOW-UP",
          "NEGOTIATION",
          "WON",
          "LOST",
        ],
        sources: [
          "Website",
          "Contact Form",
          "Schedule Call",
          "WhatsApp",
          "Referral",
          "Direct Inbound",
          "LinkedIn",
          "Other",
        ],
        priorities: ["Low", "Medium", "High", "Urgent"],
        services: [
          "Web Design",
          "SaaS App Development",
          "ERP Software",
          "E-Commerce",
          "Custom Web App",
          "Dynamic Website",
          "Hosting & Domain",
          "Maintenance & Support",
        ],
      },
      notificationSettings: {
        newEnquiry: true,
        newCareerApplication: true,
        scheduledCall: true,
        followUpDue: true,
        followUpOverdue: true,
        leadStatusChange: true,
      },
    };

    await prisma.setting.create({
      data: {
        keyName: "app_settings",
        valueJson: JSON.stringify(initialSettings),
        updatedAt: now,
      },
    });
    console.log("  ✓ Seeded default enterprise settings.");

    // 5. Seed Initial Engineering Articles
    console.log("\n[5] Seeding core engineering & architecture publications...");
    const initialArticles = [
      {
3. **Optimistic UI with Background Invalidation**: React 19 transitions and server actions allow enterprise users to experience zero perceived latency while mutations synchronize reliably in the background.

### Operational Resilience

Ensuring data consistency requires robust database connection pooling, idempotent mutations, and graceful degradation during network partitions. In production environments, database read replicas and cached summary views handle high-frequency reporting without blocking OLTP transactional operations.`,
        category: "Architecture",
        readTime: "6 min read",
        author: "Web Tech Team",
        tags: "Next.js, SaaS, Cloud Architecture",
        status: "Published",
        views: 142,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "blog-b2b-design",
        slug: "principles-of-high-converting-b2b-web-design",
        title: "10 Principles of High-Converting B2B Web Design for Modern Tech Companies",
        excerpt:
          "Transforming complex technical offerings into crystal-clear value propositions that build trust and drive enterprise inquiries.",
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
        category: "Design & UX",
        readTime: "5 min read",
        author: "Web Design Studio",
        tags: "UI/UX, Conversion, Enterprise",
        status: "Published",
        views: 98,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "blog-web-vitals",
        slug: "how-we-optimized-core-web-vitals",
        title: "How We Optimized Core Web Vitals to Achieve 99+ Performance Scores",
        excerpt:
          "A step-by-step breakdown of font sub-setting, modern bundle splitting, and zero-layout-shift asset delivery in production.",
        content: `Google's Core Web Vitals directly impact search visibility and user conversion rates. Achieving a 99+ Lighthouse performance score on desktop and mobile requires systematic elimination of render-blocking overhead.

### Critical Performance Optimizations

- **Font Subsetting & Preconnect**: Eliminating layout shifts (CLS) by using next/font with zero-runtime fallback font metrics.
- **Image Optimization & Modern Formats**: Delivering responsive AVIF/WebP assets with explicit aspect ratios and priority hints on Largest Contentful Paint (LCP) candidates.
- **CSS Architecture**: Removing heavy runtime CSS-in-JS libraries in favor of zero-runtime Tailwind CSS v4 to keep stylesheets below 20KB uncompressed.`,
        category: "Performance",
        readTime: "8 min read",
        author: "Performance Lab",
        tags: "Performance, SEO, Web Vitals",
        status: "Published",
        views: 215,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "blog-custom-erp",
        slug: "future-of-custom-erp-solutions",
        title: "The Future of Custom ERP Solutions: Cloud-Native vs Legacy Monoliths",
        excerpt:
          "Why growing SMBs and mid-market enterprises are transitioning to tailored custom ERPs to streamline inventory, orders, and real-time reporting.",
        content: `Off-the-shelf ERP platforms often burden growing enterprises with bloated subscription fees, rigid workflows, and unnecessary feature bloat. Tailored custom ERP software enables companies to digitalize their exact operational workflows with zero friction.

### Why Custom ERPs Deliver Unmatched ROI

1. **Perfect Process Alignment**: Software adapts to your company's battle-tested operations, not the other way around.
2. **Zero Per-Seat Licensing Penalties**: Scale from 10 to 1,000 team members without skyrocketing SaaS subscription fees.
3. **Direct Data Ownership**: Your transactional data lives securely in your dedicated database with automated backups and complete compliance control.`,
        category: "Enterprise Software",
        readTime: "7 min read",
        author: "Enterprise Solutions",
        tags: "ERP, Automation, Workflow",
        status: "Published",
        views: 86,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const art of initialArticles) {
      await prisma.blogPost.create({ data: art });
      console.log("  ✓ Seeded article: " + art.title);
    }

    // 6. Seed Initial Portfolio Projects
    console.log("\n[6] Seeding initial portfolio projects...");
    const initialPortfolios = [
      {
        id: "port-edulearn",
        slug: "edulearn",
        title: "EduLearn",
        category: "Education",
        type: "Online Learning Platform",
        description:
          "A modern e-learning platform with live classes, course management, student dashboard and secure payment integration.",
        image: null,
        projectUrl: "https://edulearn.io",
        features: "Web App, Payment Integration, Admin Panel, Live Video Classes, Student LMS",
        tags: "All Projects, Web App, Dynamic Website, Web Design",
        displayOrder: 1,
        status: "Active",
        techStack: "Next.js 16, WebRTC, PostgreSQL, Tailwind CSS",
        impactMetric: "+310%",
        impactLabel: "Student Enrollment",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "port-shopkart",
        slug: "shopkart",
        title: "ShopKart",
        category: "E-Commerce",
        type: "Multi-Vendor E-Commerce",
        description:
          "A feature-rich marketplace with multiple sellers, secure payments, order management and real-time tracking.",
        image: null,
        projectUrl: "https://shopkart.store",
        features: "Multi-Vendor, Payment Gateway, Order Management, Seller Portal",
        tags: "All Projects, E-Commerce, Web App, Web Design",
        displayOrder: 2,
        status: "Active",
        techStack: "Next.js 16, Redis, Stripe Connect, Prisma ORM",
        impactMetric: "$2.4M+",
        impactLabel: "Annual GMV",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "port-taskpro",
        slug: "taskpro",
        title: "TaskPro",
        category: "SaaS App",
        type: "Project Management SaaS",
        description:
          "A SaaS platform to manage projects, teams, tasks and productivity with a clean and intuitive interface.",
        image: null,
        projectUrl: "https://app.taskpro.io",
        features: "SaaS Platform, Team Management, Analytics, Kanban Sprints, Automations",
        tags: "All Projects, SaaS App, Web App, Web Design",
        displayOrder: 3,
        status: "Active",
        techStack: "React 19, Node.js, WebSockets, Tailwind CSS",
        impactMetric: "+45%",
        impactLabel: "Team Productivity",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "port-bizerp",
        slug: "bizerp",
        title: "BizERP",
        category: "ERP Software",
        type: "Complete Business Management",
        description:
          "A custom ERP solution for inventory, sales, purchase, HR, finance and more — all in one powerful platform.",
        image: null,
        projectUrl: "https://bizerp.cloud",
        features: "Inventory, HR Management, Reports, Tax Compliance, Audit Trail",
        tags: "All Projects, ERP Software, Web App, Dynamic Website",
        displayOrder: 4,
        status: "Active",
        techStack: "Next.js, GraphQL, PostgreSQL, Tailwind CSS",
        impactMetric: "-62%",
        impactLabel: "Operational Overhead",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "port-healthpulse",
        slug: "healthpulse",
        title: "HealthPulse",
        category: "Healthcare",
        type: "Telemedicine & EHR Portal",
        description:
          "HIPAA-compliant telehealth platform with secure video appointments, electronic health record vault, and digital prescription routing.",
        image: null,
        projectUrl: "https://healthpulse.med",
        features: "Video Consultations, EHR Records, Prescription Routing, Doctor Calendar",
        tags: "All Projects, Web App, SaaS App, Dynamic Website",
        displayOrder: 5,
        status: "Active",
        techStack: "Next.js 16, WebRTC, HIPAA Cloud, Tailwind CSS",
        impactMetric: "40K+",
        impactLabel: "Monthly Consultations",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "port-propnest",
        slug: "propnest",
        title: "PropNest",
        category: "Real Estate",
        type: "Property Discovery Engine",
        description:
          "High-conversion luxury property portal featuring automated MLS feed sync, dynamic map exploration, 3D tours, and lead CRM.",
        image: null,
        projectUrl: "https://propnest.estate",
        features: "MLS Feed Sync, Interactive Maps, Virtual 3D Tours, Mortgage Calculator",
        tags: "All Projects, Dynamic Website, Web Design, Web App",
        displayOrder: 6,
        status: "Active",
        techStack: "Next.js 16, Mapbox GL, Node.js, Tailwind CSS",
        impactMetric: "8.4x",
        impactLabel: "Qualified Inquiries",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "port-finedge",
        slug: "finedge",
        title: "FinEdge",
        category: "FinTech",
        type: "Wealth & Portfolio Tracker",
        description:
          "Institutional-grade portfolio management and wealth dashboard with real-time market data, risk models, and automated tax reporting.",
        image: null,
        projectUrl: "https://finedge.capital",
        features: "Live Market Stream, Asset Allocation, Risk Analytics, Tax Optimization",
        tags: "All Projects, SaaS App, Web App, ERP Software",
        displayOrder: 7,
        status: "Active",
        techStack: "Next.js, FastAPI, WebSockets, Tailwind CSS",
        impactMetric: "$120M+",
        impactLabel: "Assets Tracked",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "port-dineflow",
        slug: "dineflow",
        title: "DineFlow",
        category: "Hospitality",
        type: "Restaurant Cloud POS & KDS",
        description:
          "End-to-end restaurant automation suite with contactless QR menus, kitchen display system (KDS), delivery aggregator sync, and table inventory.",
        image: null,
        projectUrl: "https://dineflow.pos",
        features: "QR Menu & Pay, Kitchen Display (KDS), Table Turnover, Delivery Sync",
        tags: "All Projects, Web App, E-Commerce, Dynamic Website",
        displayOrder: 8,
        status: "Active",
        techStack: "Next.js 16, Socket.io, Stripe Terminal, Tailwind CSS",
        impactMetric: "3.2x",
        impactLabel: "Faster Table Turns",
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const port of initialPortfolios) {
      await prisma.portfolioItem.create({ data: port });
      console.log("  ✓ Seeded portfolio: " + port.title);
    }

    // 6. System Initial Notification
    await prisma.notification.create({
      data: {
        id: "notif-init",
        title: "Database Cleaned & Initialized",
        message: "All tables initialized and ready for production operation.",
        type: "system",
        isRead: false,
        link: "/admin",
        createdAt: now,
      },
    });
    console.log("  ✓ Welcome system notification created.");

    console.log("\n==================================================");
    console.log("DATABASE TRUNCATION & SEED COMPLETE: SUCCESS");
    console.log("==================================================");
  } catch (error) {
    console.error("\n[ERROR] Database truncation failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

truncateAndSeed();
