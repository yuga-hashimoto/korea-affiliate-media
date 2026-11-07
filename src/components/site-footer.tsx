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
    <footer className="mt-20 bg-ink text-cream">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="flex items-center gap-2 text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-500 text-sm">
                韓
              </span>
              {SITE.name}
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-cream/75">
              ソウル・釜山・済州の旅をもっと楽しくする日本語メディアです。
              営業時間・料金・交通情報は変動するため、お出かけ前に公式サイトで最新情報をご確認ください。
            </p>
            <p className="mt-4 max-w-md text-xs leading-6 text-cream/55">
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
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-600"
            >
              <span aria-hidden="true">𝕏</span>
              最新情報をフォロー
            </a>
          </div>

          <nav aria-label="フッターナビゲーション">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
              Menu
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/80 no-underline hover:text-brand-200"
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
