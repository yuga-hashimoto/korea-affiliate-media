import type { MetadataRoute } from "next";
import { publishedArticles } from "@/data";
import { siteUrl } from "@/lib/env";

const STATIC_ROUTES: ReadonlyArray<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/korea/travel", priority: 0.9, changeFrequency: "weekly" },
  { path: "/korea/travel/seoul", priority: 0.9, changeFrequency: "weekly" },
  { path: "/korea/travel/busan", priority: 0.8, changeFrequency: "weekly" },
  { path: "/korea/travel/jeju", priority: 0.8, changeFrequency: "weekly" },
  { path: "/korea/travel/transport", priority: 0.7, changeFrequency: "monthly" },
  { path: "/korea/travel/hotels", priority: 0.7, changeFrequency: "monthly" },
  { path: "/korea/travel/prepare", priority: 0.8, changeFrequency: "weekly" },
  { path: "/korea/food", priority: 0.8, changeFrequency: "weekly" },
  { path: "/korea/cafe", priority: 0.8, changeFrequency: "weekly" },
  { path: "/korea/shopping", priority: 0.7, changeFrequency: "weekly" },
  { path: "/korea/beauty", priority: 0.7, changeFrequency: "weekly" },
  { path: "/korea/fashion", priority: 0.6, changeFrequency: "monthly" },
  { path: "/articles", priority: 0.8, changeFrequency: "daily" },
  { path: "/editorial-policy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/disclosure", priority: 0.4, changeFrequency: "yearly" },
  { path: "/about", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
  { path: "/media-kit", priority: 0.3, changeFrequency: "yearly" },
];

/**
 * 静的書き出しは `trailingSlash: true`（`/about/` 形式）で、
 * ページ側の canonical も末尾スラッシュ付きになる。
 * sitemap がスラッシュなしURLを指すと全URLが308転送になり、
 * クロールの無駄・重複URLの原因になるため、必ず揃える。
 */
export function withTrailingSlash(path: string): string {
  if (path === "/") return "/";
  return `${path.replace(/\/+$/, "")}/`;
}

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${base}${withTrailingSlash(route.path)}`,
    lastModified: new Date("2026-11-06T09:00:00.000Z"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const articleEntries = publishedArticles.map((article) => ({
    url: `${base}${withTrailingSlash(`/articles/${article.slug}`)}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
