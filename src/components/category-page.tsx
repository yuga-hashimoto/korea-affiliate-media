import Link from "next/link";
import type { Category } from "@/lib/domain";
import { articlesByCategory, publishedArticles } from "@/data";
import { CATEGORY_META } from "@/lib/categories";
import type { Category as CategoryType } from "@/lib/domain";
import { PageHeader } from "./page-header";
import { Breadcrumbs } from "./breadcrumbs";
import { ArticleCard } from "./article-card";
import { JsonLd } from "./json-ld";
import { siteUrl } from "@/lib/env";

const CATEGORY_VISUAL: Partial<
  Record<CategoryType, { image: string; kr: string; alt: string }>
> = {
  seoul: { image: "/images/seoul.jpg", kr: "서울", alt: "ソウル・明洞の街並み" },
  busan: { image: "/images/busan.jpg", kr: "부산", alt: "釜山の市街地" },
  jeju: { image: "/images/jeju.jpg", kr: "제주", alt: "済州島の海岸" },
  food: { image: "/images/korean-food.jpg", kr: "맛집", alt: "韓国の食堂の料理" },
};

export function CategoryPage({
  category,
  extraLinks = [],
}: {
  category: Category;
  extraLinks?: Array<{ href: string; label: string }>;
}) {
  const visual = CATEGORY_VISUAL[category];
  const meta = CATEGORY_META[category];
  const articles = articlesByCategory(category);
  const others = publishedArticles.filter((a) => a.category !== category).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: meta.label,
          description: meta.description,
          url: `${siteUrl()}${meta.href}`,
        }}
      />
      <PageHeader
        eyebrow={`韓国旅行 / ${meta.label}`}
        title={meta.label}
        lead={meta.intro}
        meta={<span>記事 {articles.length}件</span>}
        image={visual?.image}
        imageAlt={visual?.alt}
        kr={visual?.kr ?? meta.kr}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/korea/travel", label: "旅行ガイド" },
            { href: meta.href, label: meta.label },
          ]}
        />

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            このカテゴリの記事は準備中です。ほかのガイドもあわせてご覧ください。
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}

        {extraLinks.length > 0 ? (
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg">あわせて読みたい</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {extraLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-700 underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="text-xl">ほかのガイド</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {others.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
