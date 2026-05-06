"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc3, Camera, Download } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Catalog", icon: Disc3 },
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/export", label: "Export", icon: Download },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 min-w-[72px] min-h-[44px] rounded-xl transition-all duration-200"
              style={{
                color: isActive ? "var(--accent)" : "var(--foreground-muted)",
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                style={{
                  background: isActive ? "var(--accent-muted)" : "transparent",
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className="text-xs font-medium"
                style={{
                  color: isActive ? "var(--accent)" : "var(--foreground-subtle)",
                }}
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
