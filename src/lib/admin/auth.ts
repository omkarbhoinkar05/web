import { cookies } from "next/headers";
import crypto from "crypto";
import { TeamMember, AdminRole } from "./types";
import { getTeam, getUserPassword } from "./db";

const COOKIE_NAME = "htb_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "htb_super_secret_session_token_2026_enterprise";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

/**
 * Constant-time string comparison using SHA-256 hashes
 * Eliminates side-channel timing attack vectors entirely
 */
export function safeTimingCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function signPayload(dataStr: string): string {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(dataStr);
  return hmac.digest("hex");
}

function verifySignature(dataStr: string, signature: string): boolean {
  const expected = signPayload(dataStr);
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(signature, "utf8"));
}

export async function getAdminSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const raw = Buffer.from(sessionCookie.value, "base64url").toString("utf8");
    const parsed = JSON.parse(raw);

    // 1. Check if modern HMAC-signed session
    if (parsed && parsed.p && parsed.s) {
      if (!verifySignature(parsed.p, parsed.s)) {
        return null;
      }
      const data = JSON.parse(parsed.p);
      // Verify session has not expired
      if (!data.timestamp || Date.now() - data.timestamp > SESSION_MAX_AGE_MS) {
        return null;
      }
      return data.user as SessionUser;
    }

    // 2. Backward compatibility with legacy unsigned base64 format
    const legacyRaw = Buffer.from(sessionCookie.value, "base64").toString("utf8");
    const legacyParsed = JSON.parse(legacyRaw);
    if (
      (legacyParsed.secret === "htb_super_secret_session_token_2026" || legacyParsed.secret === SESSION_SECRET) &&
      legacyParsed.user
    ) {
      return legacyParsed.user as SessionUser;
    }

    return null;
  } catch {
    return null;
  }
}

export async function setAdminSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  const payload = JSON.stringify({
    user,
    timestamp: Date.now(),
  });
  const signature = signPayload(payload);
  const token = Buffer.from(JSON.stringify({ p: payload, s: signature })).toString("base64url");

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyUserPassword(email: string, pass: string): Promise<boolean> {
  const expectedPassword = await getUserPassword(email);
  return safeTimingCompare(pass, expectedPassword);
}

export async function validateCredentials(email: string, pass: string): Promise<TeamMember | null> {
  const team = await getTeam();
  const normalizedEmail = email.toLowerCase().trim();
  const expectedPassword = await getUserPassword(normalizedEmail);

  if (!safeTimingCompare(pass, expectedPassword)) {
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
      name: "Omkar Bhoir",
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
