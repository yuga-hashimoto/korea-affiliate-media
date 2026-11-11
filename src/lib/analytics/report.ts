import type { AspRow, ConversionSummary } from "./asp";
import type { Ga4DailyRow } from "./ga4";
import { formatJstDate } from "@/lib/dates";

export interface ReportTraffic {
  rows: readonly Ga4DailyRow[];
}

export interface DailyReportInput {
  date: string;
  title?: string;
  conversions: { rows: readonly AspRow[]; summary: ConversionSummary } | null;
  staleContent: number;
  pendingPromotions: number;
  /**
   * GA4の日別アクセス。`undefined` はGA4未接続（セクションを出さない）、
   * `null` は取得できなかった（数値を推測しない旨を出す）。
   */
  traffic?: ReportTraffic | null;
}

export function buildDailyReport(input: DailyReportInput): string {
  const lines: string[] = [];

  lines.push(`# ${input.title ?? "日次レポート"} ${formatJstDate(input.date)}`);
  lines.push("");

  if (input.traffic !== undefined) {
    lines.push("## アクセス（GA4）");
    if (input.traffic === null) {
      lines.push("- GA4が未設定、または取得できませんでした（数値は推測しません）。");
    } else if (input.traffic.rows.length === 0) {
      lines.push(
        "- GA4のデータがまだありません（測定開始直後は反映まで最大24時間ほどかかります）。",
      );
    } else {
      const totals = input.traffic.rows.reduce(
        (acc, row) => ({
          users: acc.users + row.activeUsers,
          views: acc.views + row.views,
          sessions: acc.sessions + row.sessions,
        }),
        { users: 0, views: 0, sessions: 0 },
      );
      lines.push(
        `- 期間合計: PV ${totals.views} / セッション ${totals.sessions} / 日別ユーザーの単純合計 ${totals.users}`,
      );
      lines.push(
        `- 日別: ${input.traffic.rows
          .map(
            (row) =>
              `${row.date.slice(5).replace("-", "/")} ${row.activeUsers}人/${row.views}PV`,
          )
          .join(" ・ ")}`,
      );
      lines.push(
        "- 日別ユーザーは各日のユニーク。複数日来訪者は重複して数えるため、期間のユニークユーザー数とは一致しません。",
      );
    }
    lines.push("");
  }

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
