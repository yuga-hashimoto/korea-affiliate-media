import { z } from "zod";

/**
 * ドメイン型定義（単一の真実の源）。
 *
 * 重要な不変条件:
 * - 金額は「未確認」を null で表す。0 は「0円と確認済み」の場合だけ使う。
 * - 見積もり（estimate）とサンプル（sample）は observed（観測値）と区別する。
 * - 提携承認（AffiliateProgram.status === "approved"）前の成果リンクは作成しない。
 */

export const CURRENCIES = ["JPY", "KRW", "USD"] as const;
export const CurrencySchema = z.enum(CURRENCIES);
export type Currency = z.infer<typeof CurrencySchema>;

export const CategorySchema = z.enum([
  "esim",
  "hotel",
  "transport",
  "beauty",
  "fashion",
  "experience",
]);
export type Category = z.infer<typeof CategorySchema>;

export const AffiliateProgramStatusSchema = z.enum([
  "unapplied",
  "pending",
  "approved",
  "rejected",
  "paused",
  "expired",
]);
export type AffiliateProgramStatus = z.infer<
  typeof AffiliateProgramStatusSchema
>;

export const MediaSchema = z.enum(["web", "x", "instagram", "youtube"]);

export const AffiliateProgramSchema = z.object({
  id: z.string().min(1),
  merchantId: z.string().min(1),
  status: AffiliateProgramStatusSchema,
  allowedMedia: z.array(MediaSchema),
  termsUrl: z.string().url().optional(),
  approvedAt: z.string().datetime().nullable().default(null),
  /** 承認後に管理画面/APIで発行されたリンクのみ。未承認時は null。 */
  linkTemplate: z.string().url().nullable().default(null),
  commissionNote: z.string().default("未確認"),
  notes: z.string().default(""),
  updatedAt: z.string().datetime(),
});
export type AffiliateProgram = z.infer<typeof AffiliateProgramSchema>;

export const MerchantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  siteUrl: z.string().url(),
  country: z.string().length(2),
  /** 転載・リンク・データ取得に関する確認状況。 */
  dataPolicy: z.enum(["unknown", "official_api", "permitted_feed", "link_only", "prohibited"]),
  notes: z.string().default(""),
});
export type Merchant = z.infer<typeof MerchantSchema>;

export const SourceEvidenceSchema = z.object({
  id: z.string().min(1),
  sourceUrl: z.string().url(),
  sourceType: z.enum([
    "official_page",
    "official_api",
    "affiliate_feed",
    "public_regulation",
    "manual_observation",
  ]),
  /** 取得・利用が規約上認められているか。unknown の場合は自動収集しない。 */
  accessPermitted: z.enum(["yes", "no", "unknown"]),
  checkedAt: z.string().datetime(),
  observedTextHash: z.string().min(8).nullable(),
  note: z.string().default(""),
  reviewStatus: z.enum(["unreviewed", "verified", "stale", "rejected"]),
  /** 表示検証用のサンプル証跡。実在の価格・在庫ではない。 */
  sample: z.boolean().default(false),
});
export type SourceEvidence = z.infer<typeof SourceEvidenceSchema>;

export const OfferConditionSchema = z.object({
  /** 同一条件でのみ比較するための識別子（例: esim-5days-10gb-1person）。 */
  groupKey: z.string().min(1),
  label: z.string().min(1),
  people: z.number().int().positive().nullable().default(null),
  nights: z.number().int().positive().nullable().default(null),
  days: z.number().int().positive().nullable().default(null),
  gb: z.number().positive().nullable().default(null),
  notes: z.string().default(""),
});
export type OfferCondition = z.infer<typeof OfferConditionSchema>;

export const CouponSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  discountType: z.enum(["fixed", "rate", "free_shipping"]),
  /** fixed: 通貨建ての額, rate: 0-1 の割合 */
  value: z.number().nonnegative(),
  /** rate クーポンの上限額（販売通貨） */
  maxDiscount: z.number().nonnegative().nullable().default(null),
  minSubtotal: z.number().nonnegative().nullable().default(null),
  appliesTo: z.enum(["base", "shipping"]),
  requiresMembership: z.boolean().default(false),
  validFrom: z.string().datetime().nullable().default(null),
  validUntil: z.string().datetime().nullable().default(null),
  /** 条件が確認できるまで「適用できる」と断定しない。 */
  eligibility: z.enum(["confirmed", "unknown"]),
  sourceEvidenceId: z.string().min(1).nullable().default(null),
  note: z.string().default(""),
});
export type Coupon = z.infer<typeof CouponSchema>;

export const OfferSchema = z
  .object({
    id: z.string().min(1),
    productId: z.string().min(1),
    /** 比較表に表示する商品・プラン名 */
    productName: z.string().min(1),
    category: CategorySchema,
    merchantId: z.string().min(1),
    programId: z.string().nullable().default(null),
    /** 提携承認前でも表示できる公式ページURL。成果パラメータは付けない。 */
    landingUrl: z.string().url(),
    currency: CurrencySchema,
    /** 本体価格（税込/税抜は taxIncluded で示す）。未確認は null。 */
    baseAmount: z.number().nonnegative().nullable(),
    shippingAmount: z.number().nonnegative().nullable(),
    taxAmount: z.number().nonnegative().nullable(),
    feesAmount: z.number().nonnegative().nullable(),
    taxIncluded: z.boolean(),
    coupon: CouponSchema.nullable().default(null),
    condition: OfferConditionSchema,
    available: z.boolean().nullable(),
    observedAt: z.string().datetime(),
    expiresAt: z.string().datetime().nullable().default(null),
    evidenceId: z.string().min(1),
    /** 表示検証用のダミー値。実価格として扱わない。 */
    sample: z.boolean().default(false),
    /** ライブ在庫ではなく参考価格であることの明示。 */
    priceBasis: z.enum(["live", "cached", "reference", "sample"]),
    note: z.string().default(""),
  })
  .superRefine((offer, ctx) => {
    if (offer.taxIncluded && offer.taxAmount !== null && offer.taxAmount > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["taxAmount"],
        message: "taxIncluded=true のとき taxAmount を二重計上しないでください",
      });
    }
    if (offer.priceBasis === "sample" && !offer.sample) {
      ctx.addIssue({
        code: "custom",
        path: ["sample"],
        message: "priceBasis=sample の場合は sample=true にしてください",
      });
    }
  });
export type Offer = z.infer<typeof OfferSchema>;

export const FxRateSchema = z.object({
  base: CurrencySchema,
  quote: CurrencySchema,
  rate: z.number().positive(),
  observedAt: z.string().datetime(),
  source: z.string().min(1),
  sourceUrl: z.string().url().nullable().default(null),
});
export type FxRate = z.infer<typeof FxRateSchema>;

export const ArticleStatusSchema = z.enum([
  "draft",
  "review",
  "approved",
  "published",
  "retired",
]);

export const ArticleSectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
});

export const ArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  category: CategorySchema,
  status: ArticleStatusSchema,
  /** AI生成下書きかどうか。公開時は人のレビューを経る。 */
  aiGenerated: z.boolean().default(false),
  reviewedAt: z.string().datetime().nullable().default(null),
  publishedAt: z.string().datetime().nullable().default(null),
  updatedAt: z.string().datetime(),
  evidenceIds: z.array(z.string().min(1)).default([]),
  sections: z.array(ArticleSectionSchema).min(1),
  faq: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .default([]),
  related: z.array(z.string()).default([]),
  /** 比較ページへの導線（内部リンク）。 */
  hubPath: z.string().nullable().default(null),
});
export type Article = z.infer<typeof ArticleSchema>;

export const PromotionStatusSchema = z.enum([
  "draft",
  "needs_review",
  "approved",
  "scheduled",
  "published",
  "failed",
  "paused",
]);

export const PromotionSchema = z.object({
  id: z.string().min(1),
  channel: z.literal("x"),
  content: z.string().min(1).max(280),
  articleSlug: z.string().nullable().default(null),
  offerIds: z.array(z.string()).default([]),
  disclosureMode: z.enum(["none", "pr_label", "paid_partnership"]),
  status: PromotionStatusSchema,
  scheduledAt: z.string().datetime().nullable().default(null),
  externalPostId: z.string().nullable().default(null),
  contentHash: z.string().min(8),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  /** 生成に使った事実値（数値の捏造検出に使用）。 */
  facts: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  approvedBy: z.string().nullable().default(null),
});
export type Promotion = z.infer<typeof PromotionSchema>;

export const ConversionStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "reversed",
  "paid",
]);

export const ConversionSchema = z.object({
  externalConversionId: z.string().min(1),
  programId: z.string().min(1),
  amount: z.number().nonnegative(),
  commissionAmount: z.number().nonnegative(),
  currency: CurrencySchema,
  status: ConversionStatusSchema,
  eventAt: z.string().datetime(),
  confirmedAt: z.string().datetime().nullable().default(null),
  source: z.string().min(1),
});
export type Conversion = z.infer<typeof ConversionSchema>;

export const OutboundClickSchema = z.object({
  offerId: z.string().min(1),
  articleId: z.string().nullable().default(null),
  channel: z.enum(["x", "search", "direct", "internal", "other"]),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  anonymousSessionKey: z.string().min(8),
  createdAt: z.string().datetime(),
});
export type OutboundClick = z.infer<typeof OutboundClickSchema>;
