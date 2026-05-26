import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = {
  "/profile": ["VIEWER", "STREAMER", "ADMIN"],
  "/orders": ["VIEWER", "STREAMER", "ADMIN"],
  "/wishlist": ["VIEWER", "STREAMER", "ADMIN"],
  "/admin": ["ADMIN"],
  "/streamer": ["STREAMER", "ADMIN"],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const matched = Object.entries(protectedRoutes).find(([route]) => pathname.startsWith(route));

  if (!matched) {
    return NextResponse.next();
  }

  const token = request.cookies.get("npl_live_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");
    const verified = await jwtVerify(token, secret);
    const role = verified.payload.role as string;
    if (!matched[1].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/wishlist/:path*", "/admin/:path*", "/streamer/:path*"],
};
