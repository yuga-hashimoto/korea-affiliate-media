/**
 * 公開済み記事からX投稿の下書きを生成し、レビューキューに追加する。
 * 実際の投稿は行わない（SOCIAL_PUBLISH_ENABLED=true + 承認 + 手動実行が必要）。
 */
import { publishedArticles } from "../src/data/index";
import { siteUrl } from "../src/lib/env";
import { buildSocialDraft, isDuplicatePost } from "../src/lib/social/drafts";
import { contentHash } from "../src/lib/ai/articles";
import { readJsonFile, writeJsonAtomic } from "../src/lib/store";
import type { Promotion } from "../src/lib/domain";

const QUEUE = "promotions/queue.json";
const DAILY_LIMIT = Number(process.env.SOCIAL_DRAFTS_PER_DAY ?? "2");

async function main(): Promise<void> {
  const queue = await readJsonFile<Promotion[]>(QUEUE, []);
  const existing = queue.map((item) => ({
    contentHash: item.contentHash,
    articleSlug: item.articleSlug,
  }));

  let added = 0;
  const now = new Date();

  for (const article of publishedArticles) {
    if (added >= DAILY_LIMIT) break;
    if (article.aiGenerated) {
      // AI生成記事のSNS投稿は、人のレビュー完了（reviewedAt）まで保留する。
      if (!article.reviewedAt) continue;
    }
    const draft = buildSocialDraft({ article, siteUrl: siteUrl() });
    if (!draft.ok) {
      console.log(`[skip] ${article.slug}: ${draft.issues.join(" / ")}`);
      continue;
    }
    if (isDuplicatePost(existing, { contentHash: draft.contentHash, articleSlug: article.slug })) {
      continue;
    }

    const promotion: Promotion = {
      id: `promo-${contentHash(`${article.slug}:${now.toISOString()}`).slice(0, 12)}`,
      channel: "x",
      content: draft.text,
      articleSlug: article.slug,
      offerIds: [],
      disclosureMode: "pr_label",
      status: "needs_review",
      scheduledAt: null,
      externalPostId: null,
      contentHash: draft.contentHash,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      facts: [
        `article:${article.slug}`,
        `title:${article.title}`,
        `url:${siteUrl()}/articles/${article.slug}`,
      ],
      risks: draft.risks,
      approvedBy: null,
    };

    queue.push(promotion);
    existing.push({ contentHash: promotion.contentHash, articleSlug: article.slug });
    added += 1;
    console.log(`[queued] ${article.slug} (${draft.text.length}文字)`);
  }

  await writeJsonAtomic(QUEUE, queue);
  console.log(`[social-draft] ${added}件を追加（キュー合計 ${queue.length}件）`);
}

main().catch((error) => {
  console.error("[social-draft] fatal", error);
  process.exitCode = 1;
});
