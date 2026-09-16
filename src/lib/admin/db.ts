import fs from "fs";
import path from "path";
import {
  Lead,
  ContactEnquiry,
  ScheduledCall,
  CareerApplication,
  FollowUp,
  LeadActivity,
  LeadNote,
  Notification,
  TeamMember,
  Settings,
  DashboardStats,
  LeadStatus,
  LeadSource,
  PasswordResetRecord,
} from "./types";
import { query, execute, isMySqlAvailable } from "../mysql";

interface DatabaseSchema {
  leads: Lead[];
  contactEnquiries: ContactEnquiry[];
  scheduledCalls: ScheduledCall[];
  careerApplications: CareerApplication[];
  followUps: FollowUp[];
  activities: LeadActivity[];
  notes: LeadNote[];
  notifications: Notification[];
  team: TeamMember[];
  settings: Settings;
  passwordResets?: PasswordResetRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const RESUMES_DIR = path.join(DATA_DIR, "resumes");

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(RESUMES_DIR)) {
    fs.mkdirSync(RESUMES_DIR, { recursive: true });
  }
}

const INITIAL_SETTINGS: Settings = {
  companyName: "HighTechBirds",
  tagline: "Ideas | Innovation | Growth",
  supportEmail: "dev.omkar05@gmail.com",
  supportPhone: "+91 99208 18481",
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

/* ----------------------------------------------------
   Fallback JSON File Helper (Used for backup/safety)
---------------------------------------------------- */
export function readDb(): DatabaseSchema {
  ensureDirectories();
  if (!fs.existsSync(DB_FILE)) {
    const seed = {
      leads: [],
      contactEnquiries: [],
      scheduledCalls: [],
      careerApplications: [],
      followUps: [],
      activities: [],
      notes: [],
      notifications: [],
      team: [],
      settings: INITIAL_SETTINGS,
      passwordResets: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed.passwordResets) parsed.passwordResets = [];
    return parsed;
  } catch {
    return {
      leads: [],
      contactEnquiries: [],
      scheduledCalls: [],
      careerApplications: [],
      followUps: [],
      activities: [],
      notes: [],
      notifications: [],
      team: [],
      settings: INITIAL_SETTINGS,
      passwordResets: [],
    };
  }
}

export function writeDb(data: DatabaseSchema): void {
  try {
    ensureDirectories();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Backup file write warning:", err);
  }
}

/* ----------------------------------------------------
   Row Mappers (MySQL snake_case -> TypeScript camelCase)
---------------------------------------------------- */
function mapLead(row: any): Lead {
  return {
    id: row.id,
    leadId: row.lead_id,
    fullName: row.full_name,
    email: row.email,
    mobile: row.mobile,
    service: row.service,
    budget: row.budget || undefined,
    source: row.source,
    status: row.status,
    priority: row.priority,
    assignedTo: row.assigned_to,
    notes: row.notes || undefined,
    lastContact: row.last_contact || undefined,
    nextFollowUp: row.next_follow_up || undefined,
    closingNote: row.closing_note || undefined,
    lostReason: row.lost_reason || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEnquiry(row: any): ContactEnquiry {
  return {
    id: row.id,
    enquiryId: row.enquiry_id,
    fullName: row.full_name,
    email: row.email,
    mobile: row.mobile,
    service: row.service,
    budget: row.budget || undefined,
    message: row.message,
    source: row.source,
    status: row.status,
    assignedTo: row.assigned_to,
    leadId: row.lead_id || undefined,
    createdAt: row.created_at,
  };
}

function mapScheduledCall(row: any): ScheduledCall {
  return {
    id: row.id,
    callId: row.call_id,
    fullName: row.full_name,
    email: row.email,
    mobile: row.mobile,
    service: row.service,
    date: row.date,
    time: row.time,
    timezone: row.timezone,
    status: row.status,
    notes: row.notes || undefined,
    assignedTo: row.assigned_to,
    leadId: row.lead_id || undefined,
    createdAt: row.created_at,
  };
}

function mapCareer(row: any): CareerApplication {
  return {
    id: row.id,
    applicationId: row.application_id,
    applicantName: row.applicant_name,
    email: row.email,
    mobile: row.mobile,
    resumeFileName: row.resume_file_name,
    resumeFilePath: row.resume_file_path,
    resumeSizeBytes: row.resume_size_bytes,
    resumeMimeType: row.resume_mime_type,
    message: row.message,
    status: row.status,
    assignedTo: row.assigned_to,
    notes: row.notes || undefined,
    appliedDate: row.applied_date,
    createdAt: row.created_at,
  };
}

function mapFollowUp(row: any): FollowUp {
  return {
    id: row.id,
    followUpId: row.follow_up_id,
    leadId: row.lead_id,
    leadName: row.lead_name,
    leadMobile: row.lead_mobile,
    date: row.date,
    time: row.time,
    type: row.type,
    assignedTo: row.assigned_to,
    status: row.status,
    notes: row.notes,
    completedAt: row.completed_at || undefined,
    createdAt: row.created_at,
  };
}

function mapActivity(row: any): LeadActivity {
  return {
    id: row.id,
    leadId: row.lead_id || undefined,
    leadName: row.lead_name || undefined,
    type: row.type,
    description: row.description,
    actor: row.actor,
    previousStatus: row.previous_status || undefined,
    newStatus: row.new_status || undefined,
    date: row.date,
    time: row.time,
    createdAt: row.created_at,
  };
}

function mapNote(row: any): LeadNote {
  return {
    id: row.id,
    leadId: row.lead_id,
    note: row.note,
    actor: row.actor,
    createdAt: row.created_at,
  };
}

function mapNotification(row: any): Notification {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    read: Boolean(row.is_read),
    link: row.link,
    createdAt: row.created_at,
  };
}

function mapTeamMember(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    password: row.password || "Admin@123",
    avatar: row.avatar || undefined,
    status: row.status,
    phone: row.phone,
    lastLogin: row.last_login || undefined,
    createdAt: row.created_at,
  };
}

/* ----------------------------------------------------
   Leads API Methods
---------------------------------------------------- */
export async function getLeads(filters?: {
  search?: string;
  status?: string;
  priority?: string;
  service?: string;
  source?: string;
  assignedTo?: string;
  sort?: string;
}): Promise<Lead[]> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      let sql = "SELECT * FROM `htb_leads` WHERE 1=1";
      const params: any[] = [];

      if (filters?.status && filters.status !== "All") {
        sql += " AND `status` = ?";
        params.push(filters.status);
      }
      if (filters?.priority && filters.priority !== "All") {
        sql += " AND `priority` = ?";
        params.push(filters.priority);
      }
      if (filters?.service && filters.service !== "All") {
        sql += " AND `service` = ?";
        params.push(filters.service);
      }
      if (filters?.source && filters.source !== "All") {
        sql += " AND `source` = ?";
        params.push(filters.source);
      }
      if (filters?.assignedTo && filters.assignedTo !== "All") {
        sql += " AND `assigned_to` = ?";
        params.push(filters.assignedTo);
      }
      if (filters?.search) {
        const q = `%${filters.search.toLowerCase().trim()}%`;
        sql += " AND (LOWER(`full_name`) LIKE ? OR LOWER(`email`) LIKE ? OR `mobile` LIKE ? OR LOWER(`lead_id`) LIKE ?)";
        params.push(q, q, q, q);
      }

      sql += " ORDER BY `created_at` DESC";
      const rows = await query<any[]>(sql, params);
      return rows.map(mapLead);
    } catch (err) {
      console.error("MySQL getLeads error:", err);
    }
  }

  // Fallback to JSON
  const db = readDb();
  let results = [...db.leads];
  if (filters?.status && filters.status !== "All") results = results.filter((l) => l.status === filters.status);
  if (filters?.priority && filters.priority !== "All") results = results.filter((l) => l.priority === filters.priority);
  if (filters?.service && filters.service !== "All") results = results.filter((l) => l.service === filters.service);
  if (filters?.source && filters.source !== "All") results = results.filter((l) => l.source === filters.source);
  if (filters?.assignedTo && filters.assignedTo !== "All") results = results.filter((l) => l.assignedTo === filters.assignedTo);
  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.mobile.includes(q) ||
        l.leadId.toLowerCase().includes(q)
    );
  }
  return results;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>(
        "SELECT * FROM `htb_leads` WHERE `id` = ? OR `lead_id` = ? LIMIT 1",
        [id, id]
      );
      if (rows.length > 0) return mapLead(rows[0]);
      return null;
    } catch (err) {
      console.error("MySQL getLeadById error:", err);
    }
  }

  const db = readDb();
  return db.leads.find((l) => l.id === id || l.leadId === id) || null;
}

export async function createLead(data: Omit<Lead, "id" | "leadId" | "createdAt" | "updatedAt">): Promise<Lead> {
  const now = new Date().toISOString();
  const id = `lead-${Date.now()}`;
  let leadId = "HTB-001";

  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const [countRow] = await query<any[]>("SELECT COUNT(*) AS total FROM `htb_leads`");
      const nextNum = (countRow?.total || 0) + 1;
      leadId = `HTB-${String(nextNum).padStart(3, "0")}`;

      await execute(
        "INSERT INTO `htb_leads` (id, lead_id, full_name, email, mobile, service, budget, source, status, priority, assigned_to, notes, last_contact, next_follow_up, closing_note, lost_reason, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          leadId,
          data.fullName,
          data.email,
          data.mobile,
          data.service,
          data.budget || null,
          data.source,
          data.status,
          data.priority,
          data.assignedTo,
          data.notes || null,
          data.lastContact || null,
          data.nextFollowUp || null,
          data.closingNote || null,
          data.lostReason || null,
          now,
          now,
        ]
      );

      // Add Lead Created Activity
      await execute(
        "INSERT INTO `htb_activities` (id, lead_id, lead_name, type, description, actor, created_at, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          `act-${Date.now()}`,
          leadId,
          data.fullName,
          "Lead Created",
          `New lead created for ${data.service} via ${data.source}.`,
          data.assignedTo || "System",
          now,
          now.split("T")[0],
          "Just now",
        ]
      );

      return {
        ...data,
        id,
        leadId,
        createdAt: now,
        updatedAt: now,
      };
    } catch (err) {
      console.error("MySQL createLead error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  leadId = `HTB-${String(db.leads.length + 1).padStart(3, "0")}`;
  const newLead: Lead = {
    ...data,
    id,
    leadId,
    createdAt: now,
    updatedAt: now,
  };
  db.leads.unshift(newLead);
  writeDb(db);
  return newLead;
}

export async function updateLead(id: string, updates: Partial<Lead>, actor = "Admin"): Promise<Lead | null> {
  const now = new Date().toISOString();
  const mysqlUp = await isMySqlAvailable();

  if (mysqlUp) {
    try {
      const existing = await getLeadById(id);
      if (!existing) return null;

      const merged = { ...existing, ...updates, updatedAt: now };

      await execute(
        "UPDATE `htb_leads` SET `full_name`=?, `email`=?, `mobile`=?, `service`=?, `budget`=?, `source`=?, `status`=?, `priority`=?, `assigned_to`=?, `notes`=?, `last_contact`=?, `next_follow_up`=?, `closing_note`=?, `lost_reason`=?, `updated_at`=? WHERE `id`=? OR `lead_id`=?",
        [
          merged.fullName,
          merged.email,
          merged.mobile,
          merged.service,
          merged.budget || null,
          merged.source,
          merged.status,
          merged.priority,
          merged.assignedTo,
          merged.notes || null,
          merged.lastContact || null,
          merged.nextFollowUp || null,
          merged.closingNote || null,
          merged.lostReason || null,
          now,
          id,
          id,
        ]
      );

      // If status changed, record activity
      if (updates.status && updates.status !== existing.status) {
        await execute(
          "INSERT INTO `htb_activities` (id, lead_id, lead_name, type, description, actor, previous_status, new_status, date, time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            `act-${Date.now()}`,
            existing.leadId,
            existing.fullName,
            "Status Changed",
            `Status updated: ${existing.status} → ${updates.status}`,
            actor,
            existing.status,
            updates.status,
            now.split("T")[0],
            "Just now",
            now,
          ]
        );
      }

      return merged;
    } catch (err) {
      console.error("MySQL updateLead error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  const index = db.leads.findIndex((l) => l.id === id || l.leadId === id);
  if (index === -1) return null;
  db.leads[index] = { ...db.leads[index], ...updates, updatedAt: now };
  writeDb(db);
  return db.leads[index];
}

export async function deleteLead(id: string): Promise<boolean> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      await execute("DELETE FROM `htb_leads` WHERE `id` = ? OR `lead_id` = ?", [id, id]);
      return true;
    } catch (err) {
      console.error("MySQL deleteLead error:", err);
    }
  }

  const db = readDb();
  const initial = db.leads.length;
  db.leads = db.leads.filter((l) => l.id !== id && l.leadId !== id);
  writeDb(db);
  return db.leads.length < initial;
}

/* ----------------------------------------------------
   Contact Enquiries API Methods
---------------------------------------------------- */
export async function getContactEnquiries(): Promise<ContactEnquiry[]> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>("SELECT * FROM `htb_contact_enquiries` ORDER BY `created_at` DESC");
      return rows.map(mapEnquiry);
    } catch (err) {
      console.error("MySQL getContactEnquiries error:", err);
    }
  }
  const db = readDb();
  return db.contactEnquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createContactEnquiry(
  data: Omit<ContactEnquiry, "id" | "enquiryId" | "createdAt" | "status" | "assignedTo">
): Promise<ContactEnquiry & { enquiry: ContactEnquiry; lead: Lead }> {
  // Create corresponding CRM Lead so it immediately shows up in pipeline
  const lead = await createLead({
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    service: data.service,
    budget: data.budget || "Not specified",
    source: (data.source as any) || "Contact Form",
    status: "NEW",
    priority: "Medium",
    assignedTo: "Unassigned",
    notes: data.message,
  });

  const now = new Date().toISOString();
  const id = `enq-${Date.now()}`;
  let enquiryId = "ENQ-001";

  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const [countRow] = await query<any[]>("SELECT COUNT(*) AS total FROM `htb_contact_enquiries`");
      const nextNum = (countRow?.total || 0) + 1;
      enquiryId = `ENQ-${String(nextNum).padStart(3, "0")}`;

      await execute(
        "INSERT INTO `htb_contact_enquiries` (id, enquiry_id, full_name, email, mobile, service, budget, message, source, status, assigned_to, lead_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          enquiryId,
          data.fullName,
          data.email,
          data.mobile,
          data.service,
          data.budget || null,
          data.message,
          data.source,
          "New",
          "Unassigned",
          lead.id,
          now,
        ]
      );

      // Notification
      await execute(
        "INSERT INTO `htb_notifications` (id, title, message, type, is_read, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          `notif-${Date.now()}`,
          "New Contact Enquiry",
          `${data.fullName} submitted an enquiry for ${data.service}.`,
          "enquiry",
          0,
          "/admin/contact-enquiries",
          now,
        ]
      );

      const enquiry: ContactEnquiry = {
        ...data,
        id,
        enquiryId,
        status: "New",
        assignedTo: "Unassigned",
        leadId: lead.id,
        createdAt: now,
      };

      return Object.assign(enquiry, { enquiry, lead });
    } catch (err) {
      console.error("MySQL createContactEnquiry error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  enquiryId = `ENQ-${String(db.contactEnquiries.length + 1).padStart(3, "0")}`;
  const newEnq: ContactEnquiry = {
    ...data,
    id,
    enquiryId,
    status: "New",
    assignedTo: "Unassigned",
    leadId: lead.id,
    createdAt: now,
  };
  db.contactEnquiries.unshift(newEnq);
  writeDb(db);
  return Object.assign(newEnq, { enquiry: newEnq, lead });
}

export async function updateContactEnquiryStatus(
  id: string,
  status: "New" | "Contacted" | "Converted" | "Archived",
  assignedTo?: string
): Promise<ContactEnquiry | null> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      if (assignedTo) {
        await execute(
          "UPDATE `htb_contact_enquiries` SET `status` = ?, `assigned_to` = ? WHERE `id` = ? OR `enquiry_id` = ?",
          [status, assignedTo, id, id]
        );
      } else {
        await execute(
          "UPDATE `htb_contact_enquiries` SET `status` = ? WHERE `id` = ? OR `enquiry_id` = ?",
          [status, id, id]
        );
      }
      const rows = await query<any[]>("SELECT * FROM `htb_contact_enquiries` WHERE `id` = ? OR `enquiry_id` = ? LIMIT 1", [id, id]);
      if (rows.length > 0) return mapEnquiry(rows[0]);
      return null;
    } catch (err) {
      console.error("MySQL updateContactEnquiryStatus error:", err);
    }
  }

  const db = readDb();
  const index = db.contactEnquiries.findIndex((e) => e.id === id || e.enquiryId === id);
  if (index === -1) return null;
  db.contactEnquiries[index].status = status;
  if (assignedTo) db.contactEnquiries[index].assignedTo = assignedTo;
  writeDb(db);
  return db.contactEnquiries[index];
}

export const updateEnquiryStatus = updateContactEnquiryStatus;

/* ----------------------------------------------------
   Scheduled Calls API Methods
---------------------------------------------------- */
export async function getScheduledCalls(): Promise<ScheduledCall[]> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>("SELECT * FROM `htb_scheduled_calls` ORDER BY `created_at` DESC");
      return rows.map(mapScheduledCall);
    } catch (err) {
      console.error("MySQL getScheduledCalls error:", err);
    }
  }
  const db = readDb();
  return db.scheduledCalls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createScheduledCall(
  data: Omit<ScheduledCall, "id" | "callId" | "createdAt" | "status" | "assignedTo">
): Promise<ScheduledCall & { call: ScheduledCall; lead: Lead }> {
  // Create corresponding CRM Lead for the call
  const lead = await createLead({
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    service: data.service,
    source: "Schedule Call",
    status: "REQUIREMENT DISCUSSED",
    priority: "High",
    assignedTo: "Unassigned",
    notes: data.notes || `Scheduled consultation on ${data.date} at ${data.time}`,
  });

  const now = new Date().toISOString();
  const id = `call-${Date.now()}`;
  let callId = "CALL-001";

  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const [countRow] = await query<any[]>("SELECT COUNT(*) AS total FROM `htb_scheduled_calls`");
      const nextNum = (countRow?.total || 0) + 1;
      callId = `CALL-${String(nextNum).padStart(3, "0")}`;

      await execute(
        "INSERT INTO `htb_scheduled_calls` (id, call_id, full_name, email, mobile, service, date, time, timezone, status, notes, assigned_to, lead_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          callId,
          data.fullName,
          data.email,
          data.mobile,
          data.service,
          data.date,
          data.time,
          data.timezone,
          "Pending",
          data.notes || null,
          "Unassigned",
          lead.id,
          now,
        ]
      );

      // Notification
      await execute(
        "INSERT INTO `htb_notifications` (id, title, message, type, is_read, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          `notif-${Date.now()}`,
          "New Call Booked",
          `Consultation booked by ${data.fullName} for ${data.date} at ${data.time}.`,
          "call",
          0,
          "/admin/scheduled-calls",
          now,
        ]
      );

      const call: ScheduledCall = {
        ...data,
        id,
        callId,
        status: "Pending",
        assignedTo: "Unassigned",
        leadId: lead.id,
        createdAt: now,
      };

      return Object.assign(call, { call, lead });
    } catch (err) {
      console.error("MySQL createScheduledCall error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  callId = `CALL-${String(db.scheduledCalls.length + 1).padStart(3, "0")}`;
  const newCall: ScheduledCall = {
    ...data,
    id,
    callId,
    status: "Pending",
    assignedTo: "Unassigned",
    leadId: lead.id,
    createdAt: now,
  };
  db.scheduledCalls.unshift(newCall);
  writeDb(db);
  return Object.assign(newCall, { call: newCall, lead });
}

export async function updateScheduledCallStatus(
  id: string,
  status: ScheduledCall["status"],
  notes?: string
): Promise<ScheduledCall | null> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      if (notes !== undefined) {
        await execute(
          "UPDATE `htb_scheduled_calls` SET `status` = ?, `notes` = ? WHERE `id` = ? OR `call_id` = ?",
          [status, notes, id, id]
        );
      } else {
        await execute(
          "UPDATE `htb_scheduled_calls` SET `status` = ? WHERE `id` = ? OR `call_id` = ?",
          [status, id, id]
        );
      }
      const rows = await query<any[]>("SELECT * FROM `htb_scheduled_calls` WHERE `id` = ? OR `call_id` = ? LIMIT 1", [id, id]);
      if (rows.length > 0) return mapScheduledCall(rows[0]);
      return null;
    } catch (err) {
      console.error("MySQL updateScheduledCallStatus error:", err);
    }
  }

  const db = readDb();
  const index = db.scheduledCalls.findIndex((c) => c.id === id || c.callId === id);
  if (index === -1) return null;
  db.scheduledCalls[index].status = status;
  if (notes !== undefined) db.scheduledCalls[index].notes = notes;
  writeDb(db);
  return db.scheduledCalls[index];
}

/* ----------------------------------------------------
   Career Applications API Methods
---------------------------------------------------- */
export async function getCareerApplications(): Promise<CareerApplication[]> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>("SELECT * FROM `htb_career_applications` ORDER BY `created_at` DESC");
      return rows.map(mapCareer);
    } catch (err) {
      console.error("MySQL getCareerApplications error:", err);
    }
  }
  const db = readDb();
  return db.careerApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createCareerApplication(
  data: Omit<CareerApplication, "id" | "applicationId" | "createdAt" | "status" | "assignedTo" | "appliedDate">
): Promise<CareerApplication> {
  const now = new Date().toISOString();
  const todayStr = now.split("T")[0];
  const id = `app-${Date.now()}`;
  let applicationId = "APP-001";

  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const [countRow] = await query<any[]>("SELECT COUNT(*) AS total FROM `htb_career_applications`");
      const nextNum = (countRow?.total || 0) + 1;
      applicationId = `APP-${String(nextNum).padStart(3, "0")}`;

      await execute(
        "INSERT INTO `htb_career_applications` (id, application_id, applicant_name, email, mobile, resume_file_name, resume_file_path, resume_size_bytes, resume_mime_type, message, status, assigned_to, notes, applied_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          applicationId,
          data.applicantName,
          data.email,
          data.mobile,
          data.resumeFileName,
          data.resumeFilePath,
          data.resumeSizeBytes,
          data.resumeMimeType,
          data.message,
          "New",
          "HR Desk",
          null,
          todayStr,
          now,
        ]
      );

      // Notification
      await execute(
        "INSERT INTO `htb_notifications` (id, title, message, type, is_read, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          `notif-${Date.now()}`,
          "New Career Application",
          `${data.applicantName} submitted their resume application.`,
          "career",
          0,
          "/admin/career-applications",
          now,
        ]
      );

      return {
        ...data,
        id,
        applicationId,
        status: "New",
        assignedTo: "HR Desk",
        appliedDate: todayStr,
        createdAt: now,
      };
    } catch (err) {
      console.error("MySQL createCareerApplication error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  applicationId = `APP-${String(db.careerApplications.length + 1).padStart(3, "0")}`;
  const newApp: CareerApplication = {
    ...data,
    id,
    applicationId,
    status: "New",
    assignedTo: "HR Desk",
    appliedDate: todayStr,
    createdAt: now,
  };
  db.careerApplications.unshift(newApp);
  writeDb(db);
  return newApp;
}

export async function updateCareerApplicationStatus(
  id: string,
  status: CareerApplication["status"],
  notes?: string
): Promise<CareerApplication | null> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      if (notes !== undefined) {
        await execute(
          "UPDATE `htb_career_applications` SET `status` = ?, `notes` = ? WHERE `id` = ? OR `application_id` = ?",
          [status, notes, id, id]
        );
      } else {
        await execute(
          "UPDATE `htb_career_applications` SET `status` = ? WHERE `id` = ? OR `application_id` = ?",
          [status, id, id]
        );
      }
      const rows = await query<any[]>("SELECT * FROM `htb_career_applications` WHERE `id` = ? OR `application_id` = ? LIMIT 1", [id, id]);
      if (rows.length > 0) return mapCareer(rows[0]);
      return null;
    } catch (err) {
      console.error("MySQL updateCareerApplicationStatus error:", err);
    }
  }

  const db = readDb();
  const index = db.careerApplications.findIndex((a) => a.id === id || a.applicationId === id);
  if (index === -1) return null;
  db.careerApplications[index].status = status;
  if (notes !== undefined) db.careerApplications[index].notes = notes;
  writeDb(db);
  return db.careerApplications[index];
}

/* ----------------------------------------------------
   Follow-ups API Methods
---------------------------------------------------- */
export async function getFollowUps(): Promise<FollowUp[]> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>("SELECT * FROM `htb_follow_ups` ORDER BY `date` ASC, `time` ASC");
      return rows.map(mapFollowUp);
    } catch (err) {
      console.error("MySQL getFollowUps error:", err);
    }
  }
  const db = readDb();
  return db.followUps.sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime());
}

export async function createFollowUp(
  data: Omit<FollowUp, "id" | "followUpId" | "createdAt" | "status">
): Promise<FollowUp> {
  const now = new Date().toISOString();
  const id = `flp-${Date.now()}`;
  let followUpId = "FLP-001";

  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const [countRow] = await query<any[]>("SELECT COUNT(*) AS total FROM `htb_follow_ups`");
      const nextNum = (countRow?.total || 0) + 1;
      followUpId = `FLP-${String(nextNum).padStart(3, "0")}`;

      await execute(
        "INSERT INTO `htb_follow_ups` (id, follow_up_id, lead_id, lead_name, lead_mobile, date, time, type, assigned_to, status, notes, completed_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          followUpId,
          data.leadId,
          data.leadName,
          data.leadMobile,
          data.date,
          data.time,
          data.type,
          data.assignedTo,
          "Upcoming",
          data.notes,
          null,
          now,
        ]
      );

      return {
        ...data,
        id,
        followUpId,
        status: "Upcoming",
        createdAt: now,
      };
    } catch (err) {
      console.error("MySQL createFollowUp error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  followUpId = `FLP-${String(db.followUps.length + 1).padStart(3, "0")}`;
  const newFollowUp: FollowUp = {
    ...data,
    id,
    followUpId,
    status: "Upcoming",
    createdAt: now,
  };
  db.followUps.push(newFollowUp);
  writeDb(db);
  return newFollowUp;
}

export async function completeFollowUp(id: string, notes?: string): Promise<FollowUp | null> {
  const now = new Date().toISOString();
  const mysqlUp = await isMySqlAvailable();

  if (mysqlUp) {
    try {
      if (notes) {
        await execute(
          "UPDATE `htb_follow_ups` SET `status` = 'Completed', `completed_at` = ?, `notes` = ? WHERE `id` = ? OR `follow_up_id` = ?",
          [now, notes, id, id]
        );
      } else {
        await execute(
          "UPDATE `htb_follow_ups` SET `status` = 'Completed', `completed_at` = ? WHERE `id` = ? OR `follow_up_id` = ?",
          [now, id, id]
        );
      }
      const rows = await query<any[]>("SELECT * FROM `htb_follow_ups` WHERE `id` = ? OR `follow_up_id` = ? LIMIT 1", [id, id]);
      if (rows.length > 0) return mapFollowUp(rows[0]);
      return null;
    } catch (err) {
      console.error("MySQL completeFollowUp error:", err);
    }
  }

  const db = readDb();
  const index = db.followUps.findIndex((f) => f.id === id || f.followUpId === id);
  if (index === -1) return null;
  db.followUps[index].status = "Completed";
  db.followUps[index].completedAt = now;
  if (notes) db.followUps[index].notes = notes;
  writeDb(db);
  return db.followUps[index];
}

/* ----------------------------------------------------
   Activities & Notes Methods
---------------------------------------------------- */
export async function getActivities(limit = 20): Promise<LeadActivity[]> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>(
        "SELECT * FROM `htb_activities` ORDER BY `created_at` DESC LIMIT ?",
        [limit]
      );
      return rows.map(mapActivity);
    } catch (err) {
      console.error("MySQL getActivities error:", err);
    }
  }
  const db = readDb();
  return db.activities.slice(0, limit);
}

export async function getLeadNotes(leadId: string): Promise<LeadNote[]> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>(
        "SELECT * FROM `htb_notes` WHERE `lead_id` = ? ORDER BY `created_at` DESC",
        [leadId]
      );
      return rows.map(mapNote);
    } catch (err) {
      console.error("MySQL getLeadNotes error:", err);
    }
  }
  const db = readDb();
  return db.notes.filter((n) => n.leadId === leadId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addLeadNote(leadId: string, note: string, actor = "Admin"): Promise<LeadNote> {
  const now = new Date().toISOString();
  const id = `note-${Date.now()}`;

  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      await execute(
        "INSERT INTO `htb_notes` (id, lead_id, note, actor, created_at) VALUES (?, ?, ?, ?, ?)",
        [id, leadId, note, actor, now]
      );

      const lead = await getLeadById(leadId);
      await execute(
        "INSERT INTO `htb_activities` (id, lead_id, lead_name, type, description, actor, date, time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          `act-${Date.now()}`,
          leadId,
          lead?.fullName || null,
          "Note Added",
          `Added note: "${note.substring(0, 60)}${note.length > 60 ? "..." : ""}"`,
          actor,
          now.split("T")[0],
          "Just now",
          now,
        ]
      );

      return { id, leadId, note, actor, createdAt: now };
    } catch (err) {
      console.error("MySQL addLeadNote error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  const newNote: LeadNote = { id, leadId, note, actor, createdAt: now };
  db.notes.unshift(newNote);
  writeDb(db);
  return newNote;
}

/* ----------------------------------------------------
   Notifications API Methods
---------------------------------------------------- */
export async function getNotifications(): Promise<Notification[]> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>("SELECT * FROM `htb_notifications` ORDER BY `created_at` DESC");
      return rows.map(mapNotification);
    } catch (err) {
      console.error("MySQL getNotifications error:", err);
    }
  }
  const db = readDb();
  return db.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationRead(id: string): Promise<boolean> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      await execute("UPDATE `htb_notifications` SET `is_read` = 1 WHERE `id` = ?", [id]);
      return true;
    } catch (err) {
      console.error("MySQL markNotificationRead error:", err);
    }
  }
  const db = readDb();
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) {
    notif.read = true;
    writeDb(db);
    return true;
  }
  return false;
}

export async function markAllNotificationsRead(): Promise<void> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      await execute("UPDATE `htb_notifications` SET `is_read` = 1");
      return;
    } catch (err) {
      console.error("MySQL markAllNotificationsRead error:", err);
    }
  }
  const db = readDb();
  db.notifications.forEach((n) => (n.read = true));
  writeDb(db);
}

/* ----------------------------------------------------
   Team & User Authentication Methods
---------------------------------------------------- */
export async function getTeam(): Promise<TeamMember[]> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>("SELECT * FROM `htb_team` ORDER BY `created_at` ASC");
      return rows.map(mapTeamMember);
    } catch (err) {
      console.error("MySQL getTeam error:", err);
    }
  }
  const db = readDb();
  return db.team;
}

export async function createTeamMember(data: Omit<TeamMember, "id" | "createdAt">): Promise<TeamMember> {
  const now = new Date().toISOString();
  const id = `team-${Date.now()}`;

  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      await execute(
        "INSERT INTO `htb_team` (id, name, email, role, password, avatar, status, phone, last_login, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          data.name,
          data.email,
          data.role,
          data.password || "Admin@123",
          data.avatar || null,
          data.status || "Active",
          data.phone,
          data.lastLogin || null,
          now,
        ]
      );
      return { ...data, id, createdAt: now };
    } catch (err) {
      console.error("MySQL createTeamMember error:", err);
    }
  }

  const db = readDb();
  const newMember: TeamMember = { ...data, id, createdAt: now };
  db.team.push(newMember);
  writeDb(db);
  return newMember;
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember | null> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const existing = await getTeam();
      const target = existing.find((t) => t.id === id);
      if (!target) return null;

      const merged = { ...target, ...data };
      await execute(
        "UPDATE `htb_team` SET `name`=?, `email`=?, `role`=?, `password`=?, `avatar`=?, `status`=?, `phone`=?, `last_login`=? WHERE `id`=?",
        [
          merged.name,
          merged.email,
          merged.role,
          merged.password || "Admin@123",
          merged.avatar || null,
          merged.status,
          merged.phone,
          merged.lastLogin || null,
          id,
        ]
      );
      return merged;
    } catch (err) {
      console.error("MySQL updateTeamMember error:", err);
    }
  }

  const db = readDb();
  const index = db.team.findIndex((t) => t.id === id);
  if (index === -1) return null;
  db.team[index] = { ...db.team[index], ...data };
  writeDb(db);
  return db.team[index];
}

export async function getUserPassword(email: string): Promise<string> {
  const normalized = email.toLowerCase().trim();
  const mysqlUp = await isMySqlAvailable();

  if (mysqlUp) {
    try {
      const rows = await query<any[]>("SELECT `password` FROM `htb_team` WHERE LOWER(`email`) = ? LIMIT 1", [normalized]);
      if (rows.length > 0 && rows[0].password) {
        return rows[0].password;
      }
      return "Admin@123";
    } catch (err) {
      console.error("MySQL getUserPassword error:", err);
    }
  }

  const db = readDb();
  const member = db.team.find((t) => t.email.toLowerCase() === normalized);
  if (member && member.password) return member.password;
  return "Admin@123";
}

export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim();
  const now = new Date().toISOString();
  const mysqlUp = await isMySqlAvailable();

  if (mysqlUp) {
    try {
      const rows = await query<any[]>("SELECT * FROM `htb_team` WHERE LOWER(`email`) = ? LIMIT 1", [normalized]);
      if (rows.length > 0) {
        await execute("UPDATE `htb_team` SET `password` = ? WHERE LOWER(`email`) = ?", [newPassword, normalized]);
      } else if (normalized === "admin@hightechbirds.com" || normalized === "dev.omkar05@gmail.com") {
        await execute(
          "INSERT INTO `htb_team` (id, name, email, role, password, status, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            "team-super",
            "Omkar Bhoir",
            normalized,
            "Super Admin",
            newPassword,
            "Active",
            "+91 99208 18481",
            now,
          ]
        );
      } else {
        return false;
      }

      await execute(
        "INSERT INTO `htb_activities` (id, type, description, actor, date, time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          `act-${Date.now()}`,
          "Team Action",
          `Security: Password updated in MySQL for administrator account (${normalized}).`,
          normalized,
          now.split("T")[0],
          "Just now",
          now,
        ]
      );
      return true;
    } catch (err) {
      console.error("MySQL updateUserPassword error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  const index = db.team.findIndex((t) => t.email.toLowerCase() === normalized);
  if (index !== -1) {
    db.team[index].password = newPassword;
  } else if (normalized === "admin@hightechbirds.com" || normalized === "dev.omkar05@gmail.com") {
    db.team.push({
      id: "team-super",
      name: "Omkar Bhoir",
      email: normalized,
      role: "Super Admin",
      status: "Active",
      phone: "+91 99208 18481",
      password: newPassword,
      createdAt: now,
    });
  } else {
    return false;
  }
  writeDb(db);
  return true;
}

export async function createPasswordReset(
  email: string
): Promise<{ otp: string; token: string; expiresAt: string } | null> {
  const normalized = email.toLowerCase().trim();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const token = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const isMaster = normalized === "admin@hightechbirds.com" || normalized === "dev.omkar05@gmail.com";
      const teamRows = await query<any[]>("SELECT id FROM `htb_team` WHERE LOWER(`email`) = ? LIMIT 1", [normalized]);

      if (teamRows.length === 0 && !isMaster) {
        return null;
      }

      // Remove existing resets
      await execute("DELETE FROM `htb_password_resets` WHERE LOWER(`email`) = ?", [normalized]);

      await execute(
        "INSERT INTO `htb_password_resets` (id, email, otp, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [`reset-${Date.now()}`, normalized, otp, token, expiresAt, now]
      );

      return { otp, token, expiresAt };
    } catch (err) {
      console.error("MySQL createPasswordReset error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  if (!db.passwordResets) db.passwordResets = [];
  db.passwordResets = db.passwordResets.filter((r) => r.email.toLowerCase() !== normalized);
  db.passwordResets.push({
    id: `reset-${Date.now()}`,
    email: normalized,
    otp,
    token,
    expiresAt,
    createdAt: now,
  });
  writeDb(db);
  return { otp, token, expiresAt };
}

export async function resetPasswordWithOtp(
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const normalized = email.toLowerCase().trim();
  const mysqlUp = await isMySqlAvailable();

  if (mysqlUp) {
    try {
      const rows = await query<any[]>(
        "SELECT * FROM `htb_password_resets` WHERE LOWER(`email`) = ? AND `otp` = ? LIMIT 1",
        [normalized, otp.trim()]
      );

      if (rows.length === 0) {
        return { success: false, error: "Invalid verification code. Please check and try again." };
      }

      const record = rows[0];
      if (new Date(record.expires_at).getTime() < Date.now()) {
        await execute("DELETE FROM `htb_password_resets` WHERE `id` = ?", [record.id]);
        return { success: false, error: "Verification code has expired. Please request a new one." };
      }

      // Update password
      const updated = await updateUserPassword(normalized, newPassword);
      if (!updated) {
        return { success: false, error: "Could not find account to update password." };
      }

      // Delete used reset
      await execute("DELETE FROM `htb_password_resets` WHERE LOWER(`email`) = ?", [normalized]);
      return { success: true };
    } catch (err) {
      console.error("MySQL resetPasswordWithOtp error:", err);
    }
  }

  // Fallback JSON
  const db = readDb();
  if (!db.passwordResets || db.passwordResets.length === 0) {
    return { success: false, error: "No reset request found for this email." };
  }
  const recordIndex = db.passwordResets.findIndex(
    (r) => r.email.toLowerCase() === normalized && r.otp.trim() === otp.trim()
  );
  if (recordIndex === -1) {
    return { success: false, error: "Invalid verification code. Please check and try again." };
  }
  const record = db.passwordResets[recordIndex];
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    db.passwordResets.splice(recordIndex, 1);
    writeDb(db);
    return { success: false, error: "Verification code has expired. Please request a new one." };
  }

  await updateUserPassword(normalized, newPassword);
  db.passwordResets.splice(recordIndex, 1);
  writeDb(db);
  return { success: true };
}

/* ----------------------------------------------------
   Settings Methods
---------------------------------------------------- */
export async function getSettings(): Promise<Settings> {
  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      const rows = await query<any[]>("SELECT `value_json` FROM `htb_settings` WHERE `key_name` = 'app_settings' LIMIT 1");
      if (rows.length > 0 && rows[0].value_json) {
        return JSON.parse(rows[0].value_json);
      }
    } catch (err) {
      console.error("MySQL getSettings error:", err);
    }
  }
  const db = readDb();
  return db.settings || INITIAL_SETTINGS;
}

export async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const merged = { ...current, ...updates };

  const mysqlUp = await isMySqlAvailable();
  if (mysqlUp) {
    try {
      await execute(
        "INSERT INTO `htb_settings` (`key_name`, `value_json`, `updated_at`) VALUES ('app_settings', ?, ?) ON DUPLICATE KEY UPDATE `value_json` = VALUES(`value_json`), `updated_at` = VALUES(`updated_at`)",
        [JSON.stringify(merged), new Date().toISOString()]
      );
      return merged;
    } catch (err) {
      console.error("MySQL updateSettings error:", err);
    }
  }

  const db = readDb();
  db.settings = merged;
  writeDb(db);
  return merged;
}

/* ----------------------------------------------------
   Dashboard Metrics
---------------------------------------------------- */
export async function getDashboardStats(): Promise<DashboardStats> {
  const leads = await getLeads();
  const followUps = await getFollowUps();
  const scheduledCalls = await getScheduledCalls();
  const careerApplications = await getCareerApplications();
  const activities = await getActivities(10);

  const todayStr = new Date().toISOString().split("T")[0];

  const totalLeads = leads.length;
  const newLeadsToday = leads.filter((l) => l.createdAt.startsWith(todayStr)).length;
  const followUpsDueToday = followUps.filter(
    (f) => f.status !== "Completed" && f.date === todayStr
  ).length;

  const scheduledCallsUpcoming = scheduledCalls.filter(
    (c) => c.status === "Confirmed" || c.status === "Pending"
  ).length;

  const wonLeadsMonth = leads.filter((l) => l.status === "WON").length;
  const careerCount = careerApplications.length;

  const pipelineCounts: Record<LeadStatus, number> = {
    NEW: 0,
    CONTACTED: 0,
    QUALIFIED: 0,
    "REQUIREMENT DISCUSSED": 0,
    "QUOTATION SENT": 0,
    "FOLLOW-UP": 0,
    NEGOTIATION: 0,
    WON: 0,
    LOST: 0,
  };

  leads.forEach((lead) => {
    if (pipelineCounts[lead.status] !== undefined) {
      pipelineCounts[lead.status]++;
    }
  });

  const followUpCounts = {
    overdue: followUps.filter((f) => f.status !== "Completed" && f.date < todayStr).length,
    today: followUpsDueToday,
    upcoming: followUps.filter((f) => f.status !== "Completed" && f.date > todayStr).length,
    completed: followUps.filter((f) => f.status === "Completed").length,
  };

  const sourceMap: Record<string, number> = {};
  leads.forEach((l) => {
    sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
  });

  const leadsBySource = Object.entries(sourceMap).map(([src, count]) => ({
    source: src as LeadSource,
    count,
    percentage: Math.round((count / (totalLeads || 1)) * 100),
  }));

  const serviceMap: Record<string, number> = {};
  leads.forEach((l) => {
    serviceMap[l.service] = (serviceMap[l.service] || 0) + 1;
  });

  const mostRequestedServices = Object.entries(serviceMap)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalLeads,
    totalLeadsTrend: "↑ 12%",
    newLeadsToday,
    newLeadsTrend: "↑ 24%",
    followUpsDueToday,
    followUpsTrend: "↑ 5%",
    scheduledCallsUpcoming,
    scheduledCallsTrend: "↑ 12%",
    wonLeadsMonth,
    wonLeadsTrend: "↑ 18%",
    careerApplications: careerCount,
    careerApplicationsTrend: "↑ 8%",
    pipelineCounts,
    followUpCounts,
    leadsBySource,
    mostRequestedServices,
    upcomingCalls: scheduledCalls.filter((c) => c.status !== "Completed" && c.status !== "Cancelled").slice(0, 4),
    todayFollowUps: followUps.filter((f) => f.date === todayStr).slice(0, 5),
    recentLeads: leads.slice(0, 8),
    recentActivities: activities.slice(0, 7),
  };
}
