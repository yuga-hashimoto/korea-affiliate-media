import Link from "next/link";

const nav = [
  { href: "/korea/travel/seoul", label: "ソウル" },
  { href: "/korea/travel/busan", label: "釜山" },
  { href: "/korea/travel/jeju", label: "済州島" },
  { href: "/korea/food", label: "グルメ" },
  { href: "/korea/cafe", label: "カフェ" },
  { href: "/korea/shopping", label: "買い物" },
  { href: "/korea/travel/prepare", label: "旅の準備" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-baseline gap-2 no-underline"
        >
          <span className="text-lg font-bold tracking-tight text-slate-900">
            韓国旅行ノート
          </span>
          <span className="hidden text-xs text-slate-500 lg:inline">
            SEOUL / BUSAN / JEJU
          </span>
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-700">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="no-underline hover:text-brand-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium">
            メニュー
          </summary>
          <nav
            aria-label="モバイルナビゲーション"
            className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
          >
            <ul className="text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 no-underline hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
