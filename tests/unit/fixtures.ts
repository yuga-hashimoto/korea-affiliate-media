import type { AffiliateProgram, Offer, SourceEvidence } from "@/lib/domain";

export const NOW = new Date("2026-11-06T12:00:00.000Z");

export const verifiedEvidence: SourceEvidence = {
  id: "ev-verified",
  sourceUrl: "https://example.com/official",
  sourceType: "official_page",
  accessPermitted: "yes",
  checkedAt: "2026-11-06T09:00:00.000Z",
  observedTextHash: null,
  note: "テスト用",
  reviewStatus: "verified",
  sample: false,
};

export const unverifiedEvidence: SourceEvidence = {
  ...verifiedEvidence,
  id: "ev-unverified",
  reviewStatus: "unreviewed",
};

export const approvedProgram: AffiliateProgram = {
  id: "prog-approved",
  merchantId: "m1",
  status: "approved",
  allowedMedia: ["web"],
  termsUrl: "https://example.com/terms",
  approvedAt: "2026-11-01T00:00:00.000Z",
  linkTemplate: "https://example.com/aff/123",
  commissionNote: "テスト用",
  notes: "",
  updatedAt: "2026-11-01T00:00:00.000Z",
};

export const pendingProgram: AffiliateProgram = {
  ...approvedProgram,
  id: "prog-pending",
  status: "pending",
  linkTemplate: null,
};

export function offer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: "off-1",
    productId: "prod-1",
    productName: "テスト商品",
    category: "esim",
    merchantId: "m1",
    programId: null,
    landingUrl: "https://example.com/item",
    currency: "JPY",
    baseAmount: 1000,
    shippingAmount: 0,
    taxAmount: 0,
    feesAmount: 0,
    taxIncluded: true,
    coupon: null,
    condition: {
      groupKey: "g1",
      label: "条件1",
      people: 1,
      nights: null,
      days: 5,
      gb: 3,
      notes: "",
    },
    available: true,
    observedAt: "2026-11-06T09:00:00.000Z",
    expiresAt: null,
    evidenceId: "ev-verified",
    sample: false,
    priceBasis: "cached",
    note: "",
    ...overrides,
  };
}
