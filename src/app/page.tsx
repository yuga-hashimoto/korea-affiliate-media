import Link from "next/link";
import type { Metadata } from "next";
import { latestArticles } from "@/data";
import { CATEGORY_META } from "@/lib/categories";
import type { Category } from "@/lib/domain";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { SITE, siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: { absolute: "韓国旅行ノート｜ソウル・釜山・済州の旅行ガイド" },
  description: SITE.description,
  alternates: { canonical: "/" },
};

const destinations: Array<{
  category: Category;
  gradient: string;
  copy: string;
}> = [
  {
    category: "seoul",
    gradient: "from-teal-700 to-emerald-600",
    copy: "明洞・弘大・江南。初めてでも迷わない定番ルート",
  },
  {
    category: "busan",
    gradient: "from-sky-700 to-cyan-600",
    copy: "海と市場の街。1泊2日で楽しむ釜山",
  },
  {
    category: "jeju",
    gradient: "from-indigo-700 to-sky-600",
    copy: "自然とカフェを巡る、レンタカー旅の基本",
  },
];

const quickCategories: Category[] = [
  "food",
  "cafe",
  "shopping",
  "transport",
  "hotel",
  "prepare",
];

const steps = [
  {
    title: "エリアを決める",
    body: "泊まる場所と行きたい場所を決めると、移動時間と予算が組みやすくなります。",
    href: "/korea/travel/seoul",
    cta: "ソウルのエリアを見る",
  },
  {
    title: "旅の準備をする",
    body: "パスポート・通信・決済・持ち物をチェック。初めての韓国旅行はここが肝心です。",
    href: "/korea/travel/prepare",
    cta: "準備リストを見る",
  },
  {
    title: "当日を楽しむ",
    body: "食堂・カフェ・市場の回り方と、困ったときの対処をまとめています。",
    href: "/korea/food",
    cta: "グルメガイドを見る",
  },
];

export default function HomePage() {
  const articles = latestArticles(6);

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
        }}
      />

      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-brand-50">
        <div className="container-page py-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
            {SITE.tagline}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
            次の休みは、
            <br className="hidden sm:block" />
            ソウルへ。
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
            初めての韓国旅行から、週末のリピートまで。
            エリアの選び方、モデルコース、グルメ、カフェ、買い物、交通、旅の準備を
            日本語でわかりやすくまとめています。営業時間・料金は変動するため、公式情報の確認を前提にご利用ください。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/korea/travel/seoul"
              className="rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-800"
            >
              ソウル旅行ガイド
            </Link>
            <Link
              href="/articles/seoul-2nights-3days-model-course"
              className="rounded-lg border border-brand-700 bg-white px-5 py-3 text-sm font-semibold text-brand-800 no-underline hover:bg-brand-50"
            >
              2泊3日モデルコース
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-10" aria-labelledby="destinations">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="destinations" className="text-xl sm:text-2xl">
            目的地から探す
          </h2>
          <Link href="/korea/travel" className="text-sm text-brand-700 underline">
            旅行ガイド一覧
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {destinations.map((destination) => {
            const meta = CATEGORY_META[destination.category];
            return (
              <Link
                key={destination.category}
                href={meta.href}
                className={`group relative flex min-h-44 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${destination.gradient} p-5 no-underline shadow-sm transition hover:shadow-lg`}
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                  {destination.category.toUpperCase()}
                </span>
                <span className="mt-1 text-2xl font-bold text-white">
                  {meta.label}
                </span>
                <span className="mt-2 text-sm leading-6 text-white/90">
                  {destination.copy}
                </span>
                <span className="mt-3 text-xs font-semibold text-white">
                  ガイドを見る →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-10" aria-labelledby="steps">
        <div className="container-page">
          <h2 id="steps" className="text-xl sm:text-2xl">
            はじめての韓国旅行、3ステップ
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-bold text-brand-700">STEP {index + 1}</p>
                <h3 className="mt-1 text-base">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
                <Link
                  href={step.href}
                  className="mt-3 inline-block text-xs font-semibold text-brand-700 underline"
                >
                  {step.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10" aria-labelledby="categories">
        <h2 id="categories" className="text-xl sm:text-2xl">
          テーマから探す
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickCategories.map((category) => {
            const meta = CATEGORY_META[category];
            return (
              <li key={category}>
                <Link
                  href={meta.href}
                  className="card block h-full p-4 no-underline transition hover:border-brand-400 hover:shadow-md"
                >
                  <p className="text-sm font-bold text-slate-900">{meta.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {meta.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="container-page py-6" aria-labelledby="latest">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="latest" className="text-xl sm:text-2xl">
            新着記事
          </h2>
          <Link href="/articles" className="text-sm text-brand-700 underline">
            すべて見る
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:p-8">
          <h2 className="text-lg text-brand-900">
            更新情報はX（{SITE.xHandle}）でも
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-900/80">
            新着記事や季節の情報を発信しています。アフィリエイト広告を含む投稿にはPR表記を行います。
          </p>
          <a
            href="https://x.com/bts_95_y"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-4 inline-block rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-800"
          >
            Xで最新情報を見る
          </a>
        </div>
      </section>
    </>
  );
}
