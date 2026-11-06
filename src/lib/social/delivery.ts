import { createHmac } from "node:crypto";
import type { Promotion } from "@/lib/domain";
import { appendJsonl, readJsonl } from "@/lib/store";

/**
 * X投稿の配信アダプター。
 *
 * 直接Buffer GraphQLを叩く仕様は公式ドキュメントで確認できていないため、
 * 検証済みのWebhook（Buffer/Make/Zapier/n8n、または社内エージェント）へ
 * 署名付きJSONを送る方式を既定とする。未設定時は安全に停止する。
 */

export interface DeliveryConfig {
  enabled: boolean;
  webhookUrl: string | null;
  webhookSecret: string | null;
  paidPartnershipSupported: boolean;
  now?: Date;
  fetchImpl?: typeof fetch;
  logPath?: string;
}

export type DeliveryResult =
  | { status: "dry_run"; reason: string; payload: DeliveryPayload }
  | { status: "blocked"; reason: string }
  | { status: "already_delivered"; reason: string }
  | { status: "sent"; reason: string; httpStatus: number }
  | { status: "failed"; reason: string; httpStatus: number | null };

export interface DeliveryPayload {
  channel: "x";
  text: string;
  scheduledAt: string | null;
  disclosure: Promotion["disclosureMode"];
  idempotencyKey: string;
  articleSlug: string | null;
}

export function buildPayload(promotion: Promotion): DeliveryPayload {
  return {
    channel: "x",
    text: promotion.content,
    scheduledAt: promotion.scheduledAt,
    disclosure: promotion.disclosureMode,
    idempotencyKey: `promo:${promotion.contentHash}`,
    articleSlug: promotion.articleSlug,
  };
}

function sign(secret: string, body: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export async function deliverPromotion(
  promotion: Promotion,
  config: DeliveryConfig,
): Promise<DeliveryResult> {
  const now = config.now ?? new Date();
  const payload = buildPayload(promotion);
  const logPath = config.logPath ?? "social/deliveries.jsonl";

  if (promotion.status !== "approved") {
    return {
      status: "blocked",
      reason: `承認済みではありません（status=${promotion.status}）`,
    };
  }

  // 有料パートナーシップ開示をAPIで保証できない場合、PR投稿は自動配信しない。
  if (
    promotion.disclosureMode !== "none" &&
    !config.paidPartnershipSupported
  ) {
    return {
      status: "blocked",
      reason:
        "XのPaid Partnership開示を技術的に保証できないため、PR投稿は手動運用に回します。",
    };
  }

  const history = await readJsonl<{ idempotencyKey: string }>(logPath);
  if (history.some((item) => item.idempotencyKey === payload.idempotencyKey)) {
    return { status: "already_delivered", reason: "同一内容は送信済みです" };
  }

  if (!config.enabled) {
    return {
      status: "dry_run",
      reason: "SOCIAL_PUBLISH_ENABLED=false のため送信しません（内容のみ検証）。",
      payload,
    };
  }

  if (!config.webhookUrl || !config.webhookSecret) {
    return {
      status: "blocked",
      reason: "SOCIAL_WEBHOOK_URL / SOCIAL_WEBHOOK_SECRET が未設定です。",
    };
  }

  const body = JSON.stringify(payload);
  const fetchImpl = config.fetchImpl ?? fetch;
  let httpStatus: number | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetchImpl(config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Signature": `sha256=${sign(config.webhookSecret, body)}`,
          "Idempotency-Key": payload.idempotencyKey,
        },
        body,
        signal: AbortSignal.timeout(20_000),
      });
      httpStatus = response.status;
      if (response.ok) {
        await appendJsonl(logPath, {
          idempotencyKey: payload.idempotencyKey,
          promotionId: promotion.id,
          status: "sent",
          httpStatus,
          sentAt: now.toISOString(),
        });
        return {
          status: "sent",
          reason: "送信しました",
          httpStatus,
        };
      }
      if (response.status < 500) break;
    } catch {
      httpStatus = null;
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
  }

  await appendJsonl(logPath, {
    idempotencyKey: payload.idempotencyKey,
    promotionId: promotion.id,
    status: "failed",
    httpStatus,
    sentAt: now.toISOString(),
  });
  return {
    status: "failed",
    reason: "送信に失敗しました。二重投稿を避けるため自動再試行は停止します。",
    httpStatus,
  };
}
