"use client";

import { CONDITIONS, FORMATS } from "@/types";
import type { RecordFormData } from "@/types";
import { useState } from "react";
import { Save, Loader2, Sparkles } from "lucide-react";

interface RecordFormProps {
  initialData?: Partial<RecordFormData>;
  onSubmit: (data: RecordFormData) => Promise<void>;
  submitLabel?: string;
}

export default function RecordForm({ initialData, onSubmit, submitLabel = "Save to Catalog" }: RecordFormProps) {
  const [form, setForm] = useState<RecordFormData>({
    title: initialData?.title || "",
    artist: initialData?.artist || "",
    year: initialData?.year || "",
    genre: initialData?.genre || "",
    label: initialData?.label || "",
    catalogNumber: initialData?.catalogNumber || "",
    condition: initialData?.condition || "Not Graded",
    coverCondition: initialData?.coverCondition || "Not Graded",
    format: initialData?.format || "LP",
    color: initialData?.color || "",
    notes: initialData?.notes || "",
    confidence: initialData?.confidence,
    aiRawResponse: initialData?.aiRawResponse,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.artist) return;
    setIsSubmitting(true);
    try { await onSubmit(form); } finally { setIsSubmitting(false); }
  };

  const update = (field: keyof RecordFormData, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const inputStyle = { background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {initialData?.confidence != null && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "var(--accent-muted)", border: "1px solid var(--accent)" }}>
          <Sparkles size={16} style={{ color: "var(--accent)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            AI Confidence: {Math.round((initialData.confidence ?? 0) * 100)}%
          </span>
        </div>
      )}

      {/* Title & Artist */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Title *</label>
          <input id="record-title" type="text" required value={form.title} onChange={(e) => update("title", e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} placeholder="Album title" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Artist *</label>
          <input id="record-artist" type="text" required value={form.artist} onChange={(e) => update("artist", e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} placeholder="Artist or band" />
        </div>
      </div>

      {/* Year, Genre, Label */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Year</label>
          <input type="text" value={form.year || ""} onChange={(e) => update("year", e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} placeholder="1977" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Genre</label>
          <input type="text" value={form.genre || ""} onChange={(e) => update("genre", e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} placeholder="Rock" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Label</label>
          <input type="text" value={form.label || ""} onChange={(e) => update("label", e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} placeholder="Columbia Records" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Catalog #</label>
          <input type="text" value={form.catalogNumber || ""} onChange={(e) => update("catalogNumber", e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} placeholder="ABC-123" />
        </div>
      </div>

      {/* Format & Condition */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Format</label>
          <select value={form.format} onChange={(e) => update("format", e.target.value)} className="w-full px-3 py-3 rounded-xl outline-none appearance-none" style={inputStyle}>
            {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Vinyl</label>
          <select value={form.condition} onChange={(e) => update("condition", e.target.value)} className="w-full px-3 py-3 rounded-xl outline-none appearance-none" style={inputStyle}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Cover</label>
          <select value={form.coverCondition} onChange={(e) => update("coverCondition", e.target.value)} className="w-full px-3 py-3 rounded-xl outline-none appearance-none" style={inputStyle}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Color & Notes */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Vinyl Color</label>
        <input type="text" value={form.color || ""} onChange={(e) => update("color", e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle} placeholder="Black, Red, Splatter..." />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground-muted)" }}>Notes</label>
        <textarea value={form.notes || ""} onChange={(e) => update("notes", e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl outline-none resize-none" style={inputStyle} placeholder="First pressing, includes insert..." />
      </div>

      <button type="submit" disabled={isSubmitting || !form.title || !form.artist}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all duration-200 min-h-[52px] disabled:opacity-50"
        style={{ background: "var(--accent)", color: "var(--background)" }}>
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
