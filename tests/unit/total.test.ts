import { describe, expect, it } from "vitest";
import { computeCostBreakdown } from "@/lib/total";
import type { FxRate } from "@/lib/domain";
import { NOW, offer } from "./fixtures";

const rates: FxRate[] = [
  {
    base: "USD",
    quote: "JPY",
    rate: 150,
    observedAt: "2026-11-06T00:00:00.000Z",
    source: "test",
    sourceUrl: null,
  },
  {
    base: "KRW",
    quote: "JPY",
    rate: 0.1,
    observedAt: "2026-11-06T00:00:00.000Z",
    source: "test",
    sourceUrl: null,
  },
];

describe("computeCostBreakdown", () => {
  it("税込価格に税金を二重計上しない", () => {
    const result = computeCostBreakdown(
      offer({ baseAmount: 1980, taxAmount: 0, taxIncluded: true }),
      rates,
      { now: NOW },
    );
    expect(result.totalJpy).toBe(1980);
    expect(result.complete).toBe(true);
  });

  it("税別価格は税を加算する", () => {
    const result = computeCostBreakdown(
      offer({ baseAmount: 1000, taxAmount: 100, taxIncluded: false }),
      rates,
      { now: NOW },
    );
    expect(result.totalJpy).toBe(1100);
  });

  it("未確認の手数料を0円として合計しない", () => {
    const result = computeCostBreakdown(
      offer({ baseAmount: 1000, feesAmount: null }),
      rates,
      { now: NOW },
    );
    expect(result.totalJpy).toBeNull();
    expect(result.complete).toBe(false);
    expect(result.unknownFields).toContain("fees");
    expect(result.minKnownJpy).toBe(1000);
  });

  it("為替レートがない外貨は円換算をUNKNOWNにする", () => {
    const result = computeCostBreakdown(
      offer({ currency: "USD", baseAmount: 10, taxAmount: null, taxIncluded: false }),
      [],
      { now: NOW },
    );
    expect(result.totalJpy).toBeNull();
    expect(result.fx.missing).toBe(true);
  });

  it("外貨建ては各項目を円換算し、為替の観測日時を返す", () => {
    const result = computeCostBreakdown(
      offer({
        currency: "USD",
        baseAmount: 12.5,
        taxAmount: 1,
        taxIncluded: false,
      }),
      rates,
      { now: NOW },
    );
    expect(result.totalJpy).toBe(2025);
    expect(result.fx.rate).toBe(150);
    expect(result.fx.observedAt).toBe("2026-11-06T00:00:00.000Z");
  });

  it("条件を満たす固定額クーポンを差し引く", () => {
    const result = computeCostBreakdown(
      offer({
        baseAmount: 3200,
        shippingAmount: 700,
        coupon: {
          id: "c1",
          label: "300円OFF",
          discountType: "fixed",
          value: 300,
          maxDiscount: null,
          minSubtotal: 3000,
          appliesTo: "base",
          requiresMembership: false,
          validFrom: null,
          validUntil: "2026-12-31T00:00:00.000Z",
          eligibility: "confirmed",
          sourceEvidenceId: "ev-verified",
          note: "",
        },
      }),
      rates,
      { now: NOW },
    );
    expect(result.coupon.status).toBe("applied");
    expect(result.totalJpy).toBe(3600);
  });

  it("最低購入額を満たさないクーポンは適用しない", () => {
    const result = computeCostBreakdown(
      offer({
        baseAmount: 2000,
        coupon: {
          id: "c2",
          label: "3000円以上で300円OFF",
          discountType: "fixed",
          value: 300,
          maxDiscount: null,
          minSubtotal: 3000,
          appliesTo: "base",
          requiresMembership: false,
          validFrom: null,
          validUntil: null,
          eligibility: "confirmed",
          sourceEvidenceId: "ev-verified",
          note: "",
        },
      }),
      rates,
      { now: NOW },
    );
    expect(result.coupon.status).toBe("not_applicable");
    expect(result.totalJpy).toBe(2000);
  });

  it("割合クーポンは上限額でキャップする", () => {
    const result = computeCostBreakdown(
      offer({
        baseAmount: 10000,
        coupon: {
          id: "c3",
          label: "10%OFF（最大500円）",
          discountType: "rate",
          value: 0.1,
          maxDiscount: 500,
          minSubtotal: null,
          appliesTo: "base",
          requiresMembership: false,
          validFrom: null,
          validUntil: null,
          eligibility: "confirmed",
          sourceEvidenceId: "ev-verified",
          note: "",
        },
      }),
      rates,
      { now: NOW },
    );
    expect(result.coupon.status).toBe("applied");
    expect(result.totalJpy).toBe(9500);
  });

  it("有効期限切れのクーポンは適用しない", () => {
    const result = computeCostBreakdown(
      offer({
        coupon: {
          id: "c4",
          label: "期限切れ",
          discountType: "fixed",
          value: 100,
          maxDiscount: null,
          minSubtotal: null,
          appliesTo: "base",
          requiresMembership: false,
          validFrom: null,
          validUntil: "2026-10-01T00:00:00.000Z",
          eligibility: "confirmed",
          sourceEvidenceId: "ev-verified",
          note: "",
        },
      }),
      rates,
      { now: NOW },
    );
    expect(result.coupon.status).toBe("not_applicable");
    expect(result.totalJpy).toBe(1000);
  });

  it("会員限定クーポンは非会員に適用しない", () => {
    const result = computeCostBreakdown(
      offer({
        coupon: {
          id: "c5",
          label: "会員10%OFF",
          discountType: "rate",
          value: 0.1,
          maxDiscount: null,
          minSubtotal: null,
          appliesTo: "base",
          requiresMembership: true,
          validFrom: null,
          validUntil: null,
          eligibility: "confirmed",
          sourceEvidenceId: "ev-verified",
          note: "",
        },
      }),
      rates,
      { now: NOW, member: false },
    );
    expect(result.coupon.status).toBe("not_applicable");
    expect(result.totalJpy).toBe(1000);
  });

  it("条件未確認のクーポンは未適用として通知する", () => {
    const result = computeCostBreakdown(
      offer({
        coupon: {
          id: "c6",
          label: "初回10%OFF（条件未確認）",
          discountType: "rate",
          value: 0.1,
          maxDiscount: null,
          minSubtotal: null,
          appliesTo: "base",
          requiresMembership: true,
          validFrom: null,
          validUntil: null,
          eligibility: "unknown",
          sourceEvidenceId: null,
          note: "",
        },
      }),
      rates,
      { now: NOW },
    );
    expect(result.coupon.status).toBe("unverified");
    expect(result.totalJpy).toBe(1000);
  });

  it("KRW建ての送料も同じレートで換算する", () => {
    const result = computeCostBreakdown(
      offer({ currency: "KRW", baseAmount: 18000, shippingAmount: 3000 }),
      rates,
      { now: NOW },
    );
    expect(result.totalJpy).toBe(2100);
    expect(result.nativeTotal).toBe(21000);
  });
});
