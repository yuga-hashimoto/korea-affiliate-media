import { describe, expect, it } from "vitest";
import {
  articleList,
  evidenceList,
  merchantList,
  programList,
  publishedArticles,
} from "@/data";
import { CATEGORY_META } from "@/lib/categories";
import { BANNED_PHRASES } from "@/lib/ai/policy";

describe("データ整合性", () => {
  it("記事スラッグが重複しない", () => {
    const slugs = articleList.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("全ての記事が実在する出典を参照する", () => {
    const ids = new Set(evidenceList.map((e) => e.id));
    for (const article of articleList) {
      for (const id of article.evidenceIds) {
        expect(ids.has(id), `${article.slug}: ${id}`).toBe(true);
      }
    }
  });

  it("公開記事はレビュー日時・更新日時・説明を持つ", () => {
    for (const article of publishedArticles) {
      expect(article.reviewedAt, article.slug).not.toBeNull();
      expect(article.updatedAt, article.slug).toBeTruthy();
      expect(article.description.length, article.slug).toBeGreaterThan(20);
      expect(article.sections.length, article.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it("カテゴリはすべて表示メタデータを持つ", () => {
    for (const article of articleList) {
      expect(CATEGORY_META[article.category], article.category).toBeDefined();
    }
  });

  it("公開記事に禁止表現（未検証の断定など）が含まれない", () => {
    for (const article of publishedArticles) {
      const text = [
        article.title,
        article.description,
        ...article.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
        ...article.faq.flatMap((f) => [f.question, f.answer]),
      ].join("\n");
      for (const word of BANNED_PHRASES) {
        expect(text.includes(word), `${article.slug} に「${word}」`).toBe(false);
      }
    }
  });

  it("提携プログラムに未確認の成果リンクを作らない", () => {
    for (const program of programList) {
      if (program.status !== "approved") {
        expect(program.linkTemplate).toBeNull();
      }
    }
  });

  it("事業者IDは一意で、プログラムの参照先が存在する", () => {
    const ids = new Set(merchantList.map((m) => m.id));
    expect(ids.size).toBe(merchantList.length);
    for (const program of programList) {
      expect(ids.has(program.merchantId), program.merchantId).toBe(true);
    }
  });

  it("記事は1件以上公開されている", () => {
    expect(publishedArticles.length).toBeGreaterThanOrEqual(10);
  });
});
