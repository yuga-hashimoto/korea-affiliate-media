import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleCard } from "@/components/article-card";
import { publishedArticles, searchArticles } from "@/data";
import { CATEGORY_META } from "@/lib/categories";
import type { Category } from "@/lib/domain";

export const metadata: Metadata = {
  title: "記事一覧",
  description:
    "韓国旅行の記事一覧。ソウル・釜山・済州のエリアガイド、モデルコース、グルメ、カフェ、買い物、交通、旅の準備をまとめています。",
  alternates: { canonical: "/articles" },
};

const filters: Array<{ key: Category | "all"; label: string }> = [
  { key: "all", label: "すべて" },
  ...(Object.entries(CATEGORY_META) as Array<[Category, (typeof CATEGORY_META)[Category]]>).map(
    ([key, meta]) => ({ key, label: meta.short }),
  ),
];

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const keyword = (q ?? "").trim();
  const active = filters.find((filter) => filter.key === category)?.key ?? "all";

  let articles = searchArticles(keyword);
  if (active !== "all") {
    articles = articles.filter((article) => article.category === active);
  }

  return (
    <>
      <PageHeader
        eyebrow="記事"
        title="韓国旅行の記事一覧"
        lead="エリア・テーマ別に、韓国旅行の計画に役立つ記事をまとめています。営業時間や料金は変動するため、お出かけ前に公式情報をご確認ください。"
        meta={<span>公開記事 {publishedArticles.length}件</span>}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/articles", label: "記事" }]} />

        <form action="/articles" method="get" role="search" className="mb-4 flex max-w-xl gap-2">
          <label htmlFor="q" className="sr-only">
            記事を検索
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={keyword}
            placeholder="例: ソウル、カフェ、免税"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          {active !== "all" ? (
            <input type="hidden" name="category" value={active} />
          ) : null}
          <button
            type="submit"
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            検索
          </button>
        </form>

        <nav aria-label="カテゴリで絞り込む" className="mb-6 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = filter.key === active;
            const href =
              filter.key === "all"
                ? keyword
                  ? `/articles?q=${encodeURIComponent(keyword)}`
                  : "/articles"
                : `/articles?category=${filter.key}${keyword ? `&q=${encodeURIComponent(keyword)}` : ""}`;
            return (
              <Link
                key={filter.key}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold no-underline ${
                  isActive
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-brand-400"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </nav>

        <p className="mb-4 text-sm text-slate-600">
          {keyword ? `「${keyword}」の検索結果: ` : ""}
          {articles.length}件
        </p>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            該当する記事がありません。別のキーワードやカテゴリでお試しください。
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
