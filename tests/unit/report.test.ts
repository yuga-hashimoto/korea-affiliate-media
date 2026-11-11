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

describe("buildDailyReport のアクセス（GA4）セクション", () => {
  const base = {
    date: "2026-11-11",
    conversions: null,
    staleContent: 0,
    pendingPromotions: 0,
  } as const;

  it("GA4未接続（traffic未指定）ならセクションを出さない", () => {
    const report = buildDailyReport({ ...base });
    expect(report).not.toContain("アクセス（GA4）");
  });

  it("取得失敗（traffic=null）は数値を出さず、推測しないと明記する", () => {
    const report = buildDailyReport({ ...base, traffic: null });
    expect(report).toContain("アクセス（GA4）");
    expect(report).toContain("取得できませんでした");
    expect(report).not.toContain("期間合計: PV");
  });

  it("日別の行から合計と日別内訳を出し、重複の注意を添える", () => {
    const report = buildDailyReport({
      ...base,
      traffic: {
        rows: [
          { date: "2026-11-07", activeUsers: 4, views: 9, sessions: 6 },
          { date: "2026-11-08", activeUsers: 5, views: 5, sessions: 5 },
        ],
      },
    });
    expect(report).toContain("期間合計: PV 14 / セッション 11 / 日別ユーザーの単純合計 9");
    expect(report).toContain("11/07 4人/9PV");
    expect(report).toContain("11/08 5人/5PV");
    expect(report).toContain("一致しません");
  });

  it("データが空のときは0として断定しない", () => {
    const report = buildDailyReport({ ...base, traffic: { rows: [] } });
    expect(report).toContain("まだありません");
    expect(report).not.toContain("PV 0");
  });
});
