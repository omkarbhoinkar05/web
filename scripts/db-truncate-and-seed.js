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
        phone: "+91 98330 55667",
        createdAt: now,
      },
    ];

    for (const member of teamMembers) {
      await prisma.teamMember.create({ data: member });
      console.log(`  ✓ Created team member: ${member.name} (${member.role}) -> ${member.email}`);
    }

    // 4. Seed Clean Production Settings
    console.log("\n[4] Seeding default system settings...");
    const defaultSettings = {
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
          "Mobile App",
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
        keyName: "global_settings",
        valueJson: JSON.stringify(defaultSettings),
        updatedAt: now,
      },
    });
    console.log("  ✓ Default global_settings created.");

    // 5. Seed Initial Engineering Blog Articles
    console.log("\n[5] Seeding initial engineering blog posts...");
    const initialArticles = [
      {
        id: "blog-saas-arch",
        slug: "building-resilient-saas-architectures",
        title: "Building Resilient SaaS Architectures with Next.js and Micro-Frontends",
        excerpt:
          "A deep dive into how modern engineering teams architect scalable multi-tenant web applications without sacrificing performance or maintainability.",
        content: `Modern software systems demand high availability, multi-tenant isolation, and zero-downtime deployment pipelines. When engineering high-traffic SaaS products, architecture decisions made in early phases directly dictate organizational agility 12 months down the road.

### Key Architectural Pillars

1. **Domain-Driven Modularization**: Rather than tightly coupling business domains into a single monolithic bundle, we split critical workflows into isolated, independently testable feature modules.
2. **Stateless Authentication with Edge Tokens**: By leveraging cryptographically signed HMAC tokens, sessions can be verified instantaneously across regional serverless runtimes without hitting central database bottlenecks on every request.
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
