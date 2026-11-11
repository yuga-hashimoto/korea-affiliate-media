/**
 * GA4 Data API クライアント（読み取り専用）。
 *
 * - `GA4_PROPERTY_ID` と `GOOGLE_APPLICATION_CREDENTIALS`（サービスアカウントJSON）が
 *   そろうときのみ動作する。「設定がないときは安全に停止」がデフォルト。
 * - 認証はサービスアカウントの JWT → OAuth2 アクセストークン交換。
 *   依存パッケージを増やさず node:crypto で署名する。
 * - 取得した数値はそのまま表示する。推測・補完はしない。
 */
import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const REPORT_URL = "https://analyticsdata.googleapis.com/v1beta";

export interface Ga4Config {
  propertyId: string;
  credentialsPath: string;
}

export interface Ga4PageRow {
  pageTitle: string;
  pagePath: string;
  views: number;
}

export interface Ga4PagesReport {
  rows: Ga4PageRow[];
  range: { start: string; end: string };
}

export interface Ga4DailyRow {
  /** GA4 の date ディメンションを YYYY-MM-DD にしたもの。 */
  date: string;
  /** その日にアクティブだったユーザー数（日別ユニーク。期間合計とは一致しない）。 */
  activeUsers: number;
  views: number;
  sessions: number;
}

export interface Ga4TrafficReport {
  rows: Ga4DailyRow[];
  range: { start: string; end: string };
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function ga4ConfigFromEnv(): Ga4Config | null {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!propertyId || !/^\d+$/.test(propertyId)) return null;
  if (!credentialsPath) return null;
  return { propertyId, credentialsPath };
}

/** 実行可能なGA4設定。未設定なら null（呼び出し側は取得をスキップする）。 */
export function ga4Config(): Ga4Config | null {
  return ga4ConfigFromEnv();
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function loadServiceAccount(path: string): Promise<ServiceAccount> {
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      "サービスアカウントJSONに client_email / private_key がありません",
    );
  }
  return { client_email: parsed.client_email, private_key: parsed.private_key };
}

async function getAccessToken(
  account: ServiceAccount,
  now: Date,
): Promise<string> {
  const iat = Math.floor(now.getTime() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat,
      exp: iat + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  signer.end();
  const signature = base64url(
    signer.sign(account.private_key.replace(/\\n/g, "\n")),
  );
  const assertion = `${header}.${claims}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`OAuth2 トークン取得に失敗しました（HTTP ${res.status}）`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("OAuth2 レスポンスに access_token がありません");
  }
  return data.access_token;
}

interface BatchRunReportsRows {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
}

/** GA4 batchRunReports のレスポンスのうち、必要な部分だけを整形する。 */
export function rowsToPageRows(rowset: BatchRunReportsRows[]): Ga4PageRow[] {
  return rowset
    .map((row) => {
      const pageTitle = row.dimensionValues?.[0]?.value ?? "(unknown)";
      const pagePath = row.dimensionValues?.[1]?.value ?? "(unknown)";
      const views = Number(row.metricValues?.[0]?.value ?? "0");
      return { pageTitle, pagePath, views: Number.isFinite(views) ? views : 0 };
    })
    .sort((a, b) => b.views - a.views);
}

/** dateRange は GA4 の相対表現（例: "7daysAgo"）を受け付ける。 */
export async function fetchGa4PagesReport(
  config: Ga4Config,
  options: { start: string; end: string },
): Promise<Ga4PagesReport> {
  const account = await loadServiceAccount(config.credentialsPath);
  const token = await getAccessToken(account, new Date());

  const body = {
    requests: [
      {
        dateRanges: [{ startDate: options.start, endDate: options.end }],
        dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 50,
      },
    ],
  };

  const res = await fetch(
    `${REPORT_URL}/properties/${config.propertyId}:batchRunReports`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `GA4 レポート取得に失敗しました（HTTP ${res.status}）${detail ? `: ${detail.slice(0, 300)}` : ""}`,
    );
  }
  const data = (await res.json()) as {
    reports?: { rows?: BatchRunReportsRows[] }[];
  };
  const rows = data.reports?.[0]?.rows ?? [];
  return {
    rows: rowsToPageRows(rows),
    range: { start: options.start, end: options.end },
  };
}

/** レポートをMarkdownの順位表にする。取得できない場合は null を返す。 */
export function formatPagesRanking(report: Ga4PagesReport): string {
  const lines: string[] = [];
  lines.push(`# 一番見られているページ（GA4/表示回数）`);
  lines.push("");
  lines.push(`- 期間: ${report.range.start} 〜 ${report.range.end}`);
  lines.push(`- 取得件数: ${report.rows.length}件`);
  lines.push("- 数値はGA4 Data APIの値そのもの。推測による補完はしていません。");
  lines.push("");
  if (report.rows.length === 0) {
    lines.push("まだデータがありません（測定開始から1日以内の場合、表示まで最大24時間ほどかかります）。");
    return `${lines.join("\n")}\n`;
  }
  lines.push("| # | ページタイトル | パス | 表示回数 |");
  lines.push("| --- | --- | --- | --- |");
  report.rows.forEach((row, index) => {
    lines.push(
      `| ${index + 1} | ${row.pageTitle} | \`${row.pagePath}\` | ${row.views} |`,
    );
  });
  return `${lines.join("\n")}\n`;
}

function toNumber(value: string | undefined): number {
  const n = Number(value ?? "0");
  return Number.isFinite(n) ? n : 0;
}

/** GA4 の date ディメンション（YYYYMMDD）を YYYY-MM-DD にする。 */
export function formatGa4Date(raw: string): string {
  return /^\d{8}$/.test(raw)
    ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
    : raw;
}

/** batchRunReports（date × activeUsers/screenPageViews/sessions）の行を整形する。 */
export function rowsToDailyRows(rowset: BatchRunReportsRows[]): Ga4DailyRow[] {
  return rowset
    .map((row) => ({
      date: formatGa4Date(row.dimensionValues?.[0]?.value ?? "(unknown)"),
      activeUsers: toNumber(row.metricValues?.[0]?.value),
      views: toNumber(row.metricValues?.[1]?.value),
      sessions: toNumber(row.metricValues?.[2]?.value),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** 日別のアクセス推移（ユーザー/PV/セッション）を取得する。 */
export async function fetchGa4TrafficReport(
  config: Ga4Config,
  options: { start: string; end: string },
): Promise<Ga4TrafficReport> {
  const account = await loadServiceAccount(config.credentialsPath);
  const token = await getAccessToken(account, new Date());

  const body = {
    requests: [
      {
        dateRanges: [{ startDate: options.start, endDate: options.end }],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "sessions" },
        ],
        orderBys: [{ dimension: { dimensionName: "date" } }],
        limit: 100,
      },
    ],
  };

  const res = await fetch(
    `${REPORT_URL}/properties/${config.propertyId}:batchRunReports`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `GA4 レポート取得に失敗しました（HTTP ${res.status}）${detail ? `: ${detail.slice(0, 300)}` : ""}`,
    );
  }
  const data = (await res.json()) as {
    reports?: { rows?: BatchRunReportsRows[] }[];
  };
  const rows = data.reports?.[0]?.rows ?? [];
  return {
    rows: rowsToDailyRows(rows),
    range: { start: options.start, end: options.end },
  };
}

/** 日別推移をMarkdownにする。日別ユーザーの合計は期間ユニークと一致しない旨を明記する。 */
export function formatDailyTraffic(report: Ga4TrafficReport): string {
  const lines: string[] = [];
  lines.push(`# 日別アクセス推移（GA4）`);
  lines.push("");
  lines.push(`- 期間: ${report.range.start} 〜 ${report.range.end}`);
  lines.push("- 数値はGA4 Data APIの値そのもの。推測による補完はしていません。");
  lines.push("");
  if (report.rows.length === 0) {
    lines.push("まだデータがありません（測定開始直後は反映まで最大24時間ほどかかります）。");
    return `${lines.join("\n")}\n`;
  }
  const totalViews = report.rows.reduce((sum, row) => sum + row.views, 0);
  const totalSessions = report.rows.reduce((sum, row) => sum + row.sessions, 0);
  const totalUsersPerDay = report.rows.reduce((sum, row) => sum + row.activeUsers, 0);
  lines.push(
    `- 期間合計: PV **${totalViews}** / セッション **${totalSessions}** / 日別ユーザーの単純合計 **${totalUsersPerDay}**`,
  );
  lines.push("");
  lines.push("| 日付 | ユーザー（日別） | PV | セッション |");
  lines.push("| --- | --- | --- | --- |");
  report.rows.forEach((row) => {
    lines.push(`| ${row.date} | ${row.activeUsers} | ${row.views} | ${row.sessions} |`);
  });
  lines.push("");
  lines.push(
    "> 日別の「ユーザー」はその日にアクティブだった人数。同じ人が複数日に来ると重複して数えられるため、期間合計のユニークユーザー数とは一致しません。",
  );
  return `${lines.join("\n")}\n`;
}
