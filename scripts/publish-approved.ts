/**
 * 承認済みX投稿の配信。SOCIAL_PUBLISH_ENABLED=true のときだけ送信する。
 * Buffer等への接続は SOCIAL_WEBHOOK_URL 経由（署名付きJSON）。
 */
import { readJsonFile, writeJsonAtomic, appendJsonl } from "../src/lib/store";
import { deliverPromotion } from "../src/lib/social/delivery";
import type { Promotion } from "../src/lib/domain";

async function main(): Promise<void> {
  const queue = await readJsonFile<Promotion[]>("promotions/queue.json", []);
  const approved = queue.filter((promotion) => promotion.status === "approved");

  if (approved.length === 0) {
    console.log("[publish] 承認済みの投稿はありません。");
    return;
  }

  const config = {
    enabled: process.env.SOCIAL_PUBLISH_ENABLED === "true",
    webhookUrl: process.env.SOCIAL_WEBHOOK_URL ?? null,
    webhookSecret: process.env.SOCIAL_WEBHOOK_SECRET ?? null,
    paidPartnershipSupported:
      process.env.SOCIAL_PAID_PARTNERSHIP_SUPPORTED === "true",
  };

  for (const promotion of approved) {
    const result = await deliverPromotion(promotion, config);
    console.log(`[${result.status}] ${promotion.id}: ${result.reason}`);

    if (result.status === "sent") {
      promotion.status = "published";
      promotion.updatedAt = new Date().toISOString();
    } else if (result.status === "failed") {
      promotion.status = "failed";
      promotion.updatedAt = new Date().toISOString();
    }
    await appendJsonl("audit/promotions.jsonl", {
      at: new Date().toISOString(),
      action: "publish",
      promotionId: promotion.id,
      status: result.status,
      reason: result.reason,
    });
  }

  await writeJsonAtomic("promotions/queue.json", queue);
}

main().catch((error) => {
  console.error("[publish] fatal", error);
  process.exitCode = 1;
});
