import Link from "next/link";
import { SITE } from "@/lib/env";

const links = [
  { href: "/korea/travel", label: "旅行ガイド" },
  { href: "/articles", label: "記事一覧" },
  { href: "/editorial-policy", label: "編集方針" },
  { href: "/disclosure", label: "広告表記" },
  { href: "/about", label: "運営者情報" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/credits", label: "画像クレジット" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-navy text-cream">
      <span
        aria-hidden="true"
        className="kr pointer-events-none absolute -bottom-10 right-0 select-none text-[9rem] font-black leading-none text-white/5 sm:text-[14rem]"
      >
        한국여행
      </span>

      <div className="container-page relative py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="flex items-center gap-3 text-lg font-black">
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-cream bg-brand-600">
                <span className="kr text-sm">한</span>
              </span>
              <span className="kr text-xl">한국여행노트</span>
              <span className="text-xs font-semibold text-cream/60">韓国旅行ノート</span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-cream/75">
              ソウル・釜山・済州の旅をもっと楽しくする日本語メディアです。
              営業時間・料金・交通情報は変動するため、お出かけ前に公式サイトで最新情報をご確認ください。
            </p>
            <p className="mt-4 max-w-md text-xs leading-6 text-cream/60">
              本サイトはアフィリエイト広告を利用する場合があります。広告の有無は記事内容や紹介順の根拠ではありません。
              写真は CC0 の素材を使用しています（
              <Link href="/credits" className="text-brand-200 underline">
                クレジット
              </Link>
              ）。
            </p>
            <a
              href="https://x.com/bts_95_y"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-brand-700 px-5 py-3 text-sm font-black text-white no-underline shadow-[3px_3px_0_var(--color-ink)] hover:bg-brand-600"
            >
              <span aria-hidden="true">𝕏</span>
              最新情報をフォロー
            </a>
          </div>

          <nav aria-label="フッターナビゲーション">
            <p className="kr text-[11px] font-black tracking-[0.18em] text-sky">
              메뉴 · MENU
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/80 no-underline hover:text-sun"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-[11px] text-cream/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <p>掲載情報の正確性には努めますが、最新の条件は各公式サイトをご確認ください。</p>
        </div>
      </div>
    </footer>
  );
}
