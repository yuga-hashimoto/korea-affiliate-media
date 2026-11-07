import Image from "next/image";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
  image,
  imageAlt,
  kr,
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  meta?: ReactNode;
  image?: string;
  imageAlt?: string;
  kr?: string;
}) {
  if (image) {
    return (
      <header className="relative isolate overflow-hidden">
        <div className="relative h-[320px] w-full sm:h-[380px]">
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0">
          <div className="container-page flex h-full flex-col justify-end pb-8 sm:pb-10">
            {eyebrow ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">
                {eyebrow}
              </p>
            ) : null}
            <div className="mt-2 flex items-baseline gap-3">
              {kr ? (
                <span className="kr text-lg text-brand-200">{kr}</span>
              ) : null}
              <h1 className="text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-cream/85 sm:text-base">
              {lead}
            </p>
            {meta ? <div className="mt-3 text-xs text-cream/60">{meta}</div> : null}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="relative overflow-hidden border-b border-[#efdfd3] bg-[#FDF1E7]">
      {kr ? (
        <span
          aria-hidden="true"
          className="kr pointer-events-none absolute -right-4 -top-8 select-none text-[9rem] font-bold leading-none text-brand-200/40 sm:text-[12rem]"
        >
          {kr}
        </span>
      ) : null}
      <div className="container-page relative py-12 sm:py-16">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          {lead}
        </p>
        {meta ? <div className="mt-4 text-xs text-slate-600">{meta}</div> : null}
      </div>
    </header>
  );
}
