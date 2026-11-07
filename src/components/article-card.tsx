import Link from "next/link";
import type { Article } from "@/lib/domain";
import { CATEGORY_META } from "@/lib/categories";
import { formatJstDate } from "@/lib/dates";

export function ArticleCard({ article }: { article: Article }) {
  const meta = CATEGORY_META[article.category];
  return (
    <article className="card group flex h-full flex-col border-2 border-ink p-5 transition hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)]">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-ink bg-butter px-3 py-1 text-[11px] font-black text-ink">
          {meta.short}
          <span className="kr ml-1 text-[10px] font-bold text-ink/75">{meta.kr}</span>
        </span>
        {article.aiGenerated ? (
          <span className="text-[10px] font-semibold text-slate-600">AI下書き</span>
        ) : null}
      </div>
      <h2 className="mt-3 text-[1.05rem] font-bold leading-7">
        <Link
          href={`/articles/${article.slug}`}
          className="text-ink no-underline group-hover:text-cobalt"
        >
          {article.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {article.description}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-slate-600">
        <span>更新: {formatJstDate(article.updatedAt)}</span>
        <span className="text-xs font-black text-brand-700" aria-hidden="true">
          読む <span className="kr">→</span>
        </span>
      </div>
    </article>
  );
}
