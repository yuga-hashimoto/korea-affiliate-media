import { describe, expect, it } from "vitest";
import type { AffiliateProgram, Merchant } from "@/lib/domain";
import type { AspRow } from "@/lib/analytics/asp";
import {
  aggregateByProgram,
  buildDashboard,
  escapeHtml,
  formatMoney,
  renderDashboardHtml,
} from "@/lib/analytics/dashboard";

const PROGRAMS: AffiliateProgram[] = [
  {
    id: "prog-a",
    merchantId: "merchant-a",
    status: "approved",
    allowedMedia: ["web"],
    approvedAt: "2026-11-01T00:00:00.000Z",
    linkTemplate: null,
    commissionNote: "5%",
    notes: "",
    updatedAt: "2026-11-01T00:00:00.000Z",
  },
  {
    id: "prog-b",
    merchantId: "merchant-b",
    status: "approved",
    allowedMedia: ["web"],
    approvedAt: "2026-11-01T00:00:00.000Z",
    linkTemplate: null,
    commissionNote: "2%",
    notes: "",
    updatedAt: "2026-11-01T00:00:00.000Z",
  },
  {
    id: "prog-pending",
    merchantId: "merchant-a",
    status: "pending",
    allowedMedia: [],
    approvedAt: null,
    linkTemplate: null,
    commissionNote: "未確認",
    notes: "",
    updatedAt: "2026-11-01T00:00:00.000Z",
  },
];

const MERCHANTS: Merchant[] = [
  {
    id: "merchant-a",
    name: "テスト商店A",
    siteUrl: "https://example.com/",
    country: "JP",
    dataPolicy: "unknown",
    notes: "",
  },
  {
    id: "merchant-b",
    name: "テスト商店B",
    siteUrl: "https://example.org/",
    country: "KR",
    dataPolicy: "unknown",
    notes: "",
  },
];

function row(overrides: Partial<AspRow>): AspRow {
  return {
    externalConversionId: "c1",
    programId: "prog-a",
    amount: 10_000,
    commissionAmount: 500,
    currency: "JPY",
    status: "approved",
    eventAt: "2026-11-01T00:00:00.000Z",
    confirmedAt: null,
    source: "a8.csv",
    ...overrides,
  };
}

const ROWS: AspRow[] = [
  row({ externalConversionId: "c1", programId: "prog-a", amount: 10_000, commissionAmount: 500 }),
  row({
    externalConversionId: "c2",
    programId: "prog-a",
    amount: 20_000,
    commissionAmount: 1_000,
    status: "pending",
    eventAt: "2026-11-05T00:00:00.000Z",
  }),
  row({
    externalConversionId: "c3",
    programId: "prog-b",
    amount: 40,
    commissionAmount: 6,
    currency: "USD",
    status: "paid",
    source: "vc.csv",
  }),
  row({
    externalConversionId: "c4",
    programId: "prog-b",
    amount: 30_000,
    commissionAmount: 1_500,
    status: "rejected",
  }),
  row({
    externalConversionId: "c5",
    programId: "prog-b",
    amount: 5_000,
    commissionAmount: 250,
    status: "reversed",
    eventAt: "2026-11-03T00:00:00.000Z",
  }),
];

describe("aggregateByProgram", () => {
  const aggregated = aggregateByProgram(ROWS, PROGRAMS, MERCHANTS);
  const programA = aggregated.programs.find((p) => p.programId === "prog-a");
  const programB = aggregated.programs.find((p) => p.programId === "prog-b");

  it("プログラム×通貨で報酬と売上を分けて集計する", () => {
    expect(programA?.byCurrency.JPY?.approvedCommission).toBe(500);
    expect(programA?.byCurrency.JPY?.approvedSales).toBe(10_000);
    expect(programA?.byCurrency.JPY?.pendingCommission).toBe(1_000);
    expect(programB?.byCurrency.USD?.paidCommission).toBe(6);
    expect(programB?.byCurrency.USD?.paidSales).toBe(40);
  });

  it("確定報酬に pending を含めない", () => {
    expect(programA?.byCurrency.JPY?.confirmedCommission).toBe(500);
    expect(programA?.byCurrency.JPY?.confirmedSales).toBe(10_000);
  });

  it("却下と返金をまとめて対象外にする", () => {
    expect(programB?.byCurrency.JPY?.rejectedCommission).toBe(1_750);
    expect(programB?.byCurrency.JPY?.rejectedCount).toBe(2);
  });

  it("通貨をまたいだ合算をしない", () => {
    expect(Object.keys(aggregated.totalsByCurrency).sort()).toEqual(["JPY", "USD"]);
    expect(aggregated.totalsByCurrency.JPY?.confirmedCommission).toBe(500);
    expect(aggregated.totalsByCurrency.USD?.paidCommission).toBe(6);
  });

  it("事業者名を表示名に使い、取込元を保持する", () => {
    expect(programA?.displayName).toBe("テスト商店A");
    expect(programB?.sources).toEqual(["a8.csv", "vc.csv"]);
    expect(programA?.lastEventAt).toBe("2026-11-05T00:00:00.000Z");
  });

  it("未登録のprogram_idも金額を落とさず未登録として残す", () => {
    const withUnknown = aggregateByProgram(
      [...ROWS, row({ externalConversionId: "x1", programId: "prog-x", commissionAmount: 900 })],
      PROGRAMS,
      MERCHANTS,
    );
    const unknown = withUnknown.programs.find((p) => p.programId === "prog-x");
    expect(unknown?.registered).toBe(false);
    expect(unknown?.displayName).toBe("prog-x");
    expect(withUnknown.unknownProgramIds).toEqual(["prog-x"]);
    expect(withUnknown.totalsByCurrency.JPY?.approvedCommission).toBe(1_400);
  });

  it("重複IDは状態の進んだ行を優先する", () => {
    const deduped = aggregateByProgram(
      [
        row({ externalConversionId: "d1", commissionAmount: 500, status: "approved" }),
        row({ externalConversionId: "d1", commissionAmount: 500, status: "paid" }),
      ],
      PROGRAMS,
      MERCHANTS,
    );
    expect(deduped.rowCount).toBe(1);
    expect(deduped.duplicates).toEqual(["d1"]);
    expect(deduped.programs[0]?.byCurrency.JPY?.paidCommission).toBe(500);
    expect(deduped.programs[0]?.byCurrency.JPY?.approvedCommission).toBe(0);
  });
});

describe("buildDashboard", () => {
  it("提携済みで未取込のプログラムだけを未取込に列挙する", () => {
    const data = buildDashboard({
      rows: [row({ programId: "prog-a" })],
      programs: PROGRAMS,
      merchants: MERCHANTS,
      generatedAt: "2026-11-10T00:00:00.000Z",
    });
    expect(data.notImported.map((p) => p.programId)).toEqual(["prog-b"]);
  });

  it("対象期間を成果日時の最小・最大から求める", () => {
    const data = buildDashboard({
      rows: ROWS,
      programs: PROGRAMS,
      merchants: MERCHANTS,
      generatedAt: "2026-11-10T00:00:00.000Z",
    });
    expect(data.period.from).toBe("2026-11-01T00:00:00.000Z");
    expect(data.period.to).toBe("2026-11-05T00:00:00.000Z");
    expect(data.rowCount).toBe(5);
  });

  it("データが無い場合は0件ではなく未取込として扱う", () => {
    const data = buildDashboard({
      rows: [],
      programs: PROGRAMS,
      merchants: MERCHANTS,
      generatedAt: "2026-11-10T00:00:00.000Z",
      importedFiles: [],
    });
    expect(data.rowCount).toBe(0);
    expect(data.programs).toEqual([]);
    expect(data.totalsByCurrency).toEqual({});
    expect(data.notImported.map((p) => p.programId)).toEqual(["prog-a", "prog-b"]);
  });
});

describe("formatMoney", () => {
  it("JPYは小数を出さず、USDは小数2桁で表示する", () => {
    expect(formatMoney(1_440, "JPY")).toContain("1,440");
    expect(formatMoney(1_440, "JPY")).not.toContain(".00");
    expect(formatMoney(6, "USD")).toBe("$6.00");
  });
});

describe("renderDashboardHtml", () => {
  const data = buildDashboard({
    rows: ROWS,
    programs: PROGRAMS,
    merchants: MERCHANTS,
    generatedAt: "2026-11-10T00:00:00.000Z",
    importedFiles: ["a8.csv", "vc.csv"],
  });

  it("noindex とローカル専用の注意を出力する", () => {
    const html = renderDashboardHtml(data);
    expect(html).toContain('name="robots" content="noindex, nofollow, noarchive"');
    expect(html).toContain("ローカル専用");
  });

  it("プログラム別の確定報酬と未取込を出力する", () => {
    const withUnimported = buildDashboard({
      rows: ROWS,
      programs: [
        ...PROGRAMS,
        {
          id: "prog-c",
          merchantId: "merchant-a",
          status: "approved" as const,
          allowedMedia: ["web" as const],
          approvedAt: "2026-11-01T00:00:00.000Z",
          linkTemplate: null,
          commissionNote: "5%",
          notes: "",
          updatedAt: "2026-11-01T00:00:00.000Z",
        },
      ],
      merchants: MERCHANTS,
      generatedAt: "2026-11-10T00:00:00.000Z",
      importedFiles: ["a8.csv", "vc.csv"],
    });
    const html = renderDashboardHtml(withUnimported);
    expect(html).toContain(formatMoney(500, "JPY"));
    expect(html).toContain("テスト商店A");
    expect(html).toContain("成果データが未取込");
    expect(html).toContain("（0件ではなく「未取得」）");
  });

  it("外部入力をHTMLエスケープする", () => {
    const html = renderDashboardHtml(
      buildDashboard({
        rows: [
          row({
            externalConversionId: "e1",
            programId: 'prog-<img src=x onerror="alert(1)">',
            source: 'a8".csv',
          }),
        ],
        programs: PROGRAMS,
        merchants: MERCHANTS,
        generatedAt: "2026-11-10T00:00:00.000Z",
        importedFiles: ['a8".csv'],
      }),
    );
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img src=x");
    expect(html).toContain("a8&quot;.csv");
  });

  it("データが無いときは取り込み手順を表示し、架空の数値を出さない", () => {
    const empty = buildDashboard({
      rows: [],
      programs: PROGRAMS,
      merchants: MERCHANTS,
      generatedAt: "2026-11-10T00:00:00.000Z",
    });
    const html = renderDashboardHtml(empty);
    expect(html).toContain("成果CSVの取り込み");
    expect(html).toContain("conversion_id,program_id,amount");
    expect(html).not.toContain("￥");
  });

  it("サンプルのときだけ架空データの警告を出す", () => {
    const demo = buildDashboard({
      rows: ROWS,
      programs: PROGRAMS,
      merchants: MERCHANTS,
      generatedAt: "2026-11-10T00:00:00.000Z",
      demo: true,
    });
    expect(renderDashboardHtml(demo)).toContain("サンプルデータ（架空の数値）");
    expect(renderDashboardHtml(data)).not.toContain("サンプルデータ（架空の数値）");
  });
});

describe("escapeHtml", () => {
  it("HTML特殊文字を無害化する", () => {
    expect(escapeHtml('<a href="x">&\'')).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&#39;",
    );
  });
});
