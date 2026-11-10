import { describe, expect, it } from "vitest";
import { parseAspReports } from "@/lib/analytics/asp-reports";

const valid = {
  checkedAt: "2026-11-10T00:30:00.000Z",
  reports: [
    {
      id: "amazon-2026-11-08",
      provider: "Amazonアソシエイト",
      programIds: ["prog-amazon"],
      period: { from: "2026-11-08", to: "2026-11-09" },
      checkedAt: "2026-11-10T00:30:00.000Z",
      clicks: 4,
      confirmedCommission: { JPY: 0 },
      pendingCommission: {},
      confirmedSales: { JPY: 0 },
      note: "レポート（今週）で確認",
      sourceUrl: "https://affiliate.amazon.co.jp/p/reporting/earnings",
    },
    {
      id: "a8-2026-11",
      provider: "A8.net",
      programIds: ["prog-sazo", "prog-bqcell"],
      period: { from: "2026-11-01", to: "2026-11-10" },
      checkedAt: "2026-11-10T00:30:00.000Z",
      clicks: null,
      note: "成果別レポート: 該当データなし",
    },
  ],
};

describe("parseAspReports", () => {
  it("管理画面サマリを読み取り、未指定項目を既定値で補う", () => {
    const parsed = parseAspReports(valid);
    expect(parsed.errors).toEqual([]);
    expect(parsed.reports).toHaveLength(2);
    expect(parsed.reports[1]?.confirmedCommission).toEqual({});
    expect(parsed.reports[1]?.clicks).toBeNull();
    expect(parsed.reports[1]?.note).toBe("成果別レポート: 該当データなし");
  });

  it("不正な通貨・日付・日時はエラーとして返し、サマリを採用しない", () => {
    const parsed = parseAspReports({
      checkedAt: "2026-11-10T00:30:00.000Z",
      reports: [
        {
          id: "bad",
          provider: "X",
          period: { from: "2026/11/08", to: "2026-11-09" },
          checkedAt: "2026-11-10T00:30:00.000Z",
          confirmedCommission: { EUR: 10 },
        },
      ],
    });
    expect(parsed.reports).toEqual([]);
    expect(parsed.errors.length).toBeGreaterThan(0);
  });

  it("トップレベルが空でもサマリを空配列として返す", () => {
    const parsed = parseAspReports([]);
    expect(parsed.reports).toEqual([]);
    expect(parsed.errors.length).toBeGreaterThan(0);
  });
});
