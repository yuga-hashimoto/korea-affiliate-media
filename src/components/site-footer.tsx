import Link from "next/link";
import { SITE } from "@/lib/env";

const links = [
  { href: "/korea/travel", label: "旅行ガイド" },
  { href: "/articles", label: "記事一覧" },
  { href: "/editorial-policy", label: "編集方針" },
  { href: "/disclosure", label: "広告表記" },
  { href: "/about", label: "運営者情報" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-base font-bold text-slate-900">{SITE.name}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            ソウル・釜山・済州の旅をもっと楽しくする日本語メディアです。
            営業時間・料金・交通情報は変動するため、お出かけ前に公式サイトで最新情報をご確認ください。
          </p>
          <p className="mt-3 text-xs text-slate-500">
            本サイトはアフィリエイト広告を利用する場合があります。広告の有無は記事内容や紹介順の根拠ではありません。
          </p>
        </div>
        <nav aria-label="フッターナビゲーション">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:grid-cols-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-600 no-underline hover:text-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-100">
        <p className="container-page py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE.name}. 掲載情報の正確性には努めますが、最新の条件は各公式サイトをご確認ください。
        </p>
      </div>
    </footer>
  );
}
