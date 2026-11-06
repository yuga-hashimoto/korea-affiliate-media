import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ComparisonSection } from "@/components/comparison-section";
import { articlesByCategory, offersForGroup } from "@/data";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "韓国コスメの送料込み総額比較｜関税・為替まで含める",
  description:
    "韓国コスメを通販で買うときの総支払額を比較。商品価格・送料・関税・輸入消費税・為替・クーポン条件を分けて表示し、未確認項目はUNKNOWNとします。",
  alternates: { canonical: "/korea/beauty" },
};

const costItems = [
  ["商品本体", "税込/税別の区別、セット内容、容量"],
  ["送料", "無料条件、重量・容積、まとめ買いの閾値"],
  ["関税・輸入消費税", "条件により課税。税関の公式情報で確認"],
  ["決済手数料", "海外事務手数料、通貨変換手数料"],
  ["クーポン", "閾値・上限・会員条件・有効期限"],
  ["返品", "返送料、期限、返金方法"],
];

export default function BeautyPage() {
  const offers = offersForGroup("beauty-serum-30ml-1p");
  const articles = articlesByCategory("beauty");
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "韓国コスメの総額比較",
          url: `${siteUrl()}/korea/beauty`,
        }}
      />
      <PageHeader
        eyebrow="韓国コスメ"
        title="韓国コスメの「送料・関税・為替込み」総額比較"
        lead="商品価格が安くても、送料・関税・決済手数料・為替で総額は変わります。条件を揃えて、実際に支払う額で比較します。"
        meta={<span>最終更新: 2026-11-06 ／ 比較条件: 美容液 30mL・1本</span>}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/korea/beauty", label: "韓国コスメ" }]} />

        <ComparisonSection
          offers={offers}
          scenarioTitle="美容液 30mL / 1本"
          scenarioDetail="本体価格・送料・税・手数料・クーポンを分けて表示します。会員限定クーポンは、条件を確認できた場合のみ総額に反映します。"
        />

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl">総額に含める項目</h2>
          <dl className="mt-4 divide-y divide-slate-100">
            {costItems.map(([term, description]) => (
              <div key={term} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                <dt className="font-semibold text-slate-800">{term}</dt>
                <dd className="text-sm leading-6 text-slate-600">{description}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            関税・輸入消費税の適用は商品・数量・用途で変わります。当サイトは税率を推測せず、
            <a
              href="https://www.customs.go.jp/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-brand-700"
            >
              税関の公式情報
            </a>
            を確認する前提で表示します。化粧品の効能効果について断定的な表現は行いません。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl sm:text-2xl">関連記事</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
