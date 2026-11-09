import type { Article } from "@/lib/domain";

const UPDATED_AT = "2026-11-06T09:00:00.000Z";
const PUBLISHED_AT = "2026-11-06T09:00:00.000Z";

export const prepareArticles: Article[] = [
  {
    slug: "korea-travel-checklist",
    title: "初めての韓国旅行チェックリスト｜出発前から帰国まで",
    description:
      "初めての韓国旅行に向けた準備チェックリスト。パスポート、通信、決済、持ち物、予約の控え、帰国時の税関までを時系列で整理します。",
    category: "prepare",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-customs-jp"],
    sections: [
      {
        heading: "出発1週間前まで",
        paragraphs: [
          "パスポートの有効期限、航空券の予約控え、宿泊先の住所（現地語表記）、通信手段（eSIM・Wi-Fi）、海外旅行保険を確認します。",
          "パスポートの残存有効期間やビザの要否は渡航目的・滞在期間によって異なります。外務省や大使館の公式情報を確認してください。",
        ],
      },
      {
        heading: "前日までに用意するもの",
        paragraphs: [
          "充電器・モバイルバッテリー・変換プラグ、常備薬、現金（少額）、クレジットカード、予約控えのスクリーンショットを用意します。",
          "モバイルバッテリーは航空機の持ち込み制限があります。容量と個数の条件を航空会社の公式情報で確認してください。",
        ],
      },
      {
        heading: "現地での注意",
        paragraphs: [
          "貴重品は分けて持ち、人混みでは荷物から目を離さないようにします。深夜の移動は公共交通の終電時刻を確認し、必要ならタクシーを使います。",
          "体調不良時は無理をせず、ホテルや保険会社の連絡先を確認してください。",
        ],
      },
      {
        heading: "帰国前に",
        paragraphs: [
          "購入した化粧品・食品などの輸入品は、数量や金額によって税の対象になる場合があります。税関の公式情報を確認し、必要に応じて申告します。",
          "液体類の持ち込み制限と、スーツケースの重量制限を再確認してください。",
        ],
      },
    ],
    faq: [
      {
        question: "eSIMとWi-Fiルーターはどちらがよいですか？",
        answer:
          "1人ならeSIM、複数端末や同行者と共有するならルーターが向く場合があります。料金と手間を比較してください。",
      },
      {
        question: "現金はどのくらい必要ですか？",
        answer:
          "屋台や小規模店では現金のみの場合があります。少額を用意し、カードも併用できるようにしておくと安心です。",
      },
    ],
    related: ["korea-esim-wifi-guide", "korea-travel-budget-guide", "seoul-subway-guide"],
    tags: ["旅行準備", "持ち物", "チェックリスト", "初めて"],
    hubPath: "/korea/travel/prepare",
    imageAlt: null,
  },
  {
    slug: "korea-esim-wifi-guide",
    title: "韓国旅行の通信手段｜eSIM・Wi-Fi・ローミングの選び方",
    description:
      "韓国旅行で使う通信手段を、eSIM・Wi-Fiルーター・キャリアの海外ローミングの3つから比較。設定の手順、注意点、選び方の基準をまとめます。",
    category: "prepare",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea"],
    sections: [
      {
        heading: "3つの選択肢",
        paragraphs: [
          "eSIMは端末に追加するSIMで、物理SIMの差し替えが不要です。Wi-Fiルーターは複数端末を共有でき、レンタルと返却の手間がかかります。海外ローミングは設定が簡単な一方、料金が高くなりやすいです。",
          "端末がeSIMに対応しているか、SIMロックが解除されているかを購入前に確認してください。",
        ],
      },
      {
        heading: "容量と日数の選び方",
        paragraphs: [
          "地図・メッセージ中心なら少容量でも足りますが、動画視聴や写真アップロードが多いと容量を消費します。ホテルのWi-Fiを併用できるかで必要量は変わります。",
          "プランの有効期間は購入日基準か現地接続日基準かで異なります。到着が深夜の場合は1日多めにすると安全です。",
        ],
      },
      {
        heading: "設定とトラブル",
        paragraphs: [
          "eSIMは自宅のWi-Fiにつないだ状態で設定を済ませておくと、現地で慌てません。QRコードは端末外にも保管してください。",
          "現地で接続できない場合は、機内モードの切り替え、APN設定、再起動を順に試します。サポートの連絡先を事前に控えておきましょう。",
        ],
      },
    ],
    faq: [
      {
        question: "eSIMだけで電話番号は使えますか？",
        answer:
          "データ専用のプランが多く、音声通話は付かない場合があります。通話が必要なら別途確認してください。",
      },
      {
        question: "テザリングはできますか？",
        answer:
          "プランによります。テザリング非対応の場合は、ルーターや別回線を検討してください。",
      },
    ],
    related: ["korea-travel-checklist", "incheon-airport-to-seoul", "korea-travel-budget-guide"],
    tags: ["eSIM", "Wi-Fi", "通信", "旅行準備"],
    hubPath: "/korea/travel/prepare",
    imageAlt: null,
  },
  {
    slug: "seoul-subway-guide",
    title: "ソウル地下鉄の使い方｜運賃・乗り換え・交通カード",
    description:
      "ソウルの地下鉄を初めて使う人向けに、切符と交通カードの違い、乗り換え、方向の確認、深夜の注意点をまとめます。",
    category: "transport",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-seoulmetro"],
    sections: [
      {
        heading: "交通カードが便利",
        paragraphs: [
          "1回ごとの切符を買うこともできますが、交通カード（T-moneyなど）を使うと乗り換えやバスとの併用がスムーズです。チャージは駅の券売機やコンビニで行えます。",
          "改札は日本のように入場時と出場時の両方でタッチします。残高不足だと出場できないため、事前にチャージしておきましょう。",
        ],
      },
      {
        heading: "路線と方向の確認",
        paragraphs: [
          "ソウルの地下鉄は路線ごとに色と番号が決まっています。乗り換え駅は大きく、出口も多いため、目的地の出口番号を事前に確認すると迷いにくいです。",
          "駅名はハングルと英語・漢字で表示される場合があります。地図アプリで経路を確認しながら移動すると安心です。",
        ],
      },
      {
        heading: "混雑と深夜",
        paragraphs: [
          "通勤時間帯は非常に混雑します。大きな荷物を持っている場合は、時間をずらすかタクシーを検討してください。",
          "終電の時刻は路線・日によって異なります。帰りが遅くなる場合は、事前に時刻を確認し、余裕を持って行動しましょう。",
        ],
      },
    ],
    faq: [
      {
        question: "地下鉄でスーツケースを運べますか？",
        answer:
          "可能ですが、階段や混雑する時間帯では大変です。エレベーターのある出口を確認してください。",
      },
      {
        question: "交通カードは日本で買えますか？",
        answer:
          "一部の通販で取り扱いがありますが、現地調達のほうが確実です。空港や駅、コンビニで購入できます。",
      },
    ],
    related: ["incheon-airport-to-seoul", "myeongdong-guide", "korea-travel-checklist"],
    tags: ["地下鉄", "交通カード", "ソウル", "T-money"],
    hubPath: "/korea/travel/transport",
    imageAlt: null,
  },
  {
    slug: "korea-travel-budget-guide",
    title: "韓国旅行の予算の立て方｜固定費と変動費を分けて考える",
    description:
      "韓国旅行の予算を自分で試算する方法。航空券・宿泊・交通・食費・買い物を分け、季節や人数で変わる部分を整理します。",
    category: "prepare",
    status: "published",
    aiGenerated: false,
    reviewedAt: PUBLISHED_AT,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    evidenceIds: ["ev-visitkorea", "ev-arex"],
    sections: [
      {
        heading: "固定費から決める",
        paragraphs: [
          "航空券と宿泊は旅行費用の大部分を占めます。出発地・時期・泊数・人数が決まれば、おおよその範囲が見えてきます。",
          "予約サイトの表示額には税・手数料が含まれない場合があります。確定画面で総額を確認してください。",
        ],
      },
      {
        heading: "現地でかかる費用",
        paragraphs: [
          "空港からの交通、地下鉄・バス、食費、カフェ、入場料、買い物を項目別に考えます。1日の食事回数と、カフェ・屋台の利用頻度で変動します。",
          "現地決済はカードの海外事務手数料と為替の影響を受けます。両替レートと手数料を確認しておきましょう。",
        ],
      },
      {
        heading: "予備費を確保する",
        paragraphs: [
          "天候による予定変更、追加の交通費、急な買い物に備えて予備費を1割程度見込むと安心です。",
          "費用は時期・為替・予約条件で変動します。当サイトでは一律の「相場」を断定しません。",
        ],
      },
    ],
    faq: [
      {
        question: "1日あたりの食費の目安は？",
        answer:
          "屋台中心かレストラン中心かで大きく変わります。自分の利用スタイルで項目ごとに見積もってください。",
      },
      {
        question: "現地で現金はどのくらい必要ですか？",
        answer:
          "屋台や小規模店では現金のみの場合があります。少額を用意し、カードと併用するのが現実的です。",
      },
    ],
    related: ["korea-travel-checklist", "korea-esim-wifi-guide", "korea-duty-free-guide"],
    tags: ["予算", "費用", "旅行準備", "為替"],
    hubPath: "/korea/travel/prepare",
    imageAlt: null,
  },
];
