"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc3, Camera, Download } from "lucide-react";
import { cn } from "@cyberdeck/ui";

const NAV_ITEMS = [
  { href: "/", label: "Catalog", icon: Disc3 },
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/export", label: "Export", icon: Download },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-1 rounded-md transition-colors",
                isActive ? "text-accent" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                  isActive && "bg-accent/15",
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-accent" : "text-muted-foreground/80",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
