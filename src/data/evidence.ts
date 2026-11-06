import type { SourceEvidence } from "@/lib/domain";

const CHECKED_AT = "2026-11-06T09:00:00.000Z";

function official(
  id: string,
  sourceUrl: string,
  sourceType: SourceEvidence["sourceType"],
  note: string,
): SourceEvidence {
  return {
    id,
    sourceUrl,
    sourceType,
    accessPermitted: "unknown",
    checkedAt: CHECKED_AT,
    observedTextHash: null,
    note,
    reviewStatus: "unreviewed",
  };
}

/**
 * 参照元。記事の事実確認に使う公式サイトを記録する。
 * accessPermitted=unknown は「引用・取得の許諾を確認していない」意味で、
 * 本文の転載や自動収集には使わない（リンクと要約のみ）。
 */
export const evidence: SourceEvidence[] = [
  official(
    "ev-visitkorea",
    "https://japanese.visitkorea.or.kr/",
    "official_page",
    "韓国観光公社の公式観光情報。エリア・イベント・交通の確認に使用。",
  ),
  official(
    "ev-visitkorea-busan",
    "https://japanese.visitkorea.or.kr/",
    "official_page",
    "釜山の観光情報。公式ページで最新の営業・イベント情報を確認する。",
  ),
  official(
    "ev-visit-jeju",
    "https://www.visitjeju.net/jp",
    "official_page",
    "済州観光公社の公式サイト。アクセス・観光地の確認に使用。",
  ),
  official(
    "ev-incheon-airport",
    "https://www.airport.kr/ap_jp/",
    "official_page",
    "仁川国際空港の公式サイト。ターミナル・交通・施設の確認に使用。",
  ),
  official(
    "ev-arex",
    "https://www.arex.or.kr/",
    "official_page",
    "空港鉄道AREXの公式サイト。運賃・時刻は公式で確認する。",
  ),
  official(
    "ev-seoulmetro",
    "https://www.seoulmetro.co.kr/jp/",
    "official_page",
    "ソウル交通公社の公式サイト。路線・運賃・利用案内の確認に使用。",
  ),
  official(
    "ev-korail",
    "https://www.letskorail.com/",
    "official_page",
    "韓国鉄道公社（KORAIL）の公式サイト。KTX・列車の予約と時刻の確認に使用。",
  ),
  official(
    "ev-kma",
    "https://www.kma.go.kr/",
    "official_page",
    "韓国気象庁。季節・気温・降水の確認に使用（旅行日の天気は直前に確認）。",
  ),
  official(
    "ev-oliveyoung",
    "https://global.oliveyoung.com/",
    "official_page",
    "OLIVE YOUNG Globalの公式サイト。取扱商品・配送条件の確認に使用。",
  ),
  official(
    "ev-customs-jp",
    "https://www.customs.go.jp/",
    "public_regulation",
    "税関の公式情報。輸入品の税・手続きの確認に使用（制度は変更される）。",
  ),
  official(
    "ev-caa-stealth",
    "https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/stealth_marketing",
    "public_regulation",
    "消費者庁のステルスマーケティング規制に関する解説。",
  ),
  official(
    "ev-x-paid-partnership",
    "https://help.x.com/ja/rules-and-policies/paid-partnerships-policy",
    "official_page",
    "Xの有料パートナーシップ開示ポリシー。",
  ),
];
