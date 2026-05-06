"use client";

import Image from "next/image";
import Link from "next/link";
import { Disc3, Calendar, Music, Tag } from "lucide-react";
import type { Record } from "@/generated/prisma/client";

interface RecordCardProps {
  record: Record;
}

export default function RecordCard({ record }: RecordCardProps) {
  const confidenceColor =
    (record.confidence ?? 0) >= 0.8
      ? "var(--success)"
      : (record.confidence ?? 0) >= 0.5
        ? "var(--accent)"
        : "var(--danger)";

  return (
    <Link href={`/records/${record.id}`}>
      <div
        className="group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer"
        style={{
          background: "var(--gradient-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Cover Image */}
        <div
          className="relative aspect-square overflow-hidden"
          style={{ background: "var(--surface)" }}
        >
          {record.imageUrl ? (
            <Image
              src={record.imageUrl}
              alt={`${record.title} by ${record.artist}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Disc3
                size={48}
                style={{ color: "var(--foreground-subtle)" }}
              />
            </div>
          )}

          {/* Confidence Badge */}
          {record.confidence != null && (
            <div
              className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(0, 0, 0, 0.7)",
                color: confidenceColor,
                backdropFilter: "blur(8px)",
              }}
            >
              {Math.round(record.confidence * 100)}%
            </div>
          )}

          {/* Format Badge */}
          <div
            className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              color: "var(--foreground-muted)",
              backdropFilter: "blur(8px)",
            }}
          >
            {record.format}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <h3
            className="font-semibold text-sm leading-tight truncate"
            style={{ color: "var(--foreground)" }}
          >
            {record.title}
          </h3>
          <p
            className="text-xs truncate flex items-center gap-1"
            style={{ color: "var(--foreground-muted)" }}
          >
            <Music size={12} />
            {record.artist}
          </p>
          <div
            className="flex items-center gap-3 text-xs"
            style={{ color: "var(--foreground-subtle)" }}
          >
            {record.year && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {record.year}
              </span>
            )}
            {record.genre && (
              <span className="flex items-center gap-1 truncate">
                <Tag size={11} />
                {record.genre}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
