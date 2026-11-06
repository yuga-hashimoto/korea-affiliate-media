import type { ArticleDraft } from "./schema";
import type { ArticleTopic } from "./topics";

/**
 * APIキーがない環境でパイプラインを検証するための決定的なモック。
 * 実データを装わず、事実値を含まない一般的な説明だけを生成する。
 */
export function mockArticleDraft(topic: ArticleTopic): ArticleDraft {
  return {
    title: topic.titleHint,
    description: `${topic.summary}。当日の流れと、事前に確認しておきたいポイントを整理します。`,
    category: topic.category,
    sections: [
      {
        heading: "結論：先に決めておくと楽になること",
        paragraphs: [
          `${topic.summary}ためには、移動時間と滞在時間を先に見積もっておくことが大切です。予定を詰め込みすぎると、現地での変更が難しくなります。`,
          "営業時間・料金・交通は変更される場合があります。出発前と当日に、公式サイトや現地の案内で最新情報を確認してください。",
        ],
      },
      {
        heading: "現地で確認したいこと",
        paragraphs: [
          `${topic.checklist.join("、")}を確認します。特に営業時間と定休日は、祝日や季節で変わる場合があります。`,
          "混雑する時間帯を避けると、待ち時間を減らせます。人気の場所は開店直後か平日の午前中が比較的落ち着いています。",
        ],
      },
      {
        heading: "旅程への組み込み方",
        paragraphs: [
          "午前と午後でエリアを分け、移動の往復を減らすと疲れにくくなります。食事と休憩の時間を先に確保しておくと、予定が崩れても立て直しやすいです。",
          "雨や気温の変化に備えて、屋内で過ごせる代替案を1つ用意しておくと安心です。",
        ],
      },
      {
        heading: "安全とマナー",
        paragraphs: [
          "貴重品の管理と、夜間の移動手段の確認を忘れずに行ってください。公共交通の終電時刻は日によって異なります。",
          "店舗や施設のルールに従い、撮影可否や滞在マナーを確認しましょう。",
        ],
      },
    ],
    faq: [
      {
        question: "何時ごろに行くと空いていますか？",
        answer:
          "開店直後や平日の午前中は比較的空いています。祝日や週末は混雑するため、時間に余裕を持って向かってください。",
      },
      {
        question: "雨の日でも楽しめますか？",
        answer:
          "屋内の施設やカフェを組み合わせれば楽しめます。屋外の予定は別日に回すか、代替案を用意してください。",
      },
    ],
    sourceIds: topic.evidenceIds,
    disclosure:
      "本記事はアフィリエイト広告を含む場合があります。広告の有無は記事内容に影響しません。",
    risks: [],
    confidence: "medium",
  };
}
