/**
 * 週次レポート。直近7日の成果と品質指標を集計する。
 * 取得できない指標は「未取得」と明記する。
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { readJsonFile } from "../src/lib/store";
import { buildDailyReport } from "../src/lib/analytics/report";
import { parseAspCsv, summarizeConversions } from "../src/lib/analytics/asp";
import { loadTrafficForReport } from "../src/lib/analytics/ga4";
import { articleList, evidenceList } from "../src/data/index";
import type { Promotion } from "../src/lib/domain";
import { tokyoDayKey } from "../src/lib/dates";
import { auditContent } from "../src/lib/content/audit";

const dataDir = () => process.env.DATA_DIR ?? path.join(process.cwd(), "var");

async function main(): Promise<void> {
  const now = new Date();
  const since = new Date(now.getTime() - 7 * 86_400_000);

  let conversions: {
    rows: ReturnType<typeof parseAspCsv>["rows"];
    summary: ReturnType<typeof summarizeConversions>;
  } | null = null;
  try {
    const csv = await readFile(path.join(dataDir(), "asp/conversions.csv"), "utf8");
    const parsed = parseAspCsv(csv);
    conversions = {
      rows: parsed.rows,
      summary: summarizeConversions(parsed.rows),
    };
  } catch {
    // 成果CSV未取り込み
  }

  const promotions = await readJsonFile<Promotion[]>("promotions/queue.json", []);
  const staleContent = auditContent(articleList, evidenceList, { now }).filter(
    (finding) => finding.severity !== "low",
  ).length;

  // 直近7日のアクセス。GA4未設定なら undefined、失敗なら null。
  const traffic = await loadTrafficForReport(7);

  const body = buildDailyReport({
    date: tokyoDayKey(now),
    title: "週次レポート（直近7日）",
    conversions,
    staleContent,
    pendingPromotions: promotions.filter((p) => p.status === "needs_review").length,
    traffic,
  });

  const header = [
    "# 週次レポート（直近7日）",
    "",
    `- 対象期間: ${since.toISOString()} 〜 ${now.toISOString()}`,
    "- 対象: アクセス（GA4）/ ASP成果 / 品質指標",
    "",
    "---",
    "",
  ].join("\n");

  const dir = path.join(dataDir(), "reports");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `weekly-${tokyoDayKey(now)}.md`);
  await writeFile(file, `${header}${body}`, "utf8");
  console.log(`${header}${body}`);
}

main().catch((error) => {
  console.error("[weekly-report] fatal", error);
  process.exitCode = 1;
});
