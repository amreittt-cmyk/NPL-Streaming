import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tournament = await prisma.tournament.findUnique({ where: { id }, include: { teams: true, registrations: true } });
  return NextResponse.json({ tournament });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole([UserRole.ADMIN]);
    const { id } = await params;
    const tournament = await prisma.tournament.update({ where: { id }, data: await request.json() });
    return NextResponse.json({ tournament });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole([UserRole.ADMIN]);
    const { id } = await params;
    await prisma.tournament.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
