import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticlesExplorer } from "@/components/articles-explorer";
import { publishedArticles } from "@/data";

export const metadata: Metadata = {
  title: "記事一覧",
  description:
    "韓国旅行の記事一覧。ソウル・釜山・済州のエリアガイド、モデルコース、グルメ、カフェ、買い物、交通、旅の準備をまとめています。",
  alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
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

        <Suspense
          fallback={
            <p className="text-sm text-slate-500">記事を読み込んでいます…</p>
          }
        >
          <ArticlesExplorer articles={publishedArticles} />
        </Suspense>
      </div>
    </>
  );
}
