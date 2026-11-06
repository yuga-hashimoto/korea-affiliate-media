import type { ArticleDraft, SocialDraft } from "./schema";
import type { ArticleTopic } from "./topics";

/**
 * APIキーがない環境でパイプラインを検証するための決定的なモック。
 * 実データを装わず、事実値を含まない一般的な説明だけを生成する。
 */
export function mockArticleDraft(topic: ArticleTopic): ArticleDraft {
  return {
    title: topic.titleHint,
    description: `${topic.summary}。比較条件の揃え方と、確認できない項目の扱いを整理します。`,
    category: topic.category,
    sections: [
      {
        heading: "結論：条件を揃えてから比較する",
        paragraphs: [
          `${topic.summary}ためには、対象となる商品・サービスの条件を揃えることが前提になります。日程・人数・容量・通貨・税の扱いが異なる金額を並べても、意味のある比較にはなりません。`,
          "当サイトでは、確認できない項目を0円として扱いません。未確認の項目がある場合は「確認済み項目の最低額」として表示し、確定した最安とは書きません。",
        ],
      },
      {
        heading: "比較前に確認する項目",
        paragraphs: [
          `${topic.checklist.join("、")}を確認します。これらが揃わない場合は、比較対象から外すか、条件の違いを明示します。`,
          "出典URL・確認日時・適用条件・有効期限を記録し、古い情報は「要再確認」として扱います。",
        ],
      },
      {
        heading: "未確認項目の扱い",
        paragraphs: [
          "価格が取得できない場合はUNKNOWNと表示し、計算に0を代入しません。税・送料・手数料・為替のいずれかが不明なら、合計額は確定しません。",
          "クーポンは、閾値・上限・会員条件・有効期限を確認できた場合のみ総額に反映します。条件が未確認の場合は「未適用」と明示します。",
        ],
      },
      {
        heading: "更新と訂正の方針",
        paragraphs: [
          "掲載後も定期的に公式情報を再確認し、変更があれば更新日時とともに反映します。誤りを見つけた場合は、確認のうえ速やかに訂正します。",
          "本記事は一般的な比較手法の説明であり、個別商品の購入可否や効能を断定するものではありません。",
        ],
      },
    ],
    faq: [
      {
        question: "表示価格が安い商品を選べばよいですか？",
        answer:
          "いいえ。税・送料・手数料・為替の条件を揃えた総額で比較してください。未確認項目がある場合は最安と断定できません。",
      },
      {
        question: "情報が古い場合はどうなりますか？",
        answer:
          "確認から一定期間が経過した情報は「要再確認」と表示し、順位付けの対象から外します。",
      },
    ],
    sourceIds: topic.evidenceIds,
    disclosure:
      "本記事はアフィリエイト広告を含む場合があります。広告の有無は比較順位に影響しません。",
    risks: [],
    confidence: "medium",
  };
}

export function mockSocialDraft(topic: ArticleTopic): SocialDraft {
  return {
    text: `【${topic.titleHint}】\n条件を揃えないと、表示価格と実際の支払額は一致しません。税・送料・手数料・為替を含めた総額の考え方をまとめました。\n#韓国旅行 #総額比較\nPR`,
    articleSlug: null,
    disclosureMode: "pr_label",
    sourceIds: topic.evidenceIds,
    risks: [],
  };
}
