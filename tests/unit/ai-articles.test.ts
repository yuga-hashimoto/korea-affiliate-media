import { describe, expect, it } from "vitest";
import { mockArticleDraft } from "@/lib/ai/mock-provider";
import {
  draftToArticle,
  validateDraft,
} from "@/lib/ai/articles";
import type { ArticleTopic } from "@/lib/ai/topics";
import { evidence } from "@/data/evidence";

const topic: ArticleTopic = {
  id: "kr-esim-compare-2026",
  category: "esim",
  titleHint: "韓国eSIMは「総額」で選ぶ｜比較条件の揃え方",
  summary: "韓国旅行用eSIMの総額比較で見落としやすい条件を整理する",
  checklist: ["日数", "データ容量", "為替と決済通貨"],
  evidenceIds: ["ev-airalo-official"],
  keywords: [],
  status: "queued",
};

const topicEvidence = evidence.filter((e) => topic.evidenceIds.includes(e.id));

describe("validateDraft", () => {
  it("モック下書きは品質基準を満たす", () => {
    const draft = mockArticleDraft(topic);
    const result = validateDraft(draft, topic, topicEvidence);
    expect(result.issues).toEqual([]);
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.ok).toBe(true);
  });

  it("根拠のない数値（価格）を検出する", () => {
    const draft = mockArticleDraft(topic);
    draft.sections[0]!.paragraphs.push("このプランは税込1,980円です。");
    const result = validateDraft(draft, topic, topicEvidence);
    expect(result.unsupportedNumbers).toContain("1,980");
    expect(result.ok).toBe(false);
  });

  it("禁止表現（最安値など）を検出する", () => {
    const draft = mockArticleDraft(topic);
    draft.sections[1]!.paragraphs.push("当サイト調べの最安値です。");
    const result = validateDraft(draft, topic, topicEvidence);
    expect(result.bannedPhrases).toContain("最安値");
    expect(result.ok).toBe(false);
  });

  it("出典外のIDを検出する", () => {
    const draft = { ...mockArticleDraft(topic), sourceIds: ["ev-unknown"] };
    const result = validateDraft(draft, topic, topicEvidence);
    expect(result.issues.some((issue) => issue.includes("未知の出典ID"))).toBe(true);
  });

  it("広告開示がない場合は不合格", () => {
    const draft = { ...mockArticleDraft(topic), disclosure: "特になし" };
    const result = validateDraft(draft, topic, topicEvidence);
    expect(result.issues.some((issue) => issue.includes("開示"))).toBe(true);
  });
});

describe("draftToArticle", () => {
  it("生成記事はreview状態で、公開されない", () => {
    const draft = mockArticleDraft(topic);
    const article = draftToArticle(draft, topic, new Date("2026-11-06T00:00:00.000Z"));
    expect(article.status).toBe("review");
    expect(article.aiGenerated).toBe(true);
    expect(article.publishedAt).toBeNull();
    expect(article.slug).toBe("kr-esim-compare-2026");
  });
});
