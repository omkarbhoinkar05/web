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

    // 5. System Initial Notification
    await prisma.notification.create({
      data: {
        id: "notif-init",
        title: "Database Cleaned & Initialized",
        message: "All tables truncated and ready for production operation.",
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
