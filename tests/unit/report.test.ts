import { describe, expect, it } from "vitest";
import { buildDailyReport } from "@/lib/analytics/report";
import type { AspRow } from "@/lib/analytics/asp";
import { summarizeConversions } from "@/lib/analytics/asp";

const conversions: AspRow[] = [
  {
    externalConversionId: "c1",
    programId: "prog-a",
    amount: 10000,
    commissionAmount: 500,
    currency: "JPY",
    status: "approved",
    eventAt: "2026-11-05T00:00:00.000Z",
    confirmedAt: "2026-11-06T00:00:00.000Z",
    source: "test",
  },
];

describe("buildDailyReport", () => {
  it("成果CSV未取り込みを0円と表現しない", () => {
    const report = buildDailyReport({
      date: "2026-11-06",
      conversions: null,
      staleContent: 1,
      pendingPromotions: 2,
    });
    expect(report).toContain("成果CSVが未取り込み");
    expect(report).toContain("再確認が必要な記事・出典: 1件");
    expect(report).not.toContain("確定 0");
  });

  it("通貨ごとに確定・見込を分けて表示する", () => {
    const report = buildDailyReport({
      date: "2026-11-06",
      conversions: {
        rows: conversions,
        summary: summarizeConversions(conversions),
      },
      staleContent: 0,
      pendingPromotions: 0,
    });
    expect(report).toContain("JPY: 確定 500 / 見込 0 / 却下・返金 0");
    expect(report).toContain("通貨が異なる成果は合算していません");
  });
});
