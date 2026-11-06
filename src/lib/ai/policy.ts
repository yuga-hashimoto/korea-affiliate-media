/**
 * 生成物の共通ポリシー。数値の捏造・未確認の断定・薬機法リスク表現を弾く。
 */

export const BANNED_PHRASES = [
  "最安値",
  "絶対にお得",
  "必ず稼げる",
  "No.1",
  "日本一",
  "実際に使ってみた",
  "実際に泊まった",
  "治る",
  "シミが消える",
  "肌が生まれ変わる",
  "公式パートナー",
  "限定保証",
] as const;

export function findBannedPhrases(text: string): string[] {
  return BANNED_PHRASES.filter((phrase) => text.includes(phrase));
}

/**
 * 本文中の数値が、検証済みの事実（facts）または出典メタデータに含まれるか検査する。
 * 年号・日付もfacts側に含める運用とする。
 */
export function findUnsupportedNumbers(
  text: string,
  allowedFacts: readonly string[],
): string[] {
  const allowed = new Set<string>();
  for (const fact of allowedFacts) {
    for (const token of fact.match(/[0-9][0-9,.]*/g) ?? []) {
      allowed.add(token.replace(/,/g, ""));
    }
  }
  const tokens = text.match(/[0-9][0-9,.]*/g) ?? [];
  const unsupported = new Set<string>();
  for (const raw of tokens) {
    const normalized = raw.replace(/,/g, "").replace(/\.$/, "");
    if (normalized.length === 0) continue;
    if (!allowed.has(normalized)) {
      // 「2泊3日」「3GB」のような単純な数量は許容する（価格ではない）
      if (/^\d{1,2}$/.test(normalized)) continue;
      unsupported.add(raw);
    }
  }
  return [...unsupported];
}

export const AFFILIATE_MENTION_PATTERN =
  /(アフィリエイト|広告|PR|プロモーション|提携)/;
