import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { latestArticles, getPublishedArticle } from "@/data";
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
  image: string;
  kr: string;
  en: string;
  copy: string;
}> = [
  {
    category: "seoul",
    image: "/images/seoul.jpg",
    kr: "서울",
    en: "SEOUL",
    copy: "明洞の夜、弘大のカフェ、宮殿の朝。初めてでも迷わないソウル。",
  },
  {
    category: "busan",
    image: "/images/busan.jpg",
    kr: "부산",
    en: "BUSAN",
    copy: "海と山と市場の街。1泊2日で楽しむ釜山の歩き方。",
  },
  {
    category: "jeju",
    image: "/images/jeju.jpg",
    kr: "제주",
    en: "JEJU",
    copy: "黒い岩と青い海。レンタカーで巡る済州島の自然。",
  },
];

const quickCategories: Array<{ category: Category; kr: string }> = [
  { category: "food", kr: "맛집" },
  { category: "cafe", kr: "카페" },
  { category: "shopping", kr: "쇼핑" },
  { category: "transport", kr: "교통" },
  { category: "hotel", kr: "숙소" },
  { category: "prepare", kr: "준비" },
];

const facts = [
  { label: "通貨", value: "KRW", note: "韓国ウォン" },
  { label: "時差", value: "なし", note: "日本と同じ" },
  { label: "電圧", value: "220V", note: "C・Fタイプ" },
  { label: "言語", value: "韓国語", note: "英語も一部" },
];

export default function HomePage() {
  const articles = latestArticles(6);
  const featured = getPublishedArticle("seoul-food-guide");
  const subFeatures = [
    getPublishedArticle("seoul-2nights-3days-model-course"),
    getPublishedArticle("busan-1night-2days-model-course"),
  ].filter((article): article is NonNullable<typeof article> => Boolean(article));

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

      {/* Hero */}
      <section className="relative isolate min-h-[540px] overflow-hidden sm:min-h-[620px]">
        <Image
          src="/images/hero-seoul.jpg"
          alt="漢江から望むソウルの街並み"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

        <span
          aria-hidden="true"
          className="kr absolute -bottom-10 right-2 select-none text-[10rem] font-bold leading-none text-cream/10 sm:text-[16rem]"
        >
          서울
        </span>

        <div className="container-page relative flex min-h-[540px] flex-col justify-end pb-24 pt-20 sm:min-h-[620px] sm:pb-28">
          <p className="eyebrow !text-brand-200">Seoul · Busan · Jeju</p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-[1.15] text-white sm:text-5xl lg:text-6xl">
            次の休みは、
            <br />
            ソウルへ。
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-cream/85 sm:text-base">
            初めての韓国旅行から、週末のリピートまで。
            エリアの選び方、モデルコース、グルメ、カフェ、買い物、旅の準備を日本語でまとめています。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/korea/travel/seoul"
              className="rounded-full bg-brand-700 px-6 py-3.5 text-sm font-bold text-white no-underline shadow-lg shadow-brand-900/30 transition hover:bg-brand-600"
            >
              ソウル旅行ガイド
            </Link>
            <Link
              href="/articles/seoul-2nights-3days-model-course"
              className="rounded-full border border-cream/70 bg-cream/10 px-6 py-3.5 text-sm font-bold text-cream no-underline backdrop-blur transition hover:bg-cream/20"
            >
              2泊3日モデルコース
            </Link>
          </div>
        </div>
      </section>

      {/* 旅の基本情報 */}
      <div className="container-page relative z-10 -mt-12">
        <div className="card paper-grain grid grid-cols-2 gap-y-5 px-5 py-5 sm:grid-cols-4 sm:px-8">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border-l border-[#efdfd3] pl-4 first:border-l-0 first:pl-0 sm:pl-5"
            >
              <p className="text-[10px] font-bold tracking-widest text-brand-700">
                {fact.label}
              </p>
              <p className="mt-1 text-lg font-bold text-ink">{fact.value}</p>
              <p className="text-[10px] text-slate-600">{fact.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Destinations */}
      <section className="container-page py-14" aria-labelledby="destinations">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Destinations</p>
            <h2 id="destinations" className="mt-2 text-2xl sm:text-3xl">
              今日行くなら、どこ？
            </h2>
          </div>
          <Link href="/korea/travel" className="text-sm font-semibold text-brand-700 underline">
            旅行ガイド一覧
          </Link>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {destinations.map((destination) => {
            const meta = CATEGORY_META[destination.category];
            return (
              <Link
                key={destination.category}
                href={meta.href}
                className="group relative block overflow-hidden rounded-3xl no-underline shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-72 w-full">
                  <Image
                    src={destination.image}
                    alt={`${meta.label}の街並み`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5" />
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink via-ink/90 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-bold tracking-[0.22em] text-cream/70">
                    {destination.en}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="kr text-sm text-brand-200">{destination.kr}</span>
                    <span className="text-2xl font-bold text-white">{meta.label}</span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-cream/80">{destination.copy}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-200">
                    ガイドを見る
                    <span aria-hidden="true">→</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 特集 */}
      {featured ? (
        <section className="bg-[#FDF1E7] py-14" aria-labelledby="features">
          <div className="container-page">
            <p className="eyebrow">Features</p>
            <h2 id="features" className="mt-2 text-2xl sm:text-3xl">
              編集部の特集
            </h2>

            <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
              <Link
                href={`/articles/${featured.slug}`}
                className="card group flex h-full flex-col overflow-hidden no-underline transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative h-72 w-full shrink-0 sm:h-80">
                  <Image
                    src="/images/korean-food.jpg"
                    alt="韓国の食堂で提供される料理"
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-brand-700 px-3 py-1 text-[10px] font-bold tracking-wider text-white">
                    グルメ特集
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-end bg-ink p-6 text-cream">
                  <h3 className="text-xl text-white sm:text-2xl">{featured.title}</h3>
                  <p className="mt-2 max-w-lg text-xs leading-6 text-cream/75">
                    {featured.description}
                  </p>
                  <p className="mt-4 text-xs font-bold text-brand-200">記事を読む →</p>
                </div>
              </Link>

              <div className="grid gap-4">
                {subFeatures.map((article, index) => (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="card group flex gap-4 p-5 no-underline transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="serif text-3xl font-bold text-brand-600">
                      0{index + 1}
                    </span>
                    <span>
                      <span className="text-[10px] font-bold tracking-widest text-brand-700">
                        {CATEGORY_META[article.category].label}
                      </span>
                      <span className="mt-1 block text-base font-semibold leading-7 text-ink group-hover:text-brand-700">
                        {article.title}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-600">
                        {article.description}
                      </span>
                    </span>
                  </Link>
                ))}
                <div className="rounded-3xl bg-brand-700 p-6 text-white">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-brand-50">
                    TRAVEL TIP
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-7">
                    はじめての韓国旅行、何から決める？
                  </p>
                  <p className="mt-2 text-xs leading-6 text-white/90">
                    エリア・通信・持ち物・予算を、順番にチェックできます。
                  </p>
                  <Link
                    href="/korea/travel/prepare"
                    className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-800 no-underline"
                  >
                    準備ガイドを見る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Categories */}
      <section className="container-page py-14" aria-labelledby="categories">
        <p className="eyebrow">Categories</p>
        <h2 id="categories" className="mt-2 text-2xl sm:text-3xl">
          テーマから探す
        </h2>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickCategories.map(({ category, kr }) => {
            const meta = CATEGORY_META[category];
            return (
              <Link
                key={category}
                href={meta.href}
                className="card group flex h-full flex-col justify-between p-5 no-underline transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <span className="kr text-xs font-semibold text-brand-700">{kr}</span>
                <span className="mt-6 block text-base font-bold text-ink group-hover:text-brand-700">
                  {meta.label}
                </span>
                <span className="mt-1 text-[11px] leading-5 text-slate-600">
                  {meta.description}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-sky/50 py-14" aria-labelledby="steps">
        <div className="container-page">
          <p className="eyebrow">First Trip</p>
          <h2 id="steps" className="mt-2 text-2xl sm:text-3xl">
            はじめての韓国旅行、3ステップ
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "エリアを決める",
                body: "泊まる場所と行きたい場所が決まると、移動時間と予算が組みやすくなります。",
                href: "/korea/travel/seoul",
                cta: "ソウルのエリアを見る",
              },
              {
                title: "旅の準備をする",
                body: "パスポート・通信・決済・持ち物をチェック。初めての渡韓はここが肝心です。",
                href: "/korea/travel/prepare",
                cta: "準備リストを見る",
              },
              {
                title: "当日を楽しむ",
                body: "食堂・カフェ・市場の回り方と、困ったときの対処をまとめています。",
                href: "/korea/food",
                cta: "グルメガイドを見る",
              },
            ].map((step, index) => (
              <div key={step.title} className="card p-6">
                <span className="serif text-3xl font-bold text-brand-600">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.body}</p>
                <Link
                  href={step.href}
                  className="mt-4 inline-block text-xs font-bold text-brand-700 underline"
                >
                  {step.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="container-page py-14" aria-labelledby="latest">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">New Posts</p>
            <h2 id="latest" className="mt-2 text-2xl sm:text-3xl">
              新着記事
            </h2>
          </div>
          <Link href="/articles" className="text-sm font-semibold text-brand-700 underline">
            すべて見る
          </Link>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* X CTA */}
      <section className="container-page pb-4">
        <div className="paper-grain overflow-hidden rounded-3xl bg-brand-700 px-6 py-9 text-white sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] text-brand-50">
                FOLLOW US
              </p>
              <h2 className="mt-2 text-2xl text-white">
                ソウル旅のヒントを、毎週。
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
                新着記事、季節の情報、旅の準備に役立つ話を X（{SITE.xHandle}）で発信しています。
                アフィリエイト広告を含む投稿にはPR表記を行います。
              </p>
            </div>
            <a
              href="https://x.com/bts_95_y"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-800 no-underline hover:bg-cream"
            >
              Xで最新情報を見る
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
