import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAdminOverview } from "@/lib/data";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole([UserRole.ADMIN]);
    const overview = await getAdminOverview();
    return NextResponse.json(overview);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
