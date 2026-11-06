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
  /** 暫定ブランド名。正式名称は公開前に決定できる（1箇所の変更で反映）。 */
  name: "韓国旅行ノート",
  tagline: "ソウル・釜山・済州をもっと楽しむ旅行メディア",
  description:
    "韓国旅行をもっと楽しくする日本語メディア。ソウル・釜山・済州のエリアガイド、グルメ、カフェ、買い物、交通、宿泊、旅の準備を、確認日時つきで紹介します。",
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

export function socialPublishEnabled(): boolean {
  return flag("SOCIAL_PUBLISH_ENABLED", false);
}

export function contentAutoPublishEnabled(): boolean {
  return flag("CONTENT_AUTO_PUBLISH_ENABLED", false);
}

export function adminUiEnabled(): boolean {
  return flag("ADMIN_UI_ENABLED", false);
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

/**
 * X の Paid Partnership 開示設定を API 経由で保証できることが
 * 確認できるまで false。true にするには公式仕様の確認が必要。
 */
export function paidPartnershipSupported(): boolean {
  return flag("SOCIAL_PAID_PARTNERSHIP_SUPPORTED", false);
}
