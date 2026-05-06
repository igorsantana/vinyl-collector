"use client";

import { Filter, ChevronDown } from "lucide-react";
import { FORMATS } from "@/types";
import { useState } from "react";

interface FilterPanelProps {
  genres: string[];
  selectedGenre: string;
  selectedFormat: string;
  onGenreChange: (genre: string) => void;
  onFormatChange: (format: string) => void;
}

export default function FilterPanel({
  genres, selectedGenre, selectedFormat, onGenreChange, onFormatChange,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilters = selectedGenre !== "" || selectedFormat !== "";

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 min-h-[44px]"
        style={{ background: hasActiveFilters ? "var(--accent-muted)" : "var(--surface-elevated)", color: hasActiveFilters ? "var(--accent)" : "var(--foreground-muted)", border: `1px solid ${hasActiveFilters ? "var(--accent)" : "var(--border-subtle)"}` }}>
        <Filter size={16} />
        <span className="text-sm font-medium">Filters</span>
        {hasActiveFilters && <span className="w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold" style={{ background: "var(--accent)", color: "var(--background)" }}>{(selectedGenre ? 1 : 0) + (selectedFormat ? 1 : 0)}</span>}
        <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }} />
      </button>

      {isOpen && (
        <div className="mt-3 p-4 rounded-xl space-y-4 fade-in" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)" }}>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--foreground-muted)" }}>Genre</label>
            <div className="relative">
              <select id="filter-genre" value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl outline-none" style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                <option value="">All Genres</option>
                {genres.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--foreground-subtle)" }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--foreground-muted)" }}>Format</label>
            <div className="flex flex-wrap gap-2">
              {["", ...FORMATS].map((f) => (
                <button key={f || "all"} onClick={() => onFormatChange(f)}
                  className="px-3 py-2 rounded-lg text-sm font-medium min-h-[44px]"
                  style={{ background: selectedFormat === f ? "var(--accent)" : "var(--surface)", color: selectedFormat === f ? "var(--background)" : "var(--foreground-muted)", border: `1px solid ${selectedFormat === f ? "var(--accent)" : "var(--border)"}` }}>
                  {f || "All"}
                </button>
              ))}
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={() => { onGenreChange(""); onFormatChange(""); }}
              className="w-full py-2.5 rounded-lg text-sm font-medium" style={{ color: "var(--danger)", background: "var(--danger-muted)" }}>
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
