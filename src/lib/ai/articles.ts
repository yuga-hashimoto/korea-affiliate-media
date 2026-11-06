import { createHash } from "node:crypto";
import type { Article, SourceEvidence } from "@/lib/domain";
import { AFFILIATE_MENTION_PATTERN, findBannedPhrases, findUnsupportedNumbers } from "./policy";
import { ArticleDraftSchema, type ArticleDraft } from "./schema";
import type { ArticleTopic } from "./topics";

export const PROMPT_VERSION = "2026-11-06.1";

export const ARTICLE_SYSTEM_PROMPT = `あなたは日本の旅行・コスメ比較メディアの編集者です。
与えられた「事実データ」だけを根拠に、日本語の記事下書きをJSONで作成してください。

厳守事項:
- 事実データにない価格・割引率・在庫・体験談・数値を一切書かない。
- 「最安」「No.1」「必ず」「実際に使ってみた」など、根拠のない断定や体験の装いを書かない。
- 医療・美容の効能効果を断定しない（薬機法・景表法に配慮）。
- 比較条件（日程・人数・容量・通貨・税の扱い）を本文で明示する。
- 不明な項目はUNKNOWNとして扱い、0円と書かない。
- 広告・アフィリエイトに関する説明を disclosure に含める。
- 出力は指定JSONスキーマのみ。前後に文章を付けない。`;

export function buildUserPrompt(
  topic: ArticleTopic,
  evidence: readonly SourceEvidence[],
): string {
  return JSON.stringify({
    task: "記事下書きの作成",
    topic: {
      id: topic.id,
      category: topic.category,
      titleHint: topic.titleHint,
      summary: topic.summary,
      checklist: topic.checklist,
      keywords: topic.keywords,
    },
    facts: evidence.map((e) => ({
      id: e.id,
      sourceUrl: e.sourceUrl,
      checkedAt: e.checkedAt,
      note: e.note,
      sample: e.sample,
    })),
    outputSchema: {
      title: "string(10-80)",
      description: "string(40-160)",
      category: topic.category,
      sections: "array(3-8) of {heading, paragraphs: string[1-4]}",
      faq: "array(0-5) of {question, answer}",
      sourceIds: "array of fact ids used",
      disclosure: "string",
      risks: "array of strings",
      confidence: "low|medium|high",
    },
  });
}

export interface DraftValidation {
  ok: boolean;
  score: number;
  issues: string[];
  unsupportedNumbers: string[];
  bannedPhrases: string[];
}

export function collectText(draft: ArticleDraft): string {
  return [
    draft.title,
    draft.description,
    ...draft.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
    ...draft.faq.flatMap((f) => [f.question, f.answer]),
    draft.disclosure,
  ].join("\n");
}

export function validateDraft(
  draft: ArticleDraft,
  topic: ArticleTopic,
  evidence: readonly SourceEvidence[],
): DraftValidation {
  const issues: string[] = [];
  const text = collectText(draft);

  const allowedSourceIds = new Set(evidence.map((e) => e.id));
  for (const id of draft.sourceIds) {
    if (!allowedSourceIds.has(id)) issues.push(`未知の出典ID: ${id}`);
  }
  if (draft.category !== topic.category) {
    issues.push("カテゴリがトピックと一致しません");
  }

  const allowedFacts = [
    ...evidence.flatMap((e) => [e.note, e.sourceUrl, e.checkedAt]),
    ...topic.checklist,
    topic.titleHint,
    topic.summary,
  ];
  const unsupportedNumbers = findUnsupportedNumbers(text, allowedFacts);
  if (unsupportedNumbers.length > 0) {
    issues.push(`根拠のない数値: ${unsupportedNumbers.join(", ")}`);
  }

  const bannedPhrases = findBannedPhrases(text);
  if (bannedPhrases.length > 0) {
    issues.push(`禁止表現: ${bannedPhrases.join(", ")}`);
  }

  if (!AFFILIATE_MENTION_PATTERN.test(draft.disclosure)) {
    issues.push("広告・アフィリエイトの開示が不足しています");
  }

  const totalParagraphs = draft.sections.reduce(
    (acc, s) => acc + s.paragraphs.length,
    0,
  );

  let score = 0;
  if (draft.sections.length >= 3) score += 25;
  if (draft.sections.length >= 4) score += 5;
  if (totalParagraphs >= 6) score += 20;
  if (draft.faq.length >= 2) score += 15;
  if (draft.sourceIds.length >= 1) score += 15;
  if (evidence.length >= 1 && evidence.every((e) => !e.sample)) score += 5;
  if (draft.risks.length === 0) score += 10;
  if (draft.confidence === "high") score += 5;
  if (issues.length > 0) score = Math.min(score, 40);

  return {
    ok: issues.length === 0 && score >= 70,
    score,
    issues,
    unsupportedNumbers,
    bannedPhrases,
  };
}

export function slugifyTopic(topicId: string): string {
  return topicId
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function draftToArticle(
  draft: ArticleDraft,
  topic: ArticleTopic,
  now: Date,
): Article {
  const slug = slugifyTopic(topic.id);
  return {
    slug,
    title: draft.title,
    description: draft.description,
    category: draft.category,
    status: "review",
    aiGenerated: true,
    reviewedAt: null,
    publishedAt: null,
    updatedAt: now.toISOString(),
    evidenceIds: draft.sourceIds.length > 0 ? draft.sourceIds : topic.evidenceIds,
    sections: draft.sections,
    faq: draft.faq,
    related: [],
    hubPath: null,
  };
}

export function contentHash(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 32);
}

export function parseDraft(raw: unknown): ArticleDraft {
  return ArticleDraftSchema.parse(raw);
}
