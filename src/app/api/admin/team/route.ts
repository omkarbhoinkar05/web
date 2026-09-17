import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/admin/db";
import { teamMemberSchema } from "@/lib/validations";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "view_team") && !hasPermission(session.role, "manage_team")) {
    return NextResponse.json({ error: "Forbidden: Access restricted to Super Admin and Admin" }, { status: 403 });
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
    const parseResult = teamMemberSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, role, phone, password, status } = parseResult.data;

    const member = await createTeamMember({
      name,
      email,
      role,
      phone,
      password: password || "Admin@123",
      status: status || "Active",
    });

    return NextResponse.json({ success: true, message: "Team member added", member });
  } catch (error) {
    console.error("POST team error:", error);
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

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_team")) {
    return NextResponse.json(
      { success: false, error: "Access denied. Only Super Admin can remove team members." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Member ID is required." }, { status: 400 });
    }

    // Protect master super admin account from accidental deletion
    if (id === "team-super" || id === session.id) {
      return NextResponse.json(
        { success: false, error: "Cannot delete the active or primary Super Admin account." },
        { status: 400 }
      );
    }

    await deleteTeamMember(id);
    return NextResponse.json({ success: true, message: "Team member removed successfully." });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete team member" }, { status: 500 });
  }
}
