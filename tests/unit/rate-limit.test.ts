import { describe, expect, it } from "vitest";
import { FixedWindowRateLimiter } from "@/lib/rate-limit";

describe("FixedWindowRateLimiter", () => {
  it("上限まで許可し、超過を拒否する", () => {
    const limiter = new FixedWindowRateLimiter(2, 60_000);
    expect(limiter.check("a", 0).allowed).toBe(true);
    expect(limiter.check("a", 1).allowed).toBe(true);
    const blocked = limiter.check("a", 2);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("ウィンドウ経過後に再度許可する", () => {
    const limiter = new FixedWindowRateLimiter(1, 1000);
    expect(limiter.check("b", 0).allowed).toBe(true);
    expect(limiter.check("b", 500).allowed).toBe(false);
    expect(limiter.check("b", 1500).allowed).toBe(true);
  });

  it("キーごとに独立して数える", () => {
    const limiter = new FixedWindowRateLimiter(1, 1000);
    expect(limiter.check("x", 0).allowed).toBe(true);
    expect(limiter.check("y", 0).allowed).toBe(true);
  });
});
