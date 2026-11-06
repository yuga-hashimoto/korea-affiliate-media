import { describe, expect, it } from "vitest";
import {
  articleList,
  evidenceList,
  offerList,
  programList,
  fxRateList,
  publishedArticles,
} from "@/data";

describe("データ整合性", () => {
  it("オファーIDが重複しない", () => {
    const ids = offerList.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("全てのオファーが実在する証跡を参照する", () => {
    const ids = new Set(evidenceList.map((e) => e.id));
    for (const o of offerList) {
      expect(ids.has(o.evidenceId), o.id).toBe(true);
    }
  });

  it("サンプル価格には sample=true が付く", () => {
    for (const o of offerList.filter((x) => x.priceBasis === "sample")) {
      expect(o.sample, o.id).toBe(true);
    }
  });

  it("公開記事は出典と更新日時を持つ", () => {
    for (const article of publishedArticles) {
      expect(article.evidenceIds.length, article.slug).toBeGreaterThan(0);
      expect(article.updatedAt, article.slug).toBeTruthy();
      expect(article.reviewedAt, article.slug).not.toBeNull();
    }
  });

  it("下書き記事は公開一覧に含まれない", () => {
    const drafts = articleList.filter((a) => a.status === "draft");
    expect(drafts.length).toBeGreaterThan(0);
    for (const draft of drafts) {
      expect(publishedArticles.some((a) => a.slug === draft.slug)).toBe(false);
    }
  });

  it("公開記事に禁止表現（未検証の「最安」等）が含まれない", () => {
    const banned = ["最安値", "必ず稼げる", "No.1", "実際に使ってみた", "絶対"];
    for (const article of publishedArticles) {
      const text = [
        article.title,
        article.description,
        ...article.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
        ...article.faq.flatMap((f) => [f.question, f.answer]),
      ].join("\n");
      for (const word of banned) {
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

  it("為替レートは正の値", () => {
    for (const rate of fxRateList) {
      expect(rate.rate).toBeGreaterThan(0);
    }
  });
});
