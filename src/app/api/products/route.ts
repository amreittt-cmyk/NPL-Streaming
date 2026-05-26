import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  try {
    await requireRole([UserRole.ADMIN]);
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        slug: slugify(parsed.data.name),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 403 });
  }
}
