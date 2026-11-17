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
function officialAt(
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
    checkedAt: "2026-11-10T00:30:00.000Z",
    observedTextHash: null,
    note,
    reviewStatus: "verified",
  };
}

/** 確認日を明示して記録する（2026-11-17以降の再確認分）。 */
function officialOn(
  id: string,
  sourceUrl: string,
  sourceType: SourceEvidence["sourceType"],
  note: string,
  checkedAt: string,
): SourceEvidence {
  return {
    id,
    sourceUrl,
    sourceType,
    accessPermitted: "unknown",
    checkedAt,
    observedTextHash: null,
    note,
    reviewStatus: "verified",
  };
}

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
  officialAt(
    "ev-arex-express",
    "https://www.airportrailroad.com/train/express/introduce",
    "official_page",
    "空港鉄道（AREX）公式。直通列車の運賃・所要時間・特典を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-arex-normal-fare",
    "https://www.airportrailroad.com/train/normal/fare",
    "official_page",
    "空港鉄道（AREX）公式。一般列車の運賃表・1回用カードの加算を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-arex-normal-time",
    "https://www.airportrailroad.com/train/normal/introduce",
    "official_page",
    "空港鉄道（AREX）公式。一般列車の所要時間・乗り換え駅を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-icn-taxi",
    "https://www.airport.kr/ap_ja/1899/subview.do",
    "official_page",
    "仁川国際空港公式（日本語）。タクシーの深夜割増・市界割増・乗り場を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-icn-night-bus",
    "https://www.airport.kr/ap_ja/1891/subview.do",
    "official_page",
    "仁川国際空港公式（日本語）。ソウル深夜バスの運賃・所要時間・購入方法を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-seoulmetro-fare",
    "https://www.seoulmetro.co.kr/jp/page.do?menuIdx=657",
    "official_page",
    "ソウル交通公社公式（日本語）。地下鉄運賃・乗り換え・定期券を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-seoulmetro-ticket",
    "https://www.seoulmetro.co.kr/jp/page.do?menuIdx=662",
    "official_page",
    "ソウル交通公社公式（日本語）。交通カード・1回用カード・保証金を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-customs-jp-menzei",
    "https://www.customs.go.jp/kaigairyoko/menzei.htm",
    "public_regulation",
    "財務省・税関公式。海外旅行者の免税範囲（酒・たばこ・香水・20万円）を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-customs-jp-taxcalc",
    "https://www.customs.go.jp/kaigairyoko/zeigaku.htm",
    "public_regulation",
    "財務省・税関公式。課税価格の計算（海外市価×0.6）と簡易税率を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-icn-terminal-move",
    "https://www.airport.kr/ap_ja/1909/subview.do",
    "official_page",
    "仁川国際空港公式（日本語）。ターミナル間の空港鉄道（約6分・1,050ウォン）を確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-seoulmetro-terms",
    "https://www.seoulmetro.co.kr/jp/page.do?menuIdx=772",
    "official_page",
    "ソウル交通公社公式（日本語）。旅客区分・乗車券の効力・払い戻しを確認（2026-11-10確認）。",
  ),
  officialAt(
    "ev-kr-customs-refund",
    "https://www.customs.go.kr/english/cm/cntnts/cntntsView.do?mi=10803&cntntsId=5504",
    "public_regulation",
    "韓国関税庁公式（英語）。出国時のタックスリファンド手続きを確認（2026-11-10確認）。",
  ),
  officialOn(
    "ev-oy-global-shipping",
    "https://global.oliveyoung.com/foot-info/footer-contents?foterMenuSeq=10",
    "official_page",
    "OLIVE YOUNG Global公式（英語）。日本への配送はお届け目安7〜9日、3,900円以上で送料無料、商品価格・送料に関税を含まないことを確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-oy-global-policy",
    "https://global.oliveyoung.com/foot-info/footer-contents?foterMenuSeq=11",
    "official_page",
    "OLIVE YOUNG Global公式（英語）。返金は5〜10営業日、出荷準備中は変更・キャンセル不可、関税は受け取り人負担であることを確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-rakuten-oliveyoung-shipping",
    "https://www.rakuten.co.jp/oliveyoung/info2.html",
    "official_page",
    "楽天市場 OLIVE YOUNG公式店の配送・支払い案内。送料は0〜3,979円が500円、3,980円以上が0円、お届けまで10日程度、通関時の関税・輸入消費税は着払い、返品は到着後7日以内の連絡、キャンセルは入金完了・配送準備中のみ（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-royal-palaces",
    "https://royal.khs.go.kr/JPN/contents/J702000000.do",
    "official_page",
    "国家遺産庁 宮陵遺跡本部公式（日本語）。景福宮の観覧時間（3〜5月・9〜10月 09:00-18:00、6〜8月 09:00-18:30、11〜2月 09:00-17:00）、毎週火曜定休、大人3,000ウォン・団体2,400ウォン、65歳以上と18歳以下は無料（切符売り場で無料入場券を発券）、4大宮殿及び宗廟統合観覧券10,000ウォンを確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-sazo-forwarding",
    "https://sazo.shop/about/forwarding",
    "official_page",
    "SAZO公式（日本語）購入代行・転送サービスの案内。代行手数料は0円（代行手数料に限る）、日本への配送は佐川急便、韓国国内決済のみ・海外配送非対応のサイトでも購入できると案内、アプリ/LINE追加で送料クーポンの案内あり（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-visitkorea-dutyfree",
    "https://japanese.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140928",
    "official_page",
    "韓国観光公社公式（日本語）「免税制度と税金還付」。Duty Free／Tax Refund（事後免税）／Tax Free（即時還付）の違い、事後免税の条件（1回15,000ウォン以上・未開封未使用・購入日から3か月以内の出国・滞在6か月未満の外国人等）、空港と市内還付カウンターの使い分け（市内は600万ウォン以下の領収書）、仁川空港の還付カウンター・KIOSKの場所を確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-visitkorea-jeju-unesco",
    "https://japanese.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=139895",
    "official_page",
    "韓国観光公社公式。済州火山島と溶岩洞窟が2007年に世界自然遺産に登録、ハルラサンは標高1,947mで360のオルム（火山丘）を持つ、城山日出峰は海底火山の噴火で形成され日出の名所、万丈窟などの溶岩洞窟群の説明を確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-visitkorea-manjanggul",
    "https://japanese.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=111352&menuSn=351",
    "official_page",
    "韓国観光公社公式。万丈窟の利用時間09:00〜18:00（入場締め切り17:00）、住所（済州市旧左邑万丈窟路182）、駐車場あり・駐車料金無料を確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-visitkorea-communications",
    "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140041",
    "official_page",
    "韓国観光公社公式（英語）「Electricity & Communications」。韓国の電圧は220V/60Hzで2穴の丸型プラグ、仁川・金浦・金海・済州の主要空港にKT/SKT/LG U+のローミングセンターがありSIM購入・Wi-Fiレンタル・スマホレンタルが可能、USIMは空港・コンビニ（CU/GS25/7-Eleven/Emart24）・オンライン事前購入、eSIMはオンライン購入後にQRコードで設定し端末対応の確認が必要（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-visitkorea-driving",
    "https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=480&vcontsId=140664",
    "official_page",
    "韓国観光公社公式（英語）「Driving in Korea」。国際運転免許証（IDP）または相互認証された外国免許で入国日から最大1年間運転可、大手レンタカー会社は21歳以上・運転経験1年以上などの条件を設ける場合がある、必要書類はIDPとパスポート、保険は対人・対物が基本で自車保険はオプションの場合がある、左ハンドル・右側通行、距離はkm・速度はkm/h、ハイパスレーン注意。最終更新2026-10-08（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-gimhae-airport-access",
    "https://www.airport.co.kr/gimhaejpn/cms/frCon/index.do?MENU_ID=130",
    "official_page",
    "金海国際空港公式（日本語）。リムジンバスは海雲台・機張方面がクレジットカード9,500ウォン・始発07:10/最終21:40・約60分間隔、西面・釜田方面が6,000ウォン・約70分間隔。地下鉄は沙上駅で2号線、大渚駅で3号線に乗り換え（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-visitkorea-haeundae",
    "https://japanese.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=110997",
    "official_page",
    "韓国観光公社公式（日本語）。海雲台海水浴場の特徴（海岸線・水深・波、周辺に冬柏島・BEXCO・ホテル群）を確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-visitkorea-chagalchi",
    "https://japanese.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=459&vcontsId=70134",
    "official_page",
    "韓国観光公社公式（日本語）。チャガルチ市場（水産市場・活魚・刺身店）と南浦洞地下商店街など周辺の立地を確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-royal-changgyeonggung",
    "https://royal.khs.go.kr/JPN/contents/J702000000.do?schBdcode=cgg",
    "official_page",
    "国家遺産庁 宮陵遺跡本部公式（日本語）。昌慶宮の観覧時間09:00〜21:00（入場締め切り20:00）、毎週月曜定休、大人1,000ウォン・団体800ウォン、65歳以上と18歳以下は無料、案内スケジュール10:00/14:00を確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-nseoultower-fee",
    "https://www.nseoultower.co.kr/visit/use2.asp",
    "official_page",
    "Nソウルタワー公式（韓国語）。展望台の利用料金は大人（13歳以上）29,000ウォン、小人（3〜12歳）23,000ウォン、65歳以上は小人と同額、36か月未満は無料（保護者1名につき1名）、障がい者割引は1〜3級が本人＋同伴1名30%・4〜6級が本人30%（パッケージ・団体を除く）を確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-nseoultower-hours",
    "https://www.nseoultower.co.kr/visit/use.asp",
    "official_page",
    "Nソウルタワー公式（韓国語）。展望台の利用時間は平日10:00〜22:30、週末・祝日10:00〜23:00、年中無休、閉場30分前まで入場可、天候・運営都合で変更あり。館内のギフトショップ10:00〜22:00、Nテラス11:00〜20:00、Nバーガー11:00〜21:00、Nスイートバー10:00〜21:00、エングリル12:00〜22:00（注文締切20:00）、ザ・プレイス・ダイニング/トゥルミ粉食11:00〜22:00（注文締切21:00）を確認（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
  officialOn(
    "ev-royal-hanbok",
    "https://royal.khs.go.kr/JPN/contents/J701000000.do",
    "official_page",
    "国家遺産庁 宮陵遺跡本部公式（日本語）。韓服着用者の無料入場ガイドライン。景福宮・昌徳宮・徳寿宮・昌慶宮・宗廟が対象、上衣（チョゴリ）と下衣（チマまたはパジ）の両方着用が基本、トゥルマギのみ・ジーンズにチョゴリは不可（2026-11-17確認）。",
    "2026-11-17T09:00:00.000Z",
  ),
];
