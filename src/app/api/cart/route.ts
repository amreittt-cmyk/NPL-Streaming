import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ cart: [], mode: "client-persisted" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ cart: body.items || [], message: "Cart payload accepted" });
}
