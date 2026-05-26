import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
const cookieName = "npl_live_session";

type SessionPayload = {
  userId: string;
  role: UserRole;
  email: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      emailVerified: true,
      createdAt: true,
    },
  });
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}
