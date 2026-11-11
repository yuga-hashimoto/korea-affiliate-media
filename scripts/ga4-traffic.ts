/**
 * GA4から日別のアクセス推移（ユーザー / PV / セッション）を取得して出力する。
 *
 * - `GA4_PROPERTY_ID` と `GOOGLE_APPLICATION_CREDENTIALS` が未設定のときは
 *   取得をスキップして終了（安全に停止）。
 * - 使い方: pnpm analytics:traffic -- --days 14 [--json] [--save]
 *   - `--days N`: 直近N日（1〜90、既定14）
 *   - `--json`: Markdownの代わりにJSONを標準出力へ
 *   - `--save`: `var/reports/ga4-traffic.json` と `.md` に保存（Git管理外）
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  fetchGa4TrafficReport,
  formatDailyTraffic,
  ga4Config,
} from "../src/lib/analytics/ga4";

function argValue(argv: string[], name: string): string | null {
  const index = argv.indexOf(name);
  if (index >= 0) return argv[index + 1] ?? null;
  return null;
}

function parseDays(argv: string[]): number {
  const raw = argValue(argv, "--days");
  const n = raw ? Number(raw) : 14;
  if (Number.isInteger(n) && n >= 1 && n <= 90) return n;
  return 14;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const days = parseDays(argv);
  const asJson = argv.includes("--json");
  const save = argv.includes("--save");
  const config = ga4Config();

  if (!config) {
    console.log(
      [
        "# 日別アクセス推移（GA4）",
        "",
        "取得をスキップしました（設定がないため安全に停止）。",
        "",
        "## 有効化に必要なもの",
        "1. `GA4_PROPERTY_ID`: GA4プロパティID（数字のみ）。",
        "2. `GOOGLE_APPLICATION_CREDENTIALS`: analytics.readonly 権限の",
        "   サービスアカウントJSONのパス。",
        "3. GA4の「プロパティのアクセス管理」で、そのサービスアカウントを",
        "   閲覧者として追加する（人の承認が必要）。",
        "",
        "> 数値は取得できない段階では推測しません。",
      ].join("\n"),
    );
    return;
  }

  const report = await fetchGa4TrafficReport(config, {
    start: `${days}daysAgo`,
    end: "today",
  });

  const markdown = formatDailyTraffic(report);
  console.log(asJson ? JSON.stringify({ ...report, generatedAt: new Date().toISOString() }, null, 2) : markdown);

  if (save) {
    const dir = path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "var"), "reports");
    await mkdir(dir, { recursive: true });
    const snapshot = { generatedAt: new Date().toISOString(), ...report };
    await writeFile(path.join(dir, "ga4-traffic.json"), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    await writeFile(path.join(dir, "ga4-traffic.md"), markdown, "utf8");
    console.error(`[ga4-traffic] 保存しました: ${path.relative(process.cwd(), dir)}/ga4-traffic.{json,md}`);
  }
}

main().catch((error: unknown) => {
  console.error(
    `[ga4-traffic] 取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
