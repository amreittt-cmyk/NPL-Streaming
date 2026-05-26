import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    await prisma.streamLike.upsert({
      where: { userId_streamId: { userId: user.id, streamId: id } },
      update: {},
      create: { userId: user.id, streamId: id },
    });
    return NextResponse.json({ message: "Stream liked" });
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
}
