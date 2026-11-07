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
  copy: string;
}> = [
  {
    category: "seoul",
    image: "/images/seoul.jpg",
    copy: "明洞の夜、弘大のカフェ、宮殿の朝。初めてでも迷わないソウル。",
  },
  {
    category: "busan",
    image: "/images/busan.jpg",
    copy: "海と山と市場の街。1泊2日で楽しむ釜山の歩き方。",
  },
  {
    category: "jeju",
    image: "/images/jeju.jpg",
    copy: "黒い岩と青い海。レンタカーで巡る済州島の自然。",
  },
];

const quickCategories: Array<{ category: Category; bg: string }> = [
  { category: "food", bg: "bg-peach" },
  { category: "cafe", bg: "bg-lilac" },
  { category: "shopping", bg: "bg-mint" },
  { category: "transport", bg: "bg-sky" },
  { category: "hotel", bg: "bg-butter" },
  { category: "prepare", bg: "bg-[#FDE8E4]" },
];

const facts = [
  { kr: "통화", label: "通貨", value: "KRW", note: "韓国ウォン" },
  { kr: "시차", label: "時差", value: "なし", note: "日本と同じ" },
  { kr: "전압", label: "電圧", value: "220V", note: "C・Fタイプ" },
  { kr: "언어", label: "言語", value: "韓国語", note: "한국어" },
];

const ticker = [
  "SEOUL",
  "釜山",
  "JEJU",
  "グルメ",
  "カフェ",
  "ショッピング",
  "旅の準備",
  "KOREA TRAVEL",
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
      <section className="relative isolate min-h-[560px] overflow-hidden sm:min-h-[640px]">
        <Image
          src="/images/hero-seoul.jpg"
          alt="漢江から望むソウルの街並み"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-cobalt/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />

        <span
          aria-hidden="true"
          className="kr absolute -right-2 bottom-10 select-none text-[10rem] font-black leading-none text-white/10 sm:text-[17rem]"
        >
          서울
        </span>
        <span
          aria-hidden="true"
          className="absolute right-6 top-28 hidden text-[10px] font-bold tracking-[0.5em] text-white/50 [writing-mode:vertical-rl] sm:block"
        >
          KOREA TRAVEL NOTE
        </span>

        <div className="container-page relative flex min-h-[560px] flex-col justify-end pb-24 pt-20 sm:min-h-[640px] sm:pb-28">
          <span className="sticker w-fit -rotate-3 bg-sun text-ink">
            <span>週末はソウル</span>
            <span className="kr text-[9px] font-bold text-ink/75">주말엔 서울</span>
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl">
            週末は、
            <br />
            ソウル。
          </h1>
          <p className="mt-3 text-sm font-bold text-brand-200 sm:text-base">
            ソウルで会いましょう
            <span className="kr ml-2 text-[11px] font-semibold text-brand-200/80">
              서울에서 만나요
            </span>
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-cream/85 sm:text-base">
            初めての韓国旅行から、週末のリピートまで。
            エリアの選び方、モデルコース、グルメ、カフェ、買い物、旅の準備を日本語でまとめています。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/korea/travel/seoul"
              className="sticker !px-6 !py-3.5 !text-sm bg-brand-700 text-white hover:bg-brand-600"
            >
              <span>ソウル旅行ガイド</span>
              <span className="kr text-[10px] text-white">서울 가이드</span>
            </Link>
            <Link
              href="/articles/seoul-2nights-3days-model-course"
              className="sticker !px-6 !py-3.5 !text-sm bg-cobalt text-white hover:bg-cobalt-dark"
            >
              <span>2泊3日モデルコース</span>
              <span className="kr text-[10px] text-white">2박 3일 코스</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 旅の基本情報 */}
      <div className="container-page relative z-10 -mt-10">
        <div className="card hard-shadow grid grid-cols-2 gap-y-5 border-2 border-ink px-5 py-5 sm:grid-cols-4 sm:px-8">
          {facts.map((fact) => (
            <div
              key={fact.kr}
              className="border-l-2 border-ink/10 pl-4 first:border-l-0 first:pl-0 sm:pl-5"
            >
              <p className="text-[11px] font-black text-cobalt">{fact.label}</p>
              <p className="mt-1 text-lg font-black text-ink">{fact.value}</p>
              <p className="text-[10px] font-semibold text-slate-600">
                <span className="kr">{fact.kr}</span> / {fact.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* マーキー */}
      <div className="overflow-hidden border-y-2 border-ink bg-navy py-2 text-cream">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap text-[11px] font-black tracking-[0.2em]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-8" aria-hidden={copy === 1}>
              {ticker.map((word) => (
                <span key={`${copy}-${word}`} className="flex items-center gap-8">
                  <span className={word === "SEOUL" || word === "KOREA TRAVEL" ? "" : "kr"}>
                    {word}
                  </span>
                  <span className="text-brand-400">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Destinations */}
      <section className="container-page py-14" aria-labelledby="destinations">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-cobalt">
              旅行先 <span className="kr">여행지</span>{" "}
              <span className="text-slate-600">DESTINATIONS</span>
            </p>
            <h2 id="destinations" className="mt-2 text-2xl font-black sm:text-3xl">
              今日行くなら、どこ？
            </h2>
            <span className="mt-3 block h-1 w-12 bg-brand-600" aria-hidden="true" />
          </div>
          <Link href="/korea/travel" className="text-sm font-black text-cobalt underline">
            전체 보기
          </Link>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {destinations.map((destination) => {
            const meta = CATEGORY_META[destination.category];
            return (
              <Link
                key={destination.category}
                href={meta.href}
                className="group relative block overflow-hidden rounded-3xl border-2 border-ink no-underline shadow-[5px_5px_0_var(--color-ink)] transition hover:-translate-y-1"
              >
                <div className="relative h-80 w-full">
                  <Image
                    src={destination.image}
                    alt={`${meta.label}の街並み`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
                  <span className="sticker absolute left-4 top-4 -rotate-3 bg-sun text-ink">
                    <span>人気</span>
                    <span className="kr text-[9px] text-ink/70">인기</span>
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-white">{meta.label}</span>
                    <span className="kr text-sm font-bold text-brand-200">{meta.kr}</span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-cream/85">{destination.copy}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-black text-sun">
                    ガイドを見る <span className="kr text-[10px] opacity-80">가이드 보기</span> →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 特集 */}
      {featured ? (
        <section className="border-y-2 border-ink bg-[#FDF1E7] py-14" aria-labelledby="features">
          <div className="container-page">
            <p className="text-xs font-black tracking-[0.2em] text-cobalt">
              今週のおすすめ <span className="kr">이번 주 추천</span>{" "}
              <span className="text-slate-600">FEATURES</span>
            </p>
            <h2 id="features" className="mt-2 text-2xl font-black sm:text-3xl">
              編集部の特集
            </h2>

            <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
              <Link
                href={`/articles/${featured.slug}`}
                className="card group flex h-full flex-col overflow-hidden border-2 border-ink no-underline shadow-[5px_5px_0_var(--color-ink)] transition hover:-translate-y-1"
              >
                <div className="relative h-72 w-full shrink-0 sm:h-80">
                  <Image
                    src="/images/korean-food.jpg"
                    alt="韓国の食堂で提供される料理"
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="sticker absolute left-4 top-4 -rotate-2 bg-brand-700 text-white">
                    <span>グルメ特集</span>
                    <span className="kr text-[9px] text-white">필수</span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-end bg-navy p-6 text-cream">
                  <h3 className="text-xl font-black text-white sm:text-2xl">{featured.title}</h3>
                  <p className="mt-2 max-w-lg text-xs leading-6 text-cream/75">
                    {featured.description}
                  </p>
                  <p className="mt-4 text-xs font-black text-sun">記事を読む →</p>
                </div>
              </Link>

              <div className="grid gap-4">
                {subFeatures.map((article, index) => (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="card group flex gap-4 border-2 border-ink p-5 no-underline transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-ink)]"
                  >
                    <span className="kr text-3xl font-black text-cobalt">
                      0{index + 1}
                    </span>
                    <span>
                      <span className="text-[10px] font-black tracking-widest text-brand-700">
                        {CATEGORY_META[article.category].short}
                        <span className="kr ml-1">
                          {CATEGORY_META[article.category].kr}
                        </span>
                      </span>
                      <span className="mt-1 block text-base font-bold leading-7 text-ink group-hover:text-cobalt">
                        {article.title}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-600">
                        {article.description}
                      </span>
                    </span>
                  </Link>
                ))}
                <div className="rounded-3xl border-2 border-ink bg-cobalt p-6 text-white shadow-[4px_4px_0_var(--color-ink)]">
                  <p className="text-[10px] font-black tracking-[0.2em] text-sky">
                    旅のヒント <span className="kr">여행 팁</span>
                  </p>
                  <p className="mt-2 text-lg font-black leading-7">
                    はじめての韓国旅行、何から決める？
                  </p>
                  <p className="mt-2 text-xs leading-6 text-white">
                    エリア・通信・持ち物・予算を、順番にチェックできます。
                  </p>
                  <Link
                    href="/korea/travel/prepare"
                    className="mt-4 inline-block rounded-full border-2 border-ink bg-sun px-4 py-2 text-xs font-black text-ink no-underline"
                  >
                    準備ガイド
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Categories */}
      <section className="container-page py-14" aria-labelledby="categories">
        <p className="text-xs font-black tracking-[0.2em] text-cobalt">
          テーマ <span className="kr">테마</span>{" "}
          <span className="text-slate-600">CATEGORIES</span>
        </p>
        <h2 id="categories" className="mt-2 text-2xl font-black sm:text-3xl">
          テーマから探す
        </h2>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickCategories.map(({ category, bg }) => {
            const meta = CATEGORY_META[category];
            return (
              <Link
                key={category}
                href={meta.href}
                className={`group flex h-full flex-col justify-between rounded-2xl border-2 border-ink ${bg} p-5 no-underline shadow-[3px_3px_0_var(--color-ink)] transition hover:-translate-y-1 hover:rotate-1`}
              >
                <span className="text-base font-black text-ink">{meta.label}</span>
                <span className="kr mt-1 block text-xs font-bold text-ink/75">{meta.kr}</span>
                <span className="mt-1 text-[11px] font-semibold leading-5 text-ink/75">
                  {meta.description}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Steps */}
      <section className="border-y-2 border-ink bg-sky/60 py-14" aria-labelledby="steps">
        <div className="container-page">
          <p className="text-xs font-black tracking-[0.2em] text-cobalt">
            はじめての韓国 <span className="kr">처음 가는 한국</span>{" "}
            <span className="text-slate-600">FIRST TRIP</span>
          </p>
          <h2 id="steps" className="mt-2 text-2xl font-black sm:text-3xl">
            はじめての韓国旅行、3ステップ
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {[
              {
                kr: "지역",
                title: "エリアを決める",
                body: "泊まる場所と行きたい場所が決まると、移動時間と予算が組みやすくなります。",
                href: "/korea/travel/seoul",
                cta: "ソウルのエリアを見る",
              },
              {
                kr: "준비",
                title: "旅の準備をする",
                body: "パスポート・通信・決済・持ち物をチェック。初めての渡韓はここが肝心です。",
                href: "/korea/travel/prepare",
                cta: "準備リストを見る",
              },
              {
                kr: "당일",
                title: "当日を楽しむ",
                body: "食堂・カフェ・市場の回り方と、困ったときの対処をまとめています。",
                href: "/korea/food",
                cta: "グルメガイドを見る",
              },
            ].map((step, index) => (
              <div key={step.title} className="card border-2 border-ink p-6 shadow-[4px_4px_0_var(--color-ink)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-brand-700">
                    {step.kr === "지역" ? "エリア" : step.kr === "준비" ? "準備" : "当日"}
                    <span className="kr ml-1 text-[10px] font-bold">{step.kr}</span>
                  </span>
                  <span className="text-3xl font-black text-cobalt">0{index + 1}</span>
                </div>
                <h3 className="mt-3 text-lg font-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.body}</p>
                <Link href={step.href} className="mt-4 inline-block text-xs font-black text-cobalt underline">
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
            <p className="text-xs font-black tracking-[0.2em] text-cobalt">
              新着 <span className="kr">새 글</span>{" "}
              <span className="text-slate-600">NEW POSTS</span>
            </p>
            <h2 id="latest" className="mt-2 text-2xl font-black sm:text-3xl">
              新着記事
            </h2>
          </div>
          <Link href="/articles" className="text-sm font-black text-cobalt underline">
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
        <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-brand-700 px-6 py-9 text-white shadow-[5px_5px_0_var(--color-ink)] sm:px-10">
          <span aria-hidden="true" className="kr absolute -right-4 -top-8 text-[7rem] font-black text-white/10">
            여행
          </span>
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] text-white">
                FOLLOW US <span className="kr">· 팔로우</span>
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
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
              className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun px-6 py-3.5 text-sm font-black text-ink no-underline hover:bg-butter"
            >
              Xで最新情報を見る
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
