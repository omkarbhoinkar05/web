import prisma from "@/lib/prisma";
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
  AdminRole,
} from "./types";

export const INITIAL_SETTINGS: Settings = {
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

/**
 * Seed initial administrative accounts and default settings if fresh database is empty
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    const teamCount = await prisma.teamMember.count();
    if (teamCount === 0) {
      const now = new Date().toISOString();
      await prisma.teamMember.createMany({
        data: [
          {
            id: "team-super",
            name: "Admin User",
            email: "admin@web.com",
            role: "Super Admin",
            password: "Admin@123",
            phone: "+91 99999 99999",
            status: "Active",
            createdAt: now,
          },
          {
            id: "team-2",
            name: "Siddharth Shinde",
            email: "siddharth@web.com",
            role: "Admin",
            password: "Admin@123",
            phone: "+91 98200 12345",
            status: "Active",
            createdAt: now,
          },
          {
            id: "team-3",
            name: "Anjali Dave",
            email: "anjali@web.com",
            role: "Sales",
            password: "Admin@123",
            phone: "+91 98331 12233",
            status: "Active",
            createdAt: now,
          },
          {
            id: "team-4",
            name: "Pooja Hegde",
            email: "pooja@web.com",
            role: "HR",
            password: "Admin@123",
            phone: "+91 97115 56677",
            status: "Active",
            createdAt: now,
          },
        ],
      });

      // Seed settings
      await prisma.setting.upsert({
        where: { keyName: "app_settings" },
        update: {},
        create: {
          keyName: "app_settings",
          valueJson: JSON.stringify(INITIAL_SETTINGS),
          updatedAt: now,
        },
      });
    }
  } catch (err) {
    console.error("Database seeding check:", err);
  }
}

// ----------------------------------------------------
// Lead Management
// ----------------------------------------------------

export interface LeadFilters {
  search?: string;
  status?: string;
  priority?: string;
  service?: string;
  source?: string;
  assignedTo?: string;
  sort?: string;
  limit?: number;
  skip?: number;
}

export async function getLeads(filters?: LeadFilters): Promise<Lead[]> {
  await seedDatabaseIfEmpty();

  const where: any = {};

  if (filters?.status && filters.status !== "All") {
    where.status = filters.status;
  }
  if (filters?.priority && filters.priority !== "All") {
    where.priority = filters.priority;
  }
  if (filters?.service && filters.service !== "All") {
    where.service = filters.service;
  }
  if (filters?.source && filters.source !== "All") {
    where.source = filters.source;
  }
  if (filters?.assignedTo && filters.assignedTo !== "All") {
    where.assignedTo = filters.assignedTo;
  }
  if (filters?.search) {
    const q = filters.search.trim();
    where.OR = [
      { fullName: { contains: q } },
      { email: { contains: q } },
      { mobile: { contains: q } },
      { leadId: { contains: q } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: filters?.limit,
    skip: filters?.skip,
  });

  return leads.map((l) => ({
    id: l.id,
    leadId: l.leadId,
    fullName: l.fullName,
    email: l.email,
    mobile: l.mobile,
    service: l.service,
    budget: l.budget || undefined,
    source: l.source as LeadSource,
    status: l.status as LeadStatus,
    priority: l.priority as any,
    assignedTo: l.assignedTo,
    notes: l.notes || undefined,
    lastContact: l.lastContact || undefined,
    nextFollowUp: l.nextFollowUp || undefined,
    closingNote: l.closingNote || undefined,
    lostReason: l.lostReason as any,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  }));
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const lead = await prisma.lead.findFirst({
    where: {
      OR: [{ id }, { leadId: id }],
    },
  });

  if (!lead) return null;

  return {
    id: lead.id,
    leadId: lead.leadId,
    fullName: lead.fullName,
    email: lead.email,
    mobile: lead.mobile,
    service: lead.service,
    budget: lead.budget || undefined,
    source: lead.source as LeadSource,
    status: lead.status as LeadStatus,
    priority: lead.priority as any,
    assignedTo: lead.assignedTo,
    notes: lead.notes || undefined,
    lastContact: lead.lastContact || undefined,
    nextFollowUp: lead.nextFollowUp || undefined,
    closingNote: lead.closingNote || undefined,
    lostReason: lead.lostReason as any,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}

export async function createLead(
  data: Omit<Lead, "id" | "leadId" | "createdAt" | "updatedAt">
): Promise<Lead> {
  const now = new Date().toISOString();
  const id = `lead-${Date.now()}`;

  const totalLeads = await prisma.lead.count();
  const leadId = `WEB-${String(totalLeads + 1).padStart(3, "0")}`;

  const created = await prisma.lead.create({
    data: {
      id,
      leadId,
      fullName: data.fullName,
      email: data.email || "",
      mobile: data.mobile,
      service: data.service,
      budget: data.budget || null,
      source: data.source,
      status: data.status,
      priority: data.priority,
      assignedTo: data.assignedTo || "Unassigned",
      notes: data.notes || null,
      lastContact: data.lastContact || null,
      nextFollowUp: data.nextFollowUp || null,
      closingNote: data.closingNote || null,
      lostReason: data.lostReason || null,
      createdAt: now,
      updatedAt: now,
    },
  });

  // Record Lead Created Activity
  await prisma.leadActivity.create({
    data: {
      id: `act-${Date.now()}`,
      leadId,
      leadName: data.fullName,
      type: "Lead Created",
      description: `New lead created for ${data.service} via ${data.source}.`,
      actor: data.assignedTo || "System",
      date: now.split("T")[0],
      time: "Just now",
      createdAt: now,
    },
  });

  return {
    ...data,
    id: created.id,
    leadId: created.leadId,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  };
}

export async function updateLead(
  id: string,
  updates: Partial<Lead>,
  actor = "Admin"
): Promise<Lead | null> {
  const existing = await getLeadById(id);
  if (!existing) return null;

  const now = new Date().toISOString();

  const updated = await prisma.lead.update({
    where: { id: existing.id },
    data: {
      fullName: updates.fullName,
      email: updates.email,
      mobile: updates.mobile,
      service: updates.service,
      budget: updates.budget,
      source: updates.source,
      status: updates.status,
      priority: updates.priority,
      assignedTo: updates.assignedTo,
      notes: updates.notes,
      lastContact: updates.lastContact,
      nextFollowUp: updates.nextFollowUp,
      closingNote: updates.closingNote,
      lostReason: updates.lostReason,
      updatedAt: now,
    },
  });

  // If status changed, record activity
  if (updates.status && updates.status !== existing.status) {
    await prisma.leadActivity.create({
      data: {
        id: `act-${Date.now()}`,
        leadId: existing.leadId,
        leadName: existing.fullName,
        type: "Status Changed",
        description: `Status updated: ${existing.status} → ${updates.status}`,
        actor,
        previousStatus: existing.status,
        newStatus: updates.status,
        date: now.split("T")[0],
        time: "Just now",
        createdAt: now,
      },
    });
  }

  return {
    ...existing,
    ...updates,
    updatedAt: now,
  };
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    const existing = await getLeadById(id);
    if (!existing) return false;

    await prisma.lead.delete({
      where: { id: existing.id },
    });
    return true;
  } catch (err) {
    console.error("deleteLead error:", err);
    return false;
  }
}

// ----------------------------------------------------
// Contact Enquiries
// ----------------------------------------------------

export async function getContactEnquiries(): Promise<ContactEnquiry[]> {
  const enquiries = await prisma.contactEnquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return enquiries.map((e) => ({
    id: e.id,
    enquiryId: e.enquiryId,
    fullName: e.fullName,
    email: e.email,
    mobile: e.mobile,
    service: e.service,
    budget: e.budget || undefined,
    message: e.message,
    source: e.source,
    status: e.status as any,
    assignedTo: e.assignedTo,
    leadId: e.leadId || undefined,
    createdAt: e.createdAt,
  }));
}

export async function createContactEnquiry(
  data: Omit<ContactEnquiry, "id" | "enquiryId" | "createdAt" | "status" | "assignedTo">
): Promise<ContactEnquiry & { enquiry: ContactEnquiry; lead: Lead }> {
  // 1. Create corresponding CRM Lead
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
  const totalEnquiries = await prisma.contactEnquiry.count();
  const enquiryId = `ENQ-${String(totalEnquiries + 1).padStart(3, "0")}`;

  const enquiry = await prisma.contactEnquiry.create({
    data: {
      id,
      enquiryId,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      service: data.service,
      budget: data.budget || null,
      message: data.message,
      source: data.source || "Website Contact Form",
      status: "New",
      assignedTo: "Unassigned",
      leadId: lead.id,
      createdAt: now,
    },
  });

  // Notification for Admin
  await prisma.notification.create({
    data: {
      id: `notif-${Date.now()}`,
      title: "New Contact Enquiry",
      message: `${data.fullName} submitted an enquiry for ${data.service}.`,
      type: "enquiry",
      isRead: false,
      link: "/admin/contact-enquiries",
      createdAt: now,
    },
  });

  const resEnquiry: ContactEnquiry = {
    ...data,
    id: enquiry.id,
    enquiryId: enquiry.enquiryId,
    status: "New",
    assignedTo: "Unassigned",
    leadId: lead.id,
    createdAt: enquiry.createdAt,
  };

  return Object.assign(resEnquiry, { enquiry: resEnquiry, lead });
}

export async function updateContactEnquiryStatus(
  id: string,
  status: "New" | "Contacted" | "Converted" | "Archived",
  assignedTo?: string
): Promise<ContactEnquiry | null> {
  const existing = await prisma.contactEnquiry.findFirst({
    where: { OR: [{ id }, { enquiryId: id }] },
  });

  if (!existing) return null;

  const updated = await prisma.contactEnquiry.update({
    where: { id: existing.id },
    data: {
      status,
      assignedTo: assignedTo || existing.assignedTo,
    },
  });

  return {
    id: updated.id,
    enquiryId: updated.enquiryId,
    fullName: updated.fullName,
    email: updated.email,
    mobile: updated.mobile,
    service: updated.service,
    budget: updated.budget || undefined,
    message: updated.message,
    source: updated.source,
    status: updated.status as any,
    assignedTo: updated.assignedTo,
    leadId: updated.leadId || undefined,
    createdAt: updated.createdAt,
  };
}

export const updateEnquiryStatus = updateContactEnquiryStatus;

// ----------------------------------------------------
// Scheduled Calls
// ----------------------------------------------------

export async function getScheduledCalls(): Promise<ScheduledCall[]> {
  const calls = await prisma.scheduledCall.findMany({
    orderBy: { createdAt: "desc" },
  });

  return calls.map((c) => ({
    id: c.id,
    callId: c.callId,
    fullName: c.fullName,
    email: c.email,
    mobile: c.mobile,
    service: c.service,
    date: c.date,
    time: c.time,
    timezone: c.timezone,
    status: c.status as any,
    notes: c.notes || undefined,
    assignedTo: c.assignedTo,
    leadId: c.leadId || undefined,
    createdAt: c.createdAt,
  }));
}

export async function createScheduledCall(
  data: Omit<ScheduledCall, "id" | "callId" | "createdAt" | "status" | "assignedTo">
): Promise<ScheduledCall & { call: ScheduledCall; lead: Lead }> {
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
  const totalCalls = await prisma.scheduledCall.count();
  const callId = `CALL-${String(totalCalls + 1).padStart(3, "0")}`;

  const call = await prisma.scheduledCall.create({
    data: {
      id,
      callId,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      service: data.service,
      date: data.date,
      time: data.time,
      timezone: data.timezone,
      status: "Pending",
      notes: data.notes || null,
      assignedTo: "Unassigned",
      leadId: lead.id,
      createdAt: now,
    },
  });

  await prisma.notification.create({
    data: {
      id: `notif-${Date.now()}`,
      title: "New Call Booked",
      message: `Consultation booked by ${data.fullName} for ${data.date} at ${data.time}.`,
      type: "call",
      isRead: false,
      link: "/admin/scheduled-calls",
      createdAt: now,
    },
  });

  const resCall: ScheduledCall = {
    ...data,
    id: call.id,
    callId: call.callId,
    status: "Pending",
    assignedTo: "Unassigned",
    leadId: lead.id,
    createdAt: call.createdAt,
  };

  return Object.assign(resCall, { call: resCall, lead });
}

export async function updateScheduledCallStatus(
  id: string,
  status: "Pending" | "Confirmed" | "Completed" | "Rescheduled" | "Cancelled" | "No Show",
  notes?: string,
  assignedTo?: string
): Promise<ScheduledCall | null> {
  const existing = await prisma.scheduledCall.findFirst({
    where: { OR: [{ id }, { callId: id }] },
  });

  if (!existing) return null;

  const updated = await prisma.scheduledCall.update({
    where: { id: existing.id },
    data: {
      status,
      notes: notes !== undefined ? notes : existing.notes,
      assignedTo: assignedTo || existing.assignedTo,
    },
  });

  return {
    id: updated.id,
    callId: updated.callId,
    fullName: updated.fullName,
    email: updated.email,
    mobile: updated.mobile,
    service: updated.service,
    date: updated.date,
    time: updated.time,
    timezone: updated.timezone,
    status: updated.status as any,
    notes: updated.notes || undefined,
    assignedTo: updated.assignedTo,
    leadId: updated.leadId || undefined,
    createdAt: updated.createdAt,
  };
}

// ----------------------------------------------------
// Career Applications
// ----------------------------------------------------

export async function getCareerApplications(): Promise<CareerApplication[]> {
  const apps = await prisma.careerApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return apps.map((a) => ({
    id: a.id,
    applicationId: a.applicationId,
    applicantName: a.applicantName,
    email: a.email,
    mobile: a.mobile,
    resumeFileName: a.resumeFileName,
    resumeFilePath: a.resumeFilePath,
    resumeSizeBytes: a.resumeSizeBytes,
    resumeMimeType: a.resumeMimeType,
    message: a.message,
    status: a.status as any,
    assignedTo: a.assignedTo,
    notes: a.notes || undefined,
    appliedDate: a.appliedDate,
    createdAt: a.createdAt,
  }));
}

export async function createCareerApplication(
  data: Omit<CareerApplication, "id" | "applicationId" | "createdAt" | "status" | "assignedTo" | "appliedDate">
): Promise<CareerApplication> {
  const now = new Date().toISOString();
  const id = `app-${Date.now()}`;
  const totalApps = await prisma.careerApplication.count();
  const applicationId = `APP-${String(totalApps + 1).padStart(3, "0")}`;

  const app = await prisma.careerApplication.create({
    data: {
      id,
      applicationId,
      applicantName: data.applicantName,
      email: data.email,
      mobile: data.mobile,
      resumeFileName: data.resumeFileName,
      resumeFilePath: data.resumeFilePath,
      resumeSizeBytes: data.resumeSizeBytes,
      resumeMimeType: data.resumeMimeType,
      message: data.message,
      status: "New",
      assignedTo: "HR Team",
      notes: null,
      appliedDate: now.split("T")[0],
      createdAt: now,
    },
  });

  await prisma.notification.create({
    data: {
      id: `notif-${Date.now()}`,
      title: "New Career Application",
      message: `${data.applicantName} submitted their resume application.`,
      type: "career",
      isRead: false,
      link: "/admin/career-applications",
      createdAt: now,
    },
  });

  return {
    ...data,
    id: app.id,
    applicationId: app.applicationId,
    status: "New",
    assignedTo: "HR Team",
    appliedDate: app.appliedDate,
    createdAt: app.createdAt,
  };
}

export async function updateCareerApplicationStatus(
  id: string,
  status: "New" | "Under Review" | "Shortlisted" | "Interview" | "Selected" | "Rejected",
  notes?: string,
  assignedTo?: string
): Promise<CareerApplication | null> {
  const existing = await prisma.careerApplication.findFirst({
    where: { OR: [{ id }, { applicationId: id }] },
  });

  if (!existing) return null;

  const updated = await prisma.careerApplication.update({
    where: { id: existing.id },
    data: {
      status,
      notes: notes !== undefined ? notes : existing.notes,
      assignedTo: assignedTo || existing.assignedTo,
    },
  });

  return {
    id: updated.id,
    applicationId: updated.applicationId,
    applicantName: updated.applicantName,
    email: updated.email,
    mobile: updated.mobile,
    resumeFileName: updated.resumeFileName,
    resumeFilePath: updated.resumeFilePath,
    resumeSizeBytes: updated.resumeSizeBytes,
    resumeMimeType: updated.resumeMimeType,
    message: updated.message,
    status: updated.status as any,
    assignedTo: updated.assignedTo,
    notes: updated.notes || undefined,
    appliedDate: updated.appliedDate,
    createdAt: updated.createdAt,
  };
}

// ----------------------------------------------------
// Follow-ups
// ----------------------------------------------------

export async function getFollowUps(
  tab?: "all" | "overdue" | "today" | "upcoming" | "completed"
): Promise<FollowUp[]> {
  const todayStr = new Date().toISOString().split("T")[0];
  const where: any = {};

  if (tab === "overdue") {
    where.status = { not: "Completed" };
    where.date = { lt: todayStr };
  } else if (tab === "today") {
    where.date = todayStr;
    where.status = { not: "Completed" };
  } else if (tab === "upcoming") {
    where.status = { not: "Completed" };
    where.date = { gt: todayStr };
  } else if (tab === "completed") {
    where.status = "Completed";
  }

  const followUps = await prisma.followUp.findMany({
    where,
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  return followUps.map((f) => ({
    id: f.id,
    followUpId: f.followUpId,
    leadId: f.leadId,
    leadName: f.leadName,
    leadMobile: f.leadMobile,
    date: f.date,
    time: f.time,
    type: f.type as any,
    assignedTo: f.assignedTo,
    status: f.status as any,
    notes: f.notes,
    completedAt: f.completedAt || undefined,
    createdAt: f.createdAt,
  }));
}

export async function createFollowUp(
  data: Omit<FollowUp, "id" | "followUpId" | "createdAt">
): Promise<FollowUp> {
  const now = new Date().toISOString();
  const id = `flp-${Date.now()}`;
  const total = await prisma.followUp.count();
  const followUpId = `FLP-${String(total + 1).padStart(3, "0")}`;

  // Resolve canonical leadId in case database ID (lead-xxx) was passed
  const lead = await prisma.lead.findFirst({
    where: {
      OR: [{ leadId: data.leadId }, { id: data.leadId }],
    },
  });

  const canonicalLeadId = lead ? lead.leadId : data.leadId;
  const leadName = lead ? lead.fullName : data.leadName;
  const leadMobile = lead ? lead.mobile : data.leadMobile;

  const created = await prisma.followUp.create({
    data: {
      id,
      followUpId,
      leadId: canonicalLeadId,
      leadName,
      leadMobile,
      date: data.date,
      time: data.time || "10:00 AM",
      type: data.type || "Call",
      assignedTo: data.assignedTo || "Unassigned",
      status: data.status || "Upcoming",
      notes: data.notes,
      createdAt: now,
    },
  });

  // Automatically update lead's nextFollowUp field
  if (lead) {
    await prisma.lead
      .update({
        where: { leadId: canonicalLeadId },
        data: {
          nextFollowUp: `${data.date} (${data.time || "10:00 AM"})`,
          updatedAt: now,
        },
      })
      .catch(() => null);
  }

  await prisma.leadActivity.create({
    data: {
      id: `act-${Date.now()}`,
      leadId: canonicalLeadId,
      leadName,
      type: "Follow-up Scheduled",
      description: `${data.type} touchpoint scheduled for ${data.date} at ${data.time || "10:00 AM"}. Goal: ${data.notes}`,
      actor: data.assignedTo || "Admin",
      date: now.split("T")[0],
      time: "Just now",
      createdAt: now,
    },
  });

  return {
    ...data,
    leadId: canonicalLeadId,
    leadName,
    leadMobile,
    id: created.id,
    followUpId: created.followUpId,
    createdAt: created.createdAt,
  };
}

export async function completeFollowUp(id: string, notes?: string): Promise<FollowUp | null> {
  const existing = await prisma.followUp.findFirst({
    where: { OR: [{ id }, { followUpId: id }] },
  });

  if (!existing) return null;

  const now = new Date().toISOString();

  const updated = await prisma.followUp.update({
    where: { id: existing.id },
    data: {
      status: "Completed",
      completedAt: now,
      notes: notes ? `${existing.notes}\n[Completed Note]: ${notes}` : existing.notes,
    },
  });

  // Check if there is another upcoming follow-up for this lead
  const nextUpcoming = await prisma.followUp.findFirst({
    where: {
      leadId: existing.leadId,
      status: "Upcoming",
      id: { not: existing.id },
    },
    orderBy: { date: "asc" },
  });

  await prisma.lead
    .update({
      where: { leadId: existing.leadId },
      data: {
        nextFollowUp: nextUpcoming ? `${nextUpcoming.date} (${nextUpcoming.time})` : null,
        lastContact: now.split("T")[0],
        updatedAt: now,
      },
    })
    .catch(() => null);

  await prisma.leadActivity.create({
    data: {
      id: `act-${Date.now()}`,
      leadId: existing.leadId,
      leadName: existing.leadName,
      type: "Follow-up Completed",
      description: `Follow-up marked as completed. ${notes || ""}`,
      actor: existing.assignedTo || "Admin",
      date: now.split("T")[0],
      time: "Just now",
      createdAt: now,
    },
  });

  return {
    id: updated.id,
    followUpId: updated.followUpId,
    leadId: updated.leadId,
    leadName: updated.leadName,
    leadMobile: updated.leadMobile,
    date: updated.date,
    time: updated.time,
    type: updated.type as any,
    assignedTo: updated.assignedTo,
    status: updated.status as any,
    notes: updated.notes,
    completedAt: updated.completedAt || undefined,
    createdAt: updated.createdAt,
  };
}

// ----------------------------------------------------
// Activities & Notes
// ----------------------------------------------------

export async function getActivities(limit = 20, leadId?: string): Promise<LeadActivity[]> {
  const activities = await prisma.leadActivity.findMany({
    where: leadId ? { leadId } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return activities.map((a) => ({
    id: a.id,
    leadId: a.leadId || undefined,
    leadName: a.leadName || undefined,
    type: a.type as any,
    description: a.description,
    actor: a.actor,
    previousStatus: a.previousStatus || undefined,
    newStatus: a.newStatus || undefined,
    date: a.date,
    time: a.time,
    createdAt: a.createdAt,
  }));
}

export async function getLeadNotes(leadId: string): Promise<LeadNote[]> {
  const notes = await prisma.leadNote.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });

  return notes.map((n) => ({
    id: n.id,
    leadId: n.leadId,
    category: n.category || "General Update",
    status: n.status || undefined,
    note: n.note,
    actor: n.actor,
    createdAt: n.createdAt,
  }));
}

export async function addLeadNote(
  leadId: string,
  note: string,
  actor = "Admin",
  category = "General Update",
  status?: string
): Promise<LeadNote> {
  const now = new Date().toISOString();
  const id = `note-${Date.now()}`;

  const created = await prisma.leadNote.create({
    data: {
      id,
      leadId,
      category,
      status: status || null,
      note,
      actor,
      createdAt: now,
    },
  });

  // Update lead's notes summary, updatedAt, and optional status
  await prisma.lead
    .update({
      where: { leadId },
      data: {
        notes: note,
        updatedAt: now,
        ...(status ? { status } : {}),
      },
    })
    .catch(() => null);

  await prisma.leadActivity.create({
    data: {
      id: `act-${Date.now()}`,
      leadId,
      type: `${category} Logged`,
      description: `[${category}] ${note.length > 80 ? note.slice(0, 80) + "..." : note}`,
      actor,
      date: now.split("T")[0],
      time: "Just now",
      createdAt: now,
    },
  });

  return {
    id: created.id,
    leadId: created.leadId,
    category: created.category,
    status: created.status || undefined,
    note: created.note,
    actor: created.actor,
    createdAt: created.createdAt,
  };
}

// ----------------------------------------------------
// Notifications
// ----------------------------------------------------

export async function getNotifications(): Promise<Notification[]> {
  const notifs = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return notifs.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type as any,
    read: n.isRead,
    link: n.link,
    createdAt: n.createdAt,
  }));
}

export async function markNotificationRead(id: string): Promise<boolean> {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return true;
  } catch {
    return false;
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  await prisma.notification.updateMany({
    data: { isRead: true },
  });
}

// ----------------------------------------------------
// Team Management
// ----------------------------------------------------

export async function getTeam(): Promise<TeamMember[]> {
  await seedDatabaseIfEmpty();

  const members = await prisma.teamMember.findMany({
    orderBy: { createdAt: "asc" },
  });

  return members.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role as AdminRole,
    password: m.password,
    avatar: m.avatar || undefined,
    status: m.status as any,
    phone: m.phone,
    lastLogin: m.lastLogin || undefined,
    createdAt: m.createdAt,
  }));
}

export async function createTeamMember(
  data: Omit<TeamMember, "id" | "createdAt">
): Promise<TeamMember> {
  const now = new Date().toISOString();
  const id = `team-${Date.now()}`;

  const created = await prisma.teamMember.create({
    data: {
      id,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      role: data.role,
      password: data.password || "Admin@123",
      avatar: data.avatar || null,
      status: data.status || "Active",
      phone: data.phone,
      createdAt: now,
    },
  });

  return {
    id: created.id,
    name: created.name,
    email: created.email,
    role: created.role as AdminRole,
    status: created.status as any,
    phone: created.phone,
    avatar: created.avatar || undefined,
    createdAt: created.createdAt,
  };
}

export async function updateTeamMember(
  id: string,
  data: Partial<TeamMember>
): Promise<TeamMember | null> {
  try {
    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email ? data.email.toLowerCase().trim() : undefined,
        role: data.role,
        phone: data.phone,
        status: data.status,
        password: data.password,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role as AdminRole,
      status: updated.status as any,
      phone: updated.phone,
      avatar: updated.avatar || undefined,
      lastLogin: updated.lastLogin || undefined,
      createdAt: updated.createdAt,
    };
  } catch {
    return null;
  }
}

export async function getUserPassword(email: string): Promise<string> {
  const member = await prisma.teamMember.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (member) return member.password;
  if (email.toLowerCase().trim() === "admin@web.com") return "Admin@123";
  return "";
}

export async function updateUserPassword(email: string, newPass: string): Promise<boolean> {
  try {
    await prisma.teamMember.update({
      where: { email: email.toLowerCase().trim() },
      data: { password: newPass },
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  try {
    await prisma.teamMember.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// Password Reset OTP Flow
// ----------------------------------------------------

export async function createPasswordReset(
  email: string
): Promise<{ otp: string; token: string; expiresAt: string } | null> {
  const user = await prisma.teamMember.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) return null;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const token = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
  const now = new Date().toISOString();

  await prisma.passwordReset.create({
    data: {
      id: `pr-${Date.now()}`,
      email: email.toLowerCase().trim(),
      otp,
      token,
      expiresAt,
      createdAt: now,
    },
  });

  return { otp, token, expiresAt };
}

export async function resetPasswordWithOtp(
  email: string,
  otp: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();

  const reset = await prisma.passwordReset.findFirst({
    where: {
      email: normalizedEmail,
      otp,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!reset) {
    return { success: false, error: "Invalid or expired verification code." };
  }

  const updated = await updateUserPassword(normalizedEmail, newPass);
  if (updated) {
    await prisma.passwordReset.deleteMany({
      where: { email: normalizedEmail },
    });
    return { success: true };
  }

  return { success: false, error: "Failed to update account password." };
}

// ----------------------------------------------------
// Settings Management
// ----------------------------------------------------

export async function getSettings(): Promise<Settings> {
  await seedDatabaseIfEmpty();

  const setting = await prisma.setting.findUnique({
    where: { keyName: "app_settings" },
  });

  if (setting) {
    try {
      return JSON.parse(setting.valueJson);
    } catch {}
  }

  return INITIAL_SETTINGS;
}

export async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const merged = { ...current, ...updates };
  const now = new Date().toISOString();

  await prisma.setting.upsert({
    where: { keyName: "app_settings" },
    update: {
      valueJson: JSON.stringify(merged),
      updatedAt: now,
    },
    create: {
      keyName: "app_settings",
      valueJson: JSON.stringify(merged),
      updatedAt: now,
    },
  });

  return merged;
}

// ----------------------------------------------------
// High-Performance Dashboard Aggregations
// ----------------------------------------------------

export async function getDashboardStats(): Promise<DashboardStats> {
  await seedDatabaseIfEmpty();

  const todayStr = new Date().toISOString().split("T")[0];

  // Run optimized aggregation queries in parallel
  const [
    totalLeads,
    newLeadsToday,
    followUpsDueToday,
    scheduledCallsUpcoming,
    wonLeadsMonth,
    careerCount,
    statusGroups,
    followUpList,
    leadsBySourceGroup,
    serviceGroup,
    upcomingCalls,
    todayFollowUps,
    recentLeads,
    recentActivities,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { startsWith: todayStr } } }),
    prisma.followUp.count({ where: { date: todayStr, status: { not: "Completed" } } }),
    prisma.scheduledCall.count({
      where: { status: { in: ["Confirmed", "Pending"] } },
    }),
    prisma.lead.count({ where: { status: "WON" } }),
    prisma.careerApplication.count(),
    prisma.lead.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.followUp.findMany({
      select: { date: true, status: true },
    }),
    prisma.lead.groupBy({ by: ["source"], _count: { source: true } }),
    prisma.lead.groupBy({ by: ["service"], _count: { service: true } }),
    prisma.scheduledCall.findMany({
      where: { status: { notIn: ["Completed", "Cancelled"] } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.followUp.findMany({
      where: { date: todayStr },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.leadActivity.findMany({
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
  ]);

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

  statusGroups.forEach((g) => {
    if (pipelineCounts[g.status as LeadStatus] !== undefined) {
      pipelineCounts[g.status as LeadStatus] = g._count.status;
    }
  });

  const followUpCounts = {
    overdue: followUpList.filter((f) => f.status !== "Completed" && f.date < todayStr).length,
    today: followUpsDueToday,
    upcoming: followUpList.filter((f) => f.status !== "Completed" && f.date > todayStr).length,
    completed: followUpList.filter((f) => f.status === "Completed").length,
  };

  const leadsBySource = leadsBySourceGroup.map((g) => ({
    source: g.source as LeadSource,
    count: g._count.source,
    percentage: Math.round((g._count.source / (totalLeads || 1)) * 100),
  }));

  const mostRequestedServices = serviceGroup
    .map((g) => ({ service: g.service, count: g._count.service }))
    .sort((a, b) => b.count - a.count);

  return {
    totalLeads,
    totalLeadsTrend: "Real-time",
    newLeadsToday,
    newLeadsTrend: "Today",
    followUpsDueToday,
    followUpsTrend: "Due",
    scheduledCallsUpcoming,
    scheduledCallsTrend: "Upcoming",
    wonLeadsMonth,
    wonLeadsTrend: "Won",
    careerApplications: careerCount,
    careerApplicationsTrend: "Total",
    pipelineCounts,
    followUpCounts,
    leadsBySource,
    mostRequestedServices,
    upcomingCalls: upcomingCalls.map((c) => ({
      id: c.id,
      callId: c.callId,
      fullName: c.fullName,
      email: c.email,
      mobile: c.mobile,
      service: c.service,
      date: c.date,
      time: c.time,
      timezone: c.timezone,
      status: c.status as any,
      notes: c.notes || undefined,
      assignedTo: c.assignedTo,
      leadId: c.leadId || undefined,
      createdAt: c.createdAt,
    })),
    todayFollowUps: todayFollowUps.map((f) => ({
      id: f.id,
      followUpId: f.followUpId,
      leadId: f.leadId,
      leadName: f.leadName,
      leadMobile: f.leadMobile,
      date: f.date,
      time: f.time,
      type: f.type as any,
      assignedTo: f.assignedTo,
      status: f.status as any,
      notes: f.notes,
      completedAt: f.completedAt || undefined,
      createdAt: f.createdAt,
    })),
    recentLeads: recentLeads.map((l) => ({
      id: l.id,
      leadId: l.leadId,
      fullName: l.fullName,
      email: l.email,
      mobile: l.mobile,
      service: l.service,
      budget: l.budget || undefined,
      source: l.source as LeadSource,
      status: l.status as LeadStatus,
      priority: l.priority as any,
      assignedTo: l.assignedTo,
      notes: l.notes || undefined,
      lastContact: l.lastContact || undefined,
      nextFollowUp: l.nextFollowUp || undefined,
      closingNote: l.closingNote || undefined,
      lostReason: l.lostReason as any,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    })),
    recentActivities: recentActivities.map((a) => ({
      id: a.id,
      leadId: a.leadId || undefined,
      leadName: a.leadName || undefined,
      type: a.type as any,
      description: a.description,
      actor: a.actor,
      previousStatus: a.previousStatus || undefined,
      newStatus: a.newStatus || undefined,
      date: a.date,
      time: a.time,
      createdAt: a.createdAt,
    })),
  };
}
