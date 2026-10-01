import { NextRequest, NextResponse } from "next/server";

const WINDOW_SECONDS = 60;
const EDGE_LIMIT = 45;

export async function middleware(request: NextRequest) {
  // Never trust a browser-supplied marker. Only this middleware can set it after checking Redis.
  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.delete("x-sg-edge-rate-limit");

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    return NextResponse.next({ request: { headers: forwardedHeaders } });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const routeGroup = request.nextUrl.pathname.split("/")[2] || "api";
  const key = `sg:edge-rate:${routeGroup}:${ip}`;

  try {
    const response = await fetch(`${redisUrl.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, WINDOW_SECONDS]]),
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) throw new Error(`Upstash returned ${response.status}`);
    const commands = (await response.json()) as Array<{ result?: number | string }>;
    const count = Number(commands?.[0]?.result ?? 0);
    const ttl = Number(commands?.[1]?.result ?? WINDOW_SECONDS);

    if (count > EDGE_LIMIT) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please wait a moment and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(1, ttl)),
            "X-RateLimit-Limit": String(EDGE_LIMIT),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    forwardedHeaders.set("x-sg-edge-rate-limit", "checked");
    return NextResponse.next({ request: { headers: forwardedHeaders } });
  } catch (error) {
    // Route handlers keep a process-local limiter as a fail-safe if Redis is unavailable.
    console.error("Edge rate limit store unavailable:", error);
    return NextResponse.next({ request: { headers: forwardedHeaders } });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
