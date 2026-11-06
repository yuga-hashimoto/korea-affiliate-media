import generated from "../../content/generated/articles.json";
import type { Article } from "@/lib/domain";
import { ArticleSchema } from "@/lib/domain";

interface GeneratedRecord {
  topicId: string;
  state: "review" | "published" | "rejected";
  score: number;
  provider: string;
  model: string;
  promptVersion: string;
  createdAt: string;
  issues: string[];
  article: Article;
}

/**
 * CI/ローカルジョブが生成した記事。
 * state が published のものだけを公開対象にし、review は公開しない。
 */
export const generatedRecords: GeneratedRecord[] = (
  generated as { records: GeneratedRecord[] }
).records;

export const generatedPublishedArticles: Article[] = generatedRecords
  .filter((record) => record.state === "published")
  .map((record) => ArticleSchema.parse(record.article));
