"use client";

import { Disc3 } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15">
          <Disc3 size={22} className="vinyl-spin text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Vinyl Catalog
          </h1>
          <p className="text-xs text-muted-foreground">
            AI-Powered Record Collection
          </p>
        </div>
      </div>
    </header>
  );
}
