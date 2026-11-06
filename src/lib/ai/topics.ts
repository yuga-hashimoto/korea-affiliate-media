import { z } from "zod";

export const ArticleTopicSchema = z.object({
  id: z.string().min(1),
  category: z.enum([
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
  ]),
  titleHint: z.string().min(10).max(80),
  summary: z.string().min(20),
  checklist: z.array(z.string().min(2)).min(2),
  evidenceIds: z.array(z.string()).min(1),
  keywords: z.array(z.string()).default([]),
  status: z.enum(["queued", "used", "blocked"]).default("queued"),
});

export type ArticleTopic = z.infer<typeof ArticleTopicSchema>;
