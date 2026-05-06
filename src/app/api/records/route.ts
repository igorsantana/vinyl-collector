import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const format = searchParams.get("format") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { artist: { contains: search } },
        { label: { contains: search } },
      ];
    }

    if (genre) {
      where.genre = { contains: genre };
    }

    if (format) {
      where.format = format;
    }

    const records = await prisma.record.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = JSON.parse(formData.get("data") as string);
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | undefined;

    if (imageFile) {
      // Save image to public/uploads
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const ext = imageFile.name.split(".").pop() || "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filepath = path.join(uploadsDir, filename);

      const bytes = await imageFile.arrayBuffer();
      await writeFile(filepath, Buffer.from(bytes));

      imageUrl = `/uploads/${filename}`;
    }

    const record = await prisma.record.create({
      data: {
        title: body.title,
        artist: body.artist,
        year: body.year != null ? String(body.year) : null,
        genre: body.genre || null,
        label: body.label || null,
        catalogNumber: body.catalogNumber || null,
        condition: body.condition || "Not Graded",
        coverCondition: body.coverCondition || "Not Graded",
        format: body.format || "LP",
        color: body.color || null,
        notes: body.notes || null,
        imageUrl: imageUrl || body.imageUrl || null,
        confidence: body.confidence ? parseFloat(body.confidence) : null,
        aiRawResponse: body.aiRawResponse || null,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}
