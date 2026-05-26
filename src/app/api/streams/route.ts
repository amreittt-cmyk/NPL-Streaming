import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { streamSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const streams = await prisma.stream.findMany({ include: { streamer: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ streams });
}

export async function POST(request: Request) {
  try {
    const user = await requireRole([UserRole.ADMIN, UserRole.STREAMER]);
    const body = await request.json();
    const parsed = streamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid stream payload" }, { status: 400 });
    }

    const stream = await prisma.stream.create({
      data: {
        ...parsed.data,
        slug: slugify(parsed.data.title),
        streamerId: user.id,
        scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : null,
      },
    });

    return NextResponse.json({ stream });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 403 });
  }
}
