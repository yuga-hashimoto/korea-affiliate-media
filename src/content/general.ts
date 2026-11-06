import type { Article } from "@/lib/domain";

const UPDATED_AT = "2026-11-06T09:00:00.000Z";
const PUBLISHED_AT = "2026-11-06T09:00:00.000Z";

export const generalArticles: Article[] = [
  {
    slug: "korea-travel-checklist",
    title: "韓国旅行の準備チェックリスト｜通信・交通・決済・持ち物",
    description:
      "韓国旅行前に確認したい通信手段、空港からの交通、決済方法、持ち物、予約の控えをチェックリスト形式で整理します。",
    category: "experience",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-arex-official", "ev-customs-jp"],
    sections: [
      {
        heading: "出発1週間前まで",
        paragraphs: [
          "パスポートの有効期限、航空券の予約控え、宿泊先の住所（現地語表記）、eSIMまたはローミングの手配、海外旅行保険の加入を確認します。",
          "eSIMは購入後にQRコードを紛失しないよう、スクリーンショットを端末外にも保管します。設定は出発前に自宅Wi-Fiで済ませ、現地で慌てないようにします。",
        ],
      },
      {
        heading: "決済と両替",
        paragraphs: [
          "クレジットカードの海外利用可否と暗証番号、海外事務手数料を確認します。現金は少額から用意し、両替は空港と市内でレートが異なることを前提にします。",
          "カードのタッチ決済が使える店舗が増えていますが、すべての店舗で使えるわけではありません。予備の支払い手段を持つと安心です。",
        ],
      },
      {
        heading: "現地での移動",
        paragraphs: [
          "空港から市内への移動は、到着時刻と荷物量で選びます。交通系ICカードの利用可否、チャージ方法、深夜の運行状況を事前に確認します。",
          "公式の運賃・時刻は変更されるため、旅行直前に公式サイトで確認してください。",
        ],
      },
      {
        heading: "帰国前の確認",
        paragraphs: [
          "購入した化粧品などの輸入品は、数量や金額によって税の対象になる場合があります。税関の公式情報を確認し、必要に応じて申告します。",
          "免税店での購入は、出国時の手続きと持ち出し条件を確認してください。",
        ],
      },
    ],
    faq: [
      {
        question: "eSIMとWi-Fiルーターのどちらがよいですか？",
        answer:
          "1人ならeSIM、複数端末や同行者と共有するならルーターが向く場合があります。総額とバッテリー・返却の手間で比較してください。",
      },
    ],
    related: ["korea-esim-total-cost", "incheon-airport-to-seoul"],
    hubPath: "/korea/travel",
  },
  {
    slug: "korea-fashion-shipping-returns",
    title: "韓国ファッション通販の送料・返品費用｜総額で比べる注意点",
    description:
      "韓国ファッションを通販で購入する際の送料、関税、サイズ違いの返品送料、為替の扱いを整理。総額比較の注意点を解説します。",
    category: "fashion",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-customs-jp"],
    sections: [
      {
        heading: "サイズ・素材情報の確認",
        paragraphs: [
          "海外通販では、日本サイズとの対応表がブランドごとに異なります。実寸（着丈・肩幅・バスト）を確認し、モデル身長との比較で判断します。",
          "素材・洗濯表示・伸縮性は写真だけでは判断しにくい項目です。返品条件とあわせて確認してください。",
        ],
      },
      {
        heading: "送料と返品送料",
        paragraphs: [
          "購入時の送料に加えて、サイズ交換・返品時の返送料がかかります。海外への返送は国内より高額になり、追跡なしの返送が認められない場合もあります。",
          "返品期限・返送先・返金方法・返金までの日数を確認し、総額比較に「返品リスク」として明記します。",
        ],
      },
      {
        heading: "関税と為替",
        paragraphs: [
          "衣類の輸入には関税・輸入消費税がかかる場合があります。商品価格・数量・用途によって扱いが異なるため、税関の公式情報を確認します。",
          "為替レートは決済時に確定します。サイト上の円換算は目安であり、請求額を保証するものではありません。",
        ],
      },
    ],
    faq: [
      {
        question: "返品送料は誰が負担しますか？",
        answer:
          "販売サイトの規約によります。サイズ交換でも往復送料が購入者負担となる場合があります。注文前に確認してください。",
      },
    ],
    related: ["korea-beauty-shipping-customs"],
    hubPath: "/korea/fashion",
  },
  {
    slug: "korea-sale-calendar",
    title: "韓国コスメのセール時期はいつ？確認できる情報だけをまとめる",
    description:
      "韓国コスメのセール時期に関する情報を、確認できる公式情報だけに限定して整理する準備中の記事です。",
    category: "beauty",
    status: "draft",
    aiGenerated: false,
    reviewedAt: null,
    publishedAt: null,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-stale-oliveyoung"],
    sections: [
      {
        heading: "この記事は下書きです",
        paragraphs: [
          "セール時期・割引率・クーポン条件は販売事業者ごとに異なり、公式情報の確認が必要です。根拠が揃うまで公開しません。",
          "公開条件: 各事業者の公式キャンペーンページの確認日時、対象商品、適用条件、終了日時を記録できた時点で公開します。",
        ],
      },
    ],
    faq: [],
    related: ["oliveyoung-vs-japan-shipping"],
    hubPath: "/korea/beauty",
  },
];
