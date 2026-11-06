/**
 * X投稿の承認（人手ゲート）。AIはこのコマンドを自動実行しない。
 *
 * 使い方: pnpm social:approve --id promo-xxxx --actor "担当者名"
 */
import { readJsonFile, writeJsonAtomic, appendJsonl } from "../src/lib/store";
import type { Promotion } from "../src/lib/domain";

function arg(name: string): string | null {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? (process.argv[index + 1] ?? null) : null;
}

async function main(): Promise<void> {
  const id = arg("id");
  const actor = arg("actor") ?? process.env.ADMIN_ACTOR ?? null;
  if (!id || !actor) {
    throw new Error("--id と --actor（または ADMIN_ACTOR）が必要です。");
  }

  const queue = await readJsonFile<Promotion[]>("promotions/queue.json", []);
  const target = queue.find((promotion) => promotion.id === id);
  if (!target) throw new Error(`投稿が見つかりません: ${id}`);
  if (target.status !== "needs_review") {
    throw new Error(`レビュー待ちではありません: ${target.status}`);
  }
  if (target.risks.length > 0) {
    throw new Error(`リスクが検出された投稿は承認できません: ${target.risks.join(", ")}`);
  }

  target.status = "approved";
  target.approvedBy = actor;
  target.updatedAt = new Date().toISOString();

  await writeJsonAtomic("promotions/queue.json", queue);
  await appendJsonl("audit/promotions.jsonl", {
    at: new Date().toISOString(),
    action: "approve",
    promotionId: id,
    actor,
  });
  console.log(`[approve] ${id} を承認しました（actor=${actor}）。`);
}

main().catch((error) => {
  console.error("[approve] fatal", error.message);
  process.exitCode = 1;
});
