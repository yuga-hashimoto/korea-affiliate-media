import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { CATEGORY_META } from "@/lib/categories";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "韓国旅行ガイド｜ソウル・釜山・済州の歩き方",
  description:
    "韓国旅行の計画に役立つガイド一覧。ソウル・釜山・済州のエリア別情報、モデルコース、交通、宿泊、旅の準備をまとめています。",
  alternates: { canonical: "/korea/travel" },
};

const destinations = ["seoul", "busan", "jeju"] as const;
const themes = ["food", "cafe", "shopping", "transport", "hotel", "prepare"] as const;

export default function TravelHubPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "韓国旅行ガイド",
          url: `${siteUrl()}/korea/travel`,
        }}
      />
      <PageHeader
        eyebrow="韓国旅行"
        title="韓国旅行ガイド"
        lead="行き先を決める、移動を組み立てる、持ち物をそろえる。韓国旅行の計画に必要な情報を、エリアとテーマの両方から探せます。"
        meta={<span>ソウル / 釜山 / 済州島</span>}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/korea/travel", label: "旅行ガイド" }]} />

        <section aria-labelledby="dest">
          <h2 id="dest" className="text-xl sm:text-2xl">
            エリアから探す
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {destinations.map((category) => {
              const meta = CATEGORY_META[category];
              return (
                <Link
                  key={category}
                  href={meta.href}
                  className="card block h-full p-5 no-underline transition hover:border-brand-400 hover:shadow-md"
                >
                  <p className="text-lg font-bold text-slate-900">{meta.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{meta.description}</p>
                  <p className="mt-4 text-xs font-semibold text-brand-700">ガイドを見る →</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="themes">
          <h2 id="themes" className="text-xl sm:text-2xl">
            テーマから探す
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((category) => {
              const meta = CATEGORY_META[category];
              return (
                <Link
                  key={category}
                  href={meta.href}
                  className="card block h-full p-5 no-underline transition hover:border-brand-400 hover:shadow-md"
                >
                  <p className="text-base font-bold text-slate-900">{meta.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{meta.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg">まず読むなら</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/articles/seoul-2nights-3days-model-course" className="text-brand-700 underline">
                初めてのソウル2泊3日モデルコース
              </Link>
            </li>
            <li>
              <Link href="/articles/korea-travel-checklist" className="text-brand-700 underline">
                初めての韓国旅行チェックリスト
              </Link>
            </li>
            <li>
              <Link href="/articles/incheon-airport-to-seoul" className="text-brand-700 underline">
                仁川空港からソウル市内への行き方
              </Link>
            </li>
            <li>
              <Link href="/articles/korea-travel-budget-guide" className="text-brand-700 underline">
                韓国旅行の予算の立て方
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
