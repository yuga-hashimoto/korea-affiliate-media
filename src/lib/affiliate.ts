import { programList } from "@/data";

export type OutboundLink = {
  href: string;
  isAffiliate: boolean;
};

const HTTPS = /^https:\/\//;

/**
 * 承認済みの成果リンクを環境変数から読み込む。
 * 例: AFFILIATE_LINKS_JSON='{"prog-klook":"https://affiliate.example/..."}'
 * - 登録済みプログラムIDのみ許可
 * - https のみ許可
 * - 不正なJSON・URLは無視（公式リンクへフォールバック）
 */
export function parseAffiliateLinks(
  raw: string | undefined,
  allowedProgramIds: ReadonlySet<string>,
): Record<string, string> {
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {};
  }
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (!allowedProgramIds.has(key)) continue;
    if (typeof value !== "string") continue;
    if (!HTTPS.test(value)) continue;
    result[key] = value;
  }
  return result;
}

/** 成果リンクが使えない場合は公式URLへフォールバックする。 */
export function resolveOutbound(
  programId: string,
  officialUrl: string,
  options: { raw?: string; enabled?: boolean } = {},
): OutboundLink {
  const enabled = options.enabled ?? process.env.AFFILIATE_LINKS_ENABLED === "true";
  if (!enabled) return { href: officialUrl, isAffiliate: false };

  const allowed = new Set(programList.map((program) => program.id));
  const links = parseAffiliateLinks(
    options.raw ?? process.env.AFFILIATE_LINKS_JSON,
    allowed,
  );
  const href = links[programId];
  if (!href) return { href: officialUrl, isAffiliate: false };
  return { href, isAffiliate: true };
}
