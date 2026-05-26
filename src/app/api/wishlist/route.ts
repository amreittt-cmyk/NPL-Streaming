import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();
    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { productId } = await request.json();
    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: {},
      create: { userId: user.id, productId },
    });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: user.id, productId } },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
