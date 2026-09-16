const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hightechbirds_crm",
};

async function setupDatabase() {
  console.log("--------------------------------------------------");
  console.log("HighTechBirds: Initializing MySQL Database (XAMPP)");
  console.log(`Connecting to MySQL at ${DB_CONFIG.host}:${DB_CONFIG.port} as ${DB_CONFIG.user}...`);

  // 1. Connect to MySQL server (without database specified)
  const connection = await mysql.createConnection({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
  });

  console.log("✓ Connected to MySQL server successfully.");

  // 2. Create database if it does not exist
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  console.log(`✓ Database \`${DB_CONFIG.database}\` created / verified.`);

  // 3. Switch to target database
  await connection.changeUser({ database: DB_CONFIG.database });
  console.log(`✓ Switched to database \`${DB_CONFIG.database}\`.`);

  // 4. Create Tables
  console.log("\nCreating relational tables...");

  // Table: htb_leads
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_leads\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`lead_id\` VARCHAR(32) NOT NULL UNIQUE,
      \`full_name\` VARCHAR(191) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL,
      \`mobile\` VARCHAR(32) NOT NULL,
      \`service\` VARCHAR(100) NOT NULL,
      \`budget\` VARCHAR(100) NULL,
      \`source\` VARCHAR(50) NOT NULL,
      \`status\` VARCHAR(50) NOT NULL,
      \`priority\` VARCHAR(50) NOT NULL,
      \`assigned_to\` VARCHAR(100) NOT NULL,
      \`notes\` TEXT NULL,
      \`last_contact\` VARCHAR(100) NULL,
      \`next_follow_up\` VARCHAR(100) NULL,
      \`closing_note\` TEXT NULL,
      \`lost_reason\` VARCHAR(100) NULL,
      \`created_at\` VARCHAR(64) NOT NULL,
      \`updated_at\` VARCHAR(64) NOT NULL,
      INDEX \`idx_leads_status\` (\`status\`),
      INDEX \`idx_leads_priority\` (\`priority\`),
      INDEX \`idx_leads_created\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_leads");

  // Table: htb_team
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_team\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(191) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL UNIQUE,
      \`role\` VARCHAR(50) NOT NULL,
      \`password\` VARCHAR(255) NOT NULL DEFAULT 'Admin@123',
      \`avatar\` VARCHAR(255) NULL,
      \`status\` VARCHAR(20) NOT NULL DEFAULT 'Active',
      \`phone\` VARCHAR(32) NOT NULL,
      \`last_login\` VARCHAR(50) NULL,
      \`created_at\` VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_team");

  // Table: htb_contact_enquiries
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_contact_enquiries\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`enquiry_id\` VARCHAR(32) NOT NULL UNIQUE,
      \`full_name\` VARCHAR(191) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL,
      \`mobile\` VARCHAR(32) NOT NULL,
      \`service\` VARCHAR(100) NOT NULL,
      \`budget\` VARCHAR(100) NULL,
      \`message\` TEXT NOT NULL,
      \`source\` VARCHAR(100) NOT NULL,
      \`status\` VARCHAR(50) NOT NULL,
      \`assigned_to\` VARCHAR(100) NOT NULL,
      \`lead_id\` VARCHAR(64) NULL,
      \`created_at\` VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_contact_enquiries");

  // Table: htb_scheduled_calls
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_scheduled_calls\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`call_id\` VARCHAR(32) NOT NULL UNIQUE,
      \`full_name\` VARCHAR(191) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL,
      \`mobile\` VARCHAR(32) NOT NULL,
      \`service\` VARCHAR(100) NOT NULL,
      \`date\` VARCHAR(32) NOT NULL,
      \`time\` VARCHAR(32) NOT NULL,
      \`timezone\` VARCHAR(50) NOT NULL,
      \`status\` VARCHAR(50) NOT NULL,
      \`notes\` TEXT NULL,
      \`assigned_to\` VARCHAR(100) NOT NULL,
      \`lead_id\` VARCHAR(64) NULL,
      \`created_at\` VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_scheduled_calls");

  // Table: htb_career_applications
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_career_applications\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`application_id\` VARCHAR(32) NOT NULL UNIQUE,
      \`applicant_name\` VARCHAR(191) NOT NULL,
      \`email\` VARCHAR(191) NOT NULL,
      \`mobile\` VARCHAR(32) NOT NULL,
      \`resume_file_name\` VARCHAR(255) NOT NULL,
      \`resume_file_path\` VARCHAR(255) NOT NULL,
      \`resume_size_bytes\` INT NOT NULL,
      \`resume_mime_type\` VARCHAR(100) NOT NULL,
      \`message\` TEXT NOT NULL,
      \`status\` VARCHAR(50) NOT NULL,
      \`assigned_to\` VARCHAR(100) NOT NULL,
      \`notes\` TEXT NULL,
      \`applied_date\` VARCHAR(50) NOT NULL,
      \`created_at\` VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_career_applications");

  // Table: htb_follow_ups
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_follow_ups\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`follow_up_id\` VARCHAR(32) NOT NULL UNIQUE,
      \`lead_id\` VARCHAR(64) NOT NULL,
      \`lead_name\` VARCHAR(191) NOT NULL,
      \`lead_mobile\` VARCHAR(32) NOT NULL,
      \`date\` VARCHAR(32) NOT NULL,
      \`time\` VARCHAR(32) NOT NULL,
      \`type\` VARCHAR(50) NOT NULL,
      \`assigned_to\` VARCHAR(100) NOT NULL,
      \`status\` VARCHAR(50) NOT NULL,
      \`notes\` TEXT NOT NULL,
      \`completed_at\` VARCHAR(50) NULL,
      \`created_at\` VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_follow_ups");

  // Table: htb_activities
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_activities\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`lead_id\` VARCHAR(64) NULL,
      \`lead_name\` VARCHAR(191) NULL,
      \`type\` VARCHAR(100) NOT NULL,
      \`description\` TEXT NOT NULL,
      \`actor\` VARCHAR(100) NOT NULL,
      \`previous_status\` VARCHAR(50) NULL,
      \`new_status\` VARCHAR(50) NULL,
      \`date\` VARCHAR(32) NOT NULL,
      \`time\` VARCHAR(32) NOT NULL,
      \`created_at\` VARCHAR(64) NOT NULL,
      INDEX \`idx_activities_created\` (\`created_at\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_activities");

  // Table: htb_notes
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_notes\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`lead_id\` VARCHAR(64) NOT NULL,
      \`note\` TEXT NOT NULL,
      \`actor\` VARCHAR(100) NOT NULL,
      \`created_at\` VARCHAR(64) NOT NULL,
      INDEX \`idx_notes_lead\` (\`lead_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_notes");

  // Table: htb_notifications
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_notifications\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`title\` VARCHAR(191) NOT NULL,
      \`message\` TEXT NOT NULL,
      \`type\` VARCHAR(50) NOT NULL,
      \`is_read\` TINYINT(1) NOT NULL DEFAULT 0,
      \`link\` VARCHAR(255) NOT NULL,
      \`created_at\` VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_notifications");

  // Table: htb_settings
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_settings\` (
      \`key_name\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`value_json\` LONGTEXT NOT NULL,
      \`updated_at\` VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_settings");

  // Table: htb_password_resets
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`htb_password_resets\` (
      \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
      \`email\` VARCHAR(191) NOT NULL,
      \`otp\` VARCHAR(10) NOT NULL,
      \`token\` VARCHAR(191) NOT NULL,
      \`expires_at\` VARCHAR(64) NOT NULL,
      \`created_at\` VARCHAR(64) NOT NULL,
      INDEX \`idx_resets_email\` (\`email\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log("  - htb_password_resets");

  // 5. Data Migration from db.json if tables are empty
  const dbJsonPath = path.join(__dirname, "..", "data", "db.json");
  if (fs.existsSync(dbJsonPath)) {
    console.log("\nFound existing `data/db.json`. Migrating records to MySQL...");
    try {
      const raw = fs.readFileSync(dbJsonPath, "utf8");
      const data = JSON.parse(raw);

      // Check if team table has data
      const [teamRows] = await connection.query("SELECT COUNT(*) AS cnt FROM `htb_team`");
      if (teamRows[0].cnt === 0 && data.team && data.team.length > 0) {
        for (const member of data.team) {
          await connection.query(
            "INSERT INTO `htb_team` (id, name, email, role, password, avatar, status, phone, last_login, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              member.id,
              member.name,
              member.email,
              member.role,
              member.password || "Admin@123",
              member.avatar || null,
              member.status || "Active",
              member.phone,
              member.lastLogin || null,
              member.createdAt || new Date().toISOString(),
            ]
          );
        }
        console.log(`  ✓ Migrated ${data.team.length} team accounts.`);
      }

      // Check leads
      const [leadRows] = await connection.query("SELECT COUNT(*) AS cnt FROM `htb_leads`");
      if (leadRows[0].cnt === 0 && data.leads && data.leads.length > 0) {
        for (const lead of data.leads) {
          await connection.query(
            "INSERT INTO `htb_leads` (id, lead_id, full_name, email, mobile, service, budget, source, status, priority, assigned_to, notes, last_contact, next_follow_up, closing_note, lost_reason, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              lead.id,
              lead.leadId,
              lead.fullName,
              lead.email,
              lead.mobile,
              lead.service,
              lead.budget || null,
              lead.source,
              lead.status,
              lead.priority,
              lead.assignedTo,
              lead.notes || null,
              lead.lastContact || null,
              lead.nextFollowUp || null,
              lead.closingNote || null,
              lead.lostReason || null,
              lead.createdAt,
              lead.updatedAt || lead.createdAt,
            ]
          );
        }
        console.log(`  ✓ Migrated ${data.leads.length} leads.`);
      }

      // Check contact enquiries
      const [enqRows] = await connection.query("SELECT COUNT(*) AS cnt FROM `htb_contact_enquiries`");
      if (enqRows[0].cnt === 0 && data.contactEnquiries && data.contactEnquiries.length > 0) {
        for (const enq of data.contactEnquiries) {
          await connection.query(
            "INSERT INTO `htb_contact_enquiries` (id, enquiry_id, full_name, email, mobile, service, budget, message, source, status, assigned_to, lead_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              enq.id,
              enq.enquiryId,
              enq.fullName,
              enq.email,
              enq.mobile,
              enq.service,
              enq.budget || null,
              enq.message,
              enq.source,
              enq.status,
              enq.assignedTo,
              enq.leadId || null,
              enq.createdAt,
            ]
          );
        }
        console.log(`  ✓ Migrated ${data.contactEnquiries.length} contact enquiries.`);
      }

      // Check scheduled calls
      const [callRows] = await connection.query("SELECT COUNT(*) AS cnt FROM `htb_scheduled_calls`");
      if (callRows[0].cnt === 0 && data.scheduledCalls && data.scheduledCalls.length > 0) {
        for (const call of data.scheduledCalls) {
          await connection.query(
            "INSERT INTO `htb_scheduled_calls` (id, call_id, full_name, email, mobile, service, date, time, timezone, status, notes, assigned_to, lead_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              call.id,
              call.callId,
              call.fullName,
              call.email,
              call.mobile,
              call.service,
              call.date,
              call.time,
              call.timezone,
              call.status,
              call.notes || null,
              call.assignedTo,
              call.leadId || null,
              call.createdAt,
            ]
          );
        }
        console.log(`  ✓ Migrated ${data.scheduledCalls.length} scheduled calls.`);
      }

      // Check career applications
      const [careerRows] = await connection.query("SELECT COUNT(*) AS cnt FROM `htb_career_applications`");
      if (careerRows[0].cnt === 0 && data.careerApplications && data.careerApplications.length > 0) {
        for (const app of data.careerApplications) {
          await connection.query(
            "INSERT INTO `htb_career_applications` (id, application_id, applicant_name, email, mobile, resume_file_name, resume_file_path, resume_size_bytes, resume_mime_type, message, status, assigned_to, notes, applied_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              app.id,
              app.applicationId,
              app.applicantName,
              app.email,
              app.mobile,
              app.resumeFileName,
              app.resumeFilePath,
              app.resumeSizeBytes,
              app.resumeMimeType,
              app.message,
              app.status,
              app.assignedTo,
              app.notes || null,
              app.appliedDate,
              app.createdAt,
            ]
          );
        }
        console.log(`  ✓ Migrated ${data.careerApplications.length} career applications.`);
      }

      // Check follow ups
      const [followUpRows] = await connection.query("SELECT COUNT(*) AS cnt FROM `htb_follow_ups`");
      if (followUpRows[0].cnt === 0 && data.followUps && data.followUps.length > 0) {
        for (const f of data.followUps) {
          await connection.query(
            "INSERT INTO `htb_follow_ups` (id, follow_up_id, lead_id, lead_name, lead_mobile, date, time, type, assigned_to, status, notes, completed_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              f.id,
              f.followUpId,
              f.leadId,
              f.leadName,
              f.leadMobile,
              f.date,
              f.time,
              f.type,
              f.assignedTo,
              f.status,
              f.notes,
              f.completedAt || null,
              f.createdAt,
            ]
          );
        }
        console.log(`  ✓ Migrated ${data.followUps.length} follow-ups.`);
      }

      // Check activities
      const [activityRows] = await connection.query("SELECT COUNT(*) AS cnt FROM `htb_activities`");
      if (activityRows[0].cnt === 0 && data.activities && data.activities.length > 0) {
        for (const act of data.activities) {
          await connection.query(
            "INSERT INTO `htb_activities` (id, lead_id, lead_name, type, description, actor, previous_status, new_status, date, time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              act.id,
              act.leadId || null,
              act.leadName || null,
              act.type,
              act.description,
              act.actor,
              act.previousStatus || null,
              act.newStatus || null,
              act.date,
              act.time,
              act.createdAt,
            ]
          );
        }
        console.log(`  ✓ Migrated ${data.activities.length} activities.`);
      }

      // Check notes
      const [noteRows] = await connection.query("SELECT COUNT(*) AS cnt FROM `htb_notes`");
      if (noteRows[0].cnt === 0 && data.notes && data.notes.length > 0) {
        for (const n of data.notes) {
          await connection.query(
            "INSERT INTO `htb_notes` (id, lead_id, note, actor, created_at) VALUES (?, ?, ?, ?, ?)",
            [n.id, n.leadId, n.note, n.actor, n.createdAt]
          );
        }
        console.log(`  ✓ Migrated ${data.notes.length} notes.`);
      }

      // Check notifications
      const [notifRows] = await connection.query("SELECT COUNT(*) AS cnt FROM `htb_notifications`");
      if (notifRows[0].cnt === 0 && data.notifications && data.notifications.length > 0) {
        for (const notif of data.notifications) {
          await connection.query(
            "INSERT INTO `htb_notifications` (id, title, message, type, is_read, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              notif.id,
              notif.title,
              notif.message,
              notif.type,
              notif.read ? 1 : 0,
              notif.link,
              notif.createdAt,
            ]
          );
        }
        console.log(`  ✓ Migrated ${data.notifications.length} notifications.`);
      }

      // Settings
      if (data.settings) {
        await connection.query(
          "INSERT INTO `htb_settings` (key_name, value_json, updated_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = VALUES(updated_at)",
          ["app_settings", JSON.stringify(data.settings), new Date().toISOString()]
        );
        console.log("  ✓ Migrated system settings.");
      }
    } catch (err) {
      console.error("Warning during data migration:", err);
    }
  }

  await connection.end();
  console.log("\n==================================================");
  console.log("DATABASE SETUP COMPLETE!");
  console.log(`Open phpMyAdmin: http://localhost/phpmyadmin`);
  console.log(`Select database: ${DB_CONFIG.database}`);
  console.log("==================================================");
}

setupDatabase().catch((err) => {
  console.error("FATAL: Failed to set up database:", err);
  process.exit(1);
});
