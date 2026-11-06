import type { Article, Offer } from "@/lib/domain";
import {
  ArticleSchema,
  MerchantSchema,
  OfferSchema,
  AffiliateProgramSchema,
  SourceEvidenceSchema,
  FxRateSchema,
} from "@/lib/domain";
import { merchants } from "./merchants";
import { evidence } from "./evidence";
import { programs } from "./programs";
import { offers } from "./offers";
import { fxRates } from "./fx";
import { travelArticles } from "@/content/travel";
import { beautyArticles } from "@/content/beauty";
import { generalArticles } from "@/content/general";
import {
  generatedPublishedArticles,
  generatedRecords,
} from "./generated";

/**
 * データの検証。不正なデータ（税金の二重計上、存在しない証跡ID、
 * サンプル価格の取り違え等）があればビルドを失敗させる。
 */
function parseAll<T>(schema: { parse: (value: unknown) => T }, values: unknown[], label: string): T[] {
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
export const offerList: Offer[] = parseAll(OfferSchema, offers, "offers");
export const fxRateList = parseAll(FxRateSchema, fxRates, "fxRates");

const allArticles = [
  ...travelArticles,
  ...beautyArticles,
  ...generalArticles,
  ...generatedPublishedArticles,
];
export const articleList: Article[] = parseAll(ArticleSchema, allArticles, "articles");

// 参照整合性の検証
const evidenceIds = new Set(evidenceList.map((e) => e.id));
for (const offer of offerList) {
  if (!evidenceIds.has(offer.evidenceId)) {
    throw new Error(`offer ${offer.id} が存在しない証跡 ${offer.evidenceId} を参照しています`);
  }
}
for (const article of articleList) {
  for (const id of article.evidenceIds) {
    if (!evidenceIds.has(id)) {
      throw new Error(`article ${article.slug} が存在しない証跡 ${id} を参照しています`);
    }
  }
}
const slugs = new Set<string>();
for (const article of articleList) {
  if (slugs.has(article.slug)) {
    throw new Error(`記事スラッグが重複しています: ${article.slug}`);
  }
  slugs.add(article.slug);
}

export { generatedRecords };

export const publishedArticles = articleList
  .filter((a) => a.status === "published")
  .sort((a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? ""));

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

export function getOffer(id: string) {
  return offerList.find((o) => o.id === id);
}

export function offersForGroup(groupKey: string): Offer[] {
  return offerList.filter((o) => o.condition.groupKey === groupKey);
}

export function offersByCategory(category: Offer["category"]): Offer[] {
  return offerList.filter((o) => o.category === category);
}

export function articlesByCategory(category: Article["category"]): Article[] {
  return publishedArticles.filter((a) => a.category === category);
}

export function relatedArticles(article: Article): Article[] {
  return article.related
    .map((slug) => getPublishedArticle(slug))
    .filter((a): a is Article => Boolean(a));
}
