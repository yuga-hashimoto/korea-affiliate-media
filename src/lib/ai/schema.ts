import { z } from "zod";

/** LLMに要求する記事下書きのJSONスキーマ（strict）。 */
export const ArticleDraftSchema = z.object({
  title: z.string().min(10).max(80),
  description: z.string().min(40).max(160),
  category: z.enum(["esim", "hotel", "transport", "beauty", "fashion", "experience"]),
  sections: z
    .array(
      z.object({
        heading: z.string().min(4).max(60),
        paragraphs: z.array(z.string().min(40).max(600)).min(1).max(4),
      }),
    )
    .min(3)
    .max(8),
  faq: z
    .array(
      z.object({
        question: z.string().min(6).max(120),
        answer: z.string().min(20).max(400),
      }),
    )
    .max(5),
  sourceIds: z.array(z.string().min(1)),
  disclosure: z.string().min(10).max(300),
  risks: z.array(z.string()).max(10),
  confidence: z.enum(["low", "medium", "high"]),
});
export type ArticleDraft = z.infer<typeof ArticleDraftSchema>;

export const SocialDraftSchema = z.object({
  text: z.string().min(20).max(280),
  articleSlug: z.string().nullable(),
  disclosureMode: z.enum(["none", "pr_label", "paid_partnership"]),
  sourceIds: z.array(z.string()),
  risks: z.array(z.string()).max(5),
});
export type SocialDraft = z.infer<typeof SocialDraftSchema>;
