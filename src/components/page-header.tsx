import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  meta?: ReactNode;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container-page py-10 sm:py-12">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-2xl leading-tight sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          {lead}
        </p>
        {meta ? <div className="mt-4 text-xs text-slate-500">{meta}</div> : null}
      </div>
    </header>
  );
}
