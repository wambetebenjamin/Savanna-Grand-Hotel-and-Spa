import { Redis } from "@upstash/redis";

type RateLimitState = { count: number; resetAt: number };
type RateLimitResult = { allowed: boolean; limit: number; remaining: number; resetAt: number };

const localBuckets = new Map<string, RateLimitState>();
const WINDOW_SECONDS = 60;

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return (
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function enforceRateLimit(
  request: Request,
  scope: string,
  limit = 10,
): Promise<RateLimitResult> {
  const now = Date.now();
  const resetAt = now + WINDOW_SECONDS * 1000;
  const ip = getClientIp(request);
  const hasRedis = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );

  // In production the Edge middleware already performed this distributed check.
  // The header is stripped and re-added by middleware, never trusted from the browser.
  if (hasRedis && request.headers.get("x-sg-edge-rate-limit") === "checked") {
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  if (hasRedis) {
    try {
      const redis = Redis.fromEnv();
      const key = `sg:rate:${scope}:${ip}`;
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, WINDOW_SECONDS);
      const ttl = await redis.ttl(key);
      const edgeResetAt = now + Math.max(1, ttl) * 1000;
      return {
        allowed: count <= limit,
        limit,
        remaining: Math.max(0, limit - count),
        resetAt: edgeResetAt,
      };
    } catch (error) {
      console.error("Rate limit store unavailable; falling back to process memory.", error);
    }
  }

  const key = `${scope}:${ip}`;
  const current = localBuckets.get(key);
  let next: RateLimitState;
  if (!current || current.resetAt <= now) {
    next = { count: 1, resetAt };
  } else {
    next = { count: current.count + 1, resetAt: current.resetAt };
  }
  localBuckets.set(key, next);

  // Keep the local fallback bounded in a warm serverless process.
  if (localBuckets.size > 3000) {
    for (const [bucketKey, value] of localBuckets) {
      if (value.resetAt <= now) localBuckets.delete(bucketKey);
    }
  }

  return {
    allowed: next.count <= limit,
    limit,
    remaining: Math.max(0, limit - next.count),
    resetAt: next.resetAt,
  };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}
