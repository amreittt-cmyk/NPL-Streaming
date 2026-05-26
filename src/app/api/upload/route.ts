import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.STREAMER]);
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const fileName = `${randomUUID()}-${file.name}`;
    await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
