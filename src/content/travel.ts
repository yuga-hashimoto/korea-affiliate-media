import type { Article } from "@/lib/domain";

const UPDATED_AT = "2026-11-06T09:00:00.000Z";
const PUBLISHED_AT = "2026-11-06T09:00:00.000Z";

export const travelArticles: Article[] = [
  {
    slug: "korea-esim-total-cost",
    title: "韓国eSIMの総額比較｜価格だけで選ばないための確認項目",
    description:
      "韓国旅行用eSIMを「表示価格」ではなく総支払額で比べる方法を解説。為替・税・手数料・有効期限・端末対応の確認手順をまとめます。",
    category: "esim",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-airalo-official"],
    sections: [
      {
        heading: "結論：比べるべきは「円換算した総額」と「使える条件」",
        paragraphs: [
          "韓国旅行用eSIMは、販売サイトの表示価格だけでは実際の支払額を判断できません。通貨・税の扱い・決済手数料・為替レートの適用時点で数十円から数百円の差が出るため、円換算した総額と適用条件をセットで確認します。",
          "本サイトでは、価格が確認できない項目を0円として扱いません。未確認の項目がある場合は「確認済み項目の最低額」として表示し、確定した最安とは書きません。",
        ],
      },
      {
        heading: "比較前に揃える条件",
        paragraphs: [
          "日数・データ容量・利用人数・テザリング可否・対応端末（eSIM対応）/SIMロックの有無を揃えます。5日3GBと7日5GBでは条件が違うため、そのまま並べても意味のある比較になりません。",
          "到着日に設定したい場合は、購入からQRコード発行までの時間、現地での開通手順、サポートの言語と対応時間も確認します。価格が同じでも、現地で開通できないと旅程全体に影響します。",
        ],
      },
      {
        heading: "総額の計算式（このサイトの表示ルール）",
        paragraphs: [
          "総額 = 本体価格 + 送料 + 税金 + 手数料 − 適用条件を満たすクーポン。外貨建ての場合は、各項目を同じ為替レートで円換算し、換算レートと観測時刻を併記します。",
          "税込表記の商品に税金を二重計上しない、会員限定クーポンを誰でも使える前提にしない、有効期限切れの割引を反映しない、という3点を表示ルールとして固定しています。",
        ],
      },
      {
        heading: "見落としやすい落とし穴",
        paragraphs: [
          "「◯日間」が購入日基準か現地利用開始日基準かで、実質使える期間が変わります。また、複数国対応プランと韓国専用プランでは料金体系が異なります。",
          "返金・キャンセル条件、利用開始後のサポート、通信速度制限（一定容量後の速度）も比較対象です。価格の安さだけで選ぶと、旅程中のトラブル対応コストが上回ることがあります。",
        ],
      },
    ],
    faq: [
      {
        question: "表示価格が安いeSIMを選べばよいですか？",
        answer:
          "いいえ。通貨・税・手数料・為替の適用条件を揃えて円換算した総額で比較してください。未確認項目がある場合は「最安」と断定できません。",
      },
      {
        question: "為替レートはいつ時点のものを使いますか？",
        answer:
          "観測日時を明記したレートを使用します。決済時のレートはカード会社等により異なるため、表示額は目安として扱ってください。",
      },
    ],
    related: ["korea-esim-days-gb-guide", "korea-travel-checklist"],
    hubPath: "/korea/travel/esim",
  },
  {
    slug: "korea-esim-days-gb-guide",
    title: "韓国eSIMの日数と容量の選び方｜3日・5日・7日の使い分け",
    description:
      "韓国旅行の日数別に、eSIMのデータ容量と期間をどう選ぶかを整理。地図・動画・SNSの利用目安と、容量不足時の追加購入リスクを解説します。",
    category: "esim",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-airalo-official"],
    sections: [
      {
        heading: "日数は「滞在日数＋予備」で考える",
        paragraphs: [
          "eSIMの有効期間は購入日から起算するもの、現地ネットワーク接続時から起算するものがあります。到着が深夜の場合や、帰国日の移動が多い場合は、滞在日数に1日足した期間を選ぶと余裕が生まれます。",
          "ただし長い期間のプランが常に得とは限りません。3日と5日の差額が小さい場合もあれば、7日プランだけ割高な場合もあります。総額比較では同じ日数のプラン同士を比べ、必要なら期間違いの差額も確認します。",
        ],
      },
      {
        heading: "容量の目安",
        paragraphs: [
          "地図・メッセージ・乗換案内中心なら1日あたり数百MBで足りる場合が多く、写真のアップロードや動画視聴をすると数GBを使います。ホテルのWi-Fiを併用できるかどうかで必要量は大きく変わります。",
          "SNSのライブ配信や動画通話を予定している場合は、実測消費が大きくなります。テザリングでPCや同行者の端末をつなぐなら、人数分の余裕を見てください。",
        ],
      },
      {
        heading: "容量切れのコストを比較に入れる",
        paragraphs: [
          "容量を使い切った後の追加購入やチャージの価格は、プランごとに条件が異なります。追加購入ができないプランもあります。",
          "総額比較では「基本料金＋想定追加購入」を条件別に試算しますが、追加購入の可否・価格が未確認の場合はUNKNOWNとして表示し、確定額には含めません。",
        ],
      },
    ],
    faq: [
      {
        question: "5日間の旅行なら5日プランで足りますか？",
        answer:
          "移動日を含めた通信日数と、プランの起算方法によります。現地到着が深夜の場合は1日多めのプランが安全です。",
      },
    ],
    related: ["korea-esim-total-cost", "korea-travel-checklist"],
    hubPath: "/korea/travel/esim",
  },
  {
    slug: "seoul-budget-2nights-3days",
    title: "ソウル2泊3日の予算の立て方｜項目別に試算する手順",
    description:
      "ソウル2泊3日の旅行予算を、航空券・宿泊・現地交通・食費・通信・体験費に分けて試算する手順。変動費と固定費を分け、自分の条件で計算する方法を解説します。",
    category: "experience",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-arex-official", "ev-airalo-official"],
    sections: [
      {
        heading: "固定費と変動費を分ける",
        paragraphs: [
          "航空券と宿泊は日程で大きく変わる変動費、eSIMや空港交通は比較的読みやすい固定費です。最初に固定費を確定し、残りを食費・体験費に配分すると、予算の破綻を避けやすくなります。",
          "本サイトでは金額を一律の「相場」として提示しません。日程・人数・出発地が同じ条件での比較だけを行い、条件が異なる金額を並べて順位付けしない方針です。",
        ],
      },
      {
        heading: "計算に含める項目",
        paragraphs: [
          "航空券（燃油サーチャージ・空港税・手数料を含む総額）、宿泊（税・サービス料・清掃料を含む総額）、空港から市内への交通、eSIM、旅行保険、現地交通、食費、体験・入場料、みやげ代を項目として分けます。",
          "予約サイトの表示額に含まれない現地徴収税やリゾートフィーは、未確認ならUNKNOWNとして別枠に残します。0円として合計に混ぜません。",
        ],
      },
      {
        heading: "為替と決済通貨の扱い",
        paragraphs: [
          "現地決済はカード会社の為替レートと海外事務手数料が適用されます。サイト上の円換算額は観測時点の目安であり、実際の請求額とは一致しません。",
          "現地通貨で支払うか円建てで支払うかで、手数料の負担が変わります。比較表には販売通貨と換算レートの観測日時を表示します。",
        ],
      },
    ],
    faq: [
      {
        question: "予算はいくらと表示しないのですか？",
        answer:
          "出発地・時期・人数・宿泊グレードで大きく変動し、根拠のない一律の金額を示すと誤解を招くためです。条件を入力して試算する形にしています。",
      },
    ],
    related: ["korea-travel-checklist", "incheon-airport-to-seoul"],
    hubPath: "/korea/travel",
  },
  {
    slug: "incheon-airport-to-seoul",
    title: "仁川空港からソウル市内への交通比較｜総額と所要時間で選ぶ",
    description:
      "仁川空港からソウル市内への移動手段を、運賃・所要時間・乗り換え・荷物・深夜到着の観点で比較する方法。公式情報の確認手順も解説します。",
    category: "transport",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-arex-official"],
    sections: [
      {
        heading: "比較する4つの軸",
        paragraphs: [
          "空港から市内への移動は、運賃だけでなく、所要時間、乗り換え回数、荷物の扱い、到着時刻で評価します。深夜・早朝は運行時間の制約があり、選択肢が減ります。",
          "鉄道は定時性が高く、空港バスは荷物が多い場合に乗り換えが少ない利点があります。タクシーは人数が多い場合に1人あたりで見ると割安になることがありますが、渋滞の影響を受けます。",
        ],
      },
      {
        heading: "総額に含めるもの",
        paragraphs: [
          "運賃に加えて、空港内の移動、乗り換え時の追加運賃、深夜割増、予約手数料、カード決済手数料を確認します。グループ移動では人数分を掛けた総額で比較します。",
          "本サイトでは実際の運賃を推測して掲載しません。公式サイトで確認できた運賃のみを表示し、確認できない場合はUNKNOWNとします。",
        ],
      },
      {
        heading: "公式情報の確認手順",
        paragraphs: [
          "空港鉄道・空港バス・タクシー運賃は、各運行事業者の公式サイトで確認します。料金改定や割引の有無は時期で変わるため、旅行直前に再確認してください。",
          "公式サイトの情報を確認した日時を記録し、古い情報は「要再確認」として表示します。",
        ],
      },
    ],
    faq: [
      {
        question: "空港鉄道と空港バスのどちらが得ですか？",
        answer:
          "運賃・所要時間・乗り換え回数・荷物量で変わります。1人なら鉄道、荷物が多い少人数ならバスやタクシーが向く場合があります。公式運賃を確認して総額で比較してください。",
      },
    ],
    related: ["seoul-budget-2nights-3days", "korea-travel-checklist"],
    hubPath: "/korea/travel/airport-transport",
  },
  {
    slug: "myeongdong-vs-hongdae",
    title: "明洞と弘大どっちに泊まる？費用と移動で比較する",
    description:
      "ソウル旅行の宿泊エリア選びで迷う明洞と弘大を、宿泊費・食事・買い物・空港アクセス・夜間の移動の観点で比較します。",
    category: "hotel",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-arex-official"],
    sections: [
      {
        heading: "結論：旅程の中心がどこかで決める",
        paragraphs: [
          "初めてのソウルで観光地を回るなら明洞が移動の起点になりやすく、カフェ・ライブハウス・古着など弘大エリアを目的にするなら弘大泊が効率的です。",
          "宿泊費は時期とグレードで変動するため、エリアの優劣を一律に断定しません。同じ日程・人数・グレードで比較した総額と、移動時間・交通費を合わせて判断します。",
        ],
      },
      {
        heading: "宿泊費以外にかかる費用",
        paragraphs: [
          "エリアによって、空港からの交通費、地下鉄の乗車回数、食事の単価、買い物のしやすさが変わります。宿泊費が安くても移動費が高い場合、総額では逆転することがあります。",
          "ホテル予約サイトの表示額には、税・サービス料・清掃料が含まれない場合があります。予約確定画面で総額を確認してください。",
        ],
      },
      {
        heading: "比較表の読み方",
        paragraphs: [
          "本サイトの比較表は、本体価格・税金・手数料・クーポンを分けて表示します。未確認の項目がある行は順位付けから外れ、「UNKNOWN」と表示されます。",
          "「税込」「税別」の混在に注意してください。税別表示の宿泊費は、総額に税を加算して比較します。",
        ],
      },
    ],
    faq: [
      {
        question: "初めてのソウルなら明洞がよいですか？",
        answer:
          "観光の起点としては便利なエリアです。ただし宿泊費・空港アクセス・行きたい場所を総合して判断してください。",
      },
    ],
    related: ["hotel-booking-fees-checklist", "incheon-airport-to-seoul"],
    hubPath: "/korea/travel/hotels",
  },
  {
    slug: "hotel-booking-fees-checklist",
    title: "ホテル予約で見落とす税金・手数料・キャンセル条件の確認リスト",
    description:
      "韓国ホテル予約時に表示価格と実際の支払額がずれる原因を整理。税金・サービス料・清掃料・現地徴収・キャンセル規定の確認手順をまとめます。",
    category: "hotel",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-tripcom-official"],
    sections: [
      {
        heading: "表示価格と支払額がずれる主な原因",
        paragraphs: [
          "予約サイトの検索結果には税抜価格が表示され、確定画面で税金・サービス料が加算される場合があります。現地で徴収されるホテル税やリゾートフィーが別枠のこともあります。",
          "通貨が現地通貨のまま決済される場合、カード会社の為替レートと海外事務手数料が加算されます。表示された円額は保証されません。",
        ],
      },
      {
        heading: "予約前に確認する項目",
        paragraphs: [
          "支払総額（税・サービス料・清掃料込みか）、現地徴収の有無、キャンセル可能期限と手数料、朝食の有無と価格、チェックイン時間、追加ベッド・幼児の扱いを確認します。",
          "「無料キャンセル」と表示されていても期限を過ぎると全額請求になる場合があります。期限のタイムゾーンも確認してください。",
        ],
      },
      {
        heading: "比較時のルール",
        paragraphs: [
          "税込・税別、朝食付き・なし、キャンセル条件を揃えないと意味のある比較になりません。条件が異なる場合は順位を付けず、条件の違いを明示します。",
          "本サイトでは、未確認の現地税を0円として計算しません。UNKNOWNとして残し、比較対象から外します。",
        ],
      },
    ],
    faq: [
      {
        question: "「無料キャンセル」なら安心ですか？",
        answer:
          "期限とタイムゾーン、返金までの日数を確認してください。期限後の手数料が全額になる場合があります。",
      },
    ],
    related: ["myeongdong-vs-hongdae", "seoul-budget-2nights-3days"],
    hubPath: "/korea/travel/hotels",
  },
];
