import Link from "next/link";
import type { Article } from "@/lib/domain";
import { CATEGORY_META } from "@/lib/categories";
import { formatJstDate } from "@/lib/dates";

export function ArticleCard({ article }: { article: Article }) {
  const meta = CATEGORY_META[article.category];
  return (
    <article className="card group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
          {meta.label}
        </span>
        {article.aiGenerated ? (
          <span className="text-[10px] font-semibold text-slate-400">AI下書き</span>
        ) : null}
      </div>
      <h2 className="mt-3 text-[1.05rem] leading-7">
        <Link
          href={`/articles/${article.slug}`}
          className="text-ink no-underline group-hover:text-brand-700"
        >
          {article.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {article.description}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-slate-600">
        <span>更新: {formatJstDate(article.updatedAt)}</span>
        <span className="font-bold text-brand-700" aria-hidden="true">
          →
        </span>
      </div>
    </article>
  );
}
