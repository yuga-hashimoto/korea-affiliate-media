import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "運営者情報｜総額比較",
  description:
    "総額比較の運営方針、対象読者、情報の作成方法、お問い合わせ窓口について説明します。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="運営者情報"
        title="総額比較について"
        lead="韓国旅行・韓国コスメ・韓国ファッションの「実際に支払う総額」を、根拠と条件つきで比較するメディアです。"
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/about", label: "運営者情報" }]} />
        <div className="prose-jp max-w-3xl">
          <h2>サイトの目的</h2>
          <p>
            旅行予約サイトや通販サイトの表示価格は、税・送料・手数料・為替・クーポン条件によって実際の支払額と異なります。
            当サイトは、条件を揃えた総額と、その根拠を提示することで、読者が納得して予約・購入を判断できる状態を目指します。
          </p>

          <h2>情報の作り方</h2>
          <p>
            価格・条件は、販売事業者や公的機関の公式情報を確認して掲載します。確認できない項目は UNKNOWN と表示し、
            0 円として計算しません。AIは下書きや検査の補助に使用しますが、公開前に人的レビューと根拠の照合を行います。
          </p>

          <h2>運営体制</h2>
          <p>
            本サイトは個人運営のメディアです。特定の芸能グループやファンダムに依存した情報提供は行いません。
            広告収入はアフィリエイト報酬による場合がありますが、比較結果や順位には影響させません。
          </p>

          <h2>開示事項</h2>
          <p>
            運営者の氏名・所在地・連絡先などの詳細は、本番公開前に確定して掲載します。
            現時点ではプレビュー環境のため、特定商取引法に基づく表記は準備中です。
            訂正のご依頼はお問い合わせ窓口から受け付けます。
          </p>

          <h2>免責</h2>
          <p>
            掲載する価格・条件は変動します。最新の条件は必ず各公式サイトでご確認ください。
            当サイトの情報に基づく判断によって生じた損害について、運営者は責任を負いかねます。
          </p>
        </div>
      </div>
    </>
  );
}
