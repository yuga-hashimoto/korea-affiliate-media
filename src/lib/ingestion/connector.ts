import { createHash } from "node:crypto";
import { z } from "zod";
import { appendJsonl, readJsonFile, writeJsonAtomic } from "@/lib/store";

/**
 * 許諾済みフィードの取り込みコネクター。
 * - INGESTION_ENABLED=false（既定）では外部にアクセスしない
 * - 取得許諾が"yes"でないソースは保存しない
 * - 同一内容の重複は保存しない（observedTextHash）
 * - 失敗時は既存データを壊さず停止する
 */

export const FeedOfferSchema = z.object({
  id: z.string().min(1),
  merchantId: z.string().min(1),
  category: z.enum(["esim", "hotel", "transport", "beauty", "fashion", "experience"]),
  productName: z.string().min(1),
  landingUrl: z.string().url(),
  currency: z.enum(["JPY", "KRW", "USD"]),
  baseAmount: z.number().nonnegative(),
  shippingAmount: z.number().nonnegative().nullable(),
  taxAmount: z.number().nonnegative().nullable(),
  feesAmount: z.number().nonnegative().nullable(),
  taxIncluded: z.boolean(),
  condition: z.object({
    groupKey: z.string().min(1),
    label: z.string().min(1),
    people: z.number().int().positive().nullable(),
    nights: z.number().int().positive().nullable(),
    days: z.number().int().positive().nullable(),
    gb: z.number().positive().nullable(),
  }),
  observedAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable(),
  sourceUrl: z.string().url(),
  accessPermitted: z.enum(["yes", "no", "unknown"]),
  evidenceCheckedAt: z.string().datetime(),
  available: z.boolean().nullable(),
});
export type FeedOffer = z.infer<typeof FeedOfferSchema>;

export const FeedPayloadSchema = z.object({
  offers: z.array(z.unknown()),
});

export interface IngestionOptions {
  feedUrl: string | null;
  enabled: boolean;
  allowedHosts: readonly string[];
  maxAgeDays?: number;
  now?: Date;
  fetchImpl?: typeof fetch;
  dataDirRelative?: string;
}

export interface IngestionResult {
  status: "disabled" | "ok" | "error";
  fetched: number;
  accepted: number;
  rejected: Array<{ id: string | null; reason: string }>;
  duplicates: number;
  message: string;
}

function isFresh(checkedAt: string, now: Date, maxAgeDays: number): boolean {
  const time = new Date(checkedAt).getTime();
  return Number.isFinite(time) && now.getTime() - time <= maxAgeDays * 86_400_000;
}

export async function runIngestion(
  options: IngestionOptions,
): Promise<IngestionResult> {
  const now = options.now ?? new Date();
  const maxAgeDays = options.maxAgeDays ?? 7;
  const baseResult: IngestionResult = {
    status: "disabled",
    fetched: 0,
    accepted: 0,
    rejected: [],
    duplicates: 0,
    message: "INGESTION_ENABLED=false のため実行しません（安全なデフォルト）。",
  };

  if (!options.enabled) return baseResult;

  if (!options.feedUrl) {
    return {
      ...baseResult,
      status: "error",
      message: "INGESTION_FEED_URL が設定されていません。",
    };
  }

  let url: URL;
  try {
    url = new URL(options.feedUrl);
  } catch {
    return { ...baseResult, status: "error", message: "フィードURLが不正です。" };
  }
  if (url.protocol !== "https:") {
    return { ...baseResult, status: "error", message: "httpsのみ許可します。" };
  }
  if (
    options.allowedHosts.length === 0 ||
    !options.allowedHosts.includes(url.hostname)
  ) {
    return {
      ...baseResult,
      status: "error",
      message: `許可されていないホストです: ${url.hostname}`,
    };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  let payload: unknown;
  try {
    const response = await fetchImpl(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      return {
        ...baseResult,
        status: "error",
        message: `フィード取得に失敗: HTTP ${response.status}`,
      };
    }
    payload = await response.json();
  } catch (error) {
    return {
      ...baseResult,
      status: "error",
      message: `フィード取得エラー: ${error instanceof Error ? error.message : "unknown"}`,
    };
  }

  const parsedPayload = FeedPayloadSchema.safeParse(payload);
  if (!parsedPayload.success) {
    return {
      ...baseResult,
      status: "error",
      message: "フィードの形式が不正です（offers配列が必要）。",
    };
  }

  const relativeDir = options.dataDirRelative ?? "ingestion";
  const hashFile = `${relativeDir}/hashes.json`;
  const knownHashes = new Set(
    await readJsonFile<string[]>(hashFile, []),
  );

  const accepted: FeedOffer[] = [];
  const rejected: IngestionResult["rejected"] = [];
  let duplicates = 0;

  for (const item of parsedPayload.data.offers) {
    const parsed = FeedOfferSchema.safeParse(item);
    if (!parsed.success) {
      const id =
        typeof item === "object" && item !== null && "id" in item
          ? String((item as { id: unknown }).id)
          : null;
      rejected.push({ id, reason: "スキーマ不一致" });
      continue;
    }
    const offer = parsed.data;

    if (offer.accessPermitted !== "yes") {
      rejected.push({ id: offer.id, reason: "取得・引用の許諾が未確認" });
      continue;
    }
    if (!isFresh(offer.evidenceCheckedAt, now, maxAgeDays)) {
      rejected.push({ id: offer.id, reason: "証跡が古い（再確認が必要）" });
      continue;
    }
    const hash = createHash("sha256")
      .update(JSON.stringify(offer))
      .digest("hex")
      .slice(0, 32);
    if (knownHashes.has(hash)) {
      duplicates += 1;
      continue;
    }
    knownHashes.add(hash);
    accepted.push(offer);
  }

  // 検証済みのものだけを保存する
  if (accepted.length > 0) {
    await appendJsonl(`${relativeDir}/observations.jsonl`, {
      runAt: now.toISOString(),
      source: url.toString(),
      offers: accepted,
    });
    await writeJsonAtomic(hashFile, [...knownHashes]);
  }

  return {
    status: "ok",
    fetched: parsedPayload.data.offers.length,
    accepted: accepted.length,
    rejected,
    duplicates,
    message:
      accepted.length > 0
        ? `${accepted.length}件を保存しました（${duplicates}件は重複）。`
        : "新規に保存するオファーはありませんでした。",
  };
}
