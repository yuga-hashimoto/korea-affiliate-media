import type { Article, Category } from "@/lib/domain";
import { findBannedPhrases, findUnsupportedNumbers } from "@/lib/ai/policy";
import { contentHash } from "@/lib/ai/articles";

export interface SocialDraftInput {
  article: Article;
  siteUrl: string;
  /** 記事ごとの手書きフック（あればテンプレートより優先する） */
  hook?: string;
  /** フックに続く補足（あれば要約の代わりに使う） */
  body?: string;
}

export interface SocialDraftResult {
  ok: boolean;
  text: string;
  contentHash: string;
  risks: string[];
  issues: string[];
}

const MAX_LENGTH = 280;

/** カテゴリごとの1つ目のハッシュタグ（2つ目は共通の #韓国旅行） */
const CATEGORY_TAGS: Record<Category, string> = {
  seoul: "#ソウル",
  busan: "#釜山",
  jeju: "#済州",
  food: "#韓国グルメ",
  cafe: "#韓国カフェ",
  shopping: "#韓国ショッピング",
  transport: "#韓国旅行の交通",
  hotel: "#韓国ホテル",
  prepare: "#韓国旅行の準備",
  beauty: "#韓国コスメ",
  fashion: "#韓国ファッション",
};

/** 締めの一言。記事ごとに変えて、並んだときに同じ書き出しにならないようにする */
const CTAS = [
  "当日あわてないために、先にチェック👇",
  "判断材料をまとめました👇",
  "あとで見返したい人は保存を👇",
  "行く前に一度読んでおくと安心です👇",
];

type HookFn = (head: string) => string;

/** 冒頭のフック。どの見出しにも自然につながる形だけを使う */
const HOOKS: HookFn[] = [
  (head) => `${head}。まずはここから。`,
  (head) => `${head}で迷ったら、ここを見てください。`,
  (head) => `${head}、これだけは押さえておきたい。`,
  (head) => `${head}。行く前に知っておきたいこと。`,
];
const DEFAULT_HOOK: HookFn = (head) => `${head}。まずはここから。`;

/** タイトルの見出し部分（「｜」以降の補足を落として短くする） */
export function headlineOf(title: string): string {
  const head = title.split(/[｜|]/)[0] ?? title;
  return head.trim();
}

/** 1文目だけを取り出す（要約が長い記事でも本文が膨らまないように） */
export function firstSentence(text: string): string {
  const sentence = text.split("。")[0] ?? text;
  return sentence.trim();
}

/** 先頭から最大 n 文を取り出す（多すぎる要約を避ける） */
export function summaryOf(text: string, maxSentences = 2): string {
  const sentences = text
    .split("。")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  const picked = sentences.slice(0, maxSentences).join("。");
  return picked.length > 0 ? `${picked}。` : "";
}

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return hash;
}

export interface ComposeInput {
  title: string;
  description: string;
  category: Category;
  url: string;
  /** 文面のバリエーションを決めるための種（記事slugなど） */
  variantSalt: string;
  /** 手書きフック（テンプレートより優先） */
  hook?: string;
  /** 手書きの補足（要約より優先） */
  body?: string;
}

/**
 * X投稿の本文を組み立てる。
 * 事実は記事タイトル・要約・URLだけを使い、数値や体験談は足さない。
 * 280文字に収まるよう、締め→要約→見出しの順に削る。
 */
export function composeSocialText(input: ComposeInput): string {
  const head = headlineOf(input.title);
  const seed = Math.abs(hashString(input.variantSalt));
  const hookFn = HOOKS[seed % HOOKS.length] ?? DEFAULT_HOOK;
  const customHook = input.hook?.trim() ?? "";
  const customBody = input.body?.trim() ?? "";
  const hook = customHook.length > 0 ? customHook : hookFn(head);
  const cta = CTAS[seed % CTAS.length] ?? "判断材料をまとめました👇";
  const tag = CATEGORY_TAGS[input.category] ?? "#韓国旅行";
  // 開示は記事側に置く方針のため、ツイート本文にはPR表記を入れない（2026-11-15 本人判断）
  const tail = `${input.url}\n${tag} #韓国旅行`;

  const build = (opening: string, body: string, closer: string): string =>
    [opening, body, closer].filter((part) => part.length > 0).join("\n") + `\n${tail}`;

  const summary = customBody.length > 0 ? customBody : summaryOf(input.description, 2);
  // 手書きの本文があるときは、定型の締めを足さない（テンプレ感が出るため）
  const closer = customBody.length > 0 ? "" : cta;
  const candidates = [
    build(hook, summary, closer),
    build(hook, summary, ""),
    build(hook, firstSentence(input.description), cta),
    build(hook, "", cta),
    build(head, "", ""),
  ];

  for (const candidate of candidates) {
    if (candidate.length <= MAX_LENGTH) return candidate;
  }

  const shortest = build(head.slice(0, 24), "", "");
  return shortest.length <= MAX_LENGTH ? shortest : shortest.slice(0, MAX_LENGTH);
}

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
  const url = `${siteUrl}/articles/${article.slug}`;
  const text = composeSocialText({
    title: article.title,
    description: article.description,
    category: article.category,
    url,
    variantSalt: article.slug,
    hook: input.hook,
    body: input.body,
  });

  const maxLength = options.maxLength ?? MAX_LENGTH;
  const issues: string[] = [];
  if (text.length > maxLength) issues.push(`${maxLength}文字を超えています`);
  const banned = findBannedPhrases(text);
  if (banned.length > 0) issues.push(`禁止表現: ${banned.join(", ")}`);
  const unsupported = findUnsupportedNumbers(text, [
    article.title,
    article.description,
    url,
  ]);
  if (unsupported.length > 0) issues.push(`根拠のない数値: ${unsupported.join(", ")}`);

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
