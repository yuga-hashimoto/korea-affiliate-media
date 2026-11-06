import type { Article } from "@/lib/domain";
import { findBannedPhrases, findUnsupportedNumbers } from "@/lib/ai/policy";
import { contentHash } from "@/lib/ai/articles";

export interface SocialDraftInput {
  article: Article;
  siteUrl: string;
}

export interface SocialDraftResult {
  ok: boolean;
  text: string;
  contentHash: string;
  risks: string[];
  issues: string[];
}

const MAX_LENGTH = 280;

/**
 * 記事からX投稿の下書きを作る。
 * - 記事タイトル・要約・URLのみを使用し、価格などの数値を新たに作らない
 * - アフィリエイト/広告の可能性があるためPR表記を付ける
 */
export function buildSocialDraft(
  input: SocialDraftInput,
  options: { maxLength?: number } = {},
): SocialDraftResult {
  const { article, siteUrl } = input;
  const maxLength = options.maxLength ?? MAX_LENGTH;
  const url = `${siteUrl}/articles/${article.slug}`;
  const prefix = "【総額比較】";
  const pr = "\nPR";
  const hashtags = "\n#韓国旅行 #総額比較";

  const available = maxLength - prefix.length - pr.length - hashtags.length - url.length - 4;
  const bodySource = `${article.title}。${article.description}`;
  const body = bodySource.slice(0, Math.max(20, available));

  let text = `${prefix}${body}\n${url}${hashtags}${pr}`;
  if (text.length > maxLength) {
    text = `${prefix}${article.title.slice(0, Math.max(10, available))}\n${url}${pr}`;
  }

  const issues: string[] = [];
  if (text.length > maxLength) issues.push("280文字を超えています");
  const banned = findBannedPhrases(text);
  if (banned.length > 0) issues.push(`禁止表現: ${banned.join(", ")}`);
  const unsupported = findUnsupportedNumbers(text, [
    article.title,
    article.description,
    url,
  ]);
  if (unsupported.length > 0) issues.push(`根拠のない数値: ${unsupported.join(", ")}`);
  if (!/PR|広告/.test(text)) issues.push("PR表記がありません");

  return {
    ok: issues.length === 0,
    text,
    contentHash: contentHash(text),
    risks: banned,
    issues,
  };
}

/** 類似投稿の重複を防ぐ（本文ハッシュ + 記事スラッグ） */
export function isDuplicatePost(
  existing: ReadonlyArray<{ contentHash: string; articleSlug: string | null }>,
  candidate: { contentHash: string; articleSlug: string | null },
): boolean {
  return existing.some(
    (item) =>
      item.contentHash === candidate.contentHash ||
      (candidate.articleSlug !== null && item.articleSlug === candidate.articleSlug),
  );
}
