import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { registrationSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration details" }, { status: 400 });
  }

  const user = await getCurrentUser();
  const registration = await prisma.tournamentRegistration.create({
    data: {
      ...parsed.data,
      userId: user?.id,
    },
  });

  return NextResponse.json({ registration });
}
