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
  { path: "/korea/travel/esim", priority: 0.9, changeFrequency: "weekly" },
  { path: "/korea/travel/hotels", priority: 0.9, changeFrequency: "weekly" },
  { path: "/korea/travel/airport-transport", priority: 0.8, changeFrequency: "monthly" },
  { path: "/korea/beauty", priority: 0.9, changeFrequency: "weekly" },
  { path: "/korea/fashion", priority: 0.5, changeFrequency: "monthly" },
  { path: "/articles", priority: 0.7, changeFrequency: "daily" },
  { path: "/methodology", priority: 0.6, changeFrequency: "monthly" },
  { path: "/editorial-policy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/disclosure", priority: 0.4, changeFrequency: "yearly" },
  { path: "/about", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: new Date("2026-11-06T09:00:00.000Z"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const articleEntries = publishedArticles.map((article) => ({
    url: `${base}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
