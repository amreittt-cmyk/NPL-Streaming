import { NextResponse } from "next/server";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl: body.avatarUrl,
        bannerUrl: body.bannerUrl,
        bio: body.bio,
      },
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
