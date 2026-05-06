"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import CameraCapture from "@/components/scan/CameraCapture";
import RecordForm from "@/components/scan/RecordForm";
import type { RecordFormData } from "@/types";
import type { RecognitionResult } from "@/lib/ai";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import UsageBadge from "@/components/scan/UsageBadge";

type ScanStep = "capture" | "review";

export default function ScanPage() {
  const router = useRouter();
  const [step, setStep] = useState<ScanStep>("capture");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<RecognitionResult | null>(null);
  const capturedFileRef = useRef<File | null>(null);

  const handleCapture = async (file: File) => {
    capturedFileRef.current = file;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/recognize", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Recognition failed");
      const result: RecognitionResult = await res.json();
      setAiResult(result);
      setStep("review");
      toast.success("Record identified!", { description: `${result.title} by ${result.artist}` });
    } catch {
      toast.error("Recognition failed", { description: "Please try again with a clearer photo." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async (data: RecordFormData) => {
    try {
      const formData = new FormData();
      if (capturedFileRef.current) formData.append("image", capturedFileRef.current);
      formData.append("data", JSON.stringify({ ...data, confidence: aiResult?.confidence, aiRawResponse: JSON.stringify(aiResult) }));
      const res = await fetch("/api/records", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Record saved to catalog!");
      router.push("/");
    } catch {
      toast.error("Failed to save record");
    }
  };

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {step === "review" ? (
          <button onClick={() => { setStep("capture"); setAiResult(null); }} className="flex items-center justify-center w-10 h-10 rounded-xl min-h-[44px] min-w-[44px]" style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}>
            <ArrowLeft size={20} />
          </button>
        ) : (
          <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl min-h-[44px] min-w-[44px]" style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}>
            <ArrowLeft size={20} />
          </Link>
        )}
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
            {step === "capture" ? "Scan Record" : "Review & Save"}
          </h2>
          <p className="text-xs" style={{ color: "var(--foreground-subtle)" }}>
            {step === "capture" ? "Photograph your vinyl record for AI identification" : "Verify the AI results and add details"}
          </p>
        </div>
        {step === "review" && <Sparkles size={20} style={{ color: "var(--accent)" }} className="ml-auto" />}
      </div>

      {/* API usage */}
      {step === "capture" && <UsageBadge />}

      {/* Content */}
      {step === "capture" ? (
        <CameraCapture onCapture={handleCapture} isProcessing={isProcessing} />
      ) : (
        aiResult && <RecordForm initialData={{ ...aiResult, confidence: aiResult.confidence }} onSubmit={handleSave} submitLabel="Save to Catalog" />
      )}
    </div>
  );
}
