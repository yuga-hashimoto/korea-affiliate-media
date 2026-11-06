import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  articleList,
  getPublishedArticle,
  relatedArticles,
  evidenceList,
} from "@/data";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/badge";
import { DisclosureNote } from "@/components/disclosure-note";
import { SourceStamp } from "@/components/source-stamp";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { formatJstDate } from "@/lib/dates";
import { siteUrl } from "@/lib/env";
import { SITE } from "@/lib/env";

export const dynamicParams = false;

export function generateStaticParams() {
  return articleList
    .filter((a) => a.status === "published")
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticle(slug);
  if (!article) return { title: "記事が見つかりません" };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getPublishedArticle(slug);
  if (!article) notFound();

  const evidence = article.evidenceIds
    .map((id) => evidenceList.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  const related = relatedArticles(article);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          inLanguage: "ja",
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name },
          mainEntityOfPage: `${siteUrl()}/articles/${article.slug}`,
        }}
      />
      {article.faq.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faq.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }}
        />
      ) : null}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl() },
            {
              "@type": "ListItem",
              position: 2,
              name: "記事",
              item: `${siteUrl()}/articles`,
            },
            { "@type": "ListItem", position: 3, name: article.title },
          ],
        }}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/articles", label: "記事" },
            { href: `/articles/${article.slug}`, label: article.title },
          ]}
        />

        <article className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Badge tone="brand">韓国{article.category === "beauty" ? "コスメ" : article.category === "hotel" ? "ホテル" : article.category === "esim" ? "eSIM" : article.category === "fashion" ? "ファッション" : "旅行"}</Badge>
            {article.aiGenerated ? <Badge tone="slate">AI生成（レビュー済み）</Badge> : null}
          </div>
          <h1 className="mt-3 text-2xl leading-tight sm:text-3xl">{article.title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">{article.description}</p>
          <p className="mt-3 text-xs text-slate-500">
            公開: {article.publishedAt ? formatJstDate(article.publishedAt) : "未公開"}
            {" ・ "}更新: {formatJstDate(article.updatedAt)}
            {article.reviewedAt ? ` ・ レビュー: ${formatJstDate(article.reviewedAt)}` : ""}
          </p>

          <DisclosureNote />

          <div className="prose-jp mt-8">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          {article.faq.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-xl">よくある質問</h2>
              <dl className="mt-4 space-y-4">
                {article.faq.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <dt className="font-semibold text-slate-900">{faq.question}</dt>
                    <dd className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {evidence.length > 0 ? (
            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-base">参照元・確認日時</h2>
              <ul className="mt-3 space-y-3">
                {evidence.map((item) => (
                  <li key={item.id}>
                    <SourceStamp evidence={item} stale={item.reviewStatus === "stale"} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {article.hubPath ? (
            <p className="mt-8 text-sm">
              <Link href={article.hubPath} className="text-brand-700 underline">
                比較ページを見る →
              </Link>
            </p>
          ) : null}

          <p className="mt-8 rounded-xl bg-slate-100 p-4 text-xs leading-5 text-slate-600">
            掲載内容に誤りや古い情報を見つけた場合は、
            <Link href="/contact" className="text-brand-700 underline">
              お問い合わせ
            </Link>
            からご連絡ください。確認のうえ更新します。当サイトは現地取材・購入体験を装ったレビューを掲載しません。
          </p>
        </article>

        {related.length > 0 ? (
          <section className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-xl">関連記事</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
