"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import RecordForm from "@/components/scan/RecordForm";
import type { RecordFormData } from "@/types";
import type { Record } from "@/generated/prisma/client";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Pencil, Disc3, Calendar, Music, Tag, Building2, Hash } from "lucide-react";
import Link from "next/link";

export default function RecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<Record | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/records/${params.id}`).then((r) => r.json()).then(setRecord).catch(() => toast.error("Record not found")).finally(() => setIsLoading(false));
  }, [params.id]);

  const handleUpdate = async (data: RecordFormData) => {
    const res = await fetch(`/api/records/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error("Update failed");
    const updated = await res.json();
    setRecord(updated);
    setIsEditing(false);
    toast.success("Record updated!");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/records/${params.id}`, { method: "DELETE" });
      toast.success("Record deleted");
      router.push("/");
    } catch {
      toast.error("Failed to delete record");
      setIsDeleting(false);
    }
  };

  if (isLoading) return (
    <div className="px-4 py-5 max-w-lg mx-auto space-y-4">
      <div className="h-10 w-32 rounded-xl shimmer" />
      <div className="aspect-square rounded-2xl shimmer" />
      <div className="h-6 w-3/4 rounded shimmer" />
      <div className="h-4 w-1/2 rounded shimmer" />
    </div>
  );

  if (!record) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p style={{ color: "var(--foreground-muted)" }}>Record not found</p>
      <Link href="/" className="px-4 py-2 rounded-xl text-sm" style={{ background: "var(--accent)", color: "var(--background)" }}>Back to Catalog</Link>
    </div>
  );

  const infoItems = [
    { icon: Calendar, label: "Year", value: record.year },
    { icon: Tag, label: "Genre", value: record.genre },
    { icon: Building2, label: "Label", value: record.label },
    { icon: Hash, label: "Catalog #", value: record.catalogNumber },
  ];

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl min-h-[44px] min-w-[44px]" style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}>
          <ArrowLeft size={20} />
        </Link>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium min-h-[44px]" style={{ background: isEditing ? "var(--accent)" : "var(--surface-elevated)", color: isEditing ? "var(--background)" : "var(--foreground-muted)" }}>
            <Pencil size={15} /> {isEditing ? "Cancel" : "Edit"}
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="flex items-center justify-center w-11 h-11 rounded-xl min-h-[44px]" style={{ background: "var(--danger-muted)", color: "var(--danger)" }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <RecordForm initialData={{
          ...record,
          year: record.year ?? undefined,
          genre: record.genre ?? undefined,
          label: record.label ?? undefined,
          catalogNumber: record.catalogNumber ?? undefined,
          color: record.color ?? undefined,
          notes: record.notes ?? undefined,
          imageUrl: record.imageUrl ?? undefined,
          confidence: record.confidence ?? undefined,
          aiRawResponse: record.aiRawResponse ?? undefined,
        }} onSubmit={handleUpdate} submitLabel="Update Record" />
      ) : (
        <div className="space-y-5 fade-in">
          {/* Cover */}
          <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}>
            {record.imageUrl ? (
              <Image src={record.imageUrl} alt={record.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 512px" />
            ) : (
              <div className="flex items-center justify-center w-full h-full"><Disc3 size={64} style={{ color: "var(--foreground-subtle)" }} /></div>
            )}
            {record.confidence != null && (
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: "rgba(0,0,0,0.7)", color: (record.confidence ?? 0) >= 0.8 ? "var(--success)" : "var(--accent)", backdropFilter: "blur(8px)" }}>
                {Math.round(record.confidence * 100)}% match
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{record.title}</h2>
            <p className="text-base flex items-center gap-1.5 mt-1" style={{ color: "var(--foreground-muted)" }}><Music size={16} /> {record.artist}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {infoItems.filter((i) => i.value).map((item) => (
              <div key={item.label} className="px-4 py-3 rounded-xl" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <item.icon size={12} style={{ color: "var(--foreground-subtle)" }} />
                  <span className="text-xs" style={{ color: "var(--foreground-subtle)" }}>{item.label}</span>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Condition & Format */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>{record.format}</span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}>Vinyl: {record.condition}</span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}>Cover: {record.coverCondition}</span>
            {record.color && <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}>{record.color}</span>}
          </div>

          {record.notes && (
            <div className="px-4 py-3 rounded-xl" style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--foreground-subtle)" }}>Notes</p>
              <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>{record.notes}</p>
            </div>
          )}

          <p className="text-xs text-center" style={{ color: "var(--foreground-subtle)" }}>Added {new Date(record.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
