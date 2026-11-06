/**
 * AI記事下書きの自動生成。
 *
 * - OPENROUTER_API_KEY が無い場合はモックで動作確認のみ（公開しない）
 * - 数値の捏造・禁止表現・出典外参照を検査し、品質スコアが基準未満なら review 止まり
 * - CONTENT_AUTO_PUBLISH_ENABLED=true かつ 実LLM + 高スコアの場合のみ published
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  contentAutoPublishEnabled,
  openRouterConfig,
} from "../src/lib/env";
import { evidenceList } from "../src/data/index";
import { ArticleTopicSchema, type ArticleTopic } from "../src/lib/ai/topics";
import {
  ARTICLE_SYSTEM_PROMPT,
  PROMPT_VERSION,
  buildUserPrompt,
  contentHash,
  draftToArticle,
  parseDraft,
  validateDraft,
} from "../src/lib/ai/articles";
import { mockArticleDraft } from "../src/lib/ai/mock-provider";
import { callOpenRouterJson } from "../src/lib/ai/openrouter";
import { appendJsonl } from "../src/lib/store";
import type { Article } from "../src/lib/domain";

const ROOT = process.cwd();
const TOPICS_PATH = path.join(ROOT, "content/topics.json");
const GENERATED_PATH = path.join(ROOT, "content/generated/articles.json");

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

async function readTopics(): Promise<ArticleTopic[]> {
  const raw = await readFile(TOPICS_PATH, "utf8");
  const parsed = JSON.parse(raw) as { topics: unknown[] };
  return parsed.topics.map((topic) => ArticleTopicSchema.parse(topic));
}

async function readGenerated(): Promise<GeneratedRecord[]> {
  try {
    const raw = await readFile(GENERATED_PATH, "utf8");
    return (JSON.parse(raw) as { records: GeneratedRecord[] }).records;
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const autoPublish = contentAutoPublishEnabled();
  const limit = Number(process.env.ARTICLE_DRAFTS_PER_RUN ?? "2");
  const config = openRouterConfig();
  const provider = config ? "openrouter" : "mock";
  const model = config?.model ?? "mock-provider";

  const topics = (await readTopics()).filter((topic) => topic.status === "queued");
  const records = await readGenerated();
  const usedTopicIds = new Set(records.map((record) => record.topicId));
  const targets = topics
    .filter((topic) => !usedTopicIds.has(topic.id))
    .slice(0, limit);

  if (targets.length === 0) {
    console.log("[article-draft] 新しいトピックがありません。");
    return;
  }

  console.log(
    `[article-draft] provider=${provider} model=${model} targets=${targets.length} autoPublish=${autoPublish}`,
  );

  for (const topic of targets) {
    const evidence = topic.evidenceIds
      .map((id) => evidenceList.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (evidence.length === 0) {
      console.log(`[skip] ${topic.id}: 出典証跡が見つかりません`);
      continue;
    }

    try {
      let raw: unknown;
      if (config) {
        raw = await callOpenRouterJson({
          apiKey: config.apiKey,
          model: config.model,
          system: ARTICLE_SYSTEM_PROMPT,
          user: buildUserPrompt(topic, evidence),
        });
      } else {
        raw = mockArticleDraft(topic);
      }

      const draft = parseDraft(raw);
      const validation = validateDraft(draft, topic, evidence);
      const article = draftToArticle(draft, topic, new Date());

      const canPublish =
        autoPublish &&
        provider !== "mock" &&
        validation.ok &&
        validation.score >= 85 &&
        evidence.every((e) => e.reviewStatus === "verified");

      const record: GeneratedRecord = {
        topicId: topic.id,
        state: !validation.ok ? "review" : canPublish ? "published" : "review",
        score: validation.score,
        provider,
        model,
        promptVersion: PROMPT_VERSION,
        createdAt: new Date().toISOString(),
        issues: validation.issues,
        article: canPublish
          ? {
              ...article,
              status: "published",
              reviewedAt: new Date().toISOString(),
              publishedAt: new Date().toISOString(),
            }
          : article,
      };

      records.push(record);
      await appendJsonl("ai/audit.jsonl", {
        at: new Date().toISOString(),
        topicId: topic.id,
        state: record.state,
        score: record.score,
        issues: record.issues,
        contentHash: contentHash(JSON.stringify(article)),
        provider,
        model,
      });

      console.log(
        `[${record.state}] ${topic.id} score=${record.score} issues=${record.issues.length}`,
      );
    } catch (error) {
      console.error(`[error] ${topic.id}:`, error instanceof Error ? error.message : error);
      await appendJsonl("ai/audit.jsonl", {
        at: new Date().toISOString(),
        topicId: topic.id,
        state: "error",
        message: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  await mkdir(path.dirname(GENERATED_PATH), { recursive: true });
  await writeFile(
    GENERATED_PATH,
    `${JSON.stringify({ records }, null, 2)}\n`,
    "utf8",
  );
  console.log(`[article-draft] ${records.length}件のレコードを保存しました。`);
}

main().catch((error) => {
  console.error("[article-draft] fatal", error);
  process.exitCode = 1;
});
