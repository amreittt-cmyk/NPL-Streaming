import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    if (!body.body?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        body: body.body,
        streamId: id,
        userId: user.id,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
}
