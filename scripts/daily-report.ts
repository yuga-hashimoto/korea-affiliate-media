/**
 * 日次レポート。取得できた数値だけを集計し、未取得は未取得と書く。
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { readJsonl, readJsonFile } from "../src/lib/store";
import { offerList, evidenceList, fxRateList } from "../src/data/index";
import {
  parseAspCsv,
  summarizeConversions,
  type AspRow,
  type ConversionSummary,
} from "../src/lib/analytics/asp";
import {
  buildDailyReport,
  type ClickRecord,
} from "../src/lib/analytics/report";
import { isPast, isStale, tokyoDayKey } from "../src/lib/dates";
import type { Promotion } from "../src/lib/domain";

async function main(): Promise<void> {
  const now = new Date();
  const day = tokyoDayKey(now);
  const month = day.slice(0, 7);

  const clicks = await readJsonl<ClickRecord>(`analytics/clicks-${month}.jsonl`);

  let conversions: { rows: AspRow[]; summary: ConversionSummary } | null = null;
  try {
    const csv = await readFile(
      path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "var"), "asp/conversions.csv"),
      "utf8",
    );
    const parsed = parseAspCsv(csv);
    conversions = {
      rows: parsed.rows,
      summary: summarizeConversions(parsed.rows, fxRateList),
    };
    if (parsed.errors.length > 0) {
      console.warn(`[report] ASP CSV に ${parsed.errors.length}件のエラー行があります`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const staleOffers = offerList.filter((offer) => {
    const evidence = evidenceList.find((item) => item.id === offer.evidenceId);
    return (
      isPast(offer.expiresAt, now) ||
      (evidence ? evidence.reviewStatus === "stale" || isStale(evidence.checkedAt, now) : true)
    );
  }).length;

  const promotions = await readJsonFile<Promotion[]>("promotions/queue.json", []);
  const pendingPromotions = promotions.filter(
    (promotion) => promotion.status === "needs_review",
  ).length;

  const ingestion = await readJsonFile<{ status: string; at: string } | null>(
    "ingestion/last-run.json",
    null,
  );

  const report = buildDailyReport({
    date: day,
    clicks,
    conversions,
    staleOffers,
    pendingPromotions,
    ingestionStatus: ingestion
      ? `${ingestion.status}（${ingestion.at}）`
      : "未実行（INGESTION_ENABLED=false）",
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
