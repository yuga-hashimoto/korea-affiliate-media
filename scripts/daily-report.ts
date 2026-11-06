/**
 * 日次レポート。取得できた数値だけを集計し、未取得は未取得と書く。
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { readJsonFile } from "../src/lib/store";
import { articleList, evidenceList } from "../src/data/index";
import { parseAspCsv, summarizeConversions } from "../src/lib/analytics/asp";
import { buildDailyReport } from "../src/lib/analytics/report";
import { tokyoDayKey } from "../src/lib/dates";
import { auditContent } from "../src/lib/content/audit";
import type { Promotion } from "../src/lib/domain";

async function main(): Promise<void> {
  const now = new Date();
  const day = tokyoDayKey(now);

  let conversions: {
    rows: ReturnType<typeof parseAspCsv>["rows"];
    summary: ReturnType<typeof summarizeConversions>;
  } | null = null;
  try {
    const csv = await readFile(
      path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "var"), "asp/conversions.csv"),
      "utf8",
    );
    const parsed = parseAspCsv(csv);
    conversions = {
      rows: parsed.rows,
      summary: summarizeConversions(parsed.rows),
    };
    if (parsed.errors.length > 0) {
      console.warn(`[report] ASP CSV に ${parsed.errors.length}件のエラー行があります`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const staleContent = auditContent(articleList, evidenceList, { now }).filter(
    (finding) => finding.severity !== "low",
  ).length;

  const promotions = await readJsonFile<Promotion[]>("promotions/queue.json", []);
  const pendingPromotions = promotions.filter(
    (promotion) => promotion.status === "needs_review",
  ).length;

  const report = buildDailyReport({
    date: day,
    conversions,
    staleContent,
    pendingPromotions,
  });

  const dir = path.join(
    process.env.DATA_DIR ?? path.join(process.cwd(), "var"),
    "reports",
  );
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `daily-${day}.md`), report, "utf8");
  console.log(report);
}

main().catch((error) => {
  console.error("[report] fatal", error);
  process.exitCode = 1;
});
