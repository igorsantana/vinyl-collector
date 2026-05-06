"use client";

import { Download, FileSpreadsheet, Disc3, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ExportPage() {
  const [recordCount, setRecordCount] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/records").then((r) => r.json()).then((data) => setRecordCount(data.length)).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vinyl-catalog-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Export Catalog</h2>
        <p className="text-sm mt-1" style={{ color: "var(--foreground-subtle)" }}>Download your vinyl collection as a CSV file</p>
      </div>

      <div className="space-y-4">
        {/* Stats card */}
        <div className="p-6 rounded-2xl text-center" style={{ background: "var(--gradient-card)", border: "1px solid var(--border-subtle)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--accent-muted)" }}>
            <Disc3 size={28} style={{ color: "var(--accent)" }} />
          </div>
          {isLoading ? (
            <div className="h-10 w-16 mx-auto rounded shimmer" />
          ) : (
            <p className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>{recordCount}</p>
          )}
          <p className="text-sm mt-1" style={{ color: "var(--foreground-muted)" }}>Records in catalog</p>
        </div>

        {/* Export button */}
        <button onClick={handleExport} disabled={isExporting || recordCount === 0}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-semibold text-base transition-all duration-200 disabled:opacity-50 min-h-[56px]"
          style={{ background: "var(--accent)", color: "var(--background)" }}>
          {isExporting ? <Loader2 size={22} className="animate-spin" /> : <Download size={22} />}
          {isExporting ? "Generating CSV..." : "Download CSV"}
        </button>

        {recordCount === 0 && !isLoading && (
          <div className="text-center py-4">
            <p className="text-sm" style={{ color: "var(--foreground-subtle)" }}>No records to export yet.</p>
            <Link href="/scan" className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "var(--surface-elevated)", color: "var(--accent)" }}>
              Scan your first record
            </Link>
          </div>
        )}

        {/* CSV Info */}
        <div className="p-4 rounded-xl space-y-3" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={16} style={{ color: "var(--foreground-muted)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--foreground-muted)" }}>CSV includes:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {["Title", "Artist", "Year", "Genre", "Label", "Catalog #", "Format", "Vinyl Condition", "Cover Condition", "Color", "Notes", "AI Confidence", "Date Added"].map((col) => (
              <span key={col} className="text-xs px-2 py-1 rounded" style={{ color: "var(--foreground-subtle)", background: "var(--surface)" }}>{col}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
