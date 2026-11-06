/**
 * シンプルなメモリ内レートリミッタ。
 * 単一インスタンスのMVP用。分散環境ではUpstash/Redis等に置き換える。
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export class FixedWindowRateLimiter {
  private readonly hits = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  check(key: string, now = Date.now()): RateLimitResult {
    const entry = this.hits.get(key);
    if (!entry || entry.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, remaining: this.limit - 1, retryAfterSeconds: 0 };
    }
    if (entry.count >= this.limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      };
    }
    entry.count += 1;
    return {
      allowed: true,
      remaining: this.limit - entry.count,
      retryAfterSeconds: 0,
    };
  }

  reset(): void {
    this.hits.clear();
  }
}
