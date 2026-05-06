import { NextResponse } from "next/server";
import { getDailyUsage, GEMINI_LIMITS } from "@/lib/usage";

export async function GET() {
  const used = await getDailyUsage();
  return NextResponse.json({
    used,
    limit: GEMINI_LIMITS.daily,
    remaining: Math.max(0, GEMINI_LIMITS.daily - used),
    rpm: GEMINI_LIMITS.rpm,
  });
}
