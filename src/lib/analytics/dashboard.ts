import type { AffiliateProgram, Merchant } from "@/lib/domain";
import { formatJstDateTime } from "@/lib/dates";
import type { AspReportSummary } from "./asp-reports";
import {
  ASP_CURRENCIES,
  dedupeConversions,
  type AspCurrency,
  type AspRow,
} from "./asp";

/**
 * アフィリエイト売上ダッシュボードの集計とHTML生成。
 *
 * - ASPごとに管理画面は分かれており、横断の公式画面は存在しない。
 *   各ASPの成果CSVを正規化して取り込み、1ページに集約する。
 * - 見込 / 承認 / 支払済 / 却下・返金 を分けたまま表示し、確定報酬と見込を混ぜない。
 * - 通貨をまたいだ合算はしない。
 * - このページはローカル専用（noindex）。外部に公開しない。
 */

export const STATUS_LABELS: Record<AspRow["status"], string> = {
  pending: "見込",
  approved: "承認済",
  paid: "支払済",
  rejected: "却下",
  reversed: "返金",
};

export interface CurrencyTotals {
  /** 成果報酬（ASPが支払う金額）。 */
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  rejectedCommission: number;
  /** 承認済 + 支払済。見込は含めない。 */
  confirmedCommission: number;
  /** 売上（注文額などのGMV）。報酬とは別物。 */
  pendingSales: number;
  approvedSales: number;
  paidSales: number;
  rejectedSales: number;
  confirmedSales: number;
  pendingCount: number;
  approvedCount: number;
  paidCount: number;
  rejectedCount: number;
}

export function emptyCurrencyTotals(): CurrencyTotals {
  return {
    pendingCommission: 0,
    approvedCommission: 0,
    paidCommission: 0,
    rejectedCommission: 0,
    confirmedCommission: 0,
    pendingSales: 0,
    approvedSales: 0,
    paidSales: 0,
    rejectedSales: 0,
    confirmedSales: 0,
    pendingCount: 0,
    approvedCount: 0,
    paidCount: 0,
    rejectedCount: 0,
  };
}

function finalizeTotals(totals: CurrencyTotals): void {
  totals.confirmedCommission = totals.approvedCommission + totals.paidCommission;
  totals.confirmedSales = totals.approvedSales + totals.paidSales;
}

export interface ProgramSummary {
  programId: string;
  /** ASP/事業者名。未登録プログラムはIDをそのまま表示する。 */
  displayName: string;
  merchantName: string | null;
  registered: boolean;
  programStatus: AffiliateProgram["status"] | null;
  termsUrl: string | null;
  byCurrency: Partial<Record<AspCurrency, CurrencyTotals>>;
  currencies: AspCurrency[];
  rowCount: number;
  confirmedCount: number;
  lastEventAt: string | null;
  sources: string[];
}

export interface DashboardData {
  generatedAt: string;
  demo: boolean;
  period: { from: string | null; to: string | null };
  totalsByCurrency: Partial<Record<AspCurrency, CurrencyTotals>>;
  programs: ProgramSummary[];
  notImported: Array<{
    programId: string;
    displayName: string;
    programStatus: AffiliateProgram["status"];
    termsUrl: string | null;
  }>;
  unknownProgramIds: string[];
  duplicates: string[];
  rowCount: number;
  importedFiles: string[];
  parseErrors: Array<{ file: string; line: number; message: string }>;
  /** ASP管理画面で確認した集計値（明細CSVとは別集計・合算しない）。 */
  summaries: AspReportSummary[];
  reportErrors: string[];
  /** programId -> 表示名（管理画面サマリの対象表示に使う）。 */
  programLabels: Record<string, string>;
}

export interface AggregatedConversions {
  programs: ProgramSummary[];
  totalsByCurrency: Partial<Record<AspCurrency, CurrencyTotals>>;
  duplicates: string[];
  unknownProgramIds: string[];
  rowCount: number;
}

function applyRow(totals: CurrencyTotals, row: AspRow): void {
  switch (row.status) {
    case "pending":
      totals.pendingCommission += row.commissionAmount;
      totals.pendingSales += row.amount;
      totals.pendingCount += 1;
      break;
    case "approved":
      totals.approvedCommission += row.commissionAmount;
      totals.approvedSales += row.amount;
      totals.approvedCount += 1;
      break;
    case "paid":
      totals.paidCommission += row.commissionAmount;
      totals.paidSales += row.amount;
      totals.paidCount += 1;
      break;
    case "rejected":
    case "reversed":
      totals.rejectedCommission += row.commissionAmount;
      totals.rejectedSales += row.amount;
      totals.rejectedCount += 1;
      break;
  }
}

/**
 * 成果行をプログラム別・通貨別に集計する。
 * 未登録のprogram_idも金額を落とさずに表示対象として残す。
 */
export function aggregateByProgram(
  rows: readonly AspRow[],
  programs: readonly AffiliateProgram[],
  merchants: readonly Merchant[],
): AggregatedConversions {
  const unique = dedupeConversions(rows);
  const programById = new Map(programs.map((program) => [program.id, program]));
  const merchantById = new Map(merchants.map((merchant) => [merchant.id, merchant]));
  const summaries = new Map<string, ProgramSummary>();

  for (const row of unique.rows) {
    const program = programById.get(row.programId) ?? null;
    const merchant = program ? merchantById.get(program.merchantId) ?? null : null;

    let summary = summaries.get(row.programId);
    if (!summary) {
      summary = {
        programId: row.programId,
        displayName: merchant?.name ?? program?.id ?? row.programId,
        merchantName: merchant?.name ?? null,
        registered: Boolean(program),
        programStatus: program?.status ?? null,
        termsUrl: program?.termsUrl ?? null,
        byCurrency: {},
        currencies: [],
        rowCount: 0,
        confirmedCount: 0,
        lastEventAt: null,
        sources: [],
      };
      summaries.set(row.programId, summary);
    }

    summary.rowCount += 1;
    if (summary.lastEventAt === null || row.eventAt > summary.lastEventAt) {
      summary.lastEventAt = row.eventAt;
    }
    if (!summary.sources.includes(row.source)) summary.sources.push(row.source);

    const totals = summary.byCurrency[row.currency] ?? emptyCurrencyTotals();
    summary.byCurrency[row.currency] = totals;
    applyRow(totals, row);
  }

  const totalsByCurrency: Partial<Record<AspCurrency, CurrencyTotals>> = {};
  for (const summary of summaries.values()) {
    for (const currency of ASP_CURRENCIES) {
      const totals = summary.byCurrency[currency];
      if (!totals) continue;
      finalizeTotals(totals);
      summary.confirmedCount += totals.approvedCount + totals.paidCount;

      const aggregate = totalsByCurrency[currency] ?? emptyCurrencyTotals();
      totalsByCurrency[currency] = aggregate;
      aggregate.pendingCommission += totals.pendingCommission;
      aggregate.approvedCommission += totals.approvedCommission;
      aggregate.paidCommission += totals.paidCommission;
      aggregate.rejectedCommission += totals.rejectedCommission;
      aggregate.pendingSales += totals.pendingSales;
      aggregate.approvedSales += totals.approvedSales;
      aggregate.paidSales += totals.paidSales;
      aggregate.rejectedSales += totals.rejectedSales;
      aggregate.pendingCount += totals.pendingCount;
      aggregate.approvedCount += totals.approvedCount;
      aggregate.paidCount += totals.paidCount;
      aggregate.rejectedCount += totals.rejectedCount;
    }
    summary.currencies = ASP_CURRENCIES.filter(
      (currency) => summary.byCurrency[currency] !== undefined,
    );
    summary.sources.sort((a, b) => a.localeCompare(b, "ja"));
  }

  for (const currency of ASP_CURRENCIES) {
    const aggregate = totalsByCurrency[currency];
    if (aggregate) finalizeTotals(aggregate);
  }

  const list = [...summaries.values()].sort(
    (a, b) => b.rowCount - a.rowCount || a.programId.localeCompare(b.programId),
  );
  const unknownProgramIds = list
    .filter((summary) => !summary.registered)
    .map((summary) => summary.programId)
    .sort((a, b) => a.localeCompare(b));

  return {
    programs: list,
    totalsByCurrency,
    duplicates: unique.duplicates,
    unknownProgramIds,
    rowCount: unique.rows.length,
  };
}

export function buildDashboard(input: {
  rows: readonly AspRow[];
  programs: readonly AffiliateProgram[];
  merchants: readonly Merchant[];
  generatedAt: string;
  demo?: boolean;
  importedFiles?: readonly string[];
  parseErrors?: ReadonlyArray<{ file: string; line: number; message: string }>;
  summaries?: readonly AspReportSummary[];
  reportErrors?: readonly string[];
}): DashboardData {
  const aggregated = aggregateByProgram(input.rows, input.programs, input.merchants);
  const importedProgramIds = new Set(aggregated.programs.map((p) => p.programId));
  const summaries = [...(input.summaries ?? [])];
  const summarizedProgramIds = new Set(summaries.flatMap((summary) => summary.programIds));

  let from: string | null = null;
  let to: string | null = null;
  for (const row of input.rows) {
    if (from === null || row.eventAt < from) from = row.eventAt;
    if (to === null || row.eventAt > to) to = row.eventAt;
  }

  const notImported = input.programs
    .filter(
      (program) =>
        program.status === "approved" &&
        !importedProgramIds.has(program.id) &&
        !summarizedProgramIds.has(program.id),
    )
    .map((program) => ({
      programId: program.id,
      displayName:
        input.merchants.find((merchant) => merchant.id === program.merchantId)?.name ??
        program.id,
      programStatus: program.status,
      termsUrl: program.termsUrl ?? null,
    }))
    .sort((a, b) => a.programId.localeCompare(b.programId));

  const programLabels: Record<string, string> = {};
  for (const program of input.programs) {
    programLabels[program.id] =
      input.merchants.find((merchant) => merchant.id === program.merchantId)?.name ??
      program.id;
  }

  return {
    generatedAt: input.generatedAt,
    demo: input.demo ?? false,
    period: { from, to },
    totalsByCurrency: aggregated.totalsByCurrency,
    programs: aggregated.programs,
    notImported,
    unknownProgramIds: aggregated.unknownProgramIds,
    duplicates: aggregated.duplicates,
    rowCount: aggregated.rowCount,
    importedFiles: [...(input.importedFiles ?? [])].sort((a, b) => a.localeCompare(b, "ja")),
    parseErrors: [...(input.parseErrors ?? [])],
    summaries,
    reportErrors: [...(input.reportErrors ?? [])],
    programLabels,
  };
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

export function formatMoney(amount: number, currency: AspCurrency): string {
  const noFraction = currency === "JPY" || currency === "KRW";
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency,
    minimumFractionDigits: noFraction ? 0 : 2,
    maximumFractionDigits: noFraction ? 0 : 2,
  }).format(amount);
}

function cellMoney(
  summary: ProgramSummary,
  pick: (totals: CurrencyTotals) => number,
): string {
  if (summary.currencies.length === 0) return "—";
  return summary.currencies
    .map((currency) => {
      const totals = summary.byCurrency[currency];
      return totals ? formatMoney(pick(totals), currency) : "—";
    })
    .map((value) => escapeHtml(value))
    .join("<br>");
}

function sumCounts(summary: ProgramSummary): string {
  let confirmed = 0;
  let pending = 0;
  let rejected = 0;
  for (const currency of summary.currencies) {
    const totals = summary.byCurrency[currency];
    if (!totals) continue;
    confirmed += totals.approvedCount + totals.paidCount;
    pending += totals.pendingCount;
    rejected += totals.rejectedCount;
  }
  return `${confirmed} / ${pending} / ${rejected}`;
}

function statusLabel(status: AffiliateProgram["status"] | null): string {
  switch (status) {
    case "approved":
      return "提携済";
    case "pending":
      return "審査中";
    case "rejected":
      return "否認";
    case "paused":
      return "停止";
    case "expired":
      return "期限切れ";
    case "unapplied":
      return "未申請";
    default:
      return "未登録";
  }
}

function renderSummaryCards(data: DashboardData): string {
  const currencies = ASP_CURRENCIES.filter(
    (currency) => data.totalsByCurrency[currency] !== undefined,
  );
  if (currencies.length === 0) return "";
  return currencies
    .map((currency) => {
      const totals = data.totalsByCurrency[currency];
      if (!totals) return "";
      return `<section class="card" aria-label="${escapeHtml(currency)} の集計">
  <h2 class="card-title">${escapeHtml(currency)}</h2>
  <dl class="card-grid">
    <div><dt>確定報酬</dt><dd class="num strong">${escapeHtml(formatMoney(totals.confirmedCommission, currency))}</dd></div>
    <div><dt>見込報酬</dt><dd class="num">${escapeHtml(formatMoney(totals.pendingCommission, currency))}</dd></div>
    <div><dt>却下・返金</dt><dd class="num muted">${escapeHtml(formatMoney(totals.rejectedCommission, currency))}</dd></div>
    <div><dt>確定売上（GMV）</dt><dd class="num">${escapeHtml(formatMoney(totals.confirmedSales, currency))}</dd></div>
    <div><dt>件数（確定/見込/却下）</dt><dd class="num">${totals.approvedCount + totals.paidCount} / ${totals.pendingCount} / ${totals.rejectedCount}</dd></div>
  </dl>
</section>`;
    })
    .join("\n");
}

function moneyMap(record: Partial<Record<AspCurrency, number>>): string {
  const currencies = ASP_CURRENCIES.filter((currency) => record[currency] !== undefined);
  if (currencies.length === 0) return "—";
  return currencies
    .map((currency) => escapeHtml(formatMoney(record[currency] ?? 0, currency)))
    .join("<br>");
}

function renderSummaries(data: DashboardData): string {
  if (data.summaries.length === 0) return "";
  const rows = data.summaries
    .map((summary) => {
      const targets =
        summary.programIds.length === 0
          ? "ASP全体"
          : summary.programIds
              .map((id) => escapeHtml(data.programLabels[id] ?? id))
              .join(" / ");
      const source = summary.sourceUrl
        ? ` <a href="${escapeHtml(summary.sourceUrl)}" target="_blank" rel="noopener noreferrer">画面</a>`
        : "";
      return `<tr>
  <td><span class="nowrap">${escapeHtml(summary.provider)}</span>${source}</td>
  <td>${targets}</td>
  <td class="num">${escapeHtml(summary.period.from)}<br>〜 ${escapeHtml(summary.period.to)}</td>
  <td>${escapeHtml(formatJstDateTime(summary.checkedAt))}</td>
  <td class="num">${summary.clicks === null ? "—" : summary.clicks}</td>
  <td class="num">${moneyMap(summary.confirmedCommission)}</td>
  <td class="num">${moneyMap(summary.pendingCommission)}</td>
  <td class="num">${moneyMap(summary.confirmedSales)}</td>
  <td class="sub">${escapeHtml(summary.note)}</td>
</tr>`;
    })
    .join("\n");
  return `<section class="panel">
<h2>ASP管理画面の実測サマリ（集計値）</h2>
<p class="muted">各ASPの管理画面で確認した集計値です。注文明細CSVとは別集計で、二重計上防止のため合算していません。</p>
<div class="table-wrap">
<table class="programs">
<caption class="sr-only">ASP管理画面で確認した集計値</caption>
<thead>
<tr>
<th scope="col">提供元</th>
<th scope="col">対象</th>
<th scope="col" class="num">期間</th>
<th scope="col">確認日</th>
<th scope="col" class="num">クリック</th>
<th scope="col" class="num">確定報酬</th>
<th scope="col" class="num">見込報酬</th>
<th scope="col" class="num">確定売上</th>
<th scope="col">メモ</th>
</tr>
</thead>
<tbody>
${rows}
</tbody>
</table>
</div>
</section>`;
}

function renderProgramRows(data: DashboardData): string {
  if (data.programs.length === 0) {
    return `<tr><td colspan="9" class="empty-note">取り込み済みの成果がありません。</td></tr>`;
  }
  return data.programs
    .map((summary) => {
      const name = summary.registered
        ? `${escapeHtml(summary.displayName)}<span class="sub">${escapeHtml(summary.programId)}</span>`
        : `${escapeHtml(summary.displayName)}<span class="sub">未登録の program_id</span>`;
      return `<tr>
  <td>${name}</td>
  <td>${escapeHtml(statusLabel(summary.programStatus))}</td>
  <td class="num">${cellMoney(summary, (t) => t.confirmedCommission)}</td>
  <td class="num">${cellMoney(summary, (t) => t.pendingCommission)}</td>
  <td class="num muted">${cellMoney(summary, (t) => t.rejectedCommission)}</td>
  <td class="num">${cellMoney(summary, (t) => t.confirmedSales)}</td>
  <td class="num">${sumCounts(summary)}</td>
  <td>${summary.lastEventAt ? escapeHtml(formatJstDateTime(summary.lastEventAt)) : "—"}</td>
  <td class="sub">${summary.sources.map((source) => escapeHtml(source)).join("<br>") || "—"}</td>
</tr>`;
    })
    .join("\n");
}

function renderNotImported(data: DashboardData): string {
  if (data.notImported.length === 0) return "";
  const items = data.notImported
    .map((program) => {
      const terms = program.termsUrl
        ? ` <a href="${escapeHtml(program.termsUrl)}" target="_blank" rel="noopener noreferrer">規約</a>`
        : "";
      return `<li><strong>${escapeHtml(program.displayName)}</strong> <span class="sub">${escapeHtml(program.programId)}</span>${terms}<br><span class="muted">成果CSVが未取込です（0件ではなく「未取得」）。</span></li>`;
    })
    .join("\n");
  return `<section class="panel">
<h2>成果データが未取込の提携プログラム</h2>
<p class="muted">提携済みですが、このページに取り込まれたCSVがありません。数値は「0」ではなく未取得として扱います。</p>
<ul class="plain">${items}</ul>
</section>`;
}

function renderWarnings(data: DashboardData): string {
  const warnings: string[] = [];
  if (data.duplicates.length > 0) {
    warnings.push(
      `重複した conversion_id を ${data.duplicates.length}件 検出しました（状態の進んだ行を優先）。`,
    );
  }
  if (data.unknownProgramIds.length > 0) {
    warnings.push(
      `登録済みプログラムに無い program_id: ${data.unknownProgramIds
        .map((id) => escapeHtml(id))
        .join(", ")}（金額は表示しています）。`,
    );
  }
  if (data.parseErrors.length > 0) {
    warnings.push(
      `CSVの読み取りエラー ${data.parseErrors.length}件（該当行は集計から除外）。`,
    );
  }
  if (data.reportErrors.length > 0) {
    warnings.push(
      `ASP実測サマリの読み込みエラー ${data.reportErrors.length}件（サマリは表示していません）。`,
    );
  }
  if (data.summaries.length > 0) {
    warnings.push(
      "ASP実測サマリ（管理画面の集計値）と明細CSVは、二重計上防止のため合算していません。",
    );
  }
  if (warnings.length === 0) return "";
  return `<section class="panel warn" aria-label="注意">
<h2>注意</h2>
<ul class="plain">${warnings.map((warning) => `<li>${warning}</li>`).join("")}</ul>
</section>`;
}

function renderParseErrors(data: DashboardData): string {
  if (data.parseErrors.length === 0) return "";
  const rows = data.parseErrors
    .slice(0, 20)
    .map(
      (error) =>
        `<tr><td>${escapeHtml(error.file)}</td><td class="num">${error.line}</td><td>${escapeHtml(error.message)}</td></tr>`,
    )
    .join("");
  return `<section class="panel">
<h2>CSVエラー（最大20件）</h2>
<table class="errors"><thead><tr><th>ファイル</th><th>行</th><th>内容</th></tr></thead><tbody>${rows}</tbody></table>
</section>`;
}

function renderEmptyState(hasSummaries: boolean): string {
  const lead = hasSummaries
    ? `<p>注文明細CSVはまだ取り込んでいません。上の「ASP管理画面の実測サマリ」は各ASP管理画面の集計値です。ここでは注文単位の明細を取り込むためのCSV形式を示します。</p>`
    : `<p>ASPの管理画面からダウンロードした成果CSVを、次の列名に揃えて <code>var/asp/</code> に置きます（複数ファイル可）。</p>`;
  return `<section class="panel empty">
<h2>成果CSVの取り込み（注文明細）</h2>
${lead}
<pre><code>conversion_id,program_id,amount,commission,currency,status,event_at,confirmed_at</code></pre>
<ul class="plain">
<li><code>status</code>: pending / approved / paid / rejected / reversed</li>
<li><code>currency</code>: JPY / USD / KRW</li>
<li><code>event_at</code>, <code>confirmed_at</code>: ISO 8601（例: 2026-11-01T00:00:00.000Z）</li>
</ul>
<p>置いたあと <code>pnpm dashboard</code> を実行すると、このページが再生成されます。ASPごとに列名が違う場合は、取り込み前にこの形式へ変換してください（架空の数値は作りません）。</p>
</section>`;
}

export function renderDashboardHtml(data: DashboardData): string {
  const period =
    data.period.from && data.period.to
      ? `${formatJstDateTime(data.period.from)} 〜 ${formatJstDateTime(data.period.to)}`
      : data.summaries.length > 0
        ? "明細CSVなし（サマリはASP毎）"
        : "データなし";
  const demoBanner = data.demo
    ? `<p class="demo-banner" role="alert">サンプルデータ（架空の数値）を表示しています。実際の売上ではありません。</p>`
    : "";
  const body =
    data.rowCount === 0
      ? renderEmptyState(data.summaries.length > 0)
      : `<section class="panel">
<h2>プログラム別の成果</h2>
<div class="table-wrap">
<table class="programs">
<caption class="sr-only">プログラム別の確定報酬・見込・却下・売上・件数</caption>
<thead>
<tr>
<th scope="col">プログラム</th>
<th scope="col">提携状態</th>
<th scope="col" class="num">確定報酬</th>
<th scope="col" class="num">見込報酬</th>
<th scope="col" class="num">却下・返金</th>
<th scope="col" class="num">確定売上</th>
<th scope="col" class="num">件数<br><span class="sub">確定/見込/却下</span></th>
<th scope="col">最終成果</th>
<th scope="col">取込元</th>
</tr>
</thead>
<tbody>
${renderProgramRows(data)}
</tbody>
</table>
</div>
</section>`;

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>アフィリエイト売上ダッシュボード｜韓国旅行ノート（ローカル専用）</title>
<style>
:root { color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; background: #f6f3ef; color: #241c1a; font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Noto Sans JP", "Yu Gothic", system-ui, sans-serif; line-height: 1.6; }
.wrap { max-width: 1200px; margin: 0 auto; padding: 24px 16px 64px; }
.hero { background: #14213d; color: #fff; border-radius: 16px; padding: 28px 24px; }
.hero h1 { margin: 0; font-size: 1.6rem; line-height: 1.3; }
.hero .lead { margin: 8px 0 0; color: #c9d3e6; font-size: .92rem; }
.badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; font-size: .78rem; }
.badge { background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.25); border-radius: 999px; padding: 3px 10px; }
.demo-banner { background: #ffe1d6; border: 1px solid #f9755f; color: #7f2028; border-radius: 10px; padding: 10px 14px; margin: 16px 0 0; font-weight: 700; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 20px; }
.card { background: #fff; border: 1px solid #e7ded6; border-radius: 14px; padding: 18px 20px; }
.card-title { margin: 0 0 10px; font-size: .95rem; letter-spacing: .08em; color: #6b5d57; }
.card-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 16px; margin: 0; }
.card-grid dt { font-size: .75rem; color: #6b5d57; }
.card-grid dd { margin: 2px 0 0; font-size: 1.05rem; }
.strong { font-weight: 800; font-size: 1.25rem; }
.panel { background: #fff; border: 1px solid #e7ded6; border-radius: 14px; padding: 20px 22px; margin-top: 20px; }
.panel h2 { margin: 0 0 12px; font-size: 1.05rem; }
.panel.warn { border-color: #f0c36d; background: #fffbef; }
.panel.empty { border-style: dashed; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: .88rem; }
th, td { padding: 9px 12px; border-bottom: 1px solid #eee5dd; text-align: left; vertical-align: top; }
thead th { background: #f1ece6; font-size: .78rem; color: #5c504a; white-space: nowrap; }
tbody tr:hover { background: #fcf8f3; }
.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.muted { color: #8a7c74; }
.sub { display: block; color: #988a82; font-size: .74rem; font-weight: 400; }
.plain { margin: 0; padding-left: 1.2em; }
.plain li { margin: 6px 0; }
pre { background: #f4efe9; border-radius: 8px; padding: 12px 14px; overflow-x: auto; font-size: .82rem; }
code { font-family: "SFMono-Regular", "Roboto Mono", Consolas, monospace; }
.errors { font-size: .82rem; }
.notes { margin-top: 24px; color: #6b5d57; font-size: .78rem; }
.notes ul { margin: 6px 0 0; padding-left: 1.2em; }
.foot { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e7ded6; color: #8a7c74; font-size: .75rem; }
.nowrap { white-space: nowrap; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
@media print { .hero { background: #fff; color: #000; } .table-wrap { overflow: visible; } body { background: #fff; } }
</style>
</head>
<body>
<div class="wrap">
<header class="hero">
<h1>アフィリエイト売上ダッシュボード</h1>
<p class="lead">韓国旅行ノート（sougakuhikaku.com）／ ASP成果の集約（注文明細CSV・管理画面サマリ）</p>
<div class="badges">
<span class="badge">ローカル専用・社外秘</span>
<span class="badge">noindex</span>
<span class="badge">対象期間: ${escapeHtml(period)}</span>
<span class="badge">生成: ${escapeHtml(formatJstDateTime(data.generatedAt))}</span>
<span class="badge">取込 ${data.importedFiles.length}ファイル / ${data.rowCount}件</span>
<span class="badge">実測サマリ ${data.summaries.length}件</span>
</div>
${demoBanner}
</header>

<div class="cards">
${renderSummaryCards(data)}
</div>

${renderSummaries(data)}

${body}

${renderNotImported(data)}

${renderWarnings(data)}

${renderParseErrors(data)}

<section class="notes">
<h2>このページの前提</h2>
<ul>
<li>ASP各社は管理画面が分かれており、横断の公式ダッシュボードはありません。このページは各ASPの成果CSVを正規化して1ページに集約したものです。</li>
<li>確定報酬は「承認済＋支払済」、見込は「pending」、却下・返金は「rejected＋reversed」です。見込を確定として扱いません。</li>
<li>売上（GMV）は注文額などで、成果報酬とは別物です。混同しないよう列を分けています。</li>
<li>通貨（JPY/USD/KRW）をまたいだ合算はしていません。為替レートは取得していないため換算しません。</li>
<li>ASP実測サマリのクリック数は各ASP管理画面の値です。GA4のクリック数・CVRはこのページに含みません。</li>
<li>実測サマリは管理画面の集計値で、明細CSV（注文単位）とは別です。合算・突合はしていません。</li>
<li>成果データが無い提携プログラムは「0件」ではなく「未取込」として表示します。</li>
</ul>
</section>

<footer class="foot">
取込ファイル: ${data.importedFiles.length > 0 ? data.importedFiles.map((file) => escapeHtml(file)).join(" / ") : "なし"}
／ 実測サマリ: ${data.summaries.length > 0 ? "var/asp/reports.json" : "なし"}（${data.summaries.length}件）
／ このページはリポジトリの var/ 配下に生成され、Gitにはコミットされません。
</footer>
</div>
</body>
</html>
`;
}
