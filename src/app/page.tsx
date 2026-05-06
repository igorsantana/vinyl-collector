"use client";

import { useEffect, useState, useCallback } from "react";
import RecordCard from "@/components/catalog/RecordCard";
import SearchBar from "@/components/catalog/SearchBar";
import FilterPanel from "@/components/catalog/FilterPanel";
import { Disc3, Plus } from "lucide-react";
import Link from "next/link";
import type { Record } from "@/generated/prisma/client";

export default function CatalogPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [format, setFormat] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (genre) params.set("genre", genre);
      if (format) params.set("format", format);
      const res = await fetch(`/api/records?${params}`);
      if (res.ok) setRecords(await res.json());
    } catch (err) {
      console.error("Failed to fetch records:", err);
    } finally {
      setIsLoading(false);
    }
  }, [search, genre, format]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const genres = [...new Set(records.map((r) => r.genre).filter(Boolean))] as string[];

  return (
    <div className="px-4 py-5 max-w-6xl mx-auto space-y-5">
      {/* Search & Filters */}
      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex items-center justify-between">
          <FilterPanel genres={genres} selectedGenre={genre} selectedFormat={format} onGenreChange={setGenre} onFormatChange={setFormat} />
          <Link href="/scan" className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm min-h-[44px] transition-all duration-200" style={{ background: "var(--accent)", color: "var(--background)" }}>
            <Plus size={18} />
            Add Record
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--foreground-subtle)" }}>
        <Disc3 size={14} />
        <span>{records.length} record{records.length !== 1 ? "s" : ""} in collection</span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
              <div className="aspect-square shimmer" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-3/4 rounded shimmer" />
                <div className="h-3 w-1/2 rounded shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "var(--surface-elevated)" }}>
            <Disc3 size={40} style={{ color: "var(--foreground-subtle)" }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground-muted)" }}>{search || genre || format ? "No records found" : "Your collection is empty"}</h2>
            <p className="text-sm mt-1" style={{ color: "var(--foreground-subtle)" }}>{search || genre || format ? "Try adjusting your search or filters" : "Scan your first vinyl record to get started"}</p>
          </div>
          {!search && !genre && !format && (
            <Link href="/scan" className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm" style={{ background: "var(--accent)", color: "var(--background)" }}>
              <Plus size={18} /> Scan First Record
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
          {records.map((record) => <RecordCard key={record.id} record={record} />)}
        </div>
      )}
    </div>
  );
}
