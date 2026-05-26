import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (order.userId && user?.id !== order.userId && user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order });
}
