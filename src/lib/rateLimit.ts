/**
 * High-Performance Sliding Window In-Memory Rate Limiter
 * Provides enterprise-grade protection against brute-force, credential stuffing, and spamming
 * Zero external dependencies (no Redis required for localhost/single-instance)
 */

interface RateLimitRecord {
  timestamps: number[];
}

const storage = new Map<string, RateLimitRecord>();

// Periodically clean up expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of storage.entries()) {
      // Keep only timestamps from the last 60 minutes
      const valid = record.timestamps.filter((ts) => now - ts < 60 * 60 * 1000);
      if (valid.length === 0) {
        storage.delete(key);
      } else {
        record.timestamps = valid;
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
  totalHits: number;
}

/**
 * Checks and records an action under a given rate limit policy
 * @param identifier Unique key (e.g. `login:127.0.0.1` or `contact:ip`)
 * @param maxLimit Maximum allowed actions within windowMs
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  maxLimit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = storage.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    storage.set(identifier, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= maxLimit) {
    const oldest = record.timestamps[0];
    const resetTime = oldest + windowMs;
    const retryAfterSec = Math.max(1, Math.ceil((resetTime - now) / 1000));

    return {
      allowed: false,
      remaining: 0,
      retryAfterSec,
      totalHits: record.timestamps.length,
    };
  }

  // Record this hit
  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxLimit - record.timestamps.length,
    retryAfterSec: 0,
    totalHits: record.timestamps.length,
  };
}

/**
 * Resets a rate limit counter (e.g. after successful login)
 */
export function resetRateLimit(identifier: string): void {
  storage.delete(identifier);
}

/**
 * Extracts client IP safely from Next.js request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
