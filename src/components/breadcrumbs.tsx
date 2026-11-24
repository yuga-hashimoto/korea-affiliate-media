import Link from "next/link";

export interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="パンくずリスト" className="mb-3 text-[11px] text-slate-600 sm:mb-4 sm:text-xs">
      <ol className="flex flex-wrap items-center gap-1">
        <li className="shrink-0">
          <Link href="/" className="hover:text-brand-700">
            ホーム
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.href}
              className={`flex min-w-0 items-center gap-1 ${isLast ? "hidden sm:flex" : ""}`}
            >
              <span aria-hidden="true">/</span>
              {isLast ? (
                <span aria-current="page" className="min-w-0 truncate text-slate-700">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="max-w-[7.5rem] truncate hover:text-brand-700">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
