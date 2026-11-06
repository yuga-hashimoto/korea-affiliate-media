import type { AspRow, ConversionSummary } from "./asp";
import { formatJstDate } from "@/lib/dates";

export interface ClickRecord {
  offerId: string;
  articleId: string | null;
  channel: string;
  day: string;
  createdAt: string;
}

export interface ClickSummary {
  total: number;
  byOffer: Array<{ offerId: string; count: number }>;
  byChannel: Array<{ channel: string; count: number }>;
  byDay: Array<{ day: string; count: number }>;
}

export function summarizeClicks(clicks: readonly ClickRecord[]): ClickSummary {
  const byOffer = new Map<string, number>();
  const byChannel = new Map<string, number>();
  const byDay = new Map<string, number>();

  for (const click of clicks) {
    byOffer.set(click.offerId, (byOffer.get(click.offerId) ?? 0) + 1);
    byChannel.set(click.channel, (byChannel.get(click.channel) ?? 0) + 1);
    byDay.set(click.day, (byDay.get(click.day) ?? 0) + 1);
  }

  const sortDesc = <T extends { count: number }>(items: T[]) =>
    items.sort((a, b) => b.count - a.count);

  return {
    total: clicks.length,
    byOffer: sortDesc([...byOffer].map(([offerId, count]) => ({ offerId, count }))),
    byChannel: sortDesc([...byChannel].map(([channel, count]) => ({ channel, count }))),
    byDay: [...byDay]
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day)),
  };
}

export interface DailyReportInput {
  date: string;
  clicks: readonly ClickRecord[];
  conversions: { rows: readonly AspRow[]; summary: ConversionSummary } | null;
  staleOffers: number;
  pendingPromotions: number;
  ingestionStatus: string;
}

export function buildDailyReport(input: DailyReportInput): string {
  const clicks = summarizeClicks(input.clicks);
  const lines: string[] = [];

  lines.push(`# 日次レポート ${formatJstDate(input.date)}`);
  lines.push("");
  lines.push("## 外部クリック");
  lines.push(`- 合計: ${clicks.total}件`);
  if (clicks.byChannel.length > 0) {
    lines.push(
      `- チャネル: ${clicks.byChannel
        .map((item) => `${item.channel} ${item.count}`)
        .join(" / ")}`,
    );
  }
  if (clicks.byOffer.length > 0) {
    lines.push(
      `- 上位オファー: ${clicks.byOffer
        .slice(0, 5)
        .map((item) => `${item.offerId} ${item.count}`)
        .join(" / ")}`,
    );
  }

  lines.push("");
  lines.push("## 成果（ASP）");
  if (!input.conversions) {
    lines.push("- 成果CSVが未取り込みです（見込・確定を推測しません）。");
  } else {
    const { summary } = input.conversions;
    lines.push(
      `- 確定報酬（approved+paid）: ¥${summary.approvedJpy + summary.paidJpy}`,
    );
    lines.push(`- 見込（pending）: ¥${summary.pendingJpy}`);
    lines.push(`- 却下・返金: ¥${summary.rejectedJpy}`);
    lines.push(
      `- 件数: ${Object.entries(summary.counts)
        .map(([status, count]) => `${status} ${count}`)
        .join(" / ")}`,
    );
    if (summary.unconvertible.length > 0) {
      lines.push(
        `- 為替未取得のため未換算: ${summary.unconvertible.length}件`,
      );
    }
    if (summary.duplicates.length > 0) {
      lines.push(`- 重複排除: ${summary.duplicates.length}件`);
    }
  }

  lines.push("");
  lines.push("## 品質・運用");
  lines.push(`- 再確認が必要なオファー: ${input.staleOffers}件`);
  lines.push(`- レビュー待ちのX投稿: ${input.pendingPromotions}件`);
  lines.push(`- 取り込みジョブ: ${input.ingestionStatus}`);
  lines.push("");
  lines.push(
    "> 数値は取得できた範囲のみです。未取得・未確定の値を0や確定値として扱っていません。",
  );

  return `${lines.join("\n")}\n`;
}
