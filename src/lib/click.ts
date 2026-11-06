import { createHash, randomUUID } from "node:crypto";
import { appendJsonl } from "./store";
import { tokyoDayKey } from "./dates";

/**
 * 匿名クリック記録。
 * IPアドレス等をそのまま保存せず、日替わりのソルト付きハッシュのみ保持する。
 */
export function anonymousSessionKey(
  ip: string | null,
  userAgent: string | null,
  now: Date,
): string {
  const day = tokyoDayKey(now);
  const salt = process.env.CLICK_HASH_SALT ?? "dev-only-salt";
  return createHash("sha256")
    .update(`${day}|${salt}|${ip ?? "unknown"}|${userAgent ?? "unknown"}`)
    .digest("hex")
    .slice(0, 24);
}

export interface ClickInput {
  offerId: string;
  articleId?: string | null;
  channel: "x" | "search" | "direct" | "internal" | "other";
  ip: string | null;
  userAgent: string | null;
  now?: Date;
}

export async function recordOutboundClick(input: ClickInput): Promise<void> {
  const now = input.now ?? new Date();
  const day = tokyoDayKey(now);
  try {
    await appendJsonl(`analytics/clicks-${day.slice(0, 7)}.jsonl`, {
      offerId: input.offerId,
      articleId: input.articleId ?? null,
      channel: input.channel,
      day,
      anonymousSessionKey: anonymousSessionKey(input.ip, input.userAgent, now),
      createdAt: now.toISOString(),
      eventId: randomUUID(),
    });
  } catch (error) {
    // 計測失敗で外部遷移を妨げない。
    console.error("[click] failed to record", {
      offerId: input.offerId,
      message: error instanceof Error ? error.message : "unknown",
    });
  }
}
