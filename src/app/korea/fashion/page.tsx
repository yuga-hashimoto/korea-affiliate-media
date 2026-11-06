import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { articlesByCategory } from "@/data";
import { ArticleCard } from "@/components/article-card";

export const metadata: Metadata = {
  title: "韓国ファッション通販の送料・返品比較（準備中）",
  description:
    "韓国ファッション通販の送料・関税・返品送料を総額で比較する準備ページ。サイズ・素材・返品条件の確認方法を整理します。",
  alternates: { canonical: "/korea/fashion" },
};

export default function FashionPage() {
  const articles = articlesByCategory("fashion");
  return (
    <>
      <PageHeader
        eyebrow="韓国ファッション"
        title="韓国ファッション通販の送料・返品まで含めた比較"
        lead="ファッションは、サイズ違いの返品送料まで含めると総額が大きく変わります。価格比較の対象を段階的に広げています。"
        meta={<span>最終更新: 2026-11-06</span>}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/korea/fashion", label: "ファッション" }]} />
        <EmptyState title="価格データは未取得です">
          引用・提携の許諾が確認できた販売事業者の情報が揃うまで、比較表は公開しません。
          それまでは、総額の考え方と確認項目を記事で案内します。
        </EmptyState>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["サイズ", "実寸・日本サイズとの対応・モデル身長"],
            ["素材", "洗濯表示・伸縮性・裏地"],
            ["返品", "期限・返送料・返送先・返金までの日数"],
          ].map(([title, body]) => (
            <div key={title} className="card p-5">
              <h2 className="text-base">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </div>
          ))}
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
