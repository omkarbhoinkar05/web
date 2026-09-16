import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getTeam, createTeamMember, updateTeamMember } from "@/lib/admin/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const team = await getTeam();
  return NextResponse.json({ success: true, count: team.length, team });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_team")) {
    return NextResponse.json(
      { success: false, error: "Access denied. Only Super Admin can add team members." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, role, phone, status } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ success: false, error: "Name, email and role are required." }, { status: 400 });
    }

    const member = await createTeamMember({
      name,
      email,
      role,
      phone: phone || "",
      status: status || "Active",
    });

    return NextResponse.json({ success: true, message: "Team member added", member });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to add team member" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_team")) {
    return NextResponse.json(
      { success: false, error: "Access denied. Only Super Admin can modify team members." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const updated = await updateTeamMember(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Team member updated", member: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update team member" }, { status: 500 });
  }
}
