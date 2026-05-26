import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ orders: [] });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  const user = await getCurrentUser();
  const order = await prisma.order.create({
    data: {
      userId: user?.id,
      guestEmail: user ? null : parsed.data.shippingAddress.email,
      subtotal: parsed.data.subtotal,
      tax: parsed.data.tax,
      shipping: parsed.data.shipping,
      total: parsed.data.total,
      couponCode: parsed.data.couponCode,
      paymentStatus: process.env.STRIPE_SECRET_KEY ? "pending_stripe" : "placeholder_paid",
      status: process.env.STRIPE_SECRET_KEY ? "PENDING" : "PAID",
      shippingAddress: parsed.data.shippingAddress,
      items: {
        create: parsed.data.items,
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ order });
}
