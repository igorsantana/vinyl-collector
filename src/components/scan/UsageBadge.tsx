"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
  rpm: number;
}

export default function UsageBadge() {
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setUsage)
      .catch(() => null);
  }, []);

  if (!usage) return null;

  const pct = (usage.used / usage.limit) * 100;
  const isWarning = pct >= 75;
  const isCritical = pct >= 90;

  const barColor = isCritical
    ? "var(--error, #ef4444)"
    : isWarning
    ? "var(--warning, #f59e0b)"
    : "var(--accent)";

  const labelColor = isCritical
    ? "var(--error, #ef4444)"
    : isWarning
    ? "var(--warning, #f59e0b)"
    : "var(--foreground-subtle)";

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap size={13} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--foreground-muted)" }}>
            Gemini API — free tier
          </span>
        </div>
        <span className="text-xs tabular-nums font-semibold" style={{ color: labelColor }}>
          {usage.used} / {usage.limit} scans today
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border-subtle)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--foreground-subtle)" }}>
          {usage.remaining} remaining · resets midnight UTC
        </span>
        <span className="text-xs" style={{ color: "var(--foreground-subtle)" }}>
          {usage.rpm} RPM max
        </span>
      </div>
    </div>
  );
}
