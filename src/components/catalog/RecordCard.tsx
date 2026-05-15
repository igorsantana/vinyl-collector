"use client";

import { Pane } from "@cyberdeck/ui";
import Image from "next/image";
import Link from "next/link";
import { Disc3, Calendar, Music, Tag } from "lucide-react";
import type { Record } from "@/generated/prisma/client";

interface RecordCardProps {
  record: Record;
}

export default function RecordCard({ record }: RecordCardProps) {
  const confidenceClass =
    (record.confidence ?? 0) >= 0.8
      ? "text-[hsl(var(--success))]"
      : (record.confidence ?? 0) >= 0.5
        ? "text-primary"
        : "text-destructive";

  return (
    <Link href={`/records/${record.id}`} className="block">
      <Pane
        className="hover-lift group cursor-pointer overflow-hidden bg-card"
        contentClassName="p-0"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {record.imageUrl ? (
            <Image
              src={record.imageUrl}
              alt={`${record.title} by ${record.artist}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Disc3 size={48} className="text-muted-foreground" />
            </div>
          )}

          {record.confidence != null && (
            <div
              className={`absolute right-2 top-2 rounded-full bg-background/80 px-2 py-1 text-xs font-bold backdrop-blur-sm ${confidenceClass}`}
            >
              {Math.round(record.confidence * 100)}%
            </div>
          )}

          <div className="absolute bottom-2 left-2 rounded-full bg-background/80 px-2 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            {record.format}
          </div>
        </div>

        <div className="space-y-1.5 border-t border-border p-3">
          <h3 className="truncate text-sm font-semibold leading-tight text-foreground">
            {record.title}
          </h3>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Music size={12} />
            {record.artist}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
            {record.year ? (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {record.year}
              </span>
            ) : null}
            {record.genre ? (
              <span className="flex items-center gap-1 truncate">
                <Tag size={11} />
                {record.genre}
              </span>
            ) : null}
          </div>
        </div>
      </Pane>
    </Link>
  );
}
