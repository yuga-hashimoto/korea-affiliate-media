import { z } from "zod";

/**
 * ドメイン型定義（韓国旅行メディア）。
 *
 * - 記事の公開状態は draft → review → approved → published で管理する。
 * - 出典（SourceEvidence）はURL・確認日時・利用許諾・レビュー状態を保持する。
 * - 提携プログラムは承認前の成果リンクを作らない。
 */

export const CATEGORIES = [
  "seoul",
  "busan",
  "jeju",
  "food",
  "cafe",
  "shopping",
  "transport",
  "hotel",
  "prepare",
  "beauty",
  "fashion",
] as const;
export const CategorySchema = z.enum(CATEGORIES);
export type Category = z.infer<typeof CategorySchema>;

export const AffiliateProgramStatusSchema = z.enum([
  "unapplied",
  "pending",
  "approved",
  "rejected",
  "paused",
  "expired",
]);
export type AffiliateProgramStatus = z.infer<typeof AffiliateProgramStatusSchema>;

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
  dataPolicy: z.enum([
    "unknown",
    "official_api",
    "permitted_feed",
    "link_only",
    "prohibited",
  ]),
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
  accessPermitted: z.enum(["yes", "no", "unknown"]),
  checkedAt: z.string().datetime(),
  observedTextHash: z.string().min(8).nullable(),
  note: z.string().default(""),
  reviewStatus: z.enum(["unreviewed", "verified", "stale", "rejected"]),
});
export type SourceEvidence = z.infer<typeof SourceEvidenceSchema>;

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
  tags: z.array(z.string()).default([]),
  /** 関連するカテゴリページ（内部リンク）。 */
  hubPath: z.string().nullable().default(null),
  /** アイキャッチ画像を使う場合のalt。画像は許諾済みのみ。 */
  imageAlt: z.string().nullable().default(null),
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
  disclosureMode: z.enum(["none", "pr_label", "paid_partnership"]),
  status: PromotionStatusSchema,
  scheduledAt: z.string().datetime().nullable().default(null),
  externalPostId: z.string().nullable().default(null),
  contentHash: z.string().min(8),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
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
  currency: z.enum(["JPY", "USD"]),
  status: ConversionStatusSchema,
  eventAt: z.string().datetime(),
  confirmedAt: z.string().datetime().nullable().default(null),
  source: z.string().min(1),
});
export type Conversion = z.infer<typeof ConversionSchema>;
