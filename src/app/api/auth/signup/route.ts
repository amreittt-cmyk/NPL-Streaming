import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";
import { signupSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signup details" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const emailVerificationToken = randomUUID();
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      emailVerificationToken,
    },
  });

  await createSession({ userId: user.id, role: user.role, email: user.email });

  return NextResponse.json({
    message: "Account created",
    verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/verify-email?token=${emailVerificationToken}`,
  });
}
