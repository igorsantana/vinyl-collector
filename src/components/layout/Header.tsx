"use client";

import { Disc3 } from "lucide-react";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 glass"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center gap-3 px-5 py-4 max-w-6xl mx-auto">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "var(--accent-muted)" }}
        >
          <Disc3
            size={22}
            style={{ color: "var(--accent)" }}
            className="vinyl-spin"
          />
        </div>
        <div>
          <h1
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Vinyl Catalog
          </h1>
          <p
            className="text-xs"
            style={{ color: "var(--foreground-subtle)" }}
          >
            AI-Powered Record Collection
          </p>
        </div>
      </div>
    </header>
  );
}
