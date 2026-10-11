/**
 * Small in-memory rate limiter for the public form endpoints. No local imports
 * (so `node --test` can load this file directly).
 *
 * On serverless hosting each instance keeps its own counts, so this is a
 * best-effort brake against a burst from one address, not a hard guarantee.
 */

const DEFAULT_MAX_KEYS = 5000;

export interface RateLimiter {
  /** True when the request is allowed; false when the caller is over the limit. */
  check(key: string, now?: number): boolean;
  size(): number;
}

export function createRateLimiter(
  limit: number,
  windowMs: number,
  maxKeys: number = DEFAULT_MAX_KEYS,
): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key: string, now: number = Date.now()): boolean {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      // Delete then set so the most recently seen keys stay at the end.
      hits.delete(key);
      hits.set(key, [...recent, now]);
      if (hits.size > maxKeys) {
        const oldest = hits.keys().next().value;
        if (oldest !== undefined) hits.delete(oldest);
      }
      return true;
    },
    size: (): number => hits.size,
  };
}

/** Best available client address behind the hosting proxy. */
export function clientKey(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}
