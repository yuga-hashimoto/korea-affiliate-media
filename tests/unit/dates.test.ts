import { describe, expect, it } from "vitest";
import { isPast, isStale, tokyoDayKey } from "@/lib/dates";

describe("dates", () => {
  it("過去日時を判定する", () => {
    expect(isPast("2026-01-01T00:00:00.000Z", new Date("2026-06-01T00:00:00.000Z"))).toBe(true);
    expect(isPast("2027-01-01T00:00:00.000Z", new Date("2026-06-01T00:00:00.000Z"))).toBe(false);
    expect(isPast(null, new Date())).toBe(false);
  });

  it("証跡の鮮度を判定する", () => {
    const now = new Date("2026-11-06T00:00:00.000Z");
    expect(isStale("2026-11-05T00:00:00.000Z", now)).toBe(false);
    expect(isStale("2026-10-01T00:00:00.000Z", now)).toBe(true);
  });

  it("東京時間の日付キーを返す", () => {
    expect(tokyoDayKey(new Date("2026-11-06T15:30:00.000Z"))).toBe("2026-11-07");
    expect(tokyoDayKey(new Date("2026-11-06T14:30:00.000Z"))).toBe("2026-11-06");
  });
});
