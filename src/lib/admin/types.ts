export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "REQUIREMENT DISCUSSED"
  | "QUOTATION SENT"
  | "FOLLOW-UP"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type LeadPriority = "Low" | "Medium" | "High" | "Urgent";

export type LeadSource =
  | "Website"
  | "Contact Form"
  | "Schedule Call"
  | "WhatsApp"
  | "Referral"
  | "Direct Inbound"
  | "LinkedIn"
  | "Other";

export interface Lead {
  id: string;
  leadId: string; // e.g. HTB-001
  fullName: string;
  email: string;
  mobile: string;
  service: string;
  budget?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo: string; // Admin / Sales user name
  notes?: string;
  lastContact?: string;
  nextFollowUp?: string;
  closingNote?: string;
  lostReason?: "Budget" | "Timing" | "Competitor" | "Requirement Changed" | "No Response" | "Other";
  createdAt: string;
  updatedAt: string;
}

export interface ContactEnquiry {
  id: string;
  enquiryId: string; // e.g. ENQ-001
  fullName: string;
  email: string;
  mobile: string;
  service: string;
  budget?: string;
  message: string;
  source: string;
  status: "New" | "Contacted" | "Converted" | "Archived";
  assignedTo: string;
  leadId?: string;
  createdAt: string;
}

export interface ScheduledCall {
  id: string;
  callId: string; // e.g. CALL-001
  fullName: string;
  email: string;
  mobile: string;
  service: string;
  date: string;
  time: string;
  timezone: string;
  status: "Pending" | "Confirmed" | "Completed" | "Rescheduled" | "Cancelled" | "No Show";
  notes?: string;
  assignedTo: string;
  leadId?: string;
  createdAt: string;
}

export interface CareerApplication {
  id: string;
  applicationId: string; // e.g. APP-001
  applicantName: string;
  email: string;
  mobile: string;
  resumeFileName: string;
  resumeFilePath: string;
  resumeSizeBytes: number;
  resumeMimeType: string;
  message: string;
  status: "New" | "Under Review" | "Shortlisted" | "Interview" | "Selected" | "Rejected";
  assignedTo: string;
  notes?: string;
  appliedDate: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  followUpId: string; // e.g. FLP-001
  leadId: string;
  leadName: string;
  leadMobile: string;
  date: string;
  time: string;
  type: "Call" | "WhatsApp" | "Email" | "Meeting" | "Quotation" | "Other";
  assignedTo: string;
  status: "Overdue" | "Today" | "Upcoming" | "Completed";
  notes: string;
  completedAt?: string;
  createdAt: string;
}

export interface LeadActivity {
  id: string;
  leadId?: string;
  leadName?: string;
  type:
    | "Lead Created"
    | "Contact Enquiry"
    | "Call Scheduled"
    | "Status Changed"
    | "Follow-up Scheduled"
    | "Follow-up Completed"
    | "Quotation Sent"
    | "Negotiation Started"
    | "Lead Won"
    | "Lead Lost"
    | "Note Added"
    | "Career Application"
    | "Team Action";
  description: string;
  actor: string;
  previousStatus?: string;
  newStatus?: string;
  date: string;
  time: string;
  createdAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  note: string;
  actor: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "enquiry" | "call" | "career" | "followup" | "status" | "system";
  read: boolean;
  link: string;
  createdAt: string;
}

export type AdminRole = "Super Admin" | "Admin" | "Sales" | "HR" | "Support";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  status: "Active" | "Inactive";
  phone: string;
  lastLogin?: string;
  createdAt: string;
}

export interface BookingSettings {
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  timezone: string;
  callDurationMinutes: number;
}

export interface LeadSettings {
  statuses: string[];
  sources: string[];
  priorities: string[];
  services: string[];
}

export interface NotificationSettings {
  newEnquiry: boolean;
  newCareerApplication: boolean;
  scheduledCall: boolean;
  followUpDue: boolean;
  followUpOverdue: boolean;
  leadStatusChange: boolean;
}

export interface Settings {
  companyName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  bookingSettings: BookingSettings;
  leadSettings: LeadSettings;
  notificationSettings: NotificationSettings;
}

export interface DashboardStats {
  totalLeads: number;
  totalLeadsTrend: string;
  newLeadsToday: number;
  newLeadsTrend: string;
  followUpsDueToday: number;
  followUpsTrend: string;
  scheduledCallsUpcoming: number;
  scheduledCallsTrend: string;
  wonLeadsMonth: number;
  wonLeadsTrend: string;
  careerApplications: number;
  careerApplicationsTrend: string;
  pipelineCounts: Record<LeadStatus, number>;
  followUpCounts: {
    overdue: number;
    today: number;
    upcoming: number;
    completed: number;
  };
  leadsBySource: { source: LeadSource; count: number; percentage: number }[];
  mostRequestedServices: { service: string; count: number }[];
  upcomingCalls: ScheduledCall[];
  todayFollowUps: FollowUp[];
  recentLeads: Lead[];
  recentActivities: LeadActivity[];
}
