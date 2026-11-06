import type {
  AffiliateProgram,
  FxRate,
  Offer,
  SourceEvidence,
} from "./domain";
import type { CostBreakdown } from "./total";
import { computeCostBreakdown } from "./total";
import { isPast } from "./dates";

export type RankBlockReason =
  | "sample_data"
  | "unknown_amount"
  | "fx_missing"
  | "expired"
  | "unavailable"
  | "evidence_missing"
  | "evidence_unverified"
  | "evidence_stale"
  | "evidence_not_permitted"
  | "program_not_approved";

export const RANK_BLOCK_LABELS: Record<RankBlockReason, string> = {
  sample_data: "サンプルデータのため順位付けの対象外",
  unknown_amount: "未確認の金額項目があるため順位付けの対象外",
  fx_missing: "為替レート未取得のため順位付けの対象外",
  expired: "掲載期限切れ",
  unavailable: "現在購入・予約できない",
  evidence_missing: "出典証跡が紐づいていない",
  evidence_unverified: "出典が未検証",
  evidence_stale: "出典が古く再確認が必要",
  evidence_not_permitted: "取得・引用の許諾が未確認",
  program_not_approved: "提携が未承認（参考表示のみ）",
};

export interface PricedOffer {
  offer: Offer;
  breakdown: CostBreakdown;
  rankable: boolean;
  blockers: RankBlockReason[];
  /** 表示用の順位。順位付け対象外は null。 */
  rank: number | null;
}

export interface ComparisonVerdict {
  kind: "cheapest" | "lowest_known" | "no_claim";
  headline: string;
  detail: string;
}

export interface ComparisonResult {
  comparable: boolean;
  groupKeys: string[];
  priced: PricedOffer[];
  ranked: PricedOffer[];
  verdict: ComparisonVerdict;
  /** 比較対象に含まれるサンプルデータの有無。 */
  hasSampleData: boolean;
  notes: string[];
}

export interface CompareOptions {
  now: Date;
  rates: readonly FxRate[];
  evidence: readonly SourceEvidence[];
  programs: readonly AffiliateProgram[];
  /** プレビュー検証時のみ true。公開ページでは false。 */
  allowSample: boolean;
  /** 証跡の許容経過日数。 */
  maxEvidenceAgeDays?: number;
  /** 判定文に表示する事業者名の解決関数。 */
  merchantLabel?: (merchantId: string) => string;
}

function evidenceBlocker(
  evidence: SourceEvidence | undefined,
  now: Date,
  maxAgeDays: number,
): RankBlockReason | null {
  if (!evidence) return "evidence_missing";
  if (evidence.reviewStatus === "rejected") return "evidence_unverified";
  if (evidence.reviewStatus === "unreviewed") return "evidence_unverified";
  if (evidence.reviewStatus === "stale") return "evidence_stale";
  if (evidence.accessPermitted !== "yes") return "evidence_not_permitted";
  if (evidence.sample) return null;
  const checked = new Date(evidence.checkedAt).getTime();
  if (!Number.isFinite(checked)) return "evidence_unverified";
  if (now.getTime() - checked > maxAgeDays * 24 * 60 * 60 * 1000) {
    return "evidence_stale";
  }
  return null;
}

/**
 * 同一条件グループのオファーを総額比較する。
 * 未確認項目があるオファーは 0 円扱いせず、順位付けから除外する。
 */
/** 公開ページに表示してよいオファー。サンプルはデモモード時のみ表示する。 */
export function selectDisplayableOffers(
  offers: readonly Offer[],
  allowSample: boolean,
): Offer[] {
  return allowSample ? [...offers] : offers.filter((offer) => !offer.sample);
}

export function compareOffers(
  offers: readonly Offer[],
  options: CompareOptions,
): ComparisonResult {
  const {
    now,
    rates,
    evidence,
    programs,
    allowSample,
    maxEvidenceAgeDays = 14,
    merchantLabel = (id: string) => id,
  } = options;

  const priced: PricedOffer[] = offers.map((offer) => {
    const breakdown = computeCostBreakdown(offer, rates, { now });
    const blockers: RankBlockReason[] = [];

    if (offer.sample && !allowSample) blockers.push("sample_data");
    if (!breakdown.complete) {
      if (breakdown.fx.missing || offer.currency !== "JPY") {
        // 換算不能は合計 null の理由の一つとして扱う
        if (breakdown.fx.missing) blockers.push("fx_missing");
      }
      if (breakdown.unknownFields.length > 0) blockers.push("unknown_amount");
    }
    if (offer.available === false) blockers.push("unavailable");
    if (isPast(offer.expiresAt, now)) blockers.push("expired");

    const ev = evidence.find((e) => e.id === offer.evidenceId);
    const evBlocker = evidenceBlocker(ev, now, maxEvidenceAgeDays);
    if (evBlocker) blockers.push(evBlocker);

    if (offer.programId) {
      const program = programs.find((p) => p.id === offer.programId);
      if (!program || program.status !== "approved") {
        blockers.push("program_not_approved");
      }
    }

    const uniqueBlockers = [...new Set(blockers)];
    return {
      offer,
      breakdown,
      blockers: uniqueBlockers,
      rankable: uniqueBlockers.length === 0 && breakdown.totalJpy !== null,
      rank: null,
    };
  });

  const groupKeys = [...new Set(priced.map((p) => p.offer.condition.groupKey))];
  const comparable = groupKeys.length <= 1;

  // 順位付け: 同一条件グループの対象のみ。同額は同順位（1,1,3）。
  const ranked = comparable
    ? priced
        .filter((p) => p.rankable)
        .sort((a, b) => (a.breakdown.totalJpy ?? 0) - (b.breakdown.totalJpy ?? 0))
    : [];

  let lastTotal: number | null = null;
  let lastRank = 0;
  ranked.forEach((item, index) => {
    const total = item.breakdown.totalJpy ?? 0;
    if (lastTotal !== null && total === lastTotal) {
      item.rank = lastRank;
    } else {
      item.rank = index + 1;
      lastRank = index + 1;
      lastTotal = total;
    }
  });

  const hasSampleData = priced.some((p) => p.offer.sample);
  const hasUnknown = priced.some((p) => !p.breakdown.complete);
  const hasUnverifiedCoupon = priced.some(
    (p) => p.breakdown.coupon.status === "unverified",
  );

  const notes: string[] = [];
  if (!comparable) {
    notes.push(
      "比較条件（日程・人数・容量など）が異なるため、総額の順位付けは行いません。",
    );
  }
  if (hasUnknown) {
    notes.push(
      "未確認の費用項目があります。合計額を確定せず「確認済み項目の最低額」として表示しています。",
    );
  }
  if (hasUnverifiedCoupon) {
    notes.push(
      "適用条件が未確認のクーポンは総額に反映していません。",
    );
  }
  if (hasSampleData) {
    notes.push(
      "このページには表示検証用のサンプル価格が含まれます。実際の販売価格ではありません。",
    );
  }
  if (!allowSample && priced.some((p) => p.offer.sample)) {
    notes.push("サンプル価格のオファーは順位付けから除外しました。");
  }

  let verdict: ComparisonVerdict;
  const best = ranked[0];
  if (!comparable) {
    verdict = {
      kind: "no_claim",
      headline: "条件が揃っていないため比較できません",
      detail:
        "日程・人数・容量などの条件を揃えると総額を比較できます。条件の異なる金額を「最安」として扱いません。",
    };
  } else if (!best) {
    verdict = {
      kind: "no_claim",
      headline: "比較可能な確認済み価格がありません",
      detail:
        "出典・取得日時・未確認項目を確認できたオファーのみを比較対象にしています。",
    };
  } else if (ranked.length < 2) {
    verdict = {
      kind: "no_claim",
      headline: "比較対象が1件のため「最安」は判定しません",
      detail:
        "同一条件で比較できるオファーが2件以上ある場合にのみ、総額の比較結果を表示します。",
    };
  } else if (hasSampleData || hasUnknown || hasUnverifiedCoupon) {
    verdict = {
      kind: "lowest_known",
      headline: `確認済み項目での最低額は「${merchantLabel(best.offer.merchantId)}」の「${best.offer.productName}」`,
      detail:
        "未確認・未適用の条件があるため「総額最安」とは断定できません。各オファーの内訳と更新日時を確認してください。",
    };
  } else {
    verdict = {
      kind: "cheapest",
      headline: `この条件での総額最安は「${merchantLabel(best.offer.merchantId)}」の「${best.offer.productName}」`,
      detail:
        "同一条件・同一通貨換算で比較した結果です。価格は変動するため、リンク先の最新条件を確認してください。",
    };
  }

  return {
    comparable,
    groupKeys,
    priced,
    ranked,
    verdict,
    hasSampleData,
    notes,
  };
}
