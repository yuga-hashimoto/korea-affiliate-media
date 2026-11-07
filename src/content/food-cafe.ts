import type { Article } from "@/lib/domain";

const UPDATED_AT = "2026-11-06T09:00:00.000Z";
const PUBLISHED_AT = "2026-11-06T09:00:00.000Z";

export const foodCafeArticles: Article[] = [
  {
    slug: "seoul-food-guide",
    title: "ソウルの食堂・屋台入門｜初めてでも注文しやすい店の選び方",
    description:
      "初めてのソウルで食堂や屋台を楽しむための基本。メニューの見方、注文の流れ、現金とカードの使い分け、食事のマナーをまとめます。",
    category: "food",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea"],
    sections: [
      {
        heading: "メニューは写真と価格を確認する",
        paragraphs: [
          "観光地の食堂や屋台では、写真付きのメニューが多くあります。価格は店頭やメニューに表示されている場合が多いですが、観光地価格の店もあるため、注文前に確認すると安心です。",
          "辛さの調整ができる店もあります。苦手な場合は「マッタン ハゲ（辛くしないで）」のように伝えると通じやすいです。",
        ],
      },
      {
        heading: "注文と会計の流れ",
        paragraphs: [
          "席に着いたら店員を呼び、メニューを指差して注文するのが簡単です。会計はレジで行う店と、席で支払う店があります。",
          "屋台は現金のみの場合があるため、少額の現金を用意しておくと便利です。カード決済可否は店舗の表示を確認してください。",
        ],
      },
      {
        heading: "食事のマナー",
        paragraphs: [
          "取り皿を共有する文化があるため、取り分け用の皿や箸を使うと安心です。おかわり無料の店もありますが、店舗によって異なります。",
          "アレルギーや宗教上の制限がある場合は、素材を確認できる店を選び、無理に勧められても断れるようにしておきましょう。",
        ],
      },
    ],
    faq: [
      {
        question: "1人でも食堂に入れますか？",
        answer:
          "1人客を受け入れる店は多くあります。混雑時間を避けると入りやすいです。",
      },
      {
        question: "チップは必要ですか？",
        answer:
          "韓国では一般的にチップの習慣はありません。表示された金額を支払います。",
      },
    ],
    related: ["korea-convenience-store", "myeongdong-guide", "seoul-2nights-3days-model-course"],
    tags: ["ソウル", "グルメ", "屋台", "食堂", "マナー"],
    hubPath: "/korea/food",
    imageAlt: null,
  },
  {
    slug: "korea-convenience-store",
    title: "韓国コンビニで買うもの｜旅行中に便利な商品と使い方",
    description:
      "韓国旅行中に役立つコンビニの使い方。飲み物・軽食・日用品の選び方、セルフレジ、交通カードのチャージなど、滞在中に知っておきたいポイントをまとめます。",
    category: "food",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea"],
    sections: [
      {
        heading: "軽食と飲み物",
        paragraphs: [
          "おにぎり・サンドイッチ・カップ麺・ヨーグルトなど、短時間で食べられる商品が充実しています。ホテルで朝食を済ませたいときにも便利です。",
          "飲み物は種類が多く、サイズもさまざまです。冷蔵ケースの商品は会計後に店内で食べることもできますが、店舗のルールに従ってください。",
        ],
      },
      {
        heading: "日用品とトラブル対応",
        paragraphs: [
          "歯ブラシ・充電ケーブル・絆創膏・マスクなど、旅行中に不足しがちな商品が揃っています。医薬品は種類が限られるため、必要な薬は日本から持参すると安心です。",
          "セルフレジは画面の言語を切り替えられる場合があります。バーコードの読み取り位置と支払い方法を確認してから操作してください。",
        ],
      },
      {
        heading: "交通カードのチャージ",
        paragraphs: [
          "一部のコンビニでは交通カードのチャージができます。現金が必要な場合があるため、チャージ前に店員へ確認するとスムーズです。",
          "残高は改札やチャージ機で確認できます。帰国前に使い切る必要はありませんが、払い戻しの条件はカード種類によって異なります。",
        ],
      },
    ],
    faq: [
      {
        question: "コンビニで免税手続きはできますか？",
        answer:
          "店舗や金額条件によります。対象かどうかはレジで確認してください。",
      },
      {
        question: "お湯は無料ですか？",
        answer:
          "カップ麺用のお湯を無料で提供している店が多いです。ただし店舗により異なります。",
      },
    ],
    related: ["seoul-food-guide", "korea-travel-checklist", "seoul-subway-guide"],
    tags: ["コンビニ", "グルメ", "旅行準備", "ソウル"],
    hubPath: "/korea/food",
    imageAlt: null,
  },
  {
    slug: "seoul-cafe-guide",
    title: "ソウルのカフェ文化｜巡り方と注文のコツ",
    description:
      "ソウルのカフェ文化と、初めてでも入りやすい店の選び方。注文の流れ、電源・Wi-Fi、滞在マナー、混雑時間をまとめます。",
    category: "cafe",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea"],
    sections: [
      {
        heading: "カフェは「空間」を楽しむ場所",
        paragraphs: [
          "ソウルのカフェは、コーヒーだけでなく内装や席の居心地を楽しむ文化があります。広い店、ベーカリー併設店、夜景が見える店など、目的に合わせて選ぶと楽しいです。",
          "人気店は週末の午後に混雑します。開店直後か平日の午前中を狙うと、ゆっくり過ごしやすいです。",
        ],
      },
      {
        heading: "注文と席の確保",
        paragraphs: [
          "先にレジで注文して番号を受け取り、席で待つ形式が一般的です。席を先に確保してから注文する店もあります。店員の案内に従ってください。",
          "テイクアウトの可否、滞在時間の制限、電源・Wi-Fiの有無は店舗ごとに異なります。",
        ],
      },
      {
        heading: "滞在マナー",
        paragraphs: [
          "長時間の滞在が前提の店もありますが、混雑時は席を譲る配慮が必要です。大声での通話や、大きな荷物を通路に置くのは避けましょう。",
          "一部の店では1人1ドリンク制を設けています。表示を確認してから着席してください。",
        ],
      },
    ],
    faq: [
      {
        question: "電源やWi-Fiは使えますか？",
        answer:
          "店舗によります。電源席やWi-Fiの表示がある店を選ぶと確実です。",
      },
      {
        question: "1人で長居しても大丈夫ですか？",
        answer:
          "混雑状況によります。混雑時は長居を控え、空いている時間帯を選ぶと安心です。",
      },
    ],
    related: ["hongdae-guide", "seoul-3nights-4days-slow-plan", "seoul-food-guide"],
    tags: ["ソウル", "カフェ", "弘大", "延南洞"],
    hubPath: "/korea/cafe",
    imageAlt: null,
  },
  {
    slug: "korea-cafe-order-guide",
    title: "韓国カフェの注文ガイド｜サイズ・氷・テイクアウトの伝え方",
    description:
      "韓国のカフェで注文するときに使う表現を整理。サイズ、氷の量、テイクアウト、支払い方法の伝え方と、困ったときの対処法を紹介します。",
    category: "cafe",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea"],
    sections: [
      {
        heading: "注文の基本",
        paragraphs: [
          "メニューを指差して「イゴ ジュセヨ（これをください）」と伝えれば通じます。サイズは「ラージ（ラジ）」、テイクアウトは「テイクアウト（ポジャン）」と伝えます。",
          "アイスの量は「オルム チョクゲ（氷少なめ）」のように調整できます。すべての店で対応できるわけではありません。",
        ],
      },
      {
        heading: "支払いと受け取り",
        paragraphs: [
          "カード決済が一般的ですが、小規模店では現金のみの場合もあります。注文時に支払い方法を確認しましょう。",
          "番号札や呼び出しベルを受け取る店では、番号が呼ばれたらカウンターへ取りに行きます。",
        ],
      },
      {
        heading: "困ったとき",
        paragraphs: [
          "翻訳アプリの画面を見せるとスムーズです。アレルギーがある場合は、原材料の確認をお願いしましょう。",
          "混雑時に席が見つからない場合は、店員に空席を確認すると案内してもらえることがあります。",
        ],
      },
    ],
    faq: [
      {
        question: "日本語は通じますか？",
        answer:
          "観光地のカフェでは日本語メニューがある場合もありますが、基本は韓国語か英語です。指差しと翻訳アプリで対応できます。",
      },
    ],
    related: ["seoul-cafe-guide", "korea-convenience-store", "korea-travel-checklist"],
    tags: ["カフェ", "韓国語", "注文", "ソウル"],
    hubPath: "/korea/cafe",
    imageAlt: null,
  },
  {
    slug: "seoul-cafe-area-guide",
    title: "ソウルカフェのエリア別ガイド｜弘大・三清洞・江南",
    description:
      "ソウルのカフェをエリア別に紹介。弘大・延南洞、三清洞・仁寺洞、江南・聖水の特徴と、混雑を避ける時間帯をまとめます。",
    category: "cafe",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-seoulmetro"],
    sections: [
      {
        heading: "弘大・延南洞",
        paragraphs: [
          "弘大と延南洞は、個性的なカフェと小さな商店が集まるエリアです。昼から夕方にかけて賑わい、週末は人気店に行列ができます。",
          "駅から少し離れた路地にも店があるため、地図アプリで位置を確認しながら歩くと効率的です。",
        ],
      },
      {
        heading: "三清洞・仁寺洞",
        paragraphs: [
          "伝統的な街並みとカフェが調和するエリアです。観光と組み合わせやすく、午前中は比較的落ち着いています。",
          "坂道や石畳の道があるため、歩きやすい靴を選んでください。",
        ],
      },
      {
        heading: "江南・聖水",
        paragraphs: [
          "江南は大型カフェやベーカリーが多く、聖水は倉庫を改装したような店が集まります。休日は混雑するため、開店直後を狙うとよいでしょう。",
          "店舗によっては滞在時間の制限や1人1ドリンク制があります。案内を確認してから着席してください。",
        ],
      },
    ],
    faq: [
      {
        question: "ソウルのカフェは予約できますか？",
        answer:
          "店舗によります。人気店は予約や待機リストを導入している場合があるため、公式情報を確認してください。",
      },
      {
        question: "電源やWi-Fiはありますか？",
        answer:
          "店舗によります。作業目的の場合は、電源・Wi-Fiの表示がある店を選ぶと確実です。",
      },
    ],
    related: ["seoul-cafe-guide", "hongdae-guide", "korean-dessert-cafe"],
    tags: ["ソウル", "カフェ", "弘大", "三清洞", "江南"],
    hubPath: "/korea/cafe",
    imageAlt: null,
  },
  {
    slug: "korean-dessert-cafe",
    title: "韓国カフェのスイーツガイド｜注文と楽しみ方",
    description:
      "韓国のカフェで楽しめるスイーツの種類と注文のコツ。季節限定メニュー、テイクアウト、アレルギー確認のポイントをまとめます。",
    category: "cafe",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea"],
    sections: [
      {
        heading: "ケーキ・ベーカリー・かき氷",
        paragraphs: [
          "韓国のカフェでは、ケーキや焼き菓子、季節限定のかき氷などが人気です。メニューは写真付きのことが多く、サイズも確認できます。",
          "季節限定メニューは店舗や時期によって変わります。訪問時にメニューを確認してください。",
        ],
      },
      {
        heading: "注文の流れ",
        paragraphs: [
          "レジでケースの商品を指差し、飲み物と一緒に注文するのが一般的です。テイクアウトの場合は容器代がかかる場合があります。",
          "アレルギーがある場合は、素材を確認できる範囲で店員に伝えましょう。",
        ],
      },
      {
        heading: "楽しみ方とマナー",
        paragraphs: [
          "店内で食べる場合は、席を確保してから注文する店と、注文後に席を探す店があります。案内に従ってください。",
          "混雑時は長居を控え、次の客が使えるように配慮しましょう。",
        ],
      },
    ],
    faq: [
      {
        question: "テイクアウトはできますか？",
        answer:
          "多くの店で可能ですが、商品によっては店内限定の場合があります。注文時に確認してください。",
      },
    ],
    related: ["seoul-cafe-guide", "seoul-cafe-area-guide", "korea-cafe-order-guide"],
    tags: ["カフェ", "スイーツ", "韓国", "注文"],
    hubPath: "/korea/cafe",
    imageAlt: null,
  },
];
