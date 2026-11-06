import type { AffiliateProgram, Offer } from "./domain";
import { affiliateLinksEnabled } from "./env";

export type OutboundLink =
  | { mode: "affiliate"; href: string; note: string }
  | { mode: "official"; href: string; note: string }
  | { mode: "blocked"; href: null; note: string };

function isHttps(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * 外部リンクを解決する。提携未承認・リンク未発行・フラグOFFのときは
 * 公式ページへの通常リンクのみを返す。成果パラメータを捏造しない。
 */
export function resolveOutboundLink(
  offer: Offer,
  program: AffiliateProgram | null,
): OutboundLink {
  if (!isHttps(offer.landingUrl)) {
    return { mode: "blocked", href: null, note: "リンク先がhttpsではないため無効化しました" };
  }

  const canUseAffiliate =
    affiliateLinksEnabled() &&
    program !== null &&
    program.status === "approved" &&
    program.allowedMedia.includes("web") &&
    program.linkTemplate !== null &&
    isHttps(program.linkTemplate);

  if (canUseAffiliate && program) {
    return {
      mode: "affiliate",
      href: program.linkTemplate as string,
      note: "広告（提携承認済みリンク）",
    };
  }

  if (!program || program.status !== "approved") {
    return {
      mode: "official",
      href: offer.landingUrl,
      note: "公式ページへのリンク（提携未承認・成果リンクなし）",
    };
  }

  return {
    mode: "official",
    href: offer.landingUrl,
    note: "成果リンクの発行条件が未確認のため公式ページへリンクしています",
  };
}

/** /go/{id} で許可するリンク先を決める（登録済みオファーのみ）。 */
export function resolveGoTarget(
  offer: Offer,
  program: AffiliateProgram | null,
): { href: string | null; mode: "affiliate" | "official" } {
  const resolved = resolveOutboundLink(offer, program);
  if (resolved.mode === "blocked") return { href: null, mode: "official" };
  return { href: resolved.href, mode: resolved.mode };
}
