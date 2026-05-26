import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/verify-email`);
  }

  const user = await prisma.user.findFirst({ where: { emailVerificationToken: token } });
  if (!user) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerificationToken: null },
  });

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login`);
}
