import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ArticleTopicSchema } from "@/lib/ai/topics";
import { evidenceList } from "@/data";

/**
 * content/topics.json は Content Bot（generate-article-drafts）が実行時に読む。
 * 定義不備があると夜間バッチが落ちるため、PR時点のCIで検出する。
 */
describe("記事トピック定義", () => {
  const raw = readFileSync(
    path.join(process.cwd(), "content/topics.json"),
    "utf8",
  );
  const parsed = JSON.parse(raw) as { topics: unknown[] };
  const entries = Array.isArray(parsed.topics) ? parsed.topics : [];

  it("トピックが1件以上ある", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it("全トピックがスキーマを満たす", () => {
    for (const [index, entry] of entries.entries()) {
      const result = ArticleTopicSchema.safeParse(entry);
      const id =
        typeof entry === "object" && entry !== null && "id" in entry
          ? String((entry as { id: unknown }).id)
          : `index:${index}`;
      const problems = result.success
        ? []
        : result.error.issues.map(
            (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
          );
      expect(problems, `topics[${index}] ${id}`).toEqual([]);
    }
  });

  it("トピックIDが重複しない", () => {
    const ids = entries.map((entry) =>
      typeof entry === "object" && entry !== null && "id" in entry
        ? String((entry as { id: unknown }).id)
        : "",
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("全ての出典IDが実在する証跡を指す", () => {
    const known = new Set(evidenceList.map((evidence) => evidence.id));
    for (const entry of entries) {
      const topic = ArticleTopicSchema.parse(entry);
      for (const evidenceId of topic.evidenceIds) {
        expect(known.has(evidenceId), `${topic.id}: ${evidenceId}`).toBe(true);
      }
    }
  });
});
