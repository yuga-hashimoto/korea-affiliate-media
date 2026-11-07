import type { Category } from "./domain";

export interface CategoryMeta {
  label: string;
  short: string;
  /** デザイン用の韓国語ラベル */
  kr: string;
  description: string;
  href: string;
  /** 一覧ページで表示する補足。 */
  intro: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  seoul: {
    label: "ソウル",
    short: "ソウル",
    kr: "서울",
    description: "ソウルのエリアガイド・モデルコース・街歩き",
    href: "/korea/travel/seoul",
    intro:
      "初めてのソウルからリピーターまで。明洞・弘大・江南などエリアの特徴と、2泊3日・3泊4日のモデルコースをまとめています。",
  },
  busan: {
    label: "釜山",
    short: "釜山",
    kr: "부산",
    description: "釜山の海・市場・モデルコース",
    href: "/korea/travel/busan",
    intro:
      "海雲台・広安里・南浦洞など、釜山の定番エリアと1泊2日の回り方を紹介します。ソウルからの移動手段も確認できます。",
  },
  jeju: {
    label: "済州島",
    short: "済州島",
    kr: "제주",
    description: "済州島の自然・カフェ・モデルコース",
    href: "/korea/travel/jeju",
    intro:
      "レンタカー移動が基本の済州島。東側・西側の回り方、天候による変更、2泊3日のモデルコースをまとめています。",
  },
  food: {
    label: "グルメ",
    short: "グルメ",
    kr: "맛집",
    description: "食堂・屋台・コンビニ・韓国グルメ",
    href: "/korea/food",
    intro:
      "食堂や屋台での注文の流れ、コンビニで買えるもの、食事のマナーなど、初めてでも困らない韓国グルメの基本を紹介します。",
  },
  cafe: {
    label: "カフェ",
    short: "カフェ",
    kr: "카페",
    description: "ソウルのカフェ文化と巡り方",
    href: "/korea/cafe",
    intro:
      "ソウルのカフェは空間を楽しむ文化。注文の仕方、混雑を避ける時間帯、滞在マナーをまとめています。",
  },
  shopping: {
    label: "買い物",
    short: "買い物",
    kr: "쇼핑",
    description: "コスメ・ファッション・免税のガイド",
    href: "/korea/shopping",
    intro:
      "韓国コスメ、ファッション、免税店・タックスリファンド。買い物の前に確認したいサイズ・返品・持ち帰りの注意点を整理します。",
  },
  transport: {
    label: "交通",
    short: "交通",
    kr: "교통",
    description: "空港アクセス・地下鉄・都市間移動",
    href: "/korea/travel/transport",
    intro:
      "仁川空港からソウル市内へのアクセス、地下鉄と交通カードの使い方、釜山・済州への移動手段をまとめています。",
  },
  hotel: {
    label: "宿泊",
    short: "宿泊",
    kr: "숙소",
    description: "ホテル選びとエリアの特徴",
    href: "/korea/travel/hotels",
    intro:
      "ソウル・釜山の宿泊エリアの特徴と、予約前に確認したい税・キャンセル条件・アクセスのポイントを紹介します。",
  },
  prepare: {
    label: "旅の準備",
    short: "旅の準備",
    kr: "준비",
    description: "持ち物・通信・予算・季節と服装",
    href: "/korea/travel/prepare",
    intro:
      "パスポート、通信手段、決済、持ち物、予算、季節ごとの服装まで。韓国旅行の準備を時系列で確認できます。",
  },
  beauty: {
    label: "韓国コスメ",
    short: "コスメ",
    kr: "뷰티",
    description: "韓国コスメの買い物ガイド",
    href: "/korea/beauty",
    intro:
      "OLIVE YOUNGなどの店舗と通販の使い分け、テスターの確認、免税・返品・持ち帰りの注意点をまとめています。",
  },
  fashion: {
    label: "韓国ファッション",
    short: "ファッション",
    kr: "패션",
    description: "韓国ファッションの買い物ガイド",
    href: "/korea/fashion",
    intro:
      "サイズ表記の違い、試着と返品の条件、日本への持ち帰りと関税の注意点を紹介します。",
  },
};
