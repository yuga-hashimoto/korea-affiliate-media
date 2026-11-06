import { describe, expect, it } from "vitest";
import { compareOffers } from "@/lib/compare";
import {
  NOW,
  offer,
  approvedProgram,
  pendingProgram,
  verifiedEvidence,
} from "./fixtures";

const baseOptions = {
  now: NOW,
  rates: [],
  evidence: [verifiedEvidence],
  programs: [approvedProgram],
  allowSample: false,
};

describe("compareOffers", () => {
  it("確認済みの総額だけを昇順で順位付けする", () => {
    const result = compareOffers(
      [offer({ id: "a", baseAmount: 1000 }), offer({ id: "b", baseAmount: 800 })],
      baseOptions,
    );
    expect(result.ranked.map((p) => p.offer.id)).toEqual(["b", "a"]);
    expect(result.verdict.kind).toBe("cheapest");
  });

  it("同額は同順位にする", () => {
    const result = compareOffers(
      [
        offer({ id: "a", baseAmount: 1000 }),
        offer({ id: "b", baseAmount: 1000 }),
        offer({ id: "c", baseAmount: 1200 }),
      ],
      baseOptions,
    );
    expect(result.ranked.map((p) => p.rank)).toEqual([1, 1, 3]);
  });

  it("未確認項目があるオファーは順位付けしない", () => {
    const result = compareOffers(
      [
        offer({ id: "ok", baseAmount: 1000 }),
        offer({ id: "unknown", baseAmount: 500, feesAmount: null }),
      ],
      baseOptions,
    );
    const unknown = result.priced.find((p) => p.offer.id === "unknown");
    expect(unknown?.rankable).toBe(false);
    expect(unknown?.blockers).toContain("unknown_amount");
    expect(result.ranked).toHaveLength(1);
    expect(result.verdict.kind).toBe("no_claim");
  });

  it("サンプルデータは既定で順位付けから除外する", () => {
    const result = compareOffers(
      [
        offer({ id: "real", baseAmount: 1000 }),
        offer({ id: "sample", baseAmount: 100, sample: true, priceBasis: "sample" }),
      ],
      { ...baseOptions },
    );
    expect(result.priced.find((p) => p.offer.id === "sample")?.rankable).toBe(false);
    expect(result.hasSampleData).toBe(true);
  });

  it("サンプルを含む場合は「最安」と断定しない", () => {
    const result = compareOffers(
      [
        offer({ id: "a", baseAmount: 1000, sample: true, priceBasis: "sample" }),
        offer({ id: "b", baseAmount: 1200, sample: true, priceBasis: "sample" }),
      ],
      { ...baseOptions, allowSample: true },
    );
    expect(result.verdict.kind).toBe("lowest_known");
  });

  it("条件グループが異なる場合は順位付けしない", () => {
    const result = compareOffers(
      [
        offer({ id: "a", baseAmount: 1000 }),
        offer({
          id: "b",
          baseAmount: 500,
          condition: {
            groupKey: "g2",
            label: "別条件",
            people: 1,
            nights: null,
            days: 7,
            gb: 5,
            notes: "",
          },
        }),
      ],
      baseOptions,
    );
    expect(result.comparable).toBe(false);
    expect(result.ranked).toHaveLength(0);
    expect(result.verdict.kind).toBe("no_claim");
  });

  it("出典が未検証のオファーは順位付けしない", () => {
    const result = compareOffers(
      [
        offer({ id: "a", baseAmount: 1000, evidenceId: "ev-unknown" }),
        offer({ id: "b", baseAmount: 1200 }),
      ],
      baseOptions,
    );
    const a = result.priced.find((p) => p.offer.id === "a");
    expect(a?.blockers).toContain("evidence_missing");
  });

  it("期限切れ・購入不可は順位付けしない", () => {
    const result = compareOffers(
      [
        offer({ id: "expired", expiresAt: "2026-10-01T00:00:00.000Z" }),
        offer({ id: "unavailable", available: false }),
      ],
      baseOptions,
    );
    expect(result.ranked).toHaveLength(0);
    expect(result.priced.find((p) => p.offer.id === "expired")?.blockers).toContain("expired");
    expect(result.priced.find((p) => p.offer.id === "unavailable")?.blockers).toContain("unavailable");
  });

  it("提携未承認のオファーは順位付けしない", () => {
    const result = compareOffers(
      [
        offer({ id: "ok", baseAmount: 1000, programId: "prog-approved" }),
        offer({
          id: "pending",
          baseAmount: 900,
          programId: "prog-pending",
        }),
      ],
      {
        ...baseOptions,
        programs: [approvedProgram, pendingProgram],
      },
    );
    expect(
      result.priced.find((p) => p.offer.id === "pending")?.blockers,
    ).toContain("program_not_approved");
    expect(result.ranked.map((p) => p.offer.id)).toEqual(["ok"]);
  });

  it("1件だけでは最安判定しない", () => {
    const result = compareOffers([offer({ baseAmount: 1000 })], baseOptions);
    expect(result.verdict.kind).toBe("no_claim");
  });

  it("出典が古い場合は再確認を要求する", () => {
    const result = compareOffers(
      [offer({ baseAmount: 1000, evidenceId: "ev-stale" })],
      {
        ...baseOptions,
        evidence: [
          {
            ...verifiedEvidence,
            id: "ev-stale",
            checkedAt: "2026-09-01T00:00:00.000Z",
          },
        ],
      },
    );
    expect(result.priced[0]?.blockers).toContain("evidence_stale");
  });
});
