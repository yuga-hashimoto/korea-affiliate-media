import { describe, expect, it } from "vitest";
import {
  formatPagesRanking,
  ga4Config,
  rowsToPageRows,
  type Ga4PagesReport,
} from "@/lib/analytics/ga4";

describe("ga4Config", () => {
  it("プロパティIDと資格情報が未設定なら null（安全に停止）", () => {
    const saved = {
      propertyId: process.env.GA4_PROPERTY_ID,
      credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    };
    try {
      delete process.env.GA4_PROPERTY_ID;
      delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
      expect(ga4Config()).toBeNull();
    } finally {
      process.env.GA4_PROPERTY_ID = saved.propertyId;
      process.env.GOOGLE_APPLICATION_CREDENTIALS = saved.credentials;
    }
  });

  it("数字以外のプロパティIDは null", () => {
    const saved = {
      propertyId: process.env.GA4_PROPERTY_ID,
      credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    };
    try {
      process.env.GA4_PROPERTY_ID = "G-XXXX";
      process.env.GOOGLE_APPLICATION_CREDENTIALS = "/tmp/sa.json";
      expect(ga4Config()).toBeNull();
    } finally {
      process.env.GA4_PROPERTY_ID = saved.propertyId;
      process.env.GOOGLE_APPLICATION_CREDENTIALS = saved.credentials;
    }
  });
});

describe("rowsToPageRows", () => {
  it("GA4レスポンス行を表示回数の降順に整形する", () => {
    const rows = rowsToPageRows([
      {
        dimensionValues: [{ value: "ホーム" }, { value: "/" }],
        metricValues: [{ value: "12" }],
      },
      {
        dimensionValues: [{ value: "記事A" }, { value: "/articles/a/" }],
        metricValues: [{ value: "30" }],
      },
      {
        dimensionValues: [{ value: "記事B" }, { value: "/articles/b/" }],
        metricValues: [{ value: "7" }],
      },
    ]);
    expect(rows[0]).toEqual({
      pageTitle: "記事A",
      pagePath: "/articles/a/",
      views: 30,
    });
    expect(rows.map((r) => r.views)).toEqual([30, 12, 7]);
  });

  it("欠損値は推測せず (unknown)/0 として扱う", () => {
    const rows = rowsToPageRows([
      { dimensionValues: [], metricValues: [] },
    ]);
    expect(rows[0]).toEqual({
      pageTitle: "(unknown)",
      pagePath: "(unknown)",
      views: 0,
    });
  });

  it("非数値の指標は0として扱う", () => {
    const rows = rowsToPageRows([
      {
        dimensionValues: [{ value: "t" }, { value: "/p/" }],
        metricValues: [{ value: "not-a-number" }],
      },
    ]);
    expect(rows[0]?.views).toBe(0);
  });
});

describe("formatPagesRanking", () => {
  it("データ無しのときに0や確定値と表現しない", () => {
    const report: Ga4PagesReport = {
      rows: [],
      range: { start: "7daysAgo", end: "today" },
    };
    const text = formatPagesRanking(report);
    expect(text).toContain("まだデータがありません");
    expect(text).toContain("7daysAgo");
  });

  it("ランク表を出力する", () => {
    const report: Ga4PagesReport = {
      rows: [
        { pageTitle: "記事A", pagePath: "/articles/a/", views: 30 },
        { pageTitle: "ホーム", pagePath: "/", views: 12 },
      ],
      range: { start: "7daysAgo", end: "today" },
    };
    const text = formatPagesRanking(report);
    expect(text).toContain("| 1 | 記事A | `/articles/a/` | 30 |");
    expect(text).toContain("| 2 | ホーム | `/` | 12 |");
  });
});
