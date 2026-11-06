import { describe, expect, it } from "vitest";
import { auditContent } from "@/lib/content/audit";
import type { Article, SourceEvidence } from "@/lib/domain";

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
};

const article: Article = {
  slug: "test-article",
  title: "テスト記事",
  description: "説明",
  category: "seoul",
  status: "published",
  aiGenerated: false,
  reviewedAt: "2026-11-01T00:00:00.000Z",
  publishedAt: "2026-11-01T00:00:00.000Z",
  updatedAt: "2026-11-05T00:00:00.000Z",
  evidenceIds: ["ev-1"],
  sections: [{ heading: "見出し", paragraphs: ["本文"] }],
  faq: [],
  related: [],
  tags: [],
  hubPath: null,
  imageAlt: null,
};

describe("auditContent", () => {
  it("健全なコンテンツは指摘なし", () => {
    expect(auditContent([article], [evidence], { now })).toEqual([]);
  });

  it("出典が古い記事を検出する", () => {
    const stale = { ...evidence, checkedAt: "2026-09-01T00:00:00.000Z" };
    const findings = auditContent([article], [stale], { now });
    expect(findings.some((f) => f.kind === "stale_evidence")).toBe(true);
  });

  it("存在しない出典を高リスクとして検出する", () => {
    const findings = auditContent([article], [], { now });
    expect(findings[0]?.kind).toBe("missing_evidence");
    expect(findings[0]?.severity).toBe("high");
  });

  it("古い下書きを検出する", () => {
    const draft = {
      ...article,
      status: "draft" as const,
      updatedAt: "2026-09-01T00:00:00.000Z",
    };
    const findings = auditContent([draft], [evidence], { now });
    expect(findings.some((f) => f.kind === "old_draft")).toBe(true);
  });

  it("長期間更新されていない記事を検出する", () => {
    const old = { ...article, updatedAt: "2026-01-01T00:00:00.000Z" };
    const findings = auditContent([old], [evidence], { now });
    expect(findings.some((f) => f.kind === "stale_article")).toBe(true);
  });
});
