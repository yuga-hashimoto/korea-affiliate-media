import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { articlesByCategory } from "@/data";
import { ArticleCard } from "@/components/article-card";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "韓国旅行の総額比較｜航空券・ホテル・eSIM・交通費",
  description:
    "韓国旅行の総支払額を比較するための入口。航空券・ホテル・eSIM・空港交通・現地交通を、税・手数料・為替まで含めて整理します。",
  alternates: { canonical: "/korea/travel" },
};

const sections = [
  {
    href: "/korea/travel/esim",
    title: "eSIM",
    description: "日数・容量・為替込みの総額。容量切れの追加購入も確認項目。",
  },
  {
    href: "/korea/travel/hotels",
    title: "ホテル",
    description: "税・サービス料・清掃料・キャンセル条件を含めた宿泊総額。",
  },
  {
    href: "/korea/travel/airport-transport",
    title: "空港交通",
    description: "仁川空港からソウル市内への運賃・所要時間・乗り換え。",
  },
  {
    href: "/articles/seoul-budget-2nights-3days",
    title: "予算の立て方",
    description: "固定費と変動費に分けて、自分の条件で試算する手順。",
  },
];

export default function TravelPage() {
  const articles = articlesByCategory("experience").concat(articlesByCategory("transport"));
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "韓国旅行の総額比較",
          url: `${siteUrl()}/korea/travel`,
          isPartOf: { "@type": "WebSite", url: siteUrl() },
        }}
      />
      <PageHeader
        eyebrow="韓国旅行"
        title="韓国旅行の総額を、条件を揃えて比較する"
        lead="航空券・ホテル・eSIM・空港交通は、表示価格と実際の支払額がずれやすい項目です。税・手数料・為替・キャンセル条件まで含めた総額で比較します。"
        meta={<span>最終更新: 2026-11-06</span>}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/korea/travel", label: "韓国旅行" }]} />

        <section aria-labelledby="travel-items">
          <h2 id="travel-items" className="text-xl sm:text-2xl">
            項目別に比較する
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="card block h-full p-5 no-underline transition hover:border-brand-400 hover:shadow-md"
                >
                  <p className="text-lg font-bold text-slate-900">{section.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
                  <p className="mt-4 text-xs font-semibold text-brand-700">比較ページへ →</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl">旅行の総額に含める項目</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-700 sm:grid-cols-2">
            <li>・航空券（燃油サーチャージ・空港税・手数料込み）</li>
            <li>・宿泊（税・サービス料・清掃料・現地徴収）</li>
            <li>・空港から市内への交通</li>
            <li>・eSIM / Wi-Fi / ローミング</li>
            <li>・現地交通（地下鉄・バス・タクシー）</li>
            <li>・食費・体験費・入場料</li>
            <li>・海外旅行保険</li>
            <li>・カードの海外事務手数料・為替差</li>
          </ul>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            確認できない項目は0円にせず、UNKNOWNとして残します。条件が異なる金額を並べて「最安」と表示することはありません。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl">関連記事</h2>
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
