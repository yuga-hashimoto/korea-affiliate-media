import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ComparisonSection } from "@/components/comparison-section";
import { articlesByCategory, offersForGroup } from "@/data";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "韓国eSIM 総額比較｜5日・3GBを同じ条件で比べる",
  description:
    "韓国旅行用eSIMの総額比較。本体価格・税金・手数料・為替を含めた円換算額と、確認日時・適用条件を表示します。未確認項目はUNKNOWNとして扱います。",
  alternates: { canonical: "/korea/travel/esim" },
};

const faqs = [
  {
    q: "表示価格が最も安いプランを選べばよいですか？",
    a: "いいえ。通貨・税・手数料・為替を揃えた総額で比較してください。未確認の項目があるオファーは順位付けの対象外としています。",
  },
  {
    q: "サンプルとは何ですか？",
    a: "画面と計算ロジックの検証用に用意した架空の価格です。実在の販売価格ではありません。公開時には許諾済みの公式情報に置き換えます。",
  },
  {
    q: "為替はいつ時点ですか？",
    a: "各比較の詳細に、換算レートと観測日時を表示します。実際の請求額は決済時のレートで変動します。",
  },
];

export default function EsimPage() {
  const offers = offersForGroup("esim-5d-3gb-1p");
  const articles = articlesByCategory("esim");
  const updatedAt = "2026-11-06";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
      <PageHeader
        eyebrow="韓国旅行 / eSIM"
        title="韓国eSIMの総額比較（5日間・3GB・1人）"
        lead="販売通貨・税・手数料・為替を揃えたうえで、実際に支払う総額を比較します。確認できない項目はUNKNOWNとして表示し、確定した最安とは書きません。"
        meta={
          <span>
            最終更新: {updatedAt} ／ 比較条件: 5日間・3GB・1人・1回線
          </span>
        }
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/korea/travel", label: "韓国旅行" },
            { href: "/korea/travel/esim", label: "eSIM" },
          ]}
        />

        <ComparisonSection
          offers={offers}
          scenarioTitle="eSIM 5日間 / 3GB / 1人"
          scenarioDetail="同一条件のプランのみを比較します。税込表記の商品に税金を二重計上せず、会員限定クーポンは利用条件を確認できた場合のみ反映します。"
        />

        <section className="mt-10" aria-labelledby="esim-faq">
          <h2 id="esim-faq" className="text-xl sm:text-2xl">
            よくある質問
          </h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-5">
                <dt className="font-semibold text-slate-900">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-7 text-slate-600">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="text-xl sm:text-2xl">関連記事</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs leading-5 text-slate-500">
          このページの構造化データは、実際のページ内容（FAQ）に対応しています。
          価格の構造化データ（Offer）は、提携・価格の確認が取れるまで出力しません。
          参照: <a href={`${siteUrl()}/methodology`} className="text-brand-700">比較手法</a>
        </p>
      </div>
    </>
  );
}
