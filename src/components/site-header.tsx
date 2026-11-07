import Link from "next/link";

const nav = [
  { href: "/korea/travel/seoul", kr: "서울", label: "ソウル" },
  { href: "/korea/travel/busan", kr: "부산", label: "釜山" },
  { href: "/korea/travel/jeju", kr: "제주", label: "済州島" },
  { href: "/korea/food", kr: "맛집", label: "グルメ" },
  { href: "/korea/cafe", kr: "카페", label: "カフェ" },
  { href: "/korea/shopping", kr: "쇼핑", label: "買い物" },
  { href: "/korea/travel/prepare", kr: "준비", label: "旅の準備" },
];

function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink text-white shadow-[3px_3px_0_var(--color-ink)]"
      style={{
        background:
          "conic-gradient(from 180deg, var(--color-brand-600) 0 50%, var(--color-cobalt) 50% 100%)",
      }}
    >
      <span className="kr text-lg font-black" lang="ko">한</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-cobalt text-white">
        <div className="container-page flex h-8 items-center justify-between text-[11px]">
          <p className="font-bold tracking-wide">
            ソウル・釜山・済州の旅行ガイド
            <span className="kr ml-2 text-[10px] font-semibold opacity-75">
              서울 · 부산 · 제주
            </span>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/korea/travel/prepare" className="font-bold no-underline hover:underline">
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

      <div className="border-b-2 border-ink bg-cream/95 backdrop-blur">
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <LogoMark />
            <span className="flex flex-col leading-tight">
              <span className="text-[1.05rem] font-black tracking-tight text-ink">
                韓国旅行ノート
              </span>
              <span className="kr text-[10px] font-bold tracking-[0.14em] text-cobalt">
                한국여행노트
              </span>
            </span>
          </Link>

          <nav aria-label="メインナビゲーション" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex min-w-[3.6rem] flex-col items-center rounded-xl px-2 py-1.5 no-underline hover:bg-butter"
                  >
                    <span className="text-[13px] font-black leading-none text-ink group-hover:text-cobalt">
                      {item.label}
                    </span>
                    <span className="kr mt-1 text-[9px] font-bold text-slate-600">
                      {item.kr}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <details className="relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border-2 border-ink bg-butter px-4 py-2 text-sm font-black text-ink">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              메뉴
            </summary>
            <nav
              aria-label="モバイルナビゲーション"
              className="absolute right-0 mt-2 w-64 rounded-2xl border-2 border-ink bg-paper p-2 shadow-[5px_5px_0_var(--color-ink)]"
            >
              <ul className="text-sm">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 no-underline hover:bg-butter"
                    >
                      <span className="text-sm font-bold text-ink">{item.label}</span>
                      <span className="kr text-[10px] text-slate-600">{item.kr}</span>
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t-2 border-ink/10 pt-1">
                  <Link
                    href="/articles"
                    className="block rounded-xl px-3 py-2.5 text-sm font-bold no-underline hover:bg-butter"
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
