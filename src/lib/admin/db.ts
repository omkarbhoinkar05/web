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
} from "./types";

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

function getSeedData(): DatabaseSchema {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const leads: Lead[] = [
    {
      id: "lead-1",
      leadId: "HTB-001",
      fullName: "Rahul Sharma",
      email: "rahul.sharma@innovatetech.in",
      mobile: "9920818481",
      service: "SaaS App Development",
      budget: "₹2,00,000 – ₹5,00,000",
      source: "Website",
      status: "FOLLOW-UP",
      priority: "High",
      assignedTo: "Omkar Bhoir (Admin)",
      notes: "Looking to build a multi-tenant B2B inventory tracking dashboard.",
      lastContact: `${todayStr} 11:30 AM`,
      nextFollowUp: `${todayStr} 05:00 PM`,
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "lead-2",
      leadId: "HTB-002",
      fullName: "Amit Patil",
      email: "amit.patil@logisticsprime.com",
      mobile: "9820123456",
      service: "ERP Software",
      budget: "₹5,00,000+",
      source: "Schedule Call",
      status: "REQUIREMENT DISCUSSED",
      priority: "Urgent",
      assignedTo: "Sales Desk",
      notes: "Custom ERP for 3 warehouse hubs in Navi Mumbai.",
      lastContact: `${todayStr} 10:00 AM`,
      nextFollowUp: `${todayStr} 02:00 PM`,
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "lead-3",
      leadId: "HTB-003",
      fullName: "Neha Shah",
      email: "neha.shah@luxurydesign.in",
      mobile: "9833445566",
      service: "Web Design",
      budget: "₹1,00,000 – ₹2,00,000",
      source: "Contact Form",
      status: "QUOTATION SENT",
      priority: "Medium",
      assignedTo: "Omkar Bhoir (Admin)",
      notes: "Modern portfolio redesign for architecture studio.",
      lastContact: `${todayStr} 09:15 AM`,
      nextFollowUp: `${todayStr} 04:00 PM`,
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "lead-4",
      leadId: "HTB-004",
      fullName: "Karan Mehta",
      email: "karan@urbanmart.co",
      mobile: "9711223344",
      service: "E-Commerce",
      budget: "₹2,00,000 – ₹5,00,000",
      source: "WhatsApp",
      status: "NEGOTIATION",
      priority: "High",
      assignedTo: "Sales Desk",
      notes: "Multi-vendor grocery store with instant local delivery app.",
      lastContact: `${todayStr} 12:00 PM`,
      nextFollowUp: `${todayStr} 06:30 PM`,
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "lead-5",
      leadId: "HTB-005",
      fullName: "Dr. Arvind Rao",
      email: "arvind@cardiopulse.org",
      mobile: "9988776655",
      service: "Custom Web App",
      budget: "₹5,00,000+",
      source: "Referral",
      status: "WON",
      priority: "High",
      assignedTo: "Omkar Bhoir (Admin)",
      notes: "Telemedicine consultation suite with encrypted EHR records.",
      closingNote: "Contract signed, 30% advance received, sprint 1 kick-off scheduled.",
      createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "lead-6",
      leadId: "HTB-006",
      fullName: "Suresh Gupta",
      email: "suresh@guptatraders.in",
      mobile: "9822110099",
      service: "Dynamic Website",
      budget: "₹25,000 – ₹50,000",
      source: "Direct Inbound",
      status: "LOST",
      priority: "Low",
      assignedTo: "Sales Desk",
      notes: "Wanted generic static template at low budget.",
      lostReason: "Budget",
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "lead-7",
      leadId: "HTB-007",
      fullName: "Priya Verma",
      email: "priya@finscale.ai",
      mobile: "9819998877",
      service: "SaaS App Development",
      budget: "₹2,00,000 – ₹5,00,000",
      source: "LinkedIn",
      status: "QUALIFIED",
      priority: "High",
      assignedTo: "Omkar Bhoir (Admin)",
      notes: "Fintech analytics dashboard for wealth managers.",
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "lead-8",
      leadId: "HTB-008",
      fullName: "Vikram Singhania",
      email: "vikram@propmatrix.in",
      mobile: "9930441122",
      service: "Web Design",
      budget: "₹50,000 – ₹1,00,000",
      source: "Website",
      status: "NEW",
      priority: "Medium",
      assignedTo: "Unassigned",
      notes: "Real estate listing landing page with interactive map.",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];

  const contactEnquiries: ContactEnquiry[] = [
    {
      id: "enq-1",
      enquiryId: "ENQ-001",
      fullName: "Neha Shah",
      email: "neha.shah@luxurydesign.in",
      mobile: "9833445566",
      service: "Web Design",
      budget: "₹1,00,000 – ₹2,00,000",
      message: "We need an ultra-minimalist brand website with 3D showcases.",
      source: "Website Contact Form",
      status: "Converted",
      assignedTo: "Omkar Bhoir (Admin)",
      leadId: "HTB-003",
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "enq-2",
      enquiryId: "ENQ-002",
      fullName: "Vikram Singhania",
      email: "vikram@propmatrix.in",
      mobile: "9930441122",
      service: "Web Design",
      budget: "₹50,000 – ₹1,00,000",
      message: "Interested in getting a high-converting web presence for property launches.",
      source: "Website Contact Form",
      status: "New",
      assignedTo: "Unassigned",
      leadId: "HTB-008",
      createdAt: now.toISOString(),
    },
  ];

  const scheduledCalls: ScheduledCall[] = [
    {
      id: "call-1",
      callId: "CALL-001",
      fullName: "Rahul Sharma",
      email: "rahul.sharma@innovatetech.in",
      mobile: "9920818481",
      service: "SaaS App Development",
      date: todayStr,
      time: "10:00 AM",
      timezone: "IST (GMT+5:30)",
      status: "Confirmed",
      notes: "Review micro-frontend requirements and data schema.",
      assignedTo: "Omkar Bhoir (Admin)",
      leadId: "HTB-001",
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "call-2",
      callId: "CALL-002",
      fullName: "Amit Patil",
      email: "amit.patil@logisticsprime.com",
      mobile: "9820123456",
      service: "ERP Software",
      date: todayStr,
      time: "12:30 PM",
      timezone: "IST (GMT+5:30)",
      status: "Pending",
      notes: "Discuss warehouse inventory barcode integration.",
      assignedTo: "Sales Desk",
      leadId: "HTB-002",
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
    {
      id: "call-3",
      callId: "CALL-003",
      fullName: "Neha Shah",
      email: "neha.shah@luxurydesign.in",
      mobile: "9833445566",
      service: "Web Design",
      date: todayStr,
      time: "04:00 PM",
      timezone: "IST (GMT+5:30)",
      status: "Confirmed",
      notes: "Quotation review and typography preferences.",
      assignedTo: "Omkar Bhoir (Admin)",
      leadId: "HTB-003",
      createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    },
    {
      id: "call-4",
      callId: "CALL-004",
      fullName: "Karan Mehta",
      email: "karan@urbanmart.co",
      mobile: "9711223344",
      service: "E-Commerce",
      date: todayStr,
      time: "05:30 PM",
      timezone: "IST (GMT+5:30)",
      status: "Pending",
      notes: "Payment gateway and merchant payout escrow architecture.",
      assignedTo: "Sales Desk",
      leadId: "HTB-004",
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
  ];

  const followUps: FollowUp[] = [
    {
      id: "flp-1",
      followUpId: "FLP-001",
      leadId: "HTB-001",
      leadName: "Rahul Sharma",
      leadMobile: "9920818481",
      date: todayStr,
      time: "05:00 PM",
      type: "Call",
      assignedTo: "Omkar Bhoir (Admin)",
      status: "Today",
      notes: "Confirm tech stack decisions and timeline expectations.",
      createdAt: now.toISOString(),
    },
    {
      id: "flp-2",
      followUpId: "FLP-002",
      leadId: "HTB-003",
      leadName: "Neha Shah",
      leadMobile: "9833445566",
      date: todayStr,
      time: "04:00 PM",
      type: "Quotation",
      assignedTo: "Omkar Bhoir (Admin)",
      status: "Today",
      notes: "Follow up on the sent quotation and milestone timeline.",
      createdAt: now.toISOString(),
    },
    {
      id: "flp-3",
      followUpId: "FLP-003",
      leadId: "HTB-004",
      leadName: "Karan Mehta",
      leadMobile: "9711223344",
      date: todayStr,
      time: "06:30 PM",
      type: "WhatsApp",
      assignedTo: "Sales Desk",
      status: "Today",
      notes: "Send updated payment gateway comparison PDF via WhatsApp.",
      createdAt: now.toISOString(),
    },
    {
      id: "flp-4",
      followUpId: "FLP-004",
      leadId: "HTB-007",
      leadName: "Priya Verma",
      leadMobile: "9819998877",
      date: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split("T")[0],
      time: "11:00 AM",
      type: "Meeting",
      assignedTo: "Omkar Bhoir (Admin)",
      status: "Upcoming",
      notes: "Video demo of similar FinTech terminal built previously.",
      createdAt: now.toISOString(),
    },
  ];

  const careerApplications: CareerApplication[] = [
    {
      id: "app-1",
      applicationId: "APP-001",
      applicantName: "Tanmay Shinde",
      email: "tanmay.shinde@gmail.com",
      mobile: "9820011223",
      resumeFileName: "Tanmay_Shinde_FullStack_Resume.pdf",
      resumeFilePath: "data/resumes/Tanmay_Shinde_FullStack_Resume.pdf",
      resumeSizeBytes: 345000,
      resumeMimeType: "application/pdf",
      message: "Frontend specialist with 3 years React/Next.js and Tailwind CSS experience.",
      status: "Shortlisted",
      assignedTo: "HR Desk",
      appliedDate: `${todayStr}`,
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "app-2",
      applicationId: "APP-002",
      applicantName: "Rohan Deshmukh",
      email: "rohan.d@outlook.com",
      mobile: "9921122334",
      resumeFileName: "Rohan_Deshmukh_Backend_Resume.pdf",
      resumeFilePath: "data/resumes/Rohan_Deshmukh_Backend_Resume.pdf",
      resumeSizeBytes: 420000,
      resumeMimeType: "application/pdf",
      message: "Node.js & PostgreSQL developer experienced in microservices.",
      status: "Under Review",
      assignedTo: "HR Desk",
      appliedDate: `${todayStr}`,
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
  ];

  const activities: LeadActivity[] = [
    {
      id: "act-1",
      leadId: "HTB-008",
      leadName: "Vikram Singhania",
      type: "Contact Enquiry",
      description: "New contact enquiry received for Web Design.",
      actor: "System",
      date: todayStr,
      time: "10 mins ago",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: "act-2",
      leadId: "HTB-003",
      leadName: "Neha Shah",
      type: "Follow-up Completed",
      description: "Follow-up completed: Sent design proposal & quotation.",
      actor: "Omkar Bhoir (Admin)",
      date: todayStr,
      time: "1 hour ago",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: "act-3",
      leadId: "HTB-002",
      leadName: "Amit Patil",
      type: "Call Scheduled",
      description: "Call scheduled for ERP Software at 12:30 PM.",
      actor: "System",
      date: todayStr,
      time: "2 hours ago",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: "act-4",
      leadId: "APP-002",
      leadName: "Rohan Deshmukh",
      type: "Career Application",
      description: "Application received for Full-Stack Developer position.",
      actor: "System",
      date: todayStr,
      time: "3 hours ago",
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
    {
      id: "act-5",
      leadId: "HTB-004",
      leadName: "Karan Mehta",
      type: "Status Changed",
      previousStatus: "QUOTATION SENT",
      newStatus: "NEGOTIATION",
      description: "Lead status changed: Quotation Sent → Negotiation.",
      actor: "Sales Desk",
      date: todayStr,
      time: "4 hours ago",
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
  ];

  const notes: LeadNote[] = [
    {
      id: "note-1",
      leadId: "HTB-001",
      note: "Client emphasized need for clean multi-tenant role isolation and sub-second inventory search.",
      actor: "Omkar Bhoir (Admin)",
      createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    },
  ];

  const notifications: Notification[] = [
    {
      id: "notif-1",
      title: "New Contact Enquiry",
      message: "Vikram Singhania submitted a web design inquiry.",
      type: "enquiry",
      read: false,
      link: "/admin/contact-enquiries",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: "notif-2",
      title: "Upcoming Scheduled Call",
      message: "Call with Amit Patil (ERP Software) scheduled at 12:30 PM.",
      type: "call",
      read: false,
      link: "/admin/scheduled-calls",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: "notif-3",
      title: "New Career Application",
      message: "Rohan Deshmukh applied with resume attached.",
      type: "career",
      read: false,
      link: "/admin/career-applications",
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
  ];

  const team: TeamMember[] = [
    {
      id: "team-1",
      name: "Omkar Bhoir",
      email: "admin@hightechbirds.com",
      role: "Super Admin",
      status: "Active",
      phone: "+91 99208 18481",
      lastLogin: `${todayStr} 09:00 AM`,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "team-2",
      name: "Siddharth Shinde",
      email: "siddharth@hightechbirds.com",
      role: "Admin",
      status: "Active",
      phone: "+91 9820012345",
      lastLogin: `${todayStr} 09:30 AM`,
      createdAt: "2026-02-01T00:00:00.000Z",
    },
    {
      id: "team-3",
      name: "Anjali Dave",
      email: "anjali@hightechbirds.com",
      role: "Sales",
      status: "Active",
      phone: "+91 9833112233",
      lastLogin: `${todayStr} 10:15 AM`,
      createdAt: "2026-03-01T00:00:00.000Z",
    },
    {
      id: "team-4",
      name: "Pooja Hegde",
      email: "pooja@hightechbirds.com",
      role: "HR",
      status: "Active",
      phone: "+91 9711556677",
      lastLogin: `${todayStr} 09:45 AM`,
      createdAt: "2026-04-01T00:00:00.000Z",
    },
  ];

  return {
    leads,
    contactEnquiries,
    scheduledCalls,
    careerApplications,
    followUps,
    activities,
    notes,
    notifications,
    team,
    settings: INITIAL_SETTINGS,
  };
}

export function readDb(): DatabaseSchema {
  ensureDirectories();
  if (!fs.existsSync(DB_FILE)) {
    const seed = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    const seed = getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

export function writeDb(data: DatabaseSchema): void {
  ensureDirectories();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
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
  const db = readDb();
  let results = [...db.leads];

  if (filters?.status && filters.status !== "All") {
    results = results.filter((l) => l.status === filters.status);
  }
  if (filters?.priority && filters.priority !== "All") {
    results = results.filter((l) => l.priority === filters.priority);
  }
  if (filters?.service && filters.service !== "All") {
    results = results.filter((l) => l.service === filters.service);
  }
  if (filters?.source && filters.source !== "All") {
    results = results.filter((l) => l.source === filters.source);
  }
  if (filters?.assignedTo && filters.assignedTo !== "All") {
    results = results.filter((l) => l.assignedTo === filters.assignedTo);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.mobile.includes(q) ||
        l.leadId.toLowerCase().includes(q) ||
        l.service.toLowerCase().includes(q)
    );
  }

  // Sort
  if (filters?.sort === "oldest") {
    results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return results;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const db = readDb();
  return db.leads.find((l) => l.id === id || l.leadId === id) || null;
}

export async function createLead(
  data: Omit<Lead, "id" | "leadId" | "createdAt" | "updatedAt">
): Promise<Lead> {
  const db = readDb();
  const nextNum = db.leads.length + 1;
  const leadId = `HTB-${String(nextNum).padStart(3, "0")}`;
  const now = new Date().toISOString();

  const newLead: Lead = {
    ...data,
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    leadId,
    createdAt: now,
    updatedAt: now,
  };

  db.leads.unshift(newLead);

  // Log activity
  db.activities.unshift({
    id: `act-${Date.now()}`,
    leadId: newLead.leadId,
    leadName: newLead.fullName,
    type: "Lead Created",
    description: `New lead created: ${newLead.fullName} for ${newLead.service}.`,
    actor: newLead.assignedTo || "Admin",
    date: now.split("T")[0],
    time: "Just now",
    createdAt: now,
  });

  writeDb(db);
  return newLead;
}

export async function updateLead(id: string, updates: Partial<Lead>, actor = "Admin"): Promise<Lead | null> {
  const db = readDb();
  const index = db.leads.findIndex((l) => l.id === id || l.leadId === id);
  if (index === -1) return null;

  const current = db.leads[index];
  const previousStatus = current.status;
  const now = new Date().toISOString();

  const updated: Lead = {
    ...current,
    ...updates,
    updatedAt: now,
  };

  db.leads[index] = updated;

  // Track status change activity
  if (updates.status && updates.status !== previousStatus) {
    let activityDesc = `Lead status changed from ${previousStatus} → ${updates.status}.`;
    if (updates.status === "WON" && updates.closingNote) {
      activityDesc += ` Closing Note: "${updates.closingNote}"`;
    } else if (updates.status === "LOST" && updates.lostReason) {
      activityDesc += ` Lost Reason: ${updates.lostReason}.`;
    }

    db.activities.unshift({
      id: `act-${Date.now()}`,
      leadId: updated.leadId,
      leadName: updated.fullName,
      type: updates.status === "WON" ? "Lead Won" : updates.status === "LOST" ? "Lead Lost" : "Status Changed",
      description: activityDesc,
      previousStatus,
      newStatus: updates.status,
      actor,
      date: now.split("T")[0],
      time: "Just now",
      createdAt: now,
    });
  }

  writeDb(db);
  return updated;
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = readDb();
  const initialLen = db.leads.length;
  db.leads = db.leads.filter((l) => l.id !== id && l.leadId !== id);
  if (db.leads.length !== initialLen) {
    writeDb(db);
    return true;
  }
  return false;
}

/* ----------------------------------------------------
   Contact Enquiries API Methods
---------------------------------------------------- */
export async function getContactEnquiries(search?: string): Promise<ContactEnquiry[]> {
  const db = readDb();
  let results = [...db.contactEnquiries];
  if (search) {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.mobile.includes(q) ||
        e.enquiryId.toLowerCase().includes(q)
    );
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createContactEnquiry(data: {
  fullName: string;
  email: string;
  mobile: string;
  service: string;
  budget?: string;
  message: string;
  source?: string;
}): Promise<{ enquiry: ContactEnquiry; lead: Lead }> {
  const db = readDb();
  const nextEnqNum = db.contactEnquiries.length + 1;
  const enquiryId = `ENQ-${String(nextEnqNum).padStart(3, "0")}`;
  const now = new Date().toISOString();

  // 1. Auto-create or link Lead
  const nextLeadNum = db.leads.length + 1;
  const leadId = `HTB-${String(nextLeadNum).padStart(3, "0")}`;

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    leadId,
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    service: data.service,
    budget: data.budget || "Not Specified",
    source: "Contact Form",
    status: "NEW",
    priority: "Medium",
    assignedTo: "Omkar Bhoir (Admin)",
    notes: data.message,
    createdAt: now,
    updatedAt: now,
  };
  db.leads.unshift(newLead);

  // 2. Create Enquiry
  const newEnquiry: ContactEnquiry = {
    id: `enq-${Date.now()}`,
    enquiryId,
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    service: data.service,
    budget: data.budget,
    message: data.message,
    source: data.source || "Website Contact Form",
    status: "New",
    assignedTo: "Omkar Bhoir (Admin)",
    leadId,
    createdAt: now,
  };
  db.contactEnquiries.unshift(newEnquiry);

  // 3. Log Activity & Notification
  db.activities.unshift({
    id: `act-${Date.now()}`,
    leadId,
    leadName: data.fullName,
    type: "Contact Enquiry",
    description: `New contact enquiry received from ${data.fullName} for ${data.service}.`,
    actor: "System",
    date: now.split("T")[0],
    time: "Just now",
    createdAt: now,
  });

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: "New Contact Enquiry",
    message: `${data.fullName} submitted an enquiry for ${data.service}.`,
    type: "enquiry",
    read: false,
    link: "/admin/contact-enquiries",
    createdAt: now,
  });

  writeDb(db);
  return { enquiry: newEnquiry, lead: newLead };
}

export async function updateEnquiryStatus(
  id: string,
  status: ContactEnquiry["status"]
): Promise<ContactEnquiry | null> {
  const db = readDb();
  const item = db.contactEnquiries.find((e) => e.id === id || e.enquiryId === id);
  if (!item) return null;
  item.status = status;
  writeDb(db);
  return item;
}

/* ----------------------------------------------------
   Scheduled Calls API Methods
---------------------------------------------------- */
export async function getScheduledCalls(): Promise<ScheduledCall[]> {
  const db = readDb();
  return db.scheduledCalls.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createScheduledCall(data: {
  fullName: string;
  email: string;
  mobile: string;
  service: string;
  date: string;
  time: string;
  timezone?: string;
  notes?: string;
}): Promise<{ call: ScheduledCall; lead: Lead }> {
  const db = readDb();
  const nextCallNum = db.scheduledCalls.length + 1;
  const callId = `CALL-${String(nextCallNum).padStart(3, "0")}`;
  const now = new Date().toISOString();

  // Find existing lead by email or mobile, or create new
  let lead = db.leads.find((l) => l.email === data.email || l.mobile === data.mobile);
  if (!lead) {
    const nextLeadNum = db.leads.length + 1;
    lead = {
      id: `lead-${Date.now()}`,
      leadId: `HTB-${String(nextLeadNum).padStart(3, "0")}`,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      service: data.service,
      source: "Schedule Call",
      status: "REQUIREMENT DISCUSSED",
      priority: "High",
      assignedTo: "Omkar Bhoir (Admin)",
      notes: data.notes || "Booked call via website calendar",
      createdAt: now,
      updatedAt: now,
    };
    db.leads.unshift(lead);
  } else {
    lead.status = "REQUIREMENT DISCUSSED";
    lead.updatedAt = now;
  }

  const newCall: ScheduledCall = {
    id: `call-${Date.now()}`,
    callId,
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    service: data.service,
    date: data.date,
    time: data.time,
    timezone: data.timezone || "IST (GMT+5:30)",
    status: "Confirmed",
    notes: data.notes,
    assignedTo: "Omkar Bhoir (Admin)",
    leadId: lead.leadId,
    createdAt: now,
  };
  db.scheduledCalls.unshift(newCall);

  db.activities.unshift({
    id: `act-${Date.now()}`,
    leadId: lead.leadId,
    leadName: data.fullName,
    type: "Call Scheduled",
    description: `Call scheduled for ${data.date} at ${data.time} (${data.service}).`,
    actor: "System",
    date: now.split("T")[0],
    time: "Just now",
    createdAt: now,
  });

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: "Call Scheduled",
    message: `${data.fullName} scheduled a call on ${data.date} at ${data.time}.`,
    type: "call",
    read: false,
    link: "/admin/scheduled-calls",
    createdAt: now,
  });

  writeDb(db);
  return { call: newCall, lead };
}

export async function updateScheduledCallStatus(
  id: string,
  status: ScheduledCall["status"]
): Promise<ScheduledCall | null> {
  const db = readDb();
  const item = db.scheduledCalls.find((c) => c.id === id || c.callId === id);
  if (!item) return null;
  item.status = status;
  writeDb(db);
  return item;
}

/* ----------------------------------------------------
   Career Applications API Methods
---------------------------------------------------- */
export async function getCareerApplications(): Promise<CareerApplication[]> {
  const db = readDb();
  return db.careerApplications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createCareerApplication(data: {
  applicantName: string;
  email: string;
  mobile: string;
  resumeFileName: string;
  resumeFilePath: string;
  resumeSizeBytes: number;
  resumeMimeType: string;
  message: string;
}): Promise<CareerApplication> {
  const db = readDb();
  const nextAppNum = db.careerApplications.length + 1;
  const applicationId = `APP-${String(nextAppNum).padStart(3, "0")}`;
  const now = new Date().toISOString();

  const application: CareerApplication = {
    id: `app-${Date.now()}`,
    applicationId,
    ...data,
    status: "New",
    assignedTo: "HR Desk",
    appliedDate: now.split("T")[0],
    createdAt: now,
  };
  db.careerApplications.unshift(application);

  db.activities.unshift({
    id: `act-${Date.now()}`,
    leadId: applicationId,
    leadName: data.applicantName,
    type: "Career Application",
    description: `New career application from ${data.applicantName}. Resume: ${data.resumeFileName}.`,
    actor: "System",
    date: now.split("T")[0],
    time: "Just now",
    createdAt: now,
  });

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: "New Career Application",
    message: `${data.applicantName} applied with resume attached.`,
    type: "career",
    read: false,
    link: "/admin/career-applications",
    createdAt: now,
  });

  writeDb(db);
  return application;
}

export async function updateCareerApplicationStatus(
  id: string,
  status: CareerApplication["status"],
  notes?: string
): Promise<CareerApplication | null> {
  const db = readDb();
  const item = db.careerApplications.find((a) => a.id === id || a.applicationId === id);
  if (!item) return null;
  item.status = status;
  if (notes) item.notes = notes;
  writeDb(db);
  return item;
}

/* ----------------------------------------------------
   Follow-ups API Methods
---------------------------------------------------- */
export async function getFollowUps(tab?: "all" | "overdue" | "today" | "upcoming" | "completed"): Promise<FollowUp[]> {
  const db = readDb();
  const todayStr = new Date().toISOString().split("T")[0];

  let list = [...db.followUps];

  if (tab === "overdue") {
    list = list.filter((f) => f.status !== "Completed" && f.date < todayStr);
  } else if (tab === "today") {
    list = list.filter((f) => f.status !== "Completed" && f.date === todayStr);
  } else if (tab === "upcoming") {
    list = list.filter((f) => f.status !== "Completed" && f.date > todayStr);
  } else if (tab === "completed") {
    list = list.filter((f) => f.status === "Completed");
  }

  return list.sort((a, b) => new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime());
}

export async function createFollowUp(data: Omit<FollowUp, "id" | "followUpId" | "createdAt">): Promise<FollowUp> {
  const db = readDb();
  const nextNum = db.followUps.length + 1;
  const followUpId = `FLP-${String(nextNum).padStart(3, "0")}`;
  const now = new Date().toISOString();

  const newFollowUp: FollowUp = {
    ...data,
    id: `flp-${Date.now()}`,
    followUpId,
    createdAt: now,
  };
  db.followUps.unshift(newFollowUp);

  // Update lead's nextFollowUp field
  const lead = db.leads.find((l) => l.leadId === data.leadId || l.id === data.leadId);
  if (lead) {
    lead.nextFollowUp = `${data.date} ${data.time}`;
    lead.updatedAt = now;
  }

  db.activities.unshift({
    id: `act-${Date.now()}`,
    leadId: data.leadId,
    leadName: data.leadName,
    type: "Follow-up Scheduled",
    description: `Follow-up scheduled (${data.type}) for ${data.date} at ${data.time}.`,
    actor: data.assignedTo || "Admin",
    date: now.split("T")[0],
    time: "Just now",
    createdAt: now,
  });

  writeDb(db);
  return newFollowUp;
}

export async function completeFollowUp(id: string): Promise<FollowUp | null> {
  const db = readDb();
  const item = db.followUps.find((f) => f.id === id || f.followUpId === id);
  if (!item) return null;

  item.status = "Completed";
  item.completedAt = new Date().toISOString();

  db.activities.unshift({
    id: `act-${Date.now()}`,
    leadId: item.leadId,
    leadName: item.leadName,
    type: "Follow-up Completed",
    description: `Follow-up completed: ${item.notes || item.type}`,
    actor: item.assignedTo || "Admin",
    date: new Date().toISOString().split("T")[0],
    time: "Just now",
    createdAt: new Date().toISOString(),
  });

  writeDb(db);
  return item;
}

/* ----------------------------------------------------
   Activities, Notes & Notifications
---------------------------------------------------- */
export async function getActivities(limit = 20): Promise<LeadActivity[]> {
  const db = readDb();
  return db.activities.slice(0, limit);
}

export async function getLeadNotes(leadId: string): Promise<LeadNote[]> {
  const db = readDb();
  return db.notes.filter((n) => n.leadId === leadId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addLeadNote(leadId: string, note: string, actor = "Admin"): Promise<LeadNote> {
  const db = readDb();
  const newNote: LeadNote = {
    id: `note-${Date.now()}`,
    leadId,
    note,
    actor,
    createdAt: new Date().toISOString(),
  };
  db.notes.unshift(newNote);

  const lead = db.leads.find((l) => l.leadId === leadId || l.id === leadId);
  db.activities.unshift({
    id: `act-${Date.now()}`,
    leadId,
    leadName: lead?.fullName,
    type: "Note Added",
    description: `Added note: "${note.substring(0, 60)}${note.length > 60 ? "..." : ""}"`,
    actor,
    date: new Date().toISOString().split("T")[0],
    time: "Just now",
    createdAt: new Date().toISOString(),
  });

  writeDb(db);
  return newNote;
}

export async function getNotifications(): Promise<Notification[]> {
  const db = readDb();
  return db.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationRead(id: string): Promise<boolean> {
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
  const db = readDb();
  db.notifications.forEach((n) => (n.read = true));
  writeDb(db);
}

/* ----------------------------------------------------
   Team & Settings Methods
---------------------------------------------------- */
export async function getTeam(): Promise<TeamMember[]> {
  const db = readDb();
  return db.team;
}

export async function createTeamMember(data: Omit<TeamMember, "id" | "createdAt">): Promise<TeamMember> {
  const db = readDb();
  const newMember: TeamMember = {
    ...data,
    id: `team-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.team.push(newMember);
  writeDb(db);
  return newMember;
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember | null> {
  const db = readDb();
  const index = db.team.findIndex((t) => t.id === id);
  if (index === -1) return null;
  db.team[index] = { ...db.team[index], ...data };
  writeDb(db);
  return db.team[index];
}

export async function getSettings(): Promise<Settings> {
  const db = readDb();
  return db.settings;
}

export async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
  const db = readDb();
  db.settings = {
    ...db.settings,
    ...updates,
  };
  writeDb(db);
  return db.settings;
}

/* ----------------------------------------------------
   Dashboard Metrics
---------------------------------------------------- */
export async function getDashboardStats(): Promise<DashboardStats> {
  const db = readDb();
  const todayStr = new Date().toISOString().split("T")[0];

  const totalLeads = db.leads.length;
  const newLeadsToday = db.leads.filter((l) => l.createdAt.startsWith(todayStr)).length;
  const followUpsDueToday = db.followUps.filter(
    (f) => f.status !== "Completed" && f.date === todayStr
  ).length;

  const scheduledCallsUpcoming = db.scheduledCalls.filter(
    (c) => c.status === "Confirmed" || c.status === "Pending"
  ).length;

  const wonLeadsMonth = db.leads.filter((l) => l.status === "WON").length;
  const careerApplications = db.careerApplications.length;

  // Pipeline counts
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

  db.leads.forEach((lead) => {
    if (pipelineCounts[lead.status] !== undefined) {
      pipelineCounts[lead.status]++;
    }
  });

  // Follow-up counts
  const followUpCounts = {
    overdue: db.followUps.filter((f) => f.status !== "Completed" && f.date < todayStr).length,
    today: followUpsDueToday,
    upcoming: db.followUps.filter((f) => f.status !== "Completed" && f.date > todayStr).length,
    completed: db.followUps.filter((f) => f.status === "Completed").length,
  };

  // Leads by source
  const sourceMap: Record<string, number> = {};
  db.leads.forEach((l) => {
    sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
  });

  const leadsBySource = Object.entries(sourceMap).map(([src, count]) => ({
    source: src as LeadSource,
    count,
    percentage: Math.round((count / (totalLeads || 1)) * 100),
  }));

  // Most requested services
  const serviceMap: Record<string, number> = {};
  db.leads.forEach((l) => {
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
    careerApplications,
    careerApplicationsTrend: "↑ 8%",
    pipelineCounts,
    followUpCounts,
    leadsBySource,
    mostRequestedServices,
    upcomingCalls: db.scheduledCalls.filter((c) => c.status !== "Completed" && c.status !== "Cancelled").slice(0, 4),
    todayFollowUps: db.followUps.filter((f) => f.date === todayStr).slice(0, 5),
    recentLeads: db.leads.slice(0, 8),
    recentActivities: db.activities.slice(0, 7),
  };
}
