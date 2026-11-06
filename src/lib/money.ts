import type { Currency } from "./domain";

const SYMBOLS: Record<Currency, string> = {
  JPY: "¥",
  KRW: "₩",
  USD: "$",
};

/** 通貨ごとの表示小数桁。JPY/KRW は整数表示。 */
export function fractionDigits(currency: Currency): number {
  return currency === "USD" ? 2 : 0;
}

/** 半端な浮動小数を避けるための丸め（銀行丸めは使わず四捨五入）。 */
export function roundMoney(value: number, currency: Currency): number {
  const digits = fractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatMoney(
  value: number,
  currency: Currency,
  options: { signDisplay?: "auto" | "always" } = {},
): string {
  const digits = fractionDigits(currency);
  const formatted = new Intl.NumberFormat("ja-JP", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(roundMoney(Math.abs(value), currency));
  const sign = value < 0 ? "-" : options.signDisplay === "always" ? "+" : "";
  return `${sign}${SYMBOLS[currency]}${formatted}`;
}

/** 未確認（null）を 0 円に置き換えず、そのまま明示する。 */
export function formatMoneyOrUnknown(
  value: number | null,
  currency: Currency,
): string {
  return value === null ? "UNKNOWN" : formatMoney(value, currency);
}

export function sumKnown(values: ReadonlyArray<number | null>): number {
  return values.reduce<number>((acc, v) => acc + (v ?? 0), 0);
}
