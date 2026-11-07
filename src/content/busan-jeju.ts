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
  {
    slug: "busan-haeundae-guide",
    title: "海雲台・広安里エリアガイド｜釜山の海を楽しむ歩き方",
    description:
      "釜山の海雲台と広安里を中心に、海岸散策・食事・移動のポイントを紹介。ビーチ沿いのホテル選びと、混雑を避ける時間帯もまとめます。",
    category: "busan",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea-busan", "ev-seoulmetro"],
    sections: [
      {
        heading: "海雲台は「歩いて楽しい」エリア",
        paragraphs: [
          "海雲台はビーチ沿いに遊歩道が整備され、ホテル・飲食店・商業施設が徒歩圏に集まっています。到着日にホテルへ荷物を置いて、海沿いを散策するだけで釜山らしさを感じられます。",
          "夏は海水浴客で混雑します。遊泳可能エリアや監視員の配置は時期・時間で変わるため、現地の案内に従ってください。",
        ],
      },
      {
        heading: "広安里と夜景",
        paragraphs: [
          "広安大橋を望む広安里は、夕方から夜にかけて人気が高まります。海岸沿いのカフェや食堂で食事をしながら、橋のライトアップを楽しむのが定番です。",
          "週末や連休は混雑するため、夕食の時間を早めにすると待ち時間を減らせます。",
        ],
      },
      {
        heading: "移動とホテル選び",
        paragraphs: [
          "海雲台と広安里は地下鉄で移動できますが、駅から海岸まで少し歩きます。荷物が多い場合はタクシーも選択肢です。",
          "ホテルは駅近くか海岸沿いかで利便性が変わります。深夜のチェックイン可否と荷物預かりも確認しておきましょう。",
        ],
      },
    ],
    faq: [
      {
        question: "海雲台と広安里は1日で回れますか？",
        answer:
          "午後に海雲台、夕方から広安里という組み方なら無理なく回れます。夏の混雑期は移動時間に余裕を持ってください。",
      },
      {
        question: "海水浴はいつごろできますか？",
        answer:
          "海開きの時期は年によって異なります。公式の案内を確認してください。",
      },
    ],
    related: ["busan-1night-2days-model-course", "busan-food-guide", "busan-cafe-guide"],
    tags: ["釜山", "海雲台", "広安里", "エリア"],
    hubPath: "/korea/travel/busan",
    imageAlt: null,
  },
  {
    slug: "busan-food-guide",
    title: "釜山グルメガイド｜市場と食堂で食べるべきもの",
    description:
      "釜山の市場・食堂・屋台で食事を楽しむための基本。注文の流れ、現金とカード、混雑時間、食事のマナーをまとめます。",
    category: "busan",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea-busan"],
    sections: [
      {
        heading: "市場は午前から昼が狙い目",
        paragraphs: [
          "釜山の市場は午前から昼にかけて活気づきます。食堂や屋台の営業時間は店ごとに異なるため、遅い時間に向かう場合は事前に確認してください。",
          "市場内は現金のみの店もあります。少額の現金を用意し、カードと併用できるようにしておくと安心です。",
        ],
      },
      {
        heading: "食堂での注文",
        paragraphs: [
          "メニューを指差して注文するのが簡単です。辛さの調整ができる店もありますが、すべての店で対応できるわけではありません。",
          "会計はレジで行う店と席で支払う店があります。案内に従ってください。",
        ],
      },
      {
        heading: "食事のマナー",
        paragraphs: [
          "取り皿を共有する文化があるため、取り分け用の皿や箸を使います。おかわり無料の店もありますが、店舗によって異なります。",
          "アレルギーや宗教上の制限がある場合は、素材を確認できる店を選びましょう。",
        ],
      },
    ],
    faq: [
      {
        question: "釜山ならではの食事は？",
        answer:
          "魚介類・市場グルメ・屋台など選択肢が幅広いです。苦手な食材がある場合は注文前に確認してください。",
      },
      {
        question: "チップは必要ですか？",
        answer: "韓国では一般的にチップの習慣はありません。",
      },
    ],
    related: ["busan-haeundae-guide", "busan-1night-2days-model-course", "seoul-food-guide"],
    tags: ["釜山", "グルメ", "市場", "屋台"],
    hubPath: "/korea/food",
    imageAlt: null,
  },
  {
    slug: "busan-cafe-guide",
    title: "釜山カフェガイド｜海を眺めるカフェと街歩き",
    description:
      "釜山のカフェを、海沿い・街中・落ち着いたエリアの3つに分けて紹介。注文のコツ、混雑時間、移動の注意点をまとめます。",
    category: "cafe",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea-busan"],
    sections: [
      {
        heading: "海沿いカフェは夕方が人気",
        paragraphs: [
          "海雲台・広安里・松亭などには、海を眺められるカフェがあります。夕方から夜にかけて混雑しやすいため、早めの時間か平日がおすすめです。",
          "テラス席は天候の影響を受けます。強風や雨の日は室内席を選べるか確認してください。",
        ],
      },
      {
        heading: "街中のカフェとベーカリー",
        paragraphs: [
          "南浦洞・西面などの中心街には、ベーカリー併設のカフェや小さな喫茶店が多くあります。買い物の合間に立ち寄るのに便利です。",
          "電源・Wi-Fiの有無は店舗ごとに異なります。長時間の滞在は混雑状況に配慮しましょう。",
        ],
      },
      {
        heading: "注文と移動",
        paragraphs: [
          "レジで先に注文する形式が一般的です。テイクアウトの可否と容器代の有無を確認してください。",
          "坂道や階段が多いエリアもあるため、歩きやすい靴で向かうと安心です。",
        ],
      },
    ],
    faq: [
      {
        question: "釜山のカフェは1人でも入りやすいですか？",
        answer:
          "1人客を受け入れる店は多いです。混雑時間を避けると入りやすいです。",
      },
    ],
    related: ["busan-haeundae-guide", "busan-1night-2days-model-course", "seoul-cafe-guide"],
    tags: ["釜山", "カフェ", "海雲台", "広安里"],
    hubPath: "/korea/cafe",
    imageAlt: null,
  },
  {
    slug: "busan-night-view-guide",
    title: "釜山の夜景ガイド｜広安大橋と街の灯りを楽しむ",
    description:
      "釜山の夜景を楽しむためのエリアと移動の注意点。広安里・海雲台・南浦洞周辺の見どころと、帰りの交通手段をまとめます。",
    category: "busan",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea-busan"],
    sections: [
      {
        heading: "広安里からの眺め",
        paragraphs: [
          "広安大橋のライトアップは釜山を代表する夜景です。海岸沿いの遊歩道から眺められ、カフェや食堂も近くにあります。",
          "ライトアップの時間は日没に合わせて変わるため、訪問前に公式情報を確認してください。",
        ],
      },
      {
        heading: "海雲台・南浦洞周辺",
        paragraphs: [
          "海雲台はホテルや商業施設の灯りが海沿いに広がります。南浦洞は街の賑わいと港の雰囲気を楽しめます。",
          "夜間は人通りが多い場所を選び、路地に入る場合は明るい道を歩きましょう。",
        ],
      },
      {
        heading: "帰りの交通",
        paragraphs: [
          "地下鉄の終電時刻は日によって異なります。夜景を長く楽しむ場合は、タクシーの配車方法も確認しておくと安心です。",
        ],
      },
    ],
    faq: [
      {
        question: "夜景は何時ごろがきれいですか？",
        answer:
          "日没後から夜にかけてが見頃です。季節によって日没時刻が変わるため、訪問日の時間を確認してください。",
      },
    ],
    related: ["busan-haeundae-guide", "busan-cafe-guide", "busan-1night-2days-model-course"],
    tags: ["釜山", "夜景", "広安里", "海雲台"],
    hubPath: "/korea/travel/busan",
    imageAlt: null,
  },
  {
    slug: "jeju-east-west-guide",
    title: "済州島の東側・西側ガイド｜2泊3日でどう回るか",
    description:
      "済州島を東側と西側に分けて巡る考え方。レンタカーの有無別の回り方、移動時間、天候による変更ポイントをまとめます。",
    category: "jeju",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visit-jeju", "ev-kma"],
    sections: [
      {
        heading: "東側と西側で1日ずつ",
        paragraphs: [
          "済州島は空港を中心に、東側（城山・牛島方面）と西側（涯月・挟才方面）で見どころが分かれます。1日ずつ割り当てると移動が組みやすくなります。",
          "東側は移動距離が長めです。朝早く出発し、帰りは余裕を持って空港方面へ戻る計画にしてください。",
        ],
      },
      {
        heading: "レンタカーがない場合",
        paragraphs: [
          "バス路線はありますが、観光地を効率よく回るには時間がかかります。主要スポットを2〜3に絞り、タクシーを併用する方法があります。",
          "レンタカーを利用する場合は、国際運転免許証など必要書類と保険の内容を確認してください。",
        ],
      },
      {
        heading: "天候による変更",
        paragraphs: [
          "海沿いの遊歩道やフェリーは、強風・雨で運休になる場合があります。屋内の博物館やカフェを代替案として用意しておくと安心です。",
          "天気予報は前日と当日朝に確認し、無理のない範囲で予定を変更してください。",
        ],
      },
    ],
    faq: [
      {
        question: "済州島は2泊3日で足りますか？",
        answer:
          "主要スポットを絞れば回れます。ゆっくり巡るなら3泊4日あると余裕が生まれます。",
      },
      {
        question: "レンタカーなしでも大丈夫ですか？",
        answer:
          "主要スポットを絞り、バスとタクシーを組み合わせれば可能です。移動時間に余裕を持ってください。",
      },
    ],
    related: ["jeju-2nights-3days-model-course", "jeju-cafe-nature", "busan-jeju-access"],
    tags: ["済州島", "モデルコース", "レンタカー", "東側", "西側"],
    hubPath: "/korea/travel/jeju",
    imageAlt: null,
  },
  {
    slug: "jeju-cafe-nature",
    title: "済州島のカフェと自然｜海と山を眺める休憩スポット",
    description:
      "済州島で自然を楽しみながら立ち寄りたいカフェの選び方。海沿い・山あい・街中の特徴と、移動時の注意点をまとめます。",
    category: "cafe",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visit-jeju", "ev-kma"],
    sections: [
      {
        heading: "海沿いのカフェ",
        paragraphs: [
          "涯月・挟才・城山方面には海を眺められるカフェがあります。夕方の景色が人気ですが、日没後は周辺が暗くなるため帰りの移動手段を確認してください。",
          "強風の日はテラス席が使えない場合があります。室内席の有無を事前に確認すると安心です。",
        ],
      },
      {
        heading: "山あい・牧場エリア",
        paragraphs: [
          "済州島の内陸には牧場や山を望むカフェがあります。車での移動が基本になるため、駐車場の有無と道路状況を確認してください。",
          "霧や雨の日は視界が悪くなることがあります。運転に慣れていない場合は無理をしないようにしましょう。",
        ],
      },
      {
        heading: "注文と滞在",
        paragraphs: [
          "注文はレジで先に行う店が一般的です。テイクアウトの可否、滞在時間の制限、電源の有無は店舗ごとに異なります。",
        ],
      },
    ],
    faq: [
      {
        question: "済州島のカフェは予約が必要ですか？",
        answer:
          "人気店では待ち時間が発生します。予約可否は店舗の公式情報を確認してください。",
      },
    ],
    related: ["jeju-east-west-guide", "jeju-2nights-3days-model-course", "seoul-cafe-guide"],
    tags: ["済州島", "カフェ", "自然", "海"],
    hubPath: "/korea/cafe",
    imageAlt: null,
  },
];
