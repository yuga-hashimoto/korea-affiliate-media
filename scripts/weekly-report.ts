/**
 * 週次レポート。直近7日のクリック・成果・品質指標を集計する。
 * 取得できない指標は「未取得」と明記する。
 */
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { readJsonl, readJsonFile } from "../src/lib/store";
import { buildDailyReport, type ClickRecord } from "../src/lib/analytics/report";
import { parseAspCsv, summarizeConversions } from "../src/lib/analytics/asp";
import { evidenceList, fxRateList, offerList } from "../src/data/index";
import type { Promotion } from "../src/lib/domain";
import { isPast, isStale, tokyoDayKey } from "../src/lib/dates";

const dataDir = () => process.env.DATA_DIR ?? path.join(process.cwd(), "var");

async function readAllClicks(): Promise<ClickRecord[]> {
  try {
    const files = (await readdir(path.join(dataDir(), "analytics"))).filter((file) =>
      file.startsWith("clicks-"),
    );
    const rows: ClickRecord[] = [];
    for (const file of files) {
      rows.push(...(await readJsonl<ClickRecord>(`analytics/${file}`)));
    }
    return rows;
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const now = new Date();
  const since = new Date(now.getTime() - 7 * 86_400_000);
  const clicks = (await readAllClicks()).filter(
    (click) => new Date(click.createdAt) >= since,
  );

  let conversions: {
    rows: ReturnType<typeof parseAspCsv>["rows"];
    summary: ReturnType<typeof summarizeConversions>;
  } | null = null;
  try {
    const csv = await readFile(path.join(dataDir(), "asp/conversions.csv"), "utf8");
    const parsed = parseAspCsv(csv);
    conversions = {
      rows: parsed.rows,
      summary: summarizeConversions(parsed.rows, fxRateList),
    };
  } catch {
    // 成果CSV未取り込み
  }

  const promotions = await readJsonFile<Promotion[]>("promotions/queue.json", []);
  const staleOffers = offerList.filter((offer) => {
    const evidence = evidenceList.find((item) => item.id === offer.evidenceId);
    return (
      isPast(offer.expiresAt, now) ||
      (evidence
        ? evidence.reviewStatus === "stale" || isStale(evidence.checkedAt, now)
        : true)
    );
  }).length;

  const body = buildDailyReport({
    date: tokyoDayKey(now),
    title: "週次レポート（直近7日）",
    clicks,
    conversions,
    staleOffers,
    pendingPromotions: promotions.filter((p) => p.status === "needs_review").length,
    ingestionStatus: "週次集計",
  });

  const header = [
    "# 週次レポート（直近7日）",
    "",
    `- 対象期間: ${since.toISOString()} 〜 ${now.toISOString()}`,
    "- 対象: 外部クリック / ASP成果 / 品質指標",
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
