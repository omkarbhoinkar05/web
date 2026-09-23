import { z } from "zod";

export const indianMobileRegex = /^(?:\+91|91)?[6-9]\d{9}$/;

/**
 * Strips HTML tags, script blocks, and dangerous attributes to prevent Stored XSS
 */
export function sanitizeText(val: string): string {
  if (!val || typeof val !== "string") return val;
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

// ----------------------------------------------------
// Public Forms Validation Schemas
// ----------------------------------------------------

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .transform(sanitizeText)
    .refine((v) => v.length >= 2, { message: "Full name is required (minimum 2 characters)" })
    .refine((v) => v.length <= 100, { message: "Full name must be under 100 characters" }),
  service: z
    .string()
    .trim()
    .transform(sanitizeText)
    .refine((v) => v.length >= 1, { message: "Please select a service" }),
  email: z.string().trim().email("Please enter a valid email address"),
  mobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => indianMobileRegex.test(v), {
      message: "Please enter a valid 10-digit mobile number",
    }),
  budget: z.string().trim().transform(sanitizeText).optional().default("Not specified"),
  message: z
    .string()
    .trim()
    .transform(sanitizeText)
    .refine((v) => v.length >= 10, { message: "Message must be at least 10 characters describing your inquiry" })
    .refine((v) => v.length <= 3000, { message: "Message cannot exceed 3000 characters" }),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const scheduleCallSchema = z.object({
  fullName: z
    .string()
    .trim()
    .transform(sanitizeText)
    .refine((v) => v.length >= 2, { message: "Full name is required (minimum 2 characters)" })
    .refine((v) => v.length <= 100, { message: "Full name must be under 100 characters" }),
  email: z.string().trim().email("Please enter a valid email address"),
  mobileNumber: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => indianMobileRegex.test(v), {
      message: "Please enter a valid 10-digit mobile number",
    }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid date (YYYY-MM-DD)")
    .refine(
      (d) => {
        const selected = new Date(d + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
      },
      { message: "Scheduled date cannot be in the past" }
    ),
  time: z.string().trim().min(1, "Please select a time slot"),
  timezone: z.string().trim().transform(sanitizeText).default("IST (GMT+5:30)"),
  meetingType: z.string().trim().transform(sanitizeText).default("Video Call (Google Meet)"),
  message: z.string().trim().transform(sanitizeText).optional(),
});

export type ScheduleCallInput = z.infer<typeof scheduleCallSchema>;

export const careerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .transform(sanitizeText)
    .refine((v) => v.length >= 2, { message: "Full name is required (minimum 2 characters)" })
    .refine((v) => v.length <= 100, { message: "Full name must be under 100 characters" }),
  email: z.string().trim().email("Please enter a valid email address"),
  mobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => indianMobileRegex.test(v), {
      message: "Please enter a valid 10-digit mobile number",
    }),
  message: z
    .string()
    .trim()
    .transform(sanitizeText)
    .refine((v) => v.length >= 10, { message: "Please enter at least 10 characters introducing yourself" })
    .refine((v) => v.length <= 3000, { message: "Message cannot exceed 3000 characters" }),
});

export type CareerInput = z.infer<typeof careerSchema>;

// ----------------------------------------------------
// Admin CRM Validation Schemas
// ----------------------------------------------------

export const leadStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "REQUIREMENT DISCUSSED",
  "QUOTATION SENT",
  "FOLLOW-UP",
  "NEGOTIATION",
  "WON",
  "LOST",
]);

export const leadPriorityEnum = z.enum(["Low", "Medium", "High", "Urgent"]);

export const leadSourceEnum = z.enum([
  "Website",
  "Contact Form",
  "Schedule Call",
  "WhatsApp",
  "Referral",
  "Direct Inbound",
  "LinkedIn",
  "Other",
]);

export const adminRoleEnum = z.enum([
  "Super Admin",
  "Admin",
  "Sales",
  "HR",
  "Support",
]);

export const leadCreateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .transform(sanitizeText)
    .refine((v) => v.length >= 2, { message: "Name is required (minimum 2 characters)" }),
  email: z.string().trim().email("Invalid email").or(z.literal("")).default(""),
  mobile: z.string().trim().min(10, "Mobile must be at least 10 digits"),
  service: z
    .string()
    .trim()
    .transform(sanitizeText)
    .refine((v) => v.length >= 1, { message: "Service is required" }),
  budget: z.string().trim().transform(sanitizeText).optional().default("Not specified"),
  source: leadSourceEnum.default("Direct Inbound"),
  status: leadStatusEnum.default("NEW"),
  priority: leadPriorityEnum.default("Medium"),
  assignedTo: z.string().trim().default("Unassigned"),
  notes: z.string().trim().transform(sanitizeText).optional().default(""),
  nextFollowUp: z.string().trim().optional(),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

export const leadUpdateSchema = z.object({
  fullName: z.string().trim().transform(sanitizeText).optional(),
  email: z.string().trim().email().or(z.literal("")).optional(),
  mobile: z.string().trim().min(10).optional(),
  service: z.string().trim().transform(sanitizeText).optional(),
  budget: z.string().trim().transform(sanitizeText).optional(),
  source: leadSourceEnum.optional(),
  status: leadStatusEnum.optional(),
  priority: leadPriorityEnum.optional(),
  assignedTo: z.string().trim().optional(),
  notes: z.string().trim().transform(sanitizeText).optional(),
  lastContact: z.string().trim().optional(),
  nextFollowUp: z.string().trim().optional(),
  closingNote: z.string().trim().transform(sanitizeText).optional(),
  lostReason: z
    .enum([
      "Budget",
      "Timing",
      "Competitor",
      "Requirement Changed",
      "No Response",
      "Other",
    ])
    .optional(),
});

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

export const followUpSchema = z.object({
  leadId: z.string().trim().min(1, "Lead ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Valid date required (YYYY-MM-DD)"),
  time: z.string().trim().default("10:00 AM"),
  type: z.enum(["Call", "WhatsApp", "Email", "Meeting", "Quotation", "Other"]).default("Call"),
  assignedTo: z.string().trim().default("Unassigned"),
  status: z.enum(["Overdue", "Today", "Upcoming", "Completed"]).default("Upcoming"),
  notes: z
    .string()
    .trim()
    .transform(sanitizeText)
    .refine((v) => v.length >= 1, { message: "Follow-up note is required" })
    .default("Follow-up touchpoint"),
});

export type FollowUpInput = z.infer<typeof followUpSchema>;

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Valid email required"),
  role: adminRoleEnum,
  phone: z.string().trim().min(10, "Phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters").default("Admin@123"),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

// ----------------------------------------------------
// Authentication Schemas
// ----------------------------------------------------

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  otp: z.string().trim().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters").optional(),
  excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().trim().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().trim().optional().nullable(),
  category: z.string().trim().min(1, "Category is required").default("Engineering"),
  readTime: z.string().trim().default("5 min read"),
  author: z.string().trim().default("Web Editorial"),
  tags: z.string().trim().default("Web,Engineering"),
  status: z.enum(["Published", "Draft", "Archived"]).default("Published"),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const portfolioItemSchema = z.object({
  title: z.string().trim().min(2, "Project title must be at least 2 characters"),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters").optional(),
  category: z.string().trim().min(1, "Category is required"),
  type: z.string().trim().min(1, "Project type is required"),
  description: z.string().trim().min(5, "Description must be at least 5 characters"),
  image: z.string().trim().optional().nullable(),
  projectUrl: z.string().trim().optional().nullable(),
  features: z.union([z.string(), z.array(z.string())]).default("Web App, Responsive UI"),
  tags: z.union([z.string(), z.array(z.string())]).default("All Projects, Web App"),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  showOnHome: z.boolean().default(false),
  techStack: z.string().trim().optional().nullable(),
  impactMetric: z.string().trim().optional().nullable(),
  impactLabel: z.string().trim().optional().nullable(),
});

export type PortfolioItemInput = z.infer<typeof portfolioItemSchema>;

export const serviceItemSchema = z.object({
  title: z.string().trim().min(2, "Service title must be at least 2 characters"),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters").optional(),
  shortDescription: z.string().trim().min(5, "Short description must be at least 5 characters"),
  description: z.string().trim().optional().nullable(),
  features: z.union([z.string(), z.array(z.string())]).default(""),
  image: z.string().trim().optional().nullable(),
  icon: z.string().trim().optional().nullable(),
  buttonText: z.string().trim().default("Contact Now →"),
  href: z.string().trim().default("#contact"),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export type ServiceItemInput = z.infer<typeof serviceItemSchema>;

