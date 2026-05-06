import { prisma } from "./db";

// Gemini 2.5 Flash free-tier limits
export const GEMINI_LIMITS = {
  daily: 250,
  rpm: 15,
} as const;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function getDailyUsage(): Promise<number> {
  const row = await prisma.apiUsage.findUnique({ where: { date: today() } });
  return row?.count ?? 0;
}

export async function incrementDailyUsage(): Promise<void> {
  await prisma.apiUsage.upsert({
    where: { date: today() },
    update: { count: { increment: 1 } },
    create: { date: today(), count: 1 },
  });
}
