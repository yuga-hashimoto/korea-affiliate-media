import { describe, expect, it } from "vitest";
import { ARTICLE_CTA_PROGRAMS, pickCtaTargets } from "@/lib/cta";

const targets = [
  { programId: "prog-klook" },
  { programId: "prog-rakuten-travel" },
  { programId: "prog-amazon" },
];

describe("記事ごとのCTA絞り込み", () => {
  it("定義がある記事は対象の提携先だけを返す", () => {
    const picked = pickCtaTargets(targets, "busan-1night-2days-plan");
    expect(picked.map((t) => t.programId)).toEqual(["prog-klook", "prog-rakuten-travel"]);
  });

  it("定義がない記事はカテゴリ共通の候補をそのまま返す", () => {
    expect(pickCtaTargets(targets, "unknown-slug")).toHaveLength(targets.length);
  });

  it("定義が候補と一致しない場合は空にせずカテゴリ共通へ戻す", () => {
    const otherTargets = [{ programId: "prog-yesstyle" }];
    const picked = pickCtaTargets(otherTargets, "busan-1night-2days-plan");
    expect(picked.map((t) => t.programId)).toEqual(["prog-yesstyle"]);
  });

  it("定義済みスラッグはすべてプログラムIDを持つ", () => {
    for (const [slug, programs] of Object.entries(ARTICLE_CTA_PROGRAMS)) {
      expect(programs.length, slug).toBeGreaterThan(0);
      for (const id of programs) expect(id).toMatch(/^prog-/);
    }
  });
});
