import type { Category } from "@/lib/domain";

/**
 * 記事ごとに表示する提携先を絞り込むための定義。
 *
 * - カテゴリ共通のCTAでは記事と無関係な提携先まで並ぶため、記事の主題に合う
 *   プログラムIDだけを表示する（例: 化粧品記事にハーブピーリングを出さない）。
 * - 未定義のスラッグはカテゴリ共通のCTAをそのまま使う。
 * - 提携が未承認・リンク未設定のプログラムは、既存どおり公式URLへフォールバックする。
 */
export const ARTICLE_CTA_PROGRAMS: Record<string, readonly string[]> = {
  "oliveyoung-japan-shipping": ["prog-oliveyoung", "prog-rakuten", "prog-amazon"],
  "seoul-palace-hanbok-guide": ["prog-klook", "prog-rakuten-experience"],
  "n-seoul-tower-tickets": ["prog-klook", "prog-rakuten-experience"],
  "busan-hotel-area-guide": ["prog-rakuten-travel", "prog-tripcom", "prog-klook"],
  "seoul-1night-2days-plan": ["prog-klook", "prog-rakuten-travel"],
  "seoul-myeongdong-vs-hongdae-hotel": ["prog-rakuten-travel", "prog-tripcom"],
  "busan-1night-2days-plan": ["prog-klook", "prog-rakuten-travel"],
  "korea-travel-budget-howto": ["prog-rakuten", "prog-amazon", "prog-airalo"],
  "korea-rental-car-guide": ["prog-klook", "prog-rakuten-travel"],
  "korea-esim-sim-wifi-howto": ["prog-airalo", "prog-rakuten", "prog-amazon"],
  "jeju-unesco-nature-guide": ["prog-klook", "prog-rakuten-travel"],
  "seoul-gangnam-area-guide": ["prog-rakuten-travel", "prog-tripcom", "prog-klook"],
  "incheon-airport-late-night": ["prog-klook", "prog-tripcom", "prog-rakuten-travel"],
};

export interface ProgramTarget {
  programId: string;
}

/**
 * 記事スラッグに対応する提携先だけを返す。
 * 定義がない場合、または定義がカテゴリ内の候補と1つも一致しない場合は、
 * カテゴリ共通の候補をそのまま返す（CTAが空になるのを防ぐ）。
 */
export function pickCtaTargets<T extends ProgramTarget>(
  targets: readonly T[],
  articleSlug: string,
): T[] {
  const wanted = ARTICLE_CTA_PROGRAMS[articleSlug];
  if (!wanted || wanted.length === 0) return [...targets];
  const allowed = new Set(wanted);
  const filtered = targets.filter((target) => allowed.has(target.programId));
  return filtered.length > 0 ? filtered : [...targets];
}

/** カテゴリ型を受け取る呼び出し側のための補助（未使用カテゴリの検出用）。 */
export type CtaCategory = Category;
