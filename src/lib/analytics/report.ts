import type { AspRow, ConversionSummary } from "./asp";
import { formatJstDate } from "@/lib/dates";

export interface DailyReportInput {
  date: string;
  title?: string;
  conversions: { rows: readonly AspRow[]; summary: ConversionSummary } | null;
  staleContent: number;
  pendingPromotions: number;
}

export function buildDailyReport(input: DailyReportInput): string {
  const lines: string[] = [];

  lines.push(`# ${input.title ?? "日次レポート"} ${formatJstDate(input.date)}`);
  lines.push("");
  lines.push("## 成果（ASP）");
  if (!input.conversions) {
    lines.push("- 成果CSVが未取り込みです（見込・確定を推測しません）。");
  } else {
    const { summary } = input.conversions;
    const entries = Object.entries(summary.byCurrency);
    if (entries.length === 0) {
      lines.push("- 集計対象の成果がありません。");
    }
    for (const [currency, totals] of entries) {
      if (!totals) continue;
      lines.push(
        `- ${currency}: 確定 ${totals.approved + totals.paid} / 見込 ${totals.pending} / 却下・返金 ${totals.rejected}`,
      );
    }
    lines.push(
      `- 件数: ${Object.entries(summary.counts)
        .map(([status, count]) => `${status} ${count}`)
        .join(" / ")}`,
    );
    if (summary.duplicates.length > 0) {
      lines.push(`- 重複排除: ${summary.duplicates.length}件`);
    }
    lines.push("- 通貨が異なる成果は合算していません。");
  }

  lines.push("");
  lines.push("## 品質・運用");
  lines.push(`- 再確認が必要な記事・出典: ${input.staleContent}件`);
  lines.push(`- レビュー待ちのX投稿: ${input.pendingPromotions}件`);
  lines.push("");
  lines.push(
    "> 数値は取得できた範囲のみです。未取得・未確定の値を0や確定値として扱っていません。",
  );

  return `${lines.join("\n")}\n`;
}
