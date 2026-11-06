import { describe, expect, it } from "vitest";
import { auditContent } from "@/lib/content/audit";
import type { Article, Offer, SourceEvidence } from "@/lib/domain";

const now = new Date("2026-11-06T12:00:00.000Z");

const evidence: SourceEvidence = {
  id: "ev-1",
  sourceUrl: "https://example.com",
  sourceType: "official_page",
  accessPermitted: "yes",
  checkedAt: "2026-11-05T00:00:00.000Z",
  observedTextHash: null,
  note: "",
  reviewStatus: "verified",
  sample: false,
};

const article: Article = {
  slug: "test-article",
  title: "テスト記事",
  description: "説明",
  category: "esim",
  status: "published",
  aiGenerated: false,
  reviewedAt: "2026-11-01T00:00:00.000Z",
  publishedAt: "2026-11-01T00:00:00.000Z",
  updatedAt: "2026-11-05T00:00:00.000Z",
  evidenceIds: ["ev-1"],
  sections: [{ heading: "見出し", paragraphs: ["本文"] }],
  faq: [],
  related: [],
  hubPath: null,
};

const offer: Offer = {
  id: "off-1",
  productId: "p1",
  productName: "プラン",
  category: "esim",
  merchantId: "m1",
  programId: null,
  landingUrl: "https://example.com",
  currency: "JPY",
  baseAmount: 1000,
  shippingAmount: 0,
  taxAmount: 0,
  feesAmount: 0,
  taxIncluded: true,
  coupon: null,
  condition: {
    groupKey: "g",
    label: "条件",
    people: 1,
    nights: null,
    days: 5,
    gb: 3,
    notes: "",
  },
  available: true,
  observedAt: "2026-11-05T00:00:00.000Z",
  expiresAt: null,
  evidenceId: "ev-1",
  sample: false,
  priceBasis: "cached",
  note: "",
};

describe("auditContent", () => {
  it("健全なコンテンツは指摘なし", () => {
    expect(
      auditContent([article], [evidence], [offer], { now }),
    ).toEqual([]);
  });

  it("出典が古い記事を検出する", () => {
    const stale = { ...evidence, checkedAt: "2026-09-01T00:00:00.000Z" };
    const findings = auditContent([article], [stale], [offer], { now });
    expect(findings.some((f) => f.kind === "stale_evidence")).toBe(true);
  });

  it("期限切れオファーを高リスクとして検出する", () => {
    const findings = auditContent(
      [article],
      [evidence],
      [{ ...offer, expiresAt: "2026-10-01T00:00:00.000Z" }],
      { now },
    );
    expect(findings[0]?.kind).toBe("expired_offer");
    expect(findings[0]?.severity).toBe("high");
  });

  it("サンプルオファーは監査対象外", () => {
    const findings = auditContent(
      [article],
      [evidence],
      [{ ...offer, sample: true, priceBasis: "sample", expiresAt: "2020-01-01T00:00:00.000Z" }],
      { now },
    );
    expect(findings.some((f) => f.kind === "expired_offer")).toBe(false);
  });

  it("古い下書きを検出する", () => {
    const draft = {
      ...article,
      status: "draft" as const,
      updatedAt: "2026-09-01T00:00:00.000Z",
    };
    const findings = auditContent([draft], [evidence], [], { now });
    expect(findings.some((f) => f.kind === "old_draft")).toBe(true);
  });
});
