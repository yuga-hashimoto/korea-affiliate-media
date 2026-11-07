import Link from "next/link";

const nav = [
  { href: "/korea/travel/seoul", label: "ソウル", kr: "서울" },
  { href: "/korea/travel/busan", label: "釜山", kr: "부산" },
  { href: "/korea/travel/jeju", label: "済州島", kr: "제주" },
  { href: "/korea/food", label: "グルメ", kr: "맛집" },
  { href: "/korea/cafe", label: "カフェ", kr: "카페" },
  { href: "/korea/shopping", label: "買い物", kr: "쇼핑" },
  { href: "/korea/travel/prepare", label: "旅の準備", kr: "준비" },
];

function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white"
    >
      <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none">
        <circle cx="20" cy="15" r="6" fill="#FFC857" />
        <path
          d="M6 25c4-4 8-4 12 0s8 4 12 0 4-4 4-4"
          stroke="#FFF7EF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M6 31c4-4 8-4 12 0s8 4 12 0"
          stroke="#FFF7EF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-brand-700 text-cream">
        <div className="container-page flex h-8 items-center justify-between text-[11px]">
          <p className="tracking-wide">ソウル・釜山・済州の旅行ガイド</p>
          <div className="flex items-center gap-4">
            <Link href="/korea/travel/prepare" className="no-underline hover:underline">
              旅の準備
            </Link>
            <a
              href="https://x.com/bts_95_y"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="no-underline hover:underline"
            >
              X @bts_95_y
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-[#efdfd3] bg-cream/95 backdrop-blur">
        <div className="container-page flex h-[4.25rem] items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline"
          >
            <LogoMark />
            <span className="flex flex-col leading-tight">
              <span className="text-[1.05rem] font-bold tracking-tight text-ink">
                韓国旅行ノート
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-brand-700">
                Korea Travel Note
              </span>
            </span>
          </Link>

          <nav aria-label="メインナビゲーション" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex flex-col items-center rounded-lg px-2.5 py-1.5 no-underline hover:bg-brand-50"
                  >
                    <span className="text-[9px] font-semibold text-brand-700 kr">
                      {item.kr}
                    </span>
                    <span className="text-[13px] font-semibold text-ink group-hover:text-brand-700">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <details className="relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-brand-200 bg-paper px-4 py-2 text-sm font-semibold text-ink">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              メニュー
            </summary>
            <nav
              aria-label="モバイルナビゲーション"
              className="absolute right-0 mt-2 w-60 rounded-2xl border border-[#efdfd3] bg-paper p-2 shadow-xl"
            >
              <ul className="text-sm">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 no-underline hover:bg-brand-50"
                    >
                      <span className="font-semibold text-ink">{item.label}</span>
                      <span className="text-[10px] font-semibold text-brand-700 kr">{item.kr}</span>
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-[#efdfd3] pt-1">
                  <Link
                    href="/articles"
                    className="block rounded-xl px-3 py-2.5 no-underline hover:bg-brand-50"
                  >
                    記事一覧
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
