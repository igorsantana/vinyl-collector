"use client";

import { Camera, Upload, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  isProcessing: boolean;
}

export default function CameraCapture({ onCapture, isProcessing }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    onCapture(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleChange} className="hidden" id="camera-input" />

      {/* Preview or capture area */}
      <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "2px dashed var(--border)" }}>
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Captured record" className="w-full h-full object-cover" />
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "rgba(10, 10, 15, 0.8)", backdropFilter: "blur(8px)" }}>
                <Loader2 size={40} className="animate-spin" style={{ color: "var(--accent)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--foreground-muted)" }}>Identifying record...</p>
              </div>
            )}
          </>
        ) : (
          <button onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-4 transition-all duration-200 active:scale-95"
            style={{ color: "var(--foreground-subtle)" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "var(--accent-muted)" }}>
              <Camera size={32} style={{ color: "var(--accent)" }} />
            </div>
            <div className="text-center">
              <p className="text-base font-medium" style={{ color: "var(--foreground-muted)" }}>Tap to scan a record</p>
              <p className="text-xs mt-1" style={{ color: "var(--foreground-subtle)" }}>Take a photo of the cover, label, or spine</p>
            </div>
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 max-w-md mx-auto">
        <button onClick={() => fileInputRef.current?.click()} disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 min-h-[48px] disabled:opacity-50"
          style={{ background: "var(--accent)", color: "var(--background)" }}>
          <Camera size={18} />
          {preview ? "Retake Photo" : "Take Photo"}
        </button>
        <label className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 min-h-[48px] cursor-pointer"
          style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}>
          <Upload size={18} />
          Upload
          <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </label>
      </div>
    </div>
  );
}
