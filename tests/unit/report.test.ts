import { describe, expect, it } from "vitest";
import { buildDailyReport, summarizeClicks } from "@/lib/analytics/report";
import type { ClickRecord } from "@/lib/analytics/report";

const clicks: ClickRecord[] = [
  { offerId: "a", articleId: null, channel: "x", day: "2026-11-05", createdAt: "" },
  { offerId: "a", articleId: null, channel: "search", day: "2026-11-05", createdAt: "" },
  { offerId: "b", articleId: null, channel: "x", day: "2026-11-06", createdAt: "" },
];

describe("summarizeClicks", () => {
  it("オファー・チャネル・日別に集計する", () => {
    const summary = summarizeClicks(clicks);
    expect(summary.total).toBe(3);
    expect(summary.byOffer[0]).toEqual({ offerId: "a", count: 2 });
    expect(summary.byChannel[0]).toEqual({ channel: "x", count: 2 });
    expect(summary.byDay.map((d) => d.day)).toEqual(["2026-11-05", "2026-11-06"]);
  });
});

describe("buildDailyReport", () => {
  it("成果CSV未取り込みを0円と表現しない", () => {
    const report = buildDailyReport({
      date: "2026-11-06",
      clicks,
      conversions: null,
      staleOffers: 1,
      pendingPromotions: 2,
      ingestionStatus: "未実行",
    });
    expect(report).toContain("成果CSVが未取り込み");
    expect(report).toContain("合計: 3件");
    expect(report).toContain("再確認が必要なオファー: 1件");
    expect(report).not.toContain("確定報酬（approved+paid）: ¥0");
  });
});
