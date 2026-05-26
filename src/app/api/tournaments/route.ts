import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { tournamentSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const tournaments = await prisma.tournament.findMany({ orderBy: { startDate: "asc" } });
  return NextResponse.json({ tournaments });
}

export async function POST(request: Request) {
  try {
    await requireRole([UserRole.ADMIN]);
    const body = await request.json();
    const parsed = tournamentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid tournament payload" }, { status: 400 });
    }

    const tournament = await prisma.tournament.create({
      data: {
        ...parsed.data,
        slug: slugify(parsed.data.title),
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
      },
    });

    return NextResponse.json({ tournament });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
