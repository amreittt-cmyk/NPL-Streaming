import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "If that account exists, a reset link has been generated." });
  }

  const token = randomUUID();
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: token },
  });

  return NextResponse.json({
    message: "Reset link generated for demo use",
    resetUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`,
  });
}
