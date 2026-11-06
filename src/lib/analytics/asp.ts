import { z } from "zod";

/**
 * ASP成果CSVの取り込み。
 * 「見込・承認・却下・返金・支払済」を区別したまま、通貨ごとに集計する。
 * 為替レートを持たないため、通貨をまたいだ合算は行わない。
 */

export const ASP_CURRENCIES = ["JPY", "USD", "KRW"] as const;
export type AspCurrency = (typeof ASP_CURRENCIES)[number];

export const AspRowSchema = z.object({
  externalConversionId: z.string().min(1),
  programId: z.string().min(1),
  amount: z.coerce.number().nonnegative(),
  commissionAmount: z.coerce.number().nonnegative(),
  currency: z.enum(ASP_CURRENCIES),
  status: z.enum(["pending", "approved", "rejected", "reversed", "paid"]),
  eventAt: z.string().datetime(),
  confirmedAt: z.string().datetime().nullable().default(null),
  source: z.string().min(1).default("asp_csv"),
});
export type AspRow = z.infer<typeof AspRowSchema>;

/** 引用符・カンマ・改行を含む簡易CSVパーサ（RFC4180相当の最小実装）。 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
}

export interface ParsedAspCsv {
  rows: AspRow[];
  errors: Array<{ line: number; message: string }>;
}

const HEADER_ALIASES: Record<string, keyof AspRow> = {
  conversion_id: "externalConversionId",
  external_conversion_id: "externalConversionId",
  program_id: "programId",
  amount: "amount",
  commission: "commissionAmount",
  commission_amount: "commissionAmount",
  currency: "currency",
  status: "status",
  event_at: "eventAt",
  confirmed_at: "confirmedAt",
};

export function parseAspCsv(text: string): ParsedAspCsv {
  const table = parseCsv(text);
  if (table.length === 0) return { rows: [], errors: [{ line: 1, message: "空のCSV" }] };

  const header = table[0] ?? [];
  const columns = header.map((name) => HEADER_ALIASES[name.trim()] ?? null);
  if (!columns.includes("externalConversionId")) {
    return {
      rows: [],
      errors: [{ line: 1, message: "conversion_id 列が必要です" }],
    };
  }

  const rows: AspRow[] = [];
  const errors: Array<{ line: number; message: string }> = [];

  table.slice(1).forEach((cells, index) => {
    const record: Record<string, string> = {};
    columns.forEach((key, colIndex) => {
      if (key) record[key] = cells[colIndex] ?? "";
    });
    const parsed = AspRowSchema.safeParse({
      externalConversionId: record.externalConversionId,
      programId: record.programId,
      amount: record.amount || "0",
      commissionAmount: record.commissionAmount || "0",
      currency: record.currency,
      status: record.status,
      eventAt: record.eventAt,
      confirmedAt: record.confirmedAt || null,
      source: "asp_csv",
    });
    if (parsed.success) rows.push(parsed.data);
    else {
      errors.push({
        line: index + 2,
        message: parsed.error.issues.map((i) => i.path.join(".")).join(", "),
      });
    }
  });

  return { rows, errors };
}

export type CurrencyTotals = {
  approved: number;
  paid: number;
  pending: number;
  rejected: number;
};

export interface ConversionSummary {
  counts: Record<AspRow["status"], number>;
  byCurrency: Partial<Record<AspCurrency, CurrencyTotals>>;
  revenueByProgram: Record<string, Partial<Record<AspCurrency, number>>>;
  duplicates: string[];
}

const emptyTotals = (): CurrencyTotals => ({
  approved: 0,
  paid: 0,
  pending: 0,
  rejected: 0,
});

/**
 * 重複（同一 conversion_id）を排除し、通貨ごとに確定報酬を集計する。
 * 承認状態が進んでいる行を優先する。
 */
export function summarizeConversions(
  rows: readonly AspRow[],
): ConversionSummary {
  const seen = new Map<string, AspRow>();
  const duplicates: string[] = [];
  const priority: Record<AspRow["status"], number> = {
    rejected: 0,
    reversed: 1,
    pending: 2,
    approved: 3,
    paid: 4,
  };

  for (const row of rows) {
    const existing = seen.get(row.externalConversionId);
    if (existing) {
      duplicates.push(row.externalConversionId);
      if (priority[row.status] > priority[existing.status]) {
        seen.set(row.externalConversionId, row);
      }
    } else {
      seen.set(row.externalConversionId, row);
    }
  }

  const counts: ConversionSummary["counts"] = {
    pending: 0,
    approved: 0,
    rejected: 0,
    reversed: 0,
    paid: 0,
  };
  const byCurrency: ConversionSummary["byCurrency"] = {};
  const revenueByProgram: ConversionSummary["revenueByProgram"] = {};

  for (const row of seen.values()) {
    counts[row.status] += 1;
    const totals = byCurrency[row.currency] ?? emptyTotals();
    byCurrency[row.currency] = totals;

    if (row.status === "approved") {
      totals.approved += row.commissionAmount;
      const program = revenueByProgram[row.programId] ?? {};
      program[row.currency] = (program[row.currency] ?? 0) + row.commissionAmount;
      revenueByProgram[row.programId] = program;
    } else if (row.status === "paid") {
      totals.paid += row.commissionAmount;
      const program = revenueByProgram[row.programId] ?? {};
      program[row.currency] = (program[row.currency] ?? 0) + row.commissionAmount;
      revenueByProgram[row.programId] = program;
    } else if (row.status === "pending") {
      totals.pending += row.commissionAmount;
    } else {
      totals.rejected += row.commissionAmount;
    }
  }

  return { counts, byCurrency, revenueByProgram, duplicates };
}
