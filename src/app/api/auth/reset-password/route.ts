import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { token, password } = await request.json();
  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { passwordResetToken: token } });
  if (!user) {
    return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      passwordResetToken: null,
    },
  });

  return NextResponse.json({ message: "Password updated" });
}
