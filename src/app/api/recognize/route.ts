import { NextRequest, NextResponse } from "next/server";
import { recognizeRecord } from "@/lib/ai";
import { getDailyUsage, incrementDailyUsage, GEMINI_LIMITS } from "@/lib/usage";

export async function POST(request: NextRequest) {
  try {
    const used = await getDailyUsage();
    if (used >= GEMINI_LIMITS.daily) {
      return NextResponse.json(
        { error: `Daily scan limit of ${GEMINI_LIMITS.daily} reached. Resets at midnight UTC.` },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPEG, PNG, or WebP." },
        { status: 400 }
      );
    }

    await incrementDailyUsage();

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const result = await recognizeRecord(base64, file.type);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Recognition error:", error);
    return NextResponse.json(
      { error: "Failed to recognize record. Please try again." },
      { status: 500 }
    );
  }
}
