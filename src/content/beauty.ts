import type { Article } from "@/lib/domain";

const UPDATED_AT = "2026-11-06T09:00:00.000Z";
const PUBLISHED_AT = "2026-11-06T09:00:00.000Z";

export const beautyArticles: Article[] = [
  {
    slug: "oliveyoung-vs-japan-shipping",
    title: "OLIVE YOUNG Globalと国内通販、送料込みで比べる方法",
    description:
      "韓国コスメをOLIVE YOUNG Globalなど海外通販で買う場合と国内通販で買う場合の総額比較。送料・関税・為替・クーポン条件の確認手順を解説します。",
    category: "beauty",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-stale-oliveyoung", "ev-customs-jp"],
    sections: [
      {
        heading: "比較の出発点は「商品単価＋送料＋税金」",
        paragraphs: [
          "海外通販の商品単価が安くても、送料・関税・輸入消費税・決済手数料が加わると国内通販より高くなる場合があります。商品ごとに、実際に支払う総額を並べて比較します。",
          "本サイトでは、価格が確認できない項目を0円として扱いません。未確認の項目があれば「確認済み項目の最低額」として表示します。",
        ],
      },
      {
        heading: "関税・輸入消費税の扱い",
        paragraphs: [
          "個人使用目的の輸入でも、商品の価格・数量・内容によって税がかかる場合があります。課税の有無や税率は条件で変わるため、税関の公式情報を確認してください。",
          "「免税される」と断定せず、注文ごとに条件を確認する前提で表示します。制度は変更される可能性があるため、確認日時を明記します。",
        ],
      },
      {
        heading: "為替と決済通貨",
        paragraphs: [
          "海外通販では、販売通貨と決済通貨が異なることがあります。カード会社の為替レートと海外事務手数料がかかる場合があり、サイト上の円換算額は目安です。",
          "比較表には販売通貨・換算レート・観測日時を表示し、同じ日のレートで揃えて比較します。",
        ],
      },
      {
        heading: "クーポン・ポイントの扱い",
        paragraphs: [
          "初回購入割引や会員限定クーポンは、適用条件が確認できない限り総額に反映しません。条件が確認できた場合だけ、閾値・上限・有効期限を確認して適用します。",
          "ポイントは次回以降の支払いに使えるもので、今回の支払額とは異なります。本サイトでは原則として別表示にします。",
        ],
      },
    ],
    faq: [
      {
        question: "海外通販の方が安いですか？",
        answer:
          "商品・数量・送料・関税・為替の条件で変わります。条件を揃えた総額で比較してください。当サイトは一律の優劣を示しません。",
      },
      {
        question: "クーポンは自動で適用されますか？",
        answer:
          "適用条件を確認できたクーポンのみ総額に反映します。条件未確認のクーポンは「未適用」として表示します。",
      },
    ],
    related: ["korea-beauty-shipping-customs", "korean-serum-price-per-ml"],
    hubPath: "/korea/beauty",
  },
  {
    slug: "korea-beauty-shipping-customs",
    title: "韓国コスメの送料・関税・為替の見方｜総額が変わる要因",
    description:
      "韓国コスメを通販で買うときに総額が変動する要因を整理。送料体系、関税・輸入消費税、為替、決済手数料、返品送料の確認方法を解説します。",
    category: "beauty",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-customs-jp"],
    sections: [
      {
        heading: "送料は「無料」の条件を確認する",
        paragraphs: [
          "「送料無料」と表示されていても、一定金額以上の購入が条件の場合があります。複数商品をまとめると条件を満たすこともあれば、重量・容積で追加料金がかかることもあります。",
          "送料が商品ごとか、注文全体で一律かによって、まとめ買いの有利さが変わります。比較表では送料を独立した項目として表示します。",
        ],
      },
      {
        heading: "関税・輸入消費税は条件で変わる",
        paragraphs: [
          "輸入品には、関税・輸入消費税・通関手数料がかかる場合があります。課税か非課税かは商品価格・数量・用途などで判断され、一律ではありません。",
          "税関の公式情報で最新の制度を確認し、確認日時を記録します。当サイトは税額を推測して確定額に含めません。",
        ],
      },
      {
        heading: "為替・決済・返品のコスト",
        paragraphs: [
          "海外通販では為替レートと海外事務手数料が別途かかります。返品時の送料は購入者が負担する場合が多く、返品条件も販売サイトごとに異なります。",
          "返品・交換の可否、返送先、返送料、期限を確認してから注文してください。",
        ],
      },
    ],
    faq: [
      {
        question: "関税は必ずかかりますか？",
        answer:
          "商品・数量・金額などの条件により異なります。税関の公式情報を確認し、条件が不明な場合はUNKNOWNとして扱ってください。",
      },
    ],
    related: ["oliveyoung-vs-japan-shipping", "korean-serum-price-per-ml"],
    hubPath: "/korea/beauty",
  },
  {
    slug: "korean-serum-price-per-ml",
    title: "韓国美容液は「1mLあたり」で比べる｜容量と総額の計算",
    description:
      "韓国コスメの美容液を比較するときの容量単価の計算方法。セット販売・サンプル付き・送料込み総額の扱いを整理します。",
    category: "beauty",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-caa-stealth"],
    sections: [
      {
        heading: "容量単価の計算式",
        paragraphs: [
          "1mLあたりの価格 = 送料・税・手数料を含む総額 ÷ 内容量(mL)。セット販売では、付属品を含む総容量で割るか、本体のみで割るかを明記して比較します。",
          "容量あたりで見ると、大容量サイズが割安とは限らないことが分かります。使用期限や使い切れる量も判断材料にしてください。",
        ],
      },
      {
        heading: "セット・サンプルの扱い",
        paragraphs: [
          "サンプルやミニサイズが付く場合、その分を価格に織り込むかどうかで比較結果が変わります。当サイトでは、公式に内容量が確認できるものだけを計算に含めます。",
          "「おまけ付き」の表示だけで容量を推定せず、未確認の場合は計算から除外して注記します。",
        ],
      },
      {
        heading: "成分・効能の表現について",
        paragraphs: [
          "化粧品の効能効果には表現上の制約があります。当サイトは「シミが消える」「必ず肌が変わる」といった断定表現を掲載しません。",
          "成分表示は公式情報の範囲で引用し、判断は利用者と専門家に委ねます。価格比較と使用感の評価は分けて扱います。",
        ],
      },
    ],
    faq: [
      {
        question: "大容量の方がお得ですか？",
        answer:
          "1mLあたりで比較すると、小容量の方が安い場合もあります。使用期限内に使い切れるかも含めて判断してください。",
      },
    ],
    related: ["oliveyoung-vs-japan-shipping", "korea-beauty-shipping-customs"],
    hubPath: "/korea/beauty",
  },
];
