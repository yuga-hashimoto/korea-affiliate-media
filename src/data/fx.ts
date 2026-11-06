import type { FxRate } from "@/lib/domain";

/**
 * 為替レート。現状は表示検証用のサンプル値で、実レートではない。
 * 本番では認可された為替API/手動確認値に置き換え、観測時刻を併記する。
 */
export const fxRates: FxRate[] = [
  {
    base: "USD",
    quote: "JPY",
    rate: 152.3,
    observedAt: "2026-11-06T09:00:00.000Z",
    source: "SAMPLE（表示検証用）",
    sourceUrl: null,
  },
  {
    base: "KRW",
    quote: "JPY",
    rate: 0.108,
    observedAt: "2026-11-06T09:00:00.000Z",
    source: "SAMPLE（表示検証用）",
    sourceUrl: null,
  },
];

export const fxIsSample = true;
