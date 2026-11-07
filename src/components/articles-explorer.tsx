"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Article, Category } from "@/lib/domain";
import { CATEGORY_META } from "@/lib/categories";
import { ArticleCard } from "./article-card";

const filters: Array<{ key: Category | "all"; label: string }> = [
  { key: "all", label: "すべて" },
  ...(Object.entries(CATEGORY_META) as Array<
    [Category, (typeof CATEGORY_META)[Category]]
  >).map(([key, meta]) => ({ key, label: meta.short })),
];

/**
 * 記事の検索・カテゴリ絞り込み。
 * 静的書き出し（Cloudflare Pages）でも動作するよう、クライアント側で処理する。
 */
export function ArticlesExplorer({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";
  const [query, setQuery] = useState(initialQuery);

  const active = filters.some((filter) => filter.key === initialCategory)
    ? (initialCategory as Category | "all")
    : "all";

  const keyword = initialQuery.trim();
  const filtered = useMemo(() => {
    const normalized = keyword.toLowerCase();
    return articles.filter((article) => {
      if (active !== "all" && article.category !== active) return false;
      if (!normalized) return true;
      return (
        article.title.toLowerCase().includes(normalized) ||
        article.description.toLowerCase().includes(normalized) ||
        article.tags.some((tag) => tag.toLowerCase().includes(normalized)) ||
        article.sections.some((section) =>
          section.paragraphs.some((paragraph) =>
            paragraph.toLowerCase().includes(normalized),
          ),
        )
      );
    });
  }, [articles, keyword, active]);

  const updateParams = (next: { q?: string; category?: Category | "all" }) => {
    const params = new URLSearchParams();
    const q = next.q !== undefined ? next.q : keyword;
    const category = next.category !== undefined ? next.category : active;
    if (q) params.set("q", q);
    if (category !== "all") params.set("category", category);
    const queryString = params.toString();
    router.push(queryString ? `/articles?${queryString}` : "/articles");
  };

  return (
    <>
      <form
        action="/articles"
        method="get"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          updateParams({ q: query.trim() });
        }}
        className="mb-4 flex max-w-xl gap-2"
      >
        <label htmlFor="q" className="sr-only">
          記事を検索
        </label>
        <input
          id="q"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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
              : `/articles?category=${filter.key}${
                  keyword ? `&q=${encodeURIComponent(keyword)}` : ""
                }`;
          return (
            <Link
              key={filter.key}
              href={href}
              onClick={(event) => {
                event.preventDefault();
                updateParams({ category: filter.key });
              }}
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
        {filtered.length}件
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          該当する記事がありません。別のキーワードやカテゴリでお試しください。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
