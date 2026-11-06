import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "運営者情報",
  description:
    "韓国旅行ノートの運営方針、対象読者、情報の作成方法、お問い合わせ窓口について説明します。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="運営者情報"
        title="韓国旅行ノートについて"
        lead="ソウル・釜山・済州を中心に、韓国旅行をもっと楽しくする情報を日本語で届けるメディアです。"
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/about", label: "運営者情報" }]} />
        <div className="prose-jp max-w-3xl">
          <h2>サイトの目的</h2>
          <p>
            韓国旅行の計画に必要な情報は、エリア・交通・グルメ・買い物など多岐にわたります。
            当サイトは、初めての渡韓でも迷わないように、旅程の組み方と現地での注意点を整理して紹介します。
          </p>

          <h2>情報の作り方</h2>
          <p>
            営業時間・料金・交通・制度は、事業者や公的機関の公式情報を確認して掲載します。
            確認できない情報は掲載せず、AIは下書きや検査の補助に限定しています。公開前に人のレビューと出典の照合を行います。
          </p>

          <h2>運営体制</h2>
          <p>
            本サイトは個人運営のメディアです。特定の芸能グループやファンダムに依存した情報提供は行いません。
            広告収入はアフィリエイト報酬による場合がありますが、記事内容や紹介順には影響させません。
          </p>

          <h2>開示事項</h2>
          <p>
            運営者の氏名・所在地・連絡先などの詳細は、本番公開前に確定して掲載します。
            現時点ではプレビュー環境のため、特定商取引法に基づく表記は準備中です。
            訂正のご依頼はお問い合わせ窓口から受け付けます。
          </p>

          <h2>免責</h2>
          <p>
            営業時間・料金・交通・イベントは変更される場合があります。最新の情報は必ず各公式サイトでご確認ください。
            当サイトの情報に基づく判断によって生じた損害について、運営者は責任を負いかねます。
          </p>
        </div>
      </div>
    </>
  );
}
