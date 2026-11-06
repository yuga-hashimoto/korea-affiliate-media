import type { Article } from "@/lib/domain";

const UPDATED_AT = "2026-11-06T09:00:00.000Z";
const PUBLISHED_AT = "2026-11-06T09:00:00.000Z";

export const seoulArticles: Article[] = [
  {
    slug: "seoul-2nights-3days-model-course",
    title: "初めてのソウル2泊3日モデルコース｜無理なく回る定番ルート",
    description:
      "初めてのソウル旅行向けに、2泊3日で定番スポットを無理なく回るモデルコースを紹介。移動時間・食事・買い物のバランスと、当日の変更ポイントをまとめます。",
    category: "seoul",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-seoulmetro"],
    sections: [
      {
        heading: "1日目：到着後に明洞・南山をゆっくり",
        paragraphs: [
          "仁川空港からソウル市内へ移動し、ホテルに荷物を置いたら明洞周辺を歩くのが定番です。到着日は移動で疲れているため、予定を詰めすぎず、夕食と軽い買い物程度に留めると翌日が楽になります。",
          "南山の展望施設やケーブルカーは天候と混雑で待ち時間が変わります。運営状況は公式サイトで確認し、夕方以降に余裕を持って向かってください。",
        ],
      },
      {
        heading: "2日目：宮殿・古宮エリアとカフェ",
        paragraphs: [
          "午前中に景福宮や北村周辺を歩き、午後は三清洞・仁寺洞のカフェで休憩する流れが回りやすいです。宮殿の休館日や入場時間は変更されるため、訪問前に公式情報を確認します。",
          "徒歩移動が多いエリアなので、歩きやすい靴と水分補給を忘れずに。地下鉄の駅から目的地までが思ったより離れていることもあります。",
        ],
      },
      {
        heading: "3日目：買い物とカフェで締める",
        paragraphs: [
          "帰国日のフライト時間から逆算し、ホテル周辺か空港鉄道の駅に近いエリアで買い物をまとめると移動が楽です。免税手続きが必要な場合は、空港での手続き時間を見込んで早めに到着してください。",
          "スーツケースの重量制限と、購入品の機内持ち込み制限（液体類など）は航空会社の公式情報で確認します。",
        ],
      },
    ],
    faq: [
      {
        question: "2泊3日で釜山も入れられますか？",
        answer:
          "移動時間を考えると、ソウルと釜山を短期間で回るのは慌ただしくなります。初めてならソウルに絞るか、滞在日数を増やすことをおすすめします。",
      },
      {
        question: "雨の日はどう組み替えますか？",
        answer:
          "屋内の美術館・博物館・大型商業施設を中心に組み替えます。屋外の宮殿や市場は別日に回すと余裕が生まれます。",
      },
    ],
    related: ["myeongdong-guide", "korea-travel-checklist", "seoul-subway-guide"],
    tags: ["ソウル", "モデルコース", "2泊3日", "初めて"],
    hubPath: "/korea/travel/seoul",
    imageAlt: null,
  },
  {
    slug: "seoul-3nights-4days-slow-plan",
    title: "ソウル3泊4日ゆったりプラン｜カフェと市場を楽しむ",
    description:
      "ソウルに3泊4日でゆっくり滞在する人向けのプラン。エリアを絞り、カフェ・市場・散策を中心に無理なく回る組み方を紹介します。",
    category: "seoul",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-seoulmetro"],
    sections: [
      {
        heading: "エリアを2つに絞る",
        paragraphs: [
          "3泊4日あっても、ソウル全域を毎日移動すると移動時間で疲れます。宿泊先を起点に、徒歩と地下鉄で回れるエリアを2つ程度に絞ると、滞在の満足度が上がります。",
          "例として、明洞・南山方面と、弘大・延南洞方面を日替わりで回る組み方が組みやすいです。",
        ],
      },
      {
        heading: "市場とカフェを1日ずつ",
        paragraphs: [
          "広蔵市場や南大門市場は、午前から昼にかけて賑わいます。屋台の営業状況は日によって異なるため、公式情報や現地の表示を確認してください。",
          "カフェは午後の休憩に組み込むと、歩き続ける日でもペースを保てます。電源・Wi-Fiの有無は店舗ごとに異なります。",
        ],
      },
      {
        heading: "予備日を1日ぶん確保する",
        paragraphs: [
          "4日目を帰国準備と買い物に充てると、天候不良や予定変更にも対応できます。お土産は最終日にまとめると、荷物の整理がしやすいです。",
        ],
      },
    ],
    faq: [
      {
        question: "3泊4日なら釜山日帰りは可能ですか？",
        answer:
          "移動時間が長く、滞在時間が短くなります。目的がはっきりしている場合を除き、ソウル滞在を楽しむほうが満足度は高いです。",
      },
    ],
    related: ["seoul-2nights-3days-model-course", "seoul-cafe-guide"],
    tags: ["ソウル", "モデルコース", "3泊4日"],
    hubPath: "/korea/travel/seoul",
    imageAlt: null,
  },
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
    related: ["hongdae-guide", "seoul-2nights-3days-model-course", "korea-travel-checklist"],
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
    related: ["myeongdong-guide", "hongdae-guide", "seoul-2nights-3days-model-course"],
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
];
