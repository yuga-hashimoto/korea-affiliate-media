import type { Article } from "@/lib/domain";

const UPDATED_AT = "2026-11-06T09:00:00.000Z";
const PUBLISHED_AT = "2026-11-06T09:00:00.000Z";

export const shoppingArticles: Article[] = [
  {
    slug: "korea-cosmetics-shopping-guide",
    title: "韓国コスメの買い物ガイド｜店舗と通販の使い分け",
    description:
      "韓国コスメを旅行中に買うときの基礎知識。店舗と通販の違い、テスターの使い方、免税・返品条件、持ち帰りの注意点をまとめます。",
    category: "beauty",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-oliveyoung", "ev-customs-jp"],
    sections: [
      {
        heading: "店舗で買うメリット",
        paragraphs: [
          "店舗ではテスターで色味やテクスチャーを確認できます。店員に相談できるのも利点ですが、勧められた商品が自分に合うとは限らないため、成分表示と使用感を確認して判断しましょう。",
          "人気商品は欠品していることもあります。旅行中に確実に買いたい場合は、在庫状況を事前に確認するか、通販の利用も検討してください。",
        ],
      },
      {
        heading: "通販と送料",
        paragraphs: [
          "海外通販は商品の選択肢が広い一方、送料・関税・為替・返品条件を確認する必要があります。購入前に総額と配送日数を確認してください。",
          "返品・交換の可否は販売サイトの規約によります。化粧品は開封後の返品が難しい場合が多いため、注文内容をよく確認しましょう。",
        ],
      },
      {
        heading: "持ち帰りの注意",
        paragraphs: [
          "液体類は航空機の持ち込み制限があります。預け荷物に入れる場合は、漏れ防止と重量制限を確認してください。",
          "海外から持ち帰る化粧品は、数量や用途によって税の対象になる場合があります。税関の公式情報を確認し、必要に応じて申告します。",
        ],
      },
    ],
    faq: [
      {
        question: "免税店と市内店舗はどちらが安いですか？",
        answer:
          "商品・時期・為替・クーポン条件で変わります。一律には言えないため、条件を揃えて確認してください。",
      },
      {
        question: "化粧品の効能はどう確認すればよいですか？",
        answer:
          "パッケージや公式サイトの表示を確認し、断定表現は参考にしないでください。肌に合わない場合は使用を中止し、専門家に相談してください。",
      },
    ],
    related: ["oliveyoung-guide", "korea-duty-free-guide", "korea-travel-checklist"],
    tags: ["韓国コスメ", "買い物", "免税", "通販"],
    hubPath: "/korea/shopping",
    imageAlt: null,
  },
  {
    slug: "oliveyoung-guide",
    title: "OLIVE YOUNGの使い方｜初めての店内と商品選び",
    description:
      "韓国のドラッグストア・コスメ店OLIVE YOUNGの使い方を紹介。店内の見方、セール表示、会員・免税、混雑を避ける時間帯をまとめます。",
    category: "beauty",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-oliveyoung"],
    sections: [
      {
        heading: "店内の構成",
        paragraphs: [
          "スキンケア・メイク・ヘアケア・ボディケア・食品など幅広い商品を扱っています。入口付近には話題の商品やセール品が並ぶことが多く、奥の棚には定番品があります。",
          "テスターが用意されている商品もあります。衛生的に使えるよう、店舗の案内に従ってください。",
        ],
      },
      {
        heading: "セールと会員",
        paragraphs: [
          "店舗や時期によってセールやクーポンがあります。表示価格と適用条件を確認し、会員特典は登録条件を確認してから利用してください。",
          "免税手続きの対象条件は店舗・金額・国籍などで異なります。レジで確認するのが確実です。",
        ],
      },
      {
        heading: "混雑を避ける",
        paragraphs: [
          "明洞や弘大の大型店は週末の午後に混雑します。平日の午前中や開店直後は比較的ゆっくり見られます。",
          "人気商品の在庫は店舗によって差があります。複数店舗を回る場合は、移動時間も含めて計画してください。",
        ],
      },
    ],
    faq: [
      {
        question: "日本語で買い物できますか？",
        answer:
          "観光地の店舗では日本語対応のスタッフや翻訳ツールが用意されている場合があります。基本は韓国語か英語です。",
      },
      {
        question: "日本からオンラインで買えますか？",
        answer:
          "Globalサイトや国内通販で購入できる場合があります。送料・関税・為替を含めた条件を確認してください。",
      },
    ],
    related: ["korea-cosmetics-shopping-guide", "myeongdong-guide", "korea-duty-free-guide"],
    tags: ["OLIVE YOUNG", "韓国コスメ", "買い物", "明洞"],
    hubPath: "/korea/shopping",
    imageAlt: null,
  },
  {
    slug: "korea-fashion-shopping-guide",
    title: "韓国ファッションの買い物ガイド｜サイズと返品の注意点",
    description:
      "韓国でファッションを買うときの基礎。サイズ表記の違い、試着の可否、返品条件、日本への持ち帰りと関税の注意点をまとめます。",
    category: "fashion",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-customs-jp"],
    sections: [
      {
        heading: "サイズは実寸で確認する",
        paragraphs: [
          "韓国のサイズ表記は日本と異なる場合があります。S/M/Lの表示だけで判断せず、着丈・肩幅・バストなどの実寸を確認してください。",
          "店舗では試着できる場合とできない場合があります。返品条件も合わせて確認しましょう。",
        ],
      },
      {
        heading: "返品・交換の条件",
        paragraphs: [
          "タグを切った商品やセール品は返品できない場合があります。購入前にレジで確認するのが確実です。",
          "海外通販の場合は、返送料が購入者負担になることが多く、返品期限も短い場合があります。",
        ],
      },
      {
        heading: "持ち帰りの注意",
        paragraphs: [
          "衣類の輸入には関税・輸入消費税がかかる場合があります。商品価格・数量・用途によって扱いが異なるため、税関の公式情報を確認してください。",
          "スーツケースの容量と重量制限を確認し、購入しすぎないようにしましょう。",
        ],
      },
    ],
    faq: [
      {
        question: "韓国のお店で試着はできますか？",
        answer:
          "店舗によります。試着室がある店もあれば、セルフサービスでない場合もあります。店員に確認してください。",
      },
      {
        question: "日本サイズと同じ表記なら同じ大きさですか？",
        answer:
          "同じとは限りません。ブランドごとに寸法が異なるため、実寸を確認してください。",
      },
    ],
    related: ["korea-cosmetics-shopping-guide", "korea-duty-free-guide", "korea-travel-budget-guide"],
    tags: ["韓国ファッション", "買い物", "サイズ", "返品"],
    hubPath: "/korea/shopping",
    imageAlt: null,
  },
  {
    slug: "korea-duty-free-guide",
    title: "韓国免税店・タックスリファンドの基本｜手続きの流れ",
    description:
      "韓国での免税店利用とタックスリファンドの流れを整理。購入時の確認事項、空港での手続き、必要書類と時間の見積もりをまとめます。",
    category: "shopping",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-customs-jp", "ev-incheon-airport"],
    sections: [
      {
        heading: "免税店とタックスリファンドの違い",
        paragraphs: [
          "免税店は出国後の受け取りを前提に税抜価格で購入する仕組み、タックスリファンドは市内で支払った税の一部を出国時に還付する仕組みです。",
          "対象条件・最低購入額・手続き場所は制度や店舗で異なります。店頭の案内と公式情報を確認してください。",
        ],
      },
      {
        heading: "空港での手続き",
        paragraphs: [
          "還付にはパスポート・レシート・商品が必要な場合があります。商品を使用・開封すると対象外になることがあるため、手続きまで保管してください。",
          "出国手続き後に還付カウンターがある空港もあります。搭乗時刻から逆算し、余裕を持って向かってください。",
        ],
      },
      {
        heading: "日本での注意",
        paragraphs: [
          "免税で購入した商品でも、日本への持ち込みには税関のルールが適用されます。免税範囲や申告の要否は税関の公式情報を確認してください。",
        ],
      },
    ],
    faq: [
      {
        question: "免税手続きには何分かかりますか？",
        answer:
          "混雑状況によります。出国手続きと合わせて時間に余裕を持つことをおすすめします。",
      },
      {
        question: "免税品は日本で使えますか？",
        answer:
          "購入した商品の用途・数量によって扱いが変わります。税関のルールを確認してください。",
      },
    ],
    related: ["korea-cosmetics-shopping-guide", "korea-fashion-shopping-guide", "incheon-airport-to-seoul"],
    tags: ["免税", "タックスリファンド", "空港", "買い物"],
    hubPath: "/korea/shopping",
    imageAlt: null,
  },
];
