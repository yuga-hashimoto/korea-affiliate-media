import type { Article } from "@/lib/domain";

const UPDATED_AT = "2026-11-06T09:00:00.000Z";
const PUBLISHED_AT = "2026-11-06T09:00:00.000Z";

export const seoulArticles: Article[] = [
  {
    slug: "myeongdong-guide",
    title: "明洞の歩き方｜初めてのソウルで泊まるなら",
    description:
      "ソウルの明洞エリアを、食事・買い物・ホテル選び・移動の観点から紹介。初めてのソウル旅行で明洞を拠点にするメリットと注意点をまとめます。",
    category: "seoul",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-seoulmetro"],
    sections: [
      {
        heading: "明洞が向いている人",
        paragraphs: [
          "初めてのソウルで、観光・買い物・食事をまとめて楽しみたい人に向いています。地下鉄の駅が複数あり、主要エリアへのアクセスも比較的わかりやすいです。",
          "一方で、夜間も人通りが多く、宿泊費は高めの傾向があります。静かに過ごしたい人は、隣接する乙支路や会賢方面も選択肢になります。",
        ],
      },
      {
        heading: "食事と屋台",
        paragraphs: [
          "明洞は屋台と飲食店が集中しています。価格は表示されている場合が多いですが、観光地価格の店もあるため、メニューと会計を確認してから注文すると安心です。",
          "アレルギーや宗教上の食事制限がある場合は、素材を確認できる店を選びましょう。屋台は現金のみの場合があります。",
        ],
      },
      {
        heading: "ホテル選びのポイント",
        paragraphs: [
          "駅からの距離、深夜のチェックイン可否、荷物預かり、空港バスの停車有無を確認します。予約サイトの表示額には税・サービス料が含まれない場合があります。",
          "路面店が多いエリアなので、スーツケースでの移動は時間帯によって歩きにくくなります。",
        ],
      },
    ],
    faq: [
      {
        question: "明洞は何時ごろまで賑わっていますか？",
        answer:
          "店舗によりますが、夜遅くまで営業する飲食店や屋台があります。深夜の移動は公共交通の終電時刻を確認してください。",
      },
      {
        question: "両替はどこでするのがよいですか？",
        answer:
          "空港と市内ではレートが異なります。少額を空港で用意し、市内で必要分を両替する方法が一般的です。手数料も確認してください。",
      },
    ],
    related: ["hongdae-guide", "seoul-model-courses", "korea-travel-checklist"],
    tags: ["明洞", "ソウル", "ホテル", "エリア"],
    hubPath: "/korea/travel/seoul",
    imageAlt: null,
  },
  {
    slug: "hongdae-guide",
    title: "弘大エリアガイド｜カフェ・古着・ライブを楽しむ",
    description:
      "ソウルの弘大（ホンデ）エリアを、カフェ・古着・音楽・食事の観点から紹介。延南洞と合わせて歩くルートと、夜間の注意点をまとめます。",
    category: "seoul",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-seoulmetro"],
    sections: [
      {
        heading: "弘大の特徴",
        paragraphs: [
          "弘大は大学街を中心に、カフェ・古着屋・ライブハウス・雑貨店が集まるエリアです。昼はカフェ巡り、夜は音楽や食事を楽しむ人が多く、滞在時間が長くなりやすいです。",
          "空港鉄道の弘大入口駅が使えるため、仁川空港からのアクセスは比較的わかりやすいです。",
        ],
      },
      {
        heading: "延南洞まで足を伸ばす",
        paragraphs: [
          "弘大の隣にある延南洞は、落ち着いたカフェと小さな商店が並びます。弘大駅から歩いて回れる範囲なので、半日あれば両方を見て回れます。",
          "人気店は待ち時間が発生します。予約可否や営業時間は店舗の公式情報を確認してください。",
        ],
      },
      {
        heading: "夜間の移動",
        paragraphs: [
          "夜は人通りが多い一方、路地に入ると暗い場所もあります。帰りは大通りに出て、地下鉄またはタクシーを利用すると安心です。",
          "終電の時刻は日によって異なるため、その日の時刻表を確認してください。",
        ],
      },
    ],
    faq: [
      {
        question: "弘大は1人でも楽しめますか？",
        answer:
          "カフェや古着屋は1人でも入りやすい店が多いです。夜のライブは混雑するため、余裕を持って行動してください。",
      },
    ],
    related: ["myeongdong-guide", "seoul-cafe-guide", "seoul-subway-guide"],
    tags: ["弘大", "延南洞", "ソウル", "カフェ", "古着"],
    hubPath: "/korea/travel/seoul",
    imageAlt: null,
  },
  {
    slug: "seoul-area-guide",
    title: "ソウルのエリア選び｜明洞・弘大・江南・東大門の違い",
    description:
      "ソウル旅行の拠点選びに迷う人向けに、明洞・弘大・江南・東大門・梨泰院の特徴を比較。移動・食事・買い物・治安の観点で整理します。",
    category: "seoul",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-seoulmetro"],
    sections: [
      {
        heading: "初めてなら明洞か弘大",
        paragraphs: [
          "観光地を効率よく回るなら明洞、カフェや音楽・古着を楽しむなら弘大が拠点に向いています。どちらも空港からのアクセスがよく、食事の選択肢も多いです。",
          "ホテル代は時期によって大きく変動します。同じ日程で比較し、移動時間も含めて判断してください。",
        ],
      },
      {
        heading: "江南・東大門・梨泰院",
        paragraphs: [
          "江南はオフィス街と商業施設が中心で、落ち着いたホテルが多いエリアです。東大門は深夜の買い物や市場が目的の場合に便利です。",
          "梨泰院は多国籍な飲食店と坂道が多いエリアで、歩きやすさは場所によって差があります。",
        ],
      },
      {
        heading: "移動時間で選ぶ",
        paragraphs: [
          "どのエリアに泊まっても、地下鉄で主要スポットへ移動できます。乗り換え回数と駅からの徒歩距離を地図で確認しておくと、当日の移動が楽になります。",
        ],
      },
    ],
    faq: [
      {
        question: "子連れならどのエリアがおすすめですか？",
        answer:
          "移動の乗り換えが少なく、公園や広い歩道に近いエリアが向いています。ホテルのベッド設定や幼児料金も事前に確認してください。",
      },
    ],
    related: ["myeongdong-guide", "hongdae-guide", "seoul-model-courses"],
    tags: ["ソウル", "エリア", "ホテル", "江南", "東大門"],
    hubPath: "/korea/travel/seoul",
    imageAlt: null,
  },
  {
    slug: "seoul-hotel-area-guide",
    title: "ソウルのホテル選び｜エリア別の特徴と予約前チェック",
    description:
      "ソウルのホテルを選ぶときに見るべきポイントを整理。明洞・弘大・江南などエリアの特徴、税・キャンセル条件・空港アクセスの確認方法をまとめます。",
    category: "hotel",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-seoulmetro"],
    sections: [
      {
        heading: "エリアで決める",
        paragraphs: [
          "観光地を回るなら明洞、カフェや古着を楽しむなら弘大、落ち着いた滞在なら江南が候補になります。どこに泊まっても地下鉄で移動できますが、乗り換え回数と駅からの徒歩距離は確認しておきましょう。",
          "同じエリアでも、大通り沿いと路地裏では夜の雰囲気が異なります。地図で周辺の施設と駅からの道順を確認してください。",
        ],
      },
      {
        heading: "予約前に確認する項目",
        paragraphs: [
          "税・サービス料・清掃料が表示額に含まれるか、現地徴収があるか、キャンセル可能期限と手数料を確認します。",
          "チェックイン時間、荷物預かり、深夜のフロント対応、朝食の有無と料金も見ておくと安心です。",
        ],
      },
      {
        heading: "空港からのアクセス",
        paragraphs: [
          "仁川空港からは空港鉄道と空港バスが使えます。荷物が多い場合は、ホテル最寄りのバス停や駅からの距離を確認してください。",
          "深夜到着の場合は、公共交通の運行時間とホテルのチェックイン対応を事前に確認しましょう。",
        ],
      },
    ],
    faq: [
      {
        question: "ホテルの表示価格は税込ですか？",
        answer:
          "予約サイトによって異なります。確定画面で税・サービス料を含む総額を確認してください。",
      },
      {
        question: "ゲストハウスとホテルはどう選びますか？",
        answer:
          "共用スペースや個室の有無、セキュリティ、立地で選びます。深夜の出入りや荷物預かりの条件も確認してください。",
      },
    ],
    related: ["myeongdong-guide", "hongdae-guide", "incheon-airport-to-seoul"],
    tags: ["ソウル", "ホテル", "宿泊", "予約"],
    hubPath: "/korea/travel/hotels",
    imageAlt: null,
  },
  {
    slug: "seoul-klook-experiences",
    title: "ソウルで予約できる体験の選び方｜Klook活用ガイド",
    description:
      "ソウル旅行で事前予約したい体験（空港送迎・展望台・宮殿・テーマパークなど）の選び方と、予約前の確認事項をまとめます。",
    category: "seoul",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-incheon-airport"],
    sections: [
      {
        heading: "事前予約に向いている体験",
        paragraphs: [
          "空港送迎、展望台・入場チケット、宮殿の体験プログラム、テーマパーク、現地ツアーなどは、事前予約で当日の待ち時間を減らせる場合があります。",
          "一方で、天候や営業状況で内容が変わるものもあります。予約前にキャンセル条件と集合場所を確認してください。",
        ],
      },
      {
        heading: "予約前に確認する項目",
        paragraphs: [
          "利用日時、集合場所、所要時間、対象年齢、言語、キャンセル期限、払い戻し条件を確認します。QRコードやバウチャーの提示方法も事前に把握しておきましょう。",
          "料金・空き状況は時期や人数で変動します。表示額だけでなく、手数料や現地での追加費用の有無を確認してください。",
        ],
      },
      {
        heading: "Klookを使う場合",
        paragraphs: [
          "Klookでは、体験・送迎・ホテル・鉄道などをまとめて予約できます。日本語で予約でき、バウチャーをアプリで管理できる点が便利です。",
          "利用規約・キャンセルポリシーは商品ごとに異なります。予約確定前に必ず確認してください。",
        ],
      },
      {
        heading: "当日の注意",
        paragraphs: [
          "集合場所は地図アプリで事前に確認し、余裕を持って向かってください。混雑期は現地での待ち時間が発生します。",
          "天候による中止・変更の連絡方法を確認しておくと安心です。",
        ],
      },
    ],
    faq: [
      {
        question: "Klookの予約は日本語でできますか？",
        answer:
          "日本語サイト・アプリが用意されています。商品ページの言語表記とサポート条件を確認してください。",
      },
      {
        question: "当日予約でも大丈夫ですか？",
        answer:
          "空きがあれば可能な場合もありますが、人気商品は早めに埋まります。日程が決まったら早めの予約がおすすめです。",
      },
    ],
    related: ["incheon-airport-to-seoul", "seoul-model-courses", "seoul-hotel-area-guide"],
    tags: ["ソウル", "Klook", "体験", "予約"],
    hubPath: "/korea/travel/seoul",
    imageAlt: null,
  },
];
