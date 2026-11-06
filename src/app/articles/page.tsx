import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleCard } from "@/components/article-card";
import { publishedArticles } from "@/data";

export const metadata: Metadata = {
  title: "記事一覧｜韓国旅行・韓国コスメの総額比較",
  description:
    "韓国旅行・韓国コスメ・ファッションの総額比較に関する記事一覧。比較条件・計算式・確認日時を明記した記事のみ公開しています。",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const keyword = (q ?? "").trim();
  const articles = keyword
    ? publishedArticles.filter(
        (a) =>
          a.title.includes(keyword) ||
          a.description.includes(keyword) ||
          a.sections.some((s) =>
            s.paragraphs.some((p) => p.includes(keyword)),
          ),
      )
    : publishedArticles;

  return (
    <>
      <PageHeader
        eyebrow="記事"
        title="総額で比べるための記事一覧"
        lead="比較条件の揃え方、見落としやすい費用、公式情報の確認手順をまとめています。根拠が揃わない記事は下書きのまま保持し、公開しません。"
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/articles", label: "記事" }]} />

        <form action="/articles" method="get" role="search" className="mb-6 flex max-w-xl gap-2">
          <label htmlFor="q" className="sr-only">
            記事を検索
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={keyword}
            placeholder="例: eSIM、送料、関税"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            検索
          </button>
        </form>

        {keyword ? (
          <p className="mb-4 text-sm text-slate-600">
            「{keyword}」の検索結果: {articles.length}件
          </p>
        ) : null}

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            該当する記事がありません。別のキーワードで検索してください。
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
