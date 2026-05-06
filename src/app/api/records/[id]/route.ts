import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.record.findUnique({ where: { id } });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      { error: "Failed to fetch record" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const record = await prisma.record.update({
      where: { id },
      data: {
        title: body.title,
        artist: body.artist,
        year: body.year != null ? String(body.year) : null,
        genre: body.genre || null,
        label: body.label || null,
        catalogNumber: body.catalogNumber || null,
        condition: body.condition,
        coverCondition: body.coverCondition,
        format: body.format,
        color: body.color || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const record = await prisma.record.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Delete associated image file
    if (record.imageUrl) {
      try {
        const imagePath = path.join(process.cwd(), "public", record.imageUrl);
        await unlink(imagePath);
      } catch {
        // Image file may not exist, continue
      }
    }

    await prisma.record.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
