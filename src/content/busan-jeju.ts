import type { Article } from "@/lib/domain";

const UPDATED_AT = "2026-11-06T09:00:00.000Z";
const PUBLISHED_AT = "2026-11-06T09:00:00.000Z";

export const busanJejuArticles: Article[] = [
  {
    slug: "busan-1night-2days-model-course",
    title: "釜山1泊2日モデルコース｜海と市場を楽しむ定番ルート",
    description:
      "釜山を1泊2日で楽しむモデルコース。海雲台・広安里・南浦洞・甘川文化村の回り方と、移動時間・食事のポイントをまとめます。",
    category: "busan",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea-busan", "ev-korail"],
    sections: [
      {
        heading: "1日目：海雲台と広安里",
        paragraphs: [
          "釜山駅または金海空港から海雲台へ移動し、海岸沿いを散策します。海雲台はビーチと商業施設が近く、到着日の拠点にしやすいエリアです。",
          "夕方は広安里方面へ移動し、海岸の夜景と食事を楽しむ流れが定番です。週末は混雑するため、夕食の時間を少し早めにすると待ち時間を避けやすくなります。",
        ],
      },
      {
        heading: "2日目：南浦洞・甘川文化村",
        paragraphs: [
          "午前中に甘川文化村を訪れ、午後に南浦洞・国際市場周辺を歩くルートが組みやすいです。坂道と階段が多いため、歩きやすい靴で向かってください。",
          "市場の営業時間や店休日は店舗ごとに異なります。公式情報や現地の表示を確認しましょう。",
        ],
      },
      {
        heading: "移動の注意点",
        paragraphs: [
          "釜山の地下鉄は路線数が限られるため、目的地によってはバスやタクシーの併用が効率的です。交通カードはソウルと共通で使える場合がありますが、種類によって対応が異なります。",
          "KTXでソウルから移動する場合、予約は早めに。週末や連休は満席になりやすいです。",
        ],
      },
    ],
    faq: [
      {
        question: "ソウルから日帰りで釜山へ行けますか？",
        answer:
          "移動時間が往復で長くなるため、釜山の滞在時間は短くなります。1泊して朝と夜を楽しむほうが満足度は高いです。",
      },
      {
        question: "釜山のホテルはどこに取ればよいですか？",
        answer:
          "海雲台はリゾート感、南浦洞は市場と観光地へのアクセスが強みです。旅程に合わせて選んでください。",
      },
    ],
    related: ["busan-jeju-access", "seoul-2nights-3days-model-course", "korea-travel-checklist"],
    tags: ["釜山", "モデルコース", "1泊2日", "海雲台"],
    hubPath: "/korea/travel/busan",
    imageAlt: null,
  },
  {
    slug: "jeju-2nights-3days-model-course",
    title: "済州島2泊3日モデルコース｜自然とカフェを巡る",
    description:
      "済州島を2泊3日で巡るモデルコース。レンタカーが必要な理由、エリアの分け方、天候による変更ポイントをまとめます。",
    category: "jeju",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visit-jeju", "ev-kma"],
    sections: [
      {
        heading: "済州島は移動手段が鍵",
        paragraphs: [
          "済州島はバス路線もありますが、観光地が広く分散しているため、レンタカーがあると行動範囲が広がります。運転には国際運転免許証など必要な書類を確認してください。",
          "レンタカーを使わない場合は、主要スポットを絞り、バスとタクシーを組み合わせる計画にします。",
        ],
      },
      {
        heading: "東側と西側で1日ずつ",
        paragraphs: [
          "1日目は済州国際空港周辺と西側（涯月・挟才方面）、2日目は東側（城山・牛島方面）という分け方が組みやすいです。移動距離が長いので、1日に詰め込みすぎないようにします。",
          "天候によりフェリーや遊歩道が運休・閉鎖される場合があります。公式情報を確認し、代替案を用意してください。",
        ],
      },
      {
        heading: "3日目は空港周辺で余裕を持つ",
        paragraphs: [
          "帰国便の時間から逆算し、空港周辺で買い物と食事を済ませると安心です。レンタカーの返却時間とガソリン給油の場所を事前に確認します。",
        ],
      },
    ],
    faq: [
      {
        question: "済州島は何日あれば十分ですか？",
        answer:
          "主要スポットを回るなら2泊3日が目安です。ゆっくり巡るなら3泊4日あると余裕が生まれます。",
      },
      {
        question: "雨の日は何をしますか？",
        answer:
          "博物館・美術館・カフェ・市場など屋内施設を中心に組み替えます。屋外の自然スポットは別日に回してください。",
      },
    ],
    related: ["busan-jeju-access", "seoul-cafe-guide", "korea-season-and-packing"],
    tags: ["済州島", "モデルコース", "2泊3日", "レンタカー"],
    hubPath: "/korea/travel/jeju",
    imageAlt: null,
  },
  {
    slug: "busan-jeju-access",
    title: "ソウルから釜山・済州への行き方｜KTX・飛行機・フェリー",
    description:
      "ソウルから釜山・済州島への移動手段を比較。KTX・国内線・フェリーの所要時間と予約の注意点、荷物と空港アクセスを整理します。",
    category: "transport",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-korail", "ev-visit-jeju"],
    sections: [
      {
        heading: "ソウル→釜山はKTXが基本",
        paragraphs: [
          "ソウル駅から釜山駅へはKTXで移動するのが一般的です。所要時間は列車種別で変わるため、予約時に確認してください。週末や連休は早めの予約が必要です。",
          "ソウル駅には地下鉄・空港鉄道が乗り入れています。出発の30分以上前に到着できるよう、移動時間を見積もってください。",
        ],
      },
      {
        heading: "済州島へは飛行機",
        paragraphs: [
          "ソウルから済州島へは金浦空港発の国内線が便利です。LCCを含め複数の航空会社が運航しています。荷物の重量制限は航空会社ごとに異なるため、予約前に確認します。",
          "済州空港から市内・観光地へはバス・タクシー・レンタカーで移動します。到着時間が遅い場合は、交通手段が限られることに注意してください。",
        ],
      },
      {
        heading: "釜山→済州のフェリー",
        paragraphs: [
          "釜山から済州へはフェリーも利用できますが、所要時間が長く、天候による欠航リスクがあります。日程に余裕がある場合の選択肢です。",
          "運航状況・予約方法は各社の公式情報を確認してください。",
        ],
      },
    ],
    faq: [
      {
        question: "KTXはいつ予約すればよいですか？",
        answer:
          "週末・連休は満席になりやすいため、旅程が決まった時点で予約するのが安心です。",
      },
      {
        question: "済州島でレンタカーなしは厳しいですか？",
        answer:
          "主要スポットを絞ればバスとタクシーでも回れますが、移動に時間がかかります。レンタカーがあると自由度は高まります。",
      },
    ],
    related: ["busan-1night-2days-model-course", "jeju-2nights-3days-model-course", "incheon-airport-to-seoul"],
    tags: ["釜山", "済州島", "KTX", "国内線", "移動"],
    hubPath: "/korea/travel",
    imageAlt: null,
  },
];
