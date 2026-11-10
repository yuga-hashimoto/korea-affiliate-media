/**
 * アフィリエイト売上ダッシュボード（ローカル専用）を生成する。
 *
 * 使い方:
 *   pnpm dashboard                 # var/asp/*.csv を取り込み var/reports/dashboard.html を生成
 *   pnpm dashboard -- --since 2026-11-01 --until 2026-11-30
 *   pnpm dashboard -- --input var/asp/klook-2026-11.csv
 *   pnpm dashboard -- --demo       # docs/examples のサンプルCSVで表示確認（架空の数値）
 *   pnpm dashboard -- --print-template
 *
 * - 成果CSVは正規化された列（conversion_id, program_id, amount, commission,
 *   currency, status, event_at, confirmed_at）を想定する。
 * - データが無い場合は「0件」ではなく未取込として扱い、架空の数値は作らない。
 * - 生成物は var/ 配下（Git管理外）。外部に公開しない。
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildDashboard,
  formatMoney,
  renderDashboardHtml,
  type DashboardData,
} from "../src/lib/analytics/dashboard";
import {
  ASP_CURRENCIES,
  parseAspCsv,
  type AspCurrency,
  type AspRow,
} from "../src/lib/analytics/asp";
import {
  parseAspReports,
  type AspReportSummary,
} from "../src/lib/analytics/asp-reports";
import { merchantList, programList } from "../src/data/index";
import { dataDir } from "../src/lib/store";

const TEMPLATE_HEADER =
  "conversion_id,program_id,amount,commission,currency,status,event_at,confirmed_at";

const DEMO_CSV = "docs/examples/asp-conversions.example.csv";

interface Options {
  input: string | null;
  reports: string | null;
  since: string | null;
  until: string | null;
  demo: boolean;
  out: string | null;
  printTemplate: boolean;
}

function parseArgs(argv: readonly string[]): Options {
  const options: Options = {
    input: null,
    reports: null,
    since: null,
    until: null,
    demo: false,
    out: null,
    printTemplate: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === undefined) continue;
    if (arg === "--") continue;
    switch (arg) {
      case "--input":
      case "-i":
        options.input = argv[index + 1] ?? null;
        index += 1;
        break;
      case "--reports":
        options.reports = argv[index + 1] ?? null;
        index += 1;
        break;
      case "--since":
        options.since = argv[index + 1] ?? null;
        index += 1;
        break;
      case "--until":
        options.until = argv[index + 1] ?? null;
        index += 1;
        break;
      case "--out":
      case "-o":
        options.out = argv[index + 1] ?? null;
        index += 1;
        break;
      case "--demo":
        options.demo = true;
        break;
      case "--print-template":
        options.printTemplate = true;
        break;
      default:
        if (arg.startsWith("--")) {
          throw new Error(`不明なオプションです: ${arg}`);
        }
    }
  }
  return options;
}

function assertDay(value: string | null, name: string): void {
  if (value !== null && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${name} は YYYY-MM-DD 形式で指定してください: ${value}`);
  }
}

async function listCsvFiles(dir: string, optional = false): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch (error) {
    if (optional && (error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return entries
    .filter((name) => name.toLowerCase().endsWith(".csv"))
    .sort((a, b) => a.localeCompare(b, "ja"))
    .map((name) => path.join(dir, name));
}

async function loadRows(
  input: string | null,
): Promise<{
  rows: AspRow[];
  files: string[];
  errors: Array<{ file: string; line: number; message: string }>;
}> {
  const rows: AspRow[] = [];
  const files: string[] = [];
  const errors: Array<{ file: string; line: number; message: string }> = [];

  let targets: string[];
  if (input) {
    targets = input.toLowerCase().endsWith(".csv") ? [input] : await listCsvFiles(input);
  } else {
    targets = await listCsvFiles(path.join(dataDir(), "asp"), true);
  }

  for (const target of targets) {
    const name = path.basename(target);
    const text = await readFile(target, "utf8");
    const parsed = parseAspCsv(text, { source: name });
    files.push(name);
    rows.push(...parsed.rows);
    errors.push(...parsed.errors.map((error) => ({ file: name, ...error })));
    if (parsed.errors.length > 0) {
      console.warn(`[dashboard] ${name}: ${parsed.errors.length}件の行を読み取れませんでした`);
    }
  }

  return { rows, files, errors };
}

async function loadReports(input: string | null): Promise<{
  summaries: AspReportSummary[];
  errors: string[];
}> {
  const file = input ?? path.join(dataDir(), "asp", "reports.json");
  const name = path.basename(file);
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { summaries: [], errors: [] };
    }
    throw error;
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { summaries: [], errors: [`${name}: JSONとして読み込めません`] };
  }

  const parsed = parseAspReports(json);
  return {
    summaries: parsed.reports,
    errors: parsed.errors.map((message) => `${name}: ${message}`),
  };
}

function filterByPeriod(
  rows: readonly AspRow[],
  since: string | null,
  until: string | null,
): AspRow[] {
  return rows.filter((row) => {
    const day = row.eventAt.slice(0, 10);
    if (since !== null && day < since) return false;
    if (until !== null && day > until) return false;
    return true;
  });
}

function currencyLine(currency: AspCurrency, data: DashboardData): string {
  const totals = data.totalsByCurrency[currency];
  if (!totals) return "";
  return `- ${currency}: 確定報酬 ${formatMoney(totals.confirmedCommission, currency)} / 見込 ${formatMoney(
    totals.pendingCommission,
    currency,
  )} / 却下・返金 ${formatMoney(totals.rejectedCommission, currency)} / 確定売上 ${formatMoney(
    totals.confirmedSales,
    currency,
  )}`;
}

function renderMarkdown(data: DashboardData, outFile: string): string {
  const lines: string[] = [];
  lines.push("# アフィリエイト売上ダッシュボード");
  lines.push("");
  lines.push(`- 生成: ${data.generatedAt}`);
  lines.push(
    `- 対象期間: ${data.period.from ?? "データなし"} 〜 ${data.period.to ?? "データなし"}`,
  );
  lines.push(
    `- 取込: ${data.importedFiles.length}ファイル / ${data.rowCount}件（重複排除後）`,
  );
  lines.push(`- ASP実測サマリ: ${data.summaries.length}件（管理画面で確認）`);
  lines.push(`- HTML: ${outFile}`);
  if (data.demo) lines.push("- **サンプルデータ（架空の数値）**");
  lines.push("");

  const currencies = ASP_CURRENCIES.filter(
    (currency) => data.totalsByCurrency[currency] !== undefined,
  );
  lines.push("## 通貨別");
  if (currencies.length === 0) {
    lines.push("- 成果データが未取込です（数値は作りません）。");
  } else {
    lines.push(...currencies.map((currency) => currencyLine(currency, data)));
    lines.push("- 通貨をまたいだ合算はしていません。");
  }

  lines.push("");
  lines.push("## プログラム別");
  if (data.programs.length === 0) {
    lines.push("- なし");
  } else {
    lines.push("| プログラム | 確定報酬 | 見込 | 却下・返金 | 確定売上 | 件数(確定/見込/却下) | 最終成果 |");
    lines.push("|---|---:|---:|---:|---:|---:|---|");
    for (const summary of data.programs) {
      const perCurrency = (pick: (totals: NonNullable<(typeof summary.byCurrency)[AspCurrency]>) => number) =>
        summary.currencies
          .map((currency) => {
            const totals = summary.byCurrency[currency];
            return totals ? formatMoney(pick(totals), currency) : "—";
          })
          .join(" / ") || "—";
      const counts = summary.currencies
        .reduce(
          (acc, currency) => {
            const totals = summary.byCurrency[currency];
            if (!totals) return acc;
            return {
              confirmed: acc.confirmed + totals.approvedCount + totals.paidCount,
              pending: acc.pending + totals.pendingCount,
              rejected: acc.rejected + totals.rejectedCount,
            };
          },
          { confirmed: 0, pending: 0, rejected: 0 },
        );
      lines.push(
        `| ${summary.displayName} | ${perCurrency((t) => t.confirmedCommission)} | ${perCurrency(
          (t) => t.pendingCommission,
        )} | ${perCurrency((t) => t.rejectedCommission)} | ${perCurrency(
          (t) => t.confirmedSales,
        )} | ${counts.confirmed} / ${counts.pending} / ${counts.rejected} | ${
          summary.lastEventAt ?? "—"
        } |`,
      );
    }
  }

  lines.push("");
  lines.push("## ASP管理画面の実測サマリ（集計値・明細CSVとは合算しない）");
  if (data.summaries.length === 0) {
    lines.push("- なし");
  } else {
    const money = (record: Partial<Record<AspCurrency, number>>): string =>
      ASP_CURRENCIES.filter((currency) => record[currency] !== undefined)
        .map((currency) => formatMoney(record[currency] ?? 0, currency))
        .join(" / ") || "—";
    for (const summary of data.summaries) {
      const targets =
        summary.programIds.length === 0
          ? "ASP全体"
          : summary.programIds.map((id) => data.programLabels[id] ?? id).join(" / ");
      lines.push(
        `- ${summary.provider}（${targets}）: 期間 ${summary.period.from}〜${
          summary.period.to
        } / 確認 ${summary.checkedAt} / クリック ${summary.clicks ?? "—"} / 確定報酬 ${money(
          summary.confirmedCommission,
        )} / 見込 ${money(summary.pendingCommission)} / 確定売上 ${money(
          summary.confirmedSales,
        )}${summary.note ? ` / ${summary.note}` : ""}`,
      );
    }
  }

  lines.push("");
  lines.push("## 未取込・注意");
  if (data.notImported.length === 0) {
    lines.push("- 提携済みで未取込のプログラムはありません。");
  } else {
    for (const program of data.notImported) {
      lines.push(
        `- ${program.displayName}（${program.programId}）: 成果CSV未取込（0件ではなく未取得）`,
      );
    }
  }
  if (data.duplicates.length > 0) {
    lines.push(`- 重複 conversion_id: ${data.duplicates.length}件（状態の進んだ行を優先）`);
  }
  if (data.unknownProgramIds.length > 0) {
    lines.push(`- 未登録プログラムID: ${data.unknownProgramIds.join(", ")}`);
  }
  if (data.parseErrors.length > 0) {
    lines.push(`- CSV読み取りエラー: ${data.parseErrors.length}件`);
  }
  lines.push("");
  lines.push(
    "> 見込を確定として扱いません。数値が無い項目は未取得として表示しています。",
  );
  return `${lines.join("\n")}\n`;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.printTemplate) {
    console.log(TEMPLATE_HEADER);
    return;
  }

  assertDay(options.since, "--since");
  assertDay(options.until, "--until");

  let input = options.input;
  if (options.demo && !input) {
    input = path.join(process.cwd(), DEMO_CSV);
  }

  const loaded = await loadRows(input);
  const rows = filterByPeriod(loaded.rows, options.since, options.until);
  if (loaded.rows.length !== rows.length) {
    console.log(
      `[dashboard] 期間指定で ${loaded.rows.length - rows.length}件を除外しました`,
    );
  }

  const reports = await loadReports(options.reports);
  for (const message of reports.errors) {
    console.warn(`[dashboard] ${message}`);
  }

  const generatedAt = new Date().toISOString();
  const data = buildDashboard({
    rows,
    programs: programList,
    merchants: merchantList,
    generatedAt,
    demo: options.demo,
    importedFiles: loaded.files,
    parseErrors: loaded.errors,
    summaries: reports.summaries,
    reportErrors: reports.errors,
  });

  const outDir = path.join(dataDir(), "reports");
  await mkdir(outDir, { recursive: true });
  const outFile = options.out
    ? path.resolve(options.out)
    : path.join(outDir, options.demo ? "dashboard-demo.html" : "dashboard.html");
  const jsonFile = outFile.replace(/\.html$/i, ".json");

  await writeFile(outFile, renderDashboardHtml(data), "utf8");
  await writeFile(jsonFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  const markdown = renderMarkdown(data, outFile);
  console.log(markdown);
  console.log(`[dashboard] HTML: ${outFile}`);
  console.log(`[dashboard] JSON: ${jsonFile}`);
}

main().catch((error: unknown) => {
  console.error(
    `[dashboard] 生成に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
