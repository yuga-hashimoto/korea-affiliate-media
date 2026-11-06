import Link from "next/link";
import type { Metadata } from "next";
import { publishedArticles, offersForGroup } from "@/data";
import { ComparisonSection } from "@/components/comparison-section";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { SITE, siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "総額比較｜韓国旅行・韓国コスメの費用をわかりやすく比較",
  description: SITE.description,
  alternates: { canonical: "/" },
};

const quickLinks = [
  {
    href: "/korea/travel/esim",
    label: "韓国eSIM",
    description: "日数・容量・為替まで含めた総額",
  },
  {
    href: "/korea/travel/hotels",
    label: "ソウルのホテル",
    description: "税・手数料・キャンセル条件込み",
  },
  {
    href: "/korea/travel/airport-transport",
    label: "空港からの交通",
    description: "仁川→ソウルの運賃と所要時間",
  },
  {
    href: "/korea/beauty",
    label: "韓国コスメ",
    description: "送料・関税・為替込みの実支払額",
  },
];

const principles = [
  {
    title: "未確認は UNKNOWN",
    body: "価格が確認できない項目を 0 円として合計しません。不明な項目がある場合は「確認済み項目の最低額」として表示します。",
  },
  {
    title: "出典と確認日時を表示",
    body: "すべての価格に、参照元URL・確認日時・適用条件・有効期限を紐づけます。古い情報は「要再確認」と表示します。",
  },
  {
    title: "報酬で順位を決めない",
    body: "掲載順位は総額・条件・鮮度に基づきます。アフィリエイト報酬の有無や金額は順位の根拠にしません。",
  },
];

export default function HomePage() {
  const featured = publishedArticles.slice(0, 3);
  const esimOffers = offersForGroup("esim-5d-3gb-1p");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: siteUrl(),
          logo: `${siteUrl()}/icon.svg`,
          description: SITE.description,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: siteUrl(),
          description: SITE.description,
          inLanguage: "ja",
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteUrl()}/articles?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-brand-50">
        <div className="container-page py-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
            韓国旅行・韓国コスメの総額比較
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
            表示価格ではなく、
            <br className="hidden sm:block" />
            「実際に払う総額」で比べる。
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
            航空券・ホテル・eSIM・韓国コスメ。送料・税金・手数料・クーポン・為替まで含めた総額を、
            同じ条件で並べます。確認できない項目は UNKNOWN のまま表示し、根拠と確認日時を明記します。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/korea/travel"
              className="rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-800"
            >
              韓国旅行の総額を比べる
            </Link>
            <Link
              href="/korea/beauty"
              className="rounded-lg border border-brand-700 bg-white px-5 py-3 text-sm font-semibold text-brand-800 no-underline hover:bg-brand-50"
            >
              韓国コスメの送料込み比較
            </Link>
          </div>

          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["比較する項目", "本体・送料・税・手数料・クーポン"],
              ["表示する根拠", "公式URL・確認日時・適用条件"],
              ["順位の基準", "総額と鮮度（報酬額は不使用）"],
            ].map(([term, description]) => (
              <div key={term} className="rounded-xl border border-slate-200 bg-white p-4">
                <dt className="text-xs font-semibold text-slate-500">{term}</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page py-10" aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="text-xl sm:text-2xl">
          用途から探す
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="card block h-full p-5 no-underline transition hover:border-brand-400 hover:shadow-md"
              >
                <p className="text-base font-bold text-slate-900">{link.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
                <p className="mt-4 text-xs font-semibold text-brand-700">比較を見る →</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white py-10" aria-labelledby="how-heading">
        <div className="container-page">
          <h2 id="how-heading" className="text-xl sm:text-2xl">
            このサイトの比較ルール
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {principles.map((item, index) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-bold text-brand-700">RULE {index + 1}</p>
                <h3 className="mt-1 text-base">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link href="/methodology" className="text-brand-700 underline">
              計算式・比較条件の詳細を見る
            </Link>
          </p>
        </div>
      </section>

      <div className="container-page pb-4">
        <ComparisonSection
          offers={esimOffers}
          scenarioTitle="eSIM 5日間 / 3GB / 1人"
          scenarioDetail="条件を揃えたうえで、送料・税・手数料・クーポンを含む円換算の総額を比較します。サンプルデータが含まれる場合は明示します。"
        />
      </div>

      <section className="container-page py-10" aria-labelledby="articles-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="articles-heading" className="text-xl sm:text-2xl">
            最新の記事
          </h2>
          <Link href="/articles" className="text-sm text-brand-700">
            すべて見る
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {featured.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
