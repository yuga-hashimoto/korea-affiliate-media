import { describe, expect, it } from "vitest";
import { articleList, evidenceList, publishedArticles } from "@/data";
import { reviewArticles } from "@/content/review-articles";

describe("レビュー待ち記事", () => {
  it("review 状態で保存され、公開記事には含まれない（自動公開しない）", () => {
    const publishedSlugs = new Set(publishedArticles.map((a) => a.slug));
    expect(reviewArticles.length).toBeGreaterThan(0);
    for (const article of reviewArticles) {
      expect(article.status, article.slug).toBe("review");
      expect(article.aiGenerated, article.slug).toBe(true);
      expect(article.reviewedAt, article.slug).toBeNull();
      expect(publishedSlugs.has(article.slug), article.slug).toBe(false);
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
