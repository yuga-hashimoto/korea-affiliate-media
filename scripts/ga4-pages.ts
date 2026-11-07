/**
 * GA4から「一番見られているページ」を取得してMarkdownで出力する。
 *
 * - GA4_PROPERTY_ID と GOOGLE_APPLICATION_CREDENTIALS が未設定のときは
 *   取得をスキップして終了（安全に停止）。設定手順を表示する。
 * - 使い方: pnpm analytics:ga4-pages -- --days 7
 */
import { ga4Config, fetchGa4PagesReport, formatPagesRanking } from "../src/lib/analytics/ga4";

function parseDays(argv: string[]): number {
  const index = argv.indexOf("--days");
  if (index >= 0 && argv[index + 1]) {
    const n = Number(argv[index + 1]);
    if (Number.isInteger(n) && n >= 1 && n <= 90) return n;
  }
  return 7;
}

async function main(): Promise<void> {
  const days = parseDays(process.argv.slice(2));
  const config = ga4Config();

  if (!config) {
    console.log(
      [
        "# 一番見られているページ（GA4/表示回数）",
        "",
        "取得をスキップしました（設定がないため安全に停止）。",
        "",
        "## 有効化に必要なもの",
        "1. `GA4_PROPERTY_ID`: GA4プロパティID（数字のみ）。",
        "2. `GOOGLE_APPLICATION_CREDENTIALS`: analytics.readonly 権限の",
        "   サービスアカウントJSONのパス。GA4プロパティへの権限付与は",
        "   Google アカウント側の作業のため、人の承認が必要です。",
        "3. 上記を .env.local に設定後、`pnpm analytics:ga4-pages` を実行。",
        "",
        "## それまでの確認手段",
        "- GA4管理画面 → レポート → エンゲージメント → ページとスクリーン",
        "  （測定開始直後は表示まで最大24時間ほどかかります）",
        "",
        "> 数値は取得できない段階では推測しません。",
      ].join("\n"),
    );
    return;
  }

  const end = "today";
  const start = `${days}daysAgo`;
  const report = await fetchGa4PagesReport(config, { start, end });
  console.log(formatPagesRanking(report));
}

main().catch((error: unknown) => {
  console.error(
    `[ga4-pages] 取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
