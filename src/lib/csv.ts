import { stringify } from "csv-stringify/sync";
import type { Record } from "@/generated/prisma/client";

export function generateCSV(records: Record[]): string {
  const data = records.map((r) => ({
    Title: r.title,
    Artist: r.artist,
    Year: r.year || "",
    Genre: r.genre || "",
    Label: r.label || "",
    "Catalog #": r.catalogNumber || "",
    Format: r.format,
    "Vinyl Condition": r.condition,
    "Cover Condition": r.coverCondition,
    Color: r.color || "",
    Notes: r.notes || "",
    "AI Confidence": r.confidence ? `${Math.round(r.confidence * 100)}%` : "",
    "Date Added": r.createdAt.toISOString().split("T")[0],
  }));

  return stringify(data, {
    header: true,
    quoted_string: true,
  });
}
