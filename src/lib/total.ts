import type { Coupon, FxRate, Offer } from "./domain";
import { convertToJpy } from "./fx";
import { roundMoney } from "./money";
import { isPast } from "./dates";

export type UnknownField = "base" | "shipping" | "tax" | "fees";

export const UNKNOWN_LABELS: Record<UnknownField, string> = {
  base: "商品価格",
  shipping: "送料",
  tax: "税金",
  fees: "手数料",
};

export type CouponAssessment =
  | { status: "none" }
  | { status: "applied"; discount: number; label: string }
  | {
      status: "not_applicable";
      reason:
        | "expired"
        | "not_started"
        | "membership_required"
        | "below_threshold"
        | "no_context";
      label: string;
      detail: string;
    }
  | { status: "unverified"; label: string; detail: string };

export interface CouponContext {
  now: Date;
  member: boolean;
  /** 送料を含めた支払対象額（クーポン適用前）。 */
  subtotal: number;
  shipping: number;
}

export function assessCoupon(
  coupon: Coupon | null,
  context: CouponContext,
): CouponAssessment {
  if (!coupon) return { status: "none" };

  if (coupon.eligibility === "unknown") {
    return {
      status: "unverified",
      label: coupon.label,
      detail: "適用条件が未確認のため総額に反映していません",
    };
  }
  if (isPast(coupon.validUntil, context.now)) {
    return {
      status: "not_applicable",
      reason: "expired",
      label: coupon.label,
      detail: "有効期限が終了しています",
    };
  }
  if (coupon.validFrom && new Date(coupon.validFrom) > context.now) {
    return {
      status: "not_applicable",
      reason: "not_started",
      label: coupon.label,
      detail: "キャンペーン開始前です",
    };
  }
  if (coupon.requiresMembership && !context.member) {
    return {
      status: "not_applicable",
      reason: "membership_required",
      label: coupon.label,
      detail: "会員限定のため未適用です",
    };
  }
  if (
    coupon.minSubtotal !== null &&
    context.subtotal < coupon.minSubtotal
  ) {
    return {
      status: "not_applicable",
      reason: "below_threshold",
      label: coupon.label,
      detail: `${coupon.minSubtotal} 以上の購入が条件です`,
    };
  }

  let discount = 0;
  if (coupon.discountType === "fixed") {
    discount = coupon.value;
  } else if (coupon.discountType === "rate") {
    const target =
      coupon.appliesTo === "shipping" ? context.shipping : context.subtotal;
    discount = target * coupon.value;
    if (coupon.maxDiscount !== null) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else if (coupon.discountType === "free_shipping") {
    discount = context.shipping;
  }

  const cap = coupon.appliesTo === "shipping" ? context.shipping : context.subtotal;
  discount = Math.max(0, Math.min(discount, cap));

  return { status: "applied", discount, label: coupon.label };
}

export interface CostComponent {
  key: UnknownField | "coupon";
  label: string;
  /** 販売通貨での値。未確認は null。 */
  amount: number | null;
  /** 円換算後の値。換算不能は null。 */
  amountJpy: number | null;
  unknown: boolean;
  note: string;
}

export interface CostBreakdown {
  currency: Offer["currency"];
  components: CostComponent[];
  /** 販売通貨の合計。不明項目がある場合は null。 */
  nativeTotal: number | null;
  /** 円換算の合計。不明・換算不能なら null。 */
  totalJpy: number | null;
  /** 確認できている項目だけの最低額（「◯円以上」表示用）。 */
  minKnownJpy: number | null;
  nativeMinKnown: number | null;
  unknownFields: UnknownField[];
  complete: boolean;
  coupon: CouponAssessment;
  fx: {
    rate: number | null;
    observedAt: string | null;
    source: string | null;
    sourceUrl: string | null;
    missing: boolean;
  };
}

/**
 * 総額を計算する。不明項目は 0 として足し込まず、合計を null にして
 * 「最低◯円＋未確認項目」として提示できる形で返す。
 *
 * total = base + shipping + tax + fees - coupon
 * 税込 (taxIncluded) の場合、taxAmount は 0 か null のいずれかで、
 * 内税として扱い二重計上しない。
 */
export function computeCostBreakdown(
  offer: Offer,
  rates: readonly FxRate[],
  context: { now: Date; member?: boolean },
): CostBreakdown {
  const member = context.member ?? false;
  const taxKnown = offer.taxIncluded
    ? 0
    : offer.taxAmount;

  const coupon = assessCoupon(offer.coupon, {
    now: context.now,
    member,
    subtotal: (offer.baseAmount ?? 0) + (taxKnown ?? 0),
    shipping: offer.shippingAmount ?? 0,
  });

  const couponDiscount =
    coupon.status === "applied" ? roundMoney(coupon.discount, offer.currency) : 0;

  const rows: ReadonlyArray<{
    key: UnknownField;
    label: string;
    amount: number | null;
    note: string;
  }> = [
    {
      key: "base",
      label: "本体価格",
      amount: offer.baseAmount,
      note: offer.taxIncluded ? "税込" : "税抜",
    },
    { key: "shipping", label: "送料", amount: offer.shippingAmount, note: "" },
    {
      key: "tax",
      label: "税金",
      amount: taxKnown,
      note: offer.taxIncluded ? "内税（価格に含む）" : "追加課税",
    },
    { key: "fees", label: "手数料", amount: offer.feesAmount, note: "" },
  ];

  const unknownFields = rows.filter((r) => r.amount === null).map((r) => r.key);

  // 円換算は各項目ごとに行う（換算不能な項目は null のまま残す）。
  const components: CostComponent[] = [];
  let knownJpy = 0;
  let knownNative = 0;
  let fxMissing = false;
  let fxSource: CostBreakdown["fx"] = {
    rate: null,
    observedAt: null,
    source: null,
    sourceUrl: null,
    missing: false,
  };

  for (const row of rows) {
    if (row.amount === null) {
      components.push({
        key: row.key,
        label: row.label,
        amount: null,
        amountJpy: null,
        unknown: true,
        note: row.note,
      });
      continue;
    }
    const converted = convertToJpy(row.amount, offer.currency, rates);
    if (!converted.ok) {
      fxMissing = true;
      fxSource = {
        rate: null,
        observedAt: null,
        source: null,
        sourceUrl: null,
        missing: true,
      };
      components.push({
        key: row.key,
        label: row.label,
        amount: row.amount,
        amountJpy: null,
        unknown: false,
        note: "円換算できません（為替レート未取得）",
      });
      continue;
    }
    knownJpy += converted.amountJpy;
    knownNative += row.amount;
    if (offer.currency !== "JPY") {
      fxSource = {
        rate: converted.rate,
        observedAt: converted.observedAt,
        source: converted.source,
        sourceUrl: converted.sourceUrl,
        missing: false,
      };
    }
    components.push({
      key: row.key,
      label: row.label,
      amount: row.amount,
      amountJpy: converted.amountJpy,
      unknown: false,
      note: row.note,
    });
  }

  if (couponDiscount > 0) {
    const convertedDiscount = convertToJpy(
      couponDiscount,
      offer.currency,
      rates,
    );
    const discountJpy = convertedDiscount.ok ? convertedDiscount.amountJpy : null;
    if (discountJpy !== null) knownJpy -= discountJpy;
    knownNative -= couponDiscount;
    components.push({
      key: "coupon",
      label: "クーポン",
      amount: -couponDiscount,
      amountJpy: discountJpy === null ? null : -discountJpy,
      unknown: false,
      note: coupon.status === "applied" ? coupon.label : "",
    });
  }

  const complete = unknownFields.length === 0 && !fxMissing;
  const totalJpy = complete ? knownJpy : null;

  return {
    currency: offer.currency,
    components,
    nativeTotal: complete ? roundMoney(knownNative, offer.currency) : null,
    totalJpy,
    minKnownJpy: knownJpy,
    nativeMinKnown: roundMoney(knownNative, offer.currency),
    unknownFields,
    complete,
    coupon,
    fx: fxSource,
  };
}
