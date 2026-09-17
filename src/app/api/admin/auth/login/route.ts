import { NextResponse } from "next/server";
import { validateCredentials, setAdminSession } from "@/lib/admin/auth";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rateLimit";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `login:${ip}`;

    // Rate Limit: Max 5 attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts from this IP. Please try again in ${rateCheck.retryAfterSec} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateCheck.retryAfterSec.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const user = await validateCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    resetRateLimit(rateLimitKey);

    await setAdminSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
