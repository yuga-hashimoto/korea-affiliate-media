const TOKYO = "Asia/Tokyo";

export function formatJstDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "UNKNOWN";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: TOKYO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatJstDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "UNKNOWN";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: TOKYO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** UTC の ISO 文字列が now より過去か。 */
export function isPast(iso: string | null, now: Date): boolean {
  if (!iso) return false;
  const time = new Date(iso).getTime();
  return Number.isFinite(time) && time < now.getTime();
}

/** 証跡の鮮度（既定 14 日で stale 扱い）。 */
export function isStale(
  iso: string,
  now: Date,
  maxAgeDays = 14,
): boolean {
  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return true;
  return now.getTime() - time > maxAgeDays * 24 * 60 * 60 * 1000;
}

export function tokyoDayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TOKYO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
