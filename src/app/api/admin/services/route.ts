import { NextResponse } from "next/server";
import { getAdminSession, hasPermission } from "@/lib/admin/auth";
import { getServices, createService } from "@/lib/admin/db";
import { serviceItemSchema } from "@/lib/validations";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_services")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const skip = (page - 1) * limit;

  const [{ services, total }, totalAll, activeCount, inactiveCount] = await Promise.all([
    getServices({ search, status, limit, skip }),
    prisma.serviceItem.count(),
    prisma.serviceItem.count({ where: { status: "Active" } }),
    prisma.serviceItem.count({ where: { status: "Inactive" } }),
  ]);

  const stats = {
    total: totalAll,
    active: activeCount,
    inactive: inactiveCount,
  };

  return NextResponse.json({
    success: true,
    services,
    total,
    page,
    limit,
    stats,
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.role, "manage_services")) {
    return NextResponse.json({ error: "Forbidden: Access restricted" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parseResult = serviceItemSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const newService = await createService({
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      features: data.features,
      image: data.image,
      icon: data.icon,
      buttonText: data.buttonText,
      href: data.href,
      displayOrder: data.displayOrder,
      status: data.status,
    });

    return NextResponse.json({
      success: true,
      message: "Service created successfully",
      service: newService,
    });
  } catch (error: any) {
    console.error("POST /api/admin/services error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}
