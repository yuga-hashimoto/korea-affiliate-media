import type { Article } from "@/lib/domain";
import {
  ArticleSchema,
  MerchantSchema,
  AffiliateProgramSchema,
  SourceEvidenceSchema,
} from "@/lib/domain";
import { merchants } from "./merchants";
import { evidence } from "./evidence";
import { programs } from "./programs";
import { seoulArticles } from "@/content/seoul";
import { busanJejuArticles } from "@/content/busan-jeju";
import { foodCafeArticles } from "@/content/food-cafe";
import { shoppingArticles } from "@/content/shopping";
import { prepareArticles } from "@/content/prepare";
import { mergedArticles } from "@/content/merged";
import {
  generatedPublishedArticles,
  generatedRecords,
} from "./generated";

function parseAll<T>(
  schema: { parse: (value: unknown) => T },
  values: unknown[],
  label: string,
): T[] {
  return values.map((value, index) => {
    try {
      return schema.parse(value);
    } catch (error) {
      throw new Error(
        `${label}[${index}] のデータ検証に失敗しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  });
}

export const merchantList = parseAll(MerchantSchema, merchants, "merchants");
export const evidenceList = parseAll(SourceEvidenceSchema, evidence, "evidence");
export const programList = parseAll(AffiliateProgramSchema, programs, "programs");

const allArticles = [
  ...seoulArticles,
  ...busanJejuArticles,
  ...foodCafeArticles,
  ...shoppingArticles,
  ...prepareArticles,
  ...mergedArticles,
  ...generatedPublishedArticles,
];
export const articleList: Article[] = parseAll(ArticleSchema, allArticles, "articles");

const evidenceIds = new Set(evidenceList.map((e) => e.id));
const slugs = new Set<string>();

for (const article of articleList) {
  for (const id of article.evidenceIds) {
    if (!evidenceIds.has(id)) {
      throw new Error(`article ${article.slug} が存在しない証跡 ${id} を参照しています`);
    }
  }
  if (slugs.has(article.slug)) {
    throw new Error(`記事スラッグが重複しています: ${article.slug}`);
  }
  slugs.add(article.slug);
}

for (const article of articleList) {
  for (const related of article.related) {
    if (!slugs.has(related)) {
      throw new Error(`article ${article.slug} の関連記事 ${related} が存在しません`);
    }
  }
}

export { generatedRecords };

export const publishedArticles = articleList
  .filter((a) => a.status === "published")
  .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

export function getArticle(slug: string): Article | undefined {
  return articleList.find((a) => a.slug === slug);
}

export function getPublishedArticle(slug: string): Article | undefined {
  return publishedArticles.find((a) => a.slug === slug);
}

export function getMerchant(id: string) {
  return merchantList.find((m) => m.id === id);
}

export function getEvidence(id: string) {
  return evidenceList.find((e) => e.id === id);
}

export function getProgram(id: string | null) {
  if (!id) return null;
  return programList.find((p) => p.id === id) ?? null;
}

export function articlesByCategory(category: Article["category"]): Article[] {
  return publishedArticles.filter((a) => a.category === category);
}

export function latestArticles(limit = 6): Article[] {
  return publishedArticles.slice(0, limit);
}

export function relatedArticles(article: Article): Article[] {
  return article.related
    .map((slug) => getPublishedArticle(slug))
    .filter((a): a is Article => Boolean(a));
}

export function searchArticles(keyword: string): Article[] {
  const q = keyword.trim();
  if (!q) return publishedArticles;
  return publishedArticles.filter(
    (article) =>
      article.title.includes(q) ||
      article.description.includes(q) ||
      article.tags.some((tag) => tag.includes(q)) ||
      article.sections.some((section) =>
        section.paragraphs.some((paragraph) => paragraph.includes(q)),
      ),
  );
}
