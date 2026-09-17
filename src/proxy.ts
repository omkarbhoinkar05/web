import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "web_admin_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "web_enterprise_session_secret_2026_super_secure_key";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper for Web Crypto HMAC SHA-256 verification (compatible with Edge/Node Proxy runtime)
async function verifyHmac(payload: string, signatureHex: string, secret: string): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    // Convert hex string to byte array
    const sigBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    return await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
  } catch {
    return false;
  }
}

interface DecodedSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: "Super Admin" | "Admin" | "Sales" | "HR" | "Support";
  };
  timestamp: number;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public admin authentication endpoints
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password"
  ) {
    return NextResponse.next();
  }

  // 2. Extract and inspect session cookie
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let sessionData: DecodedSession | null = null;

  try {
    const raw = Buffer.from(sessionCookie.value, "base64url").toString("utf8");
    const parsed = JSON.parse(raw);

    if (parsed && parsed.p && parsed.s) {
      const isValid = await verifyHmac(parsed.p, parsed.s, SESSION_SECRET);
      if (!isValid) {
        throw new Error("Invalid session signature");
      }

      const decoded = JSON.parse(parsed.p) as DecodedSession;
      if (!decoded.timestamp || Date.now() - decoded.timestamp > SESSION_MAX_AGE_MS) {
        throw new Error("Session expired");
      }

      sessionData = decoded;
    }
  } catch {
    // Malformed or tampered session cookie
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  if (!sessionData || !sessionData.user) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  const role = sessionData.user.role;

  // 3. Server-side RBAC Route Protection
  // - HR dedicated routing: HR can only access careers, cannot view leads or sales dashboard
  if (role === "HR") {
    if (
      pathname === "/admin" ||
      pathname.startsWith("/admin/leads") ||
      pathname.startsWith("/admin/pipeline") ||
      pathname.startsWith("/admin/follow-ups") ||
      pathname.startsWith("/admin/scheduled-calls") ||
      pathname.startsWith("/admin/contact-enquiries") ||
      pathname.startsWith("/admin/reports") ||
      pathname.startsWith("/admin/team") ||
      pathname.startsWith("/admin/settings")
    ) {
      return NextResponse.redirect(new URL("/admin/career-applications", request.url));
    }
  }

  // - Team management: Super Admin ONLY (Admin cannot create/manage team)
  if (pathname.startsWith("/admin/team")) {
    if (role !== "Super Admin") {
      return NextResponse.redirect(new URL("/admin?error=forbidden", request.url));
    }
  }

  // - System settings & Reports: Super Admin & Admin only (Sales & HR blocked)
  if (pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/reports")) {
    if (role !== "Super Admin" && role !== "Admin") {
      return NextResponse.redirect(new URL("/admin?error=forbidden", request.url));
    }
  }

  // - Career Applications: Super Admin, Admin & HR only (Sales blocked)
  if (pathname.startsWith("/admin/career-applications")) {
    if (role !== "Super Admin" && role !== "Admin" && role !== "HR") {
      return NextResponse.redirect(new URL("/admin?error=forbidden", request.url));
    }
  }

  // - Leads & Sales CRM: Super Admin, Admin, Sales, Support only (HR strictly blocked)
  if (
    pathname.startsWith("/admin/leads") ||
    pathname.startsWith("/admin/pipeline") ||
    pathname.startsWith("/admin/follow-ups") ||
    pathname.startsWith("/admin/scheduled-calls") ||
    pathname.startsWith("/admin/contact-enquiries")
  ) {
    if (role === "HR") {
      return NextResponse.redirect(new URL("/admin/career-applications", request.url));
    }
    if (role !== "Super Admin" && role !== "Admin" && role !== "Sales" && role !== "Support") {
      return NextResponse.redirect(new URL("/admin?error=forbidden", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
