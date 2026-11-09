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
    related: ["korea-convenience-store", "myeongdong-guide", "seoul-model-courses"],
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
];
