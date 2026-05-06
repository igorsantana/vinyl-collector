import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateCSV } from "@/lib/csv";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre") || undefined;
    const format = searchParams.get("format") || undefined;

    const where: Record<string, unknown> = {};
    if (genre) where.genre = { contains: genre };
    if (format) where.format = format;

    const records = await prisma.record.findMany({
      where,
      orderBy: { artist: "asc" },
    });

    const csv = generateCSV(records);
    const date = new Date().toISOString().split("T")[0];

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="vinyl-catalog-${date}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json(
      { error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
