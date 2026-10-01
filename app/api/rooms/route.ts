import { NextRequest, NextResponse } from "next/server";
import { rooms } from "@/lib/rooms";
import { enforceRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const rate = await enforceRateLimit(request, "rooms", 60);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { ...rateLimitHeaders(rate), "Retry-After": "60" } },
    );
  }
  return NextResponse.json(
    { ok: true, rooms },
    { headers: { ...rateLimitHeaders(rate), "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
