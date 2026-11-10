import { z } from "zod";
import { ASP_CURRENCIES } from "./asp";

/**
 * ASP管理画面で確認した集計値（サマリ）。
 *
 * 背景:
 * - ASP各社の管理画面は、注文明細CSVを出せない/出しにくい場合がある。
 * - 注文明細CSVにはサイト帰属の情報が無いことが多く、同一タグを他サイトで
 *   使っていると当サイト分と区別できない。
 * そのため「管理画面で確認した集計値」を、明細CSVとは別枠で記録する。
 * 明細CSVと合算してはいけない（二重計上防止）。
 */

const DaySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const MoneyMapSchema = z
  .partialRecord(z.enum(ASP_CURRENCIES), z.number().nonnegative())
  .default({});

export const AspReportSummarySchema = z.object({
  id: z.string().min(1),
  /** 例: "Amazonアソシエイト", "A8.net" */
  provider: z.string().min(1),
  /** この集計が対象とする提携プログラムID（ASP全体の場合は空配列）。 */
  programIds: z.array(z.string().min(1)).default([]),
  period: z.object({ from: DaySchema, to: DaySchema }),
  checkedAt: z.string().datetime(),
  clicks: z.number().int().nonnegative().nullable().default(null),
  confirmedCommission: MoneyMapSchema,
  pendingCommission: MoneyMapSchema,
  confirmedSales: MoneyMapSchema,
  note: z.string().default(""),
  sourceUrl: z.string().url().nullable().default(null),
});
export type AspReportSummary = z.infer<typeof AspReportSummarySchema>;

export const AspReportsFileSchema = z.object({
  checkedAt: z.string().datetime(),
  reports: z.array(AspReportSummarySchema).default([]),
});
export type AspReportsFile = z.infer<typeof AspReportsFileSchema>;

export function parseAspReports(raw: unknown): {
  reports: AspReportSummary[];
  errors: string[];
} {
  const parsed = AspReportsFileSchema.safeParse(raw);
  if (parsed.success) return { reports: parsed.data.reports, errors: [] };
  return {
    reports: [],
    errors: parsed.error.issues.map(
      (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
    ),
  };
}
