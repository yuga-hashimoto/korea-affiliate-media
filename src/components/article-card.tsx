import Link from "next/link";
import type { Article } from "@/lib/domain";
import { CATEGORY_META } from "@/lib/categories";
import { formatJstDate } from "@/lib/dates";
import { Badge } from "./badge";

export function ArticleCard({ article }: { article: Article }) {
  const meta = CATEGORY_META[article.category];
  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">{meta.short}</Badge>
        {article.status === "draft" ? <Badge tone="amber">下書き</Badge> : null}
        {article.aiGenerated ? <Badge tone="slate">AI下書き</Badge> : null}
      </div>
      <h2 className="mt-3 text-base leading-7 sm:text-lg">
        <Link
          href={`/articles/${article.slug}`}
          className="text-slate-900 no-underline hover:text-brand-800"
        >
          {article.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {article.description}
      </p>
      <p className="mt-4 text-xs text-slate-500">
        更新: {formatJstDate(article.updatedAt)}
        {article.publishedAt ? ` ・ 公開: ${formatJstDate(article.publishedAt)}` : ""}
      </p>
    </article>
  );
}
