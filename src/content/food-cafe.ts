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
];
