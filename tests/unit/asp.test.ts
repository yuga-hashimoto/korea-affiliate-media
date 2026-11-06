import { describe, expect, it } from "vitest";
import { parseAspCsv, parseCsv, summarizeConversions } from "@/lib/analytics/asp";

const csv = `conversion_id,program_id,amount,commission,currency,status,event_at,confirmed_at
c1,prog-a,10000,500,JPY,approved,2026-11-01T00:00:00.000Z,2026-11-03T00:00:00.000Z
c2,prog-a,20000,1000,JPY,pending,2026-11-02T00:00:00.000Z,
c3,prog-b,30000,1500,JPY,rejected,2026-11-02T00:00:00.000Z,
c4,prog-b,40,6,USD,approved,2026-11-03T00:00:00.000Z,2026-11-05T00:00:00.000Z
c1,prog-a,10000,500,JPY,paid,2026-11-01T00:00:00.000Z,2026-11-06T00:00:00.000Z`;

describe("parseCsv", () => {
  it("引用符内のカンマと改行を保持する", () => {
    const rows = parseCsv('a,"b,c"\n"d\ne",f');
    expect(rows).toEqual([
      ["a", "b,c"],
      ["d\ne", "f"],
    ]);
  });
});

describe("parseAspCsv", () => {
  it("CSVをパースし、不正行をエラーとして返す", () => {
    const broken = `${csv}\nbad,row`;
    const result = parseAspCsv(broken);
    expect(result.rows.length).toBe(5);
    expect(result.errors.length).toBe(1);
  });
});

describe("summarizeConversions", () => {
  const parsed = parseAspCsv(csv);

  it("重複IDを排除し、状態の進んだ行を優先する", () => {
    const summary = summarizeConversions(parsed.rows);
    expect(summary.duplicates).toContain("c1");
    expect(summary.counts.paid).toBe(1);
    expect(summary.counts.approved).toBe(1);
  });

  it("通貨ごとに確定・見込・却下を分けて集計する", () => {
    const summary = summarizeConversions(parsed.rows);
    expect(summary.byCurrency.JPY).toEqual({
      approved: 0,
      paid: 500,
      pending: 1000,
      rejected: 1500,
    });
    expect(summary.byCurrency.USD).toEqual({
      approved: 6,
      paid: 0,
      pending: 0,
      rejected: 0,
    });
    expect(summary.revenueByProgram["prog-a"]?.JPY).toBe(500);
    expect(summary.revenueByProgram["prog-b"]?.USD).toBe(6);
  });

  it("通貨をまたいだ合算をしない", () => {
    const summary = summarizeConversions(parsed.rows);
    expect(Object.keys(summary.byCurrency).sort()).toEqual(["JPY", "USD"]);
  });
});
