import type { Currency, FxRate } from "./domain";
import { roundMoney } from "./money";

export type ConversionResult =
  | {
      ok: true;
      amountJpy: number;
      rate: number;
      observedAt: string;
      source: string;
      sourceUrl: string | null;
    }
  | { ok: false; reason: "missing_rate" | "invalid_rate" };

/**
 * 販売通貨 → 円換算。レート未取得の場合は 0 円にせず失敗を返す。
 * 換算レートと観測時刻は必ず表示側で併記すること。
 */
export function convertToJpy(
  amount: number,
  currency: Currency,
  rates: readonly FxRate[],
): ConversionResult {
  if (currency === "JPY") {
    return {
      ok: true,
      amountJpy: roundMoney(amount, "JPY"),
      rate: 1,
      observedAt: new Date().toISOString(),
      source: "JPY",
      sourceUrl: null,
    };
  }
  const rate = rates.find(
    (r) => r.base === currency && r.quote === "JPY" && r.rate > 0,
  );
  if (!rate) return { ok: false, reason: "missing_rate" };
  if (!Number.isFinite(rate.rate) || rate.rate <= 0) {
    return { ok: false, reason: "invalid_rate" };
  }
  return {
    ok: true,
    amountJpy: roundMoney(amount * rate.rate, "JPY"),
    rate: rate.rate,
    observedAt: rate.observedAt,
    source: rate.source,
    sourceUrl: rate.sourceUrl,
  };
}
