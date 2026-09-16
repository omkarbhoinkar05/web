import { cookies } from "next/headers";
import { TeamMember, AdminRole } from "./types";
import { getTeam, getUserPassword } from "./db";

const COOKIE_NAME = "htb_admin_session";
const SESSION_SECRET = "htb_super_secret_session_token_2026";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export async function getAdminSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const raw = Buffer.from(sessionCookie.value, "base64").toString("utf8");
    const parsed = JSON.parse(raw);
    if (parsed.secret !== SESSION_SECRET || !parsed.user) {
      return null;
    }
    return parsed.user as SessionUser;
  } catch {
    return null;
  }
}

export async function setAdminSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  const payload = JSON.stringify({
    secret: SESSION_SECRET,
    user,
    timestamp: Date.now(),
  });
  const encoded = Buffer.from(payload).toString("base64");

  cookieStore.set(COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyUserPassword(email: string, pass: string): Promise<boolean> {
  const expectedPassword = await getUserPassword(email);
  return pass === expectedPassword;
}

export async function validateCredentials(email: string, pass: string): Promise<TeamMember | null> {
  const team = await getTeam();
  const normalizedEmail = email.toLowerCase().trim();
  const expectedPassword = await getUserPassword(normalizedEmail);

  if (pass !== expectedPassword) {
    return null;
  }

  const found = team.find((t) => t.email.toLowerCase() === normalizedEmail);
  if (found) {
    return found;
  }

  // Master credentials fallback if not yet in team list
  if (normalizedEmail === "admin@hightechbirds.com" || normalizedEmail === "dev.omkar05@gmail.com") {
    return {
      id: "team-super",
      name: "Omkar Bhoinkar",
      email: normalizedEmail,
      role: "Super Admin",
      status: "Active",
      phone: "+91 99208 18481",
      createdAt: new Date().toISOString(),
    };
  }

  return null;
}

export const PERMISSIONS: Record<AdminRole, string[]> = {
  "Super Admin": ["all", "manage_team", "delete_records", "settings", "export"],
  Admin: ["all", "delete_records", "export"],
  Sales: ["view_leads", "edit_leads", "manage_pipeline", "schedule_calls", "follow_ups", "export"],
  HR: ["view_careers", "manage_careers", "download_resumes"],
  Support: ["view_leads", "contact_enquiries", "add_notes"],
};

export function hasPermission(role: AdminRole, permission: string): boolean {
  const perms = PERMISSIONS[role] || [];
  return perms.includes("all") || perms.includes(permission);
}
