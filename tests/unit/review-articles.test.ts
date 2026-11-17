import { describe, expect, it } from "vitest";
import { articleList, evidenceList, publishedArticles } from "@/data";
import { reviewArticles } from "@/content/review-articles";

describe("レビュー済み記事（review-articles.ts）", () => {
  it("レビュー日時が記録され、公開記事に含まれている", () => {
    const publishedSlugs = new Set(publishedArticles.map((a) => a.slug));
    expect(reviewArticles.length).toBeGreaterThan(0);
    for (const article of reviewArticles) {
      expect(article.status, article.slug).toBe("published");
      expect(article.aiGenerated, article.slug).toBe(true);
      expect(article.reviewedAt, article.slug).not.toBeNull();
      expect(publishedSlugs.has(article.slug), article.slug).toBe(true);
    }
  });

  it("実在する出典を参照し、本文が1,500字以上ある", () => {
    const ids = new Set(evidenceList.map((e) => e.id));
    for (const article of reviewArticles) {
      for (const id of article.evidenceIds) {
        expect(ids.has(id), `${article.slug}: ${id}`).toBe(true);
      }
      const chars = article.sections.reduce(
        (n, s) => n + s.paragraphs.reduce((m, p) => m + p.length, 0),
        0,
      );
      expect(chars, article.slug).toBeGreaterThanOrEqual(1500);
    }
  });

  it("関連記事はすべて実在する", () => {
    const slugs = new Set(articleList.map((a) => a.slug));
    for (const article of reviewArticles) {
      for (const related of article.related) {
        expect(slugs.has(related), `${article.slug} -> ${related}`).toBe(true);
      }
    }
  });
});
