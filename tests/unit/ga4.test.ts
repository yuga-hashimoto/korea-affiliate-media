import { generateKeyPairSync } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  fetchGa4PagesReport,
  fetchGa4TrafficReport,
  formatDailyTraffic,
  formatGa4Date,
  formatPagesRanking,
  ga4Config,
  rowsToDailyRows,
  rowsToPageRows,
  type Ga4PagesReport,
  type Ga4TrafficReport,
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

describe("formatGa4Date", () => {
  it("GA4のdateディメンション(YYYYMMDD)をYYYY-MM-DDにする", () => {
    expect(formatGa4Date("20261107")).toBe("2026-11-07");
  });

  it("想定外の形式は推測せずそのまま返す", () => {
    expect(formatGa4Date("(unknown)")).toBe("(unknown)");
  });
});

describe("rowsToDailyRows", () => {
  it("日付の昇順に並べ、ユーザー数/PV/セッションを数値化する", () => {
    const rows = rowsToDailyRows([
      {
        dimensionValues: [{ value: "20261109" }],
        metricValues: [{ value: "2" }, { value: "4" }, { value: "2" }],
      },
      {
        dimensionValues: [{ value: "20261107" }],
        metricValues: [{ value: "4" }, { value: "9" }, { value: "6" }],
      },
    ]);
    expect(rows.map((r) => r.date)).toEqual(["2026-11-07", "2026-11-09"]);
    expect(rows[0]).toEqual({
      date: "2026-11-07",
      activeUsers: 4,
      views: 9,
      sessions: 6,
    });
  });

  it("欠損値は推測せず0として扱う", () => {
    const rows = rowsToDailyRows([
      { dimensionValues: [], metricValues: [] },
    ]);
    expect(rows[0]).toEqual({
      date: "(unknown)",
      activeUsers: 0,
      views: 0,
      sessions: 0,
    });
  });
});

describe("formatDailyTraffic", () => {
  const report: Ga4TrafficReport = {
    rows: [
      { date: "2026-11-07", activeUsers: 4, views: 9, sessions: 6 },
      { date: "2026-11-08", activeUsers: 5, views: 5, sessions: 5 },
    ],
    range: { start: "7daysAgo", end: "today" },
  };

  it("期間合計と日別の表を出す", () => {
    const text = formatDailyTraffic(report);
    expect(text).toContain("PV **14**");
    expect(text).toContain("セッション **11**");
    expect(text).toContain("| 2026-11-07 | 4 | 9 | 6 |");
    expect(text).toContain("| 2026-11-08 | 5 | 5 | 5 |");
  });

  it("日別ユーザーの合計は期間ユニークと一致しない旨を明記する", () => {
    const text = formatDailyTraffic(report);
    expect(text).toContain("一致しません");
  });

  it("データ無しのときは0として断定しない", () => {
    const text = formatDailyTraffic({
      rows: [],
      range: { start: "7daysAgo", end: "today" },
    });
    expect(text).toContain("まだデータがありません");
    expect(text).not.toContain("PV **0**");
  });
});

describe("GA4 Data API へのリクエスト", () => {
  let credentialsPath = "";
  const calls: { url: string; init?: RequestInit }[] = [];

  beforeAll(async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "ga4-test-"));
    credentialsPath = path.join(dir, "service-account.json");
    const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    await writeFile(
      credentialsPath,
      JSON.stringify({
        client_email: "ga4-reader@example.iam.gserviceaccount.com",
        private_key: String(privateKey.export({ type: "pkcs8", format: "pem" })),
      }),
      "utf8",
    );
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  function installFetchMock(): void {
    calls.length = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        calls.push({ url, init });
        if (url === "https://oauth2.googleapis.com/token") {
          return new Response(JSON.stringify({ access_token: "test-token" }), {
            status: 200,
          });
        }
        const body = JSON.parse(String(init?.body ?? "{}")) as {
          requests?: { dimensions?: { name: string }[] }[];
        };
        const isDaily = body.requests?.[0]?.dimensions?.[0]?.name === "date";
        const rows = isDaily
          ? [
              {
                dimensionValues: [{ value: "20261107" }],
                metricValues: [
                  { value: "4" },
                  { value: "9" },
                  { value: "6" },
                ],
              },
            ]
          : [
              {
                dimensionValues: [{ value: "ホーム" }, { value: "/" }],
                metricValues: [{ value: "20" }],
              },
            ];
        return new Response(JSON.stringify({ reports: [{ rows }] }), {
          status: 200,
        });
      }),
    );
  }

  it("ページ別レポートは properties/{id}:batchRunReports へPOSTする", async () => {
    installFetchMock();
    const report = await fetchGa4PagesReport(
      { propertyId: "563135187", credentialsPath },
      { start: "7daysAgo", end: "today" },
    );
    expect(report.rows).toEqual([
      { pageTitle: "ホーム", pagePath: "/", views: 20 },
    ]);
    const reportCall = calls.find((c) =>
      c.url.includes("analyticsdata.googleapis.com"),
    );
    expect(reportCall?.url).toBe(
      "https://analyticsdata.googleapis.com/v1beta/properties/563135187:batchRunReports",
    );
    const body = JSON.parse(String(reportCall?.init?.body ?? "{}")) as {
      requests?: Record<string, unknown>[];
      entity?: unknown;
    };
    expect(body.entity).toBeUndefined();
    expect(body.requests?.[0]?.property).toBeUndefined();
    expect(body.requests?.[0]?.dimensions).toEqual([
      { name: "pageTitle" },
      { name: "pagePath" },
    ]);
    expect(
      (reportCall?.init?.headers as Record<string, string>).authorization,
    ).toBe("Bearer test-token");
  });

  it("日別レポートは date ディメンションで取得する", async () => {
    installFetchMock();
    const report = await fetchGa4TrafficReport(
      { propertyId: "563135187", credentialsPath },
      { start: "14daysAgo", end: "today" },
    );
    expect(report.rows).toEqual([
      { date: "2026-11-07", activeUsers: 4, views: 9, sessions: 6 },
    ]);
    const reportCall = calls.find((c) =>
      c.url.includes("analyticsdata.googleapis.com"),
    );
    const body = JSON.parse(String(reportCall?.init?.body ?? "{}")) as {
      requests?: { dimensions?: { name: string }[]; metrics?: { name: string }[] }[];
    };
    expect(body.requests?.[0]?.dimensions).toEqual([{ name: "date" }]);
    expect(body.requests?.[0]?.metrics).toEqual([
      { name: "activeUsers" },
      { name: "screenPageViews" },
      { name: "sessions" },
    ]);
  });
});
