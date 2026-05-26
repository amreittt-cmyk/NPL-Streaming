import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await comparePassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
  }

  await createSession({ userId: user.id, role: user.role, email: user.email });
  return NextResponse.json({ message: "Logged in" });
}
