/**
 * 環境設定。すべての自動化・収益化機能は「設定がないとき安全に停止」。
 * 秘密情報はここでログ出力しない。
 */

function flag(name: string, fallback = false): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  return raw === "true" || raw === "1";
}

export const SITE = {
  name: "総額比較",
  tagline: "韓国旅行・韓国コスメの「実際に払う額」を比較",
  description:
    "韓国旅行・ホテル・eSIM・韓国コスメの総支払額を、送料・税金・手数料・為替まで含めて比較する日本語メディアです。UNKNOWNはUNKNOWNのまま表示し、出典と確認日時を明記します。",
  productionUrl: "https://sougakuhikaku.com",
  xHandle: "@bts_95_y",
} as const;

/** 公開URL。Preview では VERCEL_URL / ローカルURL を使う。 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return `http://localhost:${process.env.PORT ?? "3000"}`;
}

/** 検索エンジンへの index を許可するか。既定は noindex。 */
export function indexingEnabled(): boolean {
  return flag("SITE_INDEXING_ENABLED", false);
}

/** 提携リンクを実際に配信するか。承認 + 明示設定が必要。 */
export function affiliateLinksEnabled(): boolean {
  return flag("AFFILIATE_LINKS_ENABLED", false);
}

export function socialPublishEnabled(): boolean {
  return flag("SOCIAL_PUBLISH_ENABLED", false);
}

export function contentAutoPublishEnabled(): boolean {
  return flag("CONTENT_AUTO_PUBLISH_ENABLED", false);
}

export function ingestionEnabled(): boolean {
  return flag("INGESTION_ENABLED", false);
}

export function adminUiEnabled(): boolean {
  return flag("ADMIN_UI_ENABLED", false);
}

/**
 * 表示検証用のサンプル価格を描画するか。
 * 本番では明示的に true にしない限り無効。
 */
export function demoMode(): boolean {
  const raw = process.env.NEXT_PUBLIC_DEMO_MODE;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export function ga4MeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  return id && /^G-[A-Z0-9]+$/.test(id) ? id : null;
}

export function openRouterConfig(): { apiKey: string; model: string } | null {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;
  if (!apiKey || !model) return null;
  return { apiKey, model };
}

export function bufferConfig(): {
  accessToken: string;
  xChannelId: string;
} | null {
  const accessToken = process.env.BUFFER_ACCESS_TOKEN;
  const xChannelId = process.env.BUFFER_X_CHANNEL_ID;
  if (!accessToken || !xChannelId) return null;
  return { accessToken, xChannelId };
}

/**
 * X の Paid Partnership 開示設定を API 経由で保証できることが
 * 確認できるまで false。true にするには公式仕様の確認が必要。
 */
export function paidPartnershipSupported(): boolean {
  return flag("BUFFER_PAID_PARTNERSHIP_SUPPORTED", false);
}
