import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stream = await prisma.stream.findUnique({ where: { id }, include: { streamer: true } });
  return NextResponse.json({ stream });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.STREAMER]);
    const { id } = await params;
    const current = await prisma.stream.findUnique({ where: { id } });
    if (!current || (user.role === "STREAMER" && current.streamerId !== user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const stream = await prisma.stream.update({ where: { id }, data: await request.json() });
    return NextResponse.json({ stream });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.STREAMER]);
    const { id } = await params;
    const current = await prisma.stream.findUnique({ where: { id } });
    if (!current || (user.role === "STREAMER" && current.streamerId !== user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.stream.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
