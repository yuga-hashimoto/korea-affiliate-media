import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { publishedArticles } from "@/data";
import { contactEmail } from "@/lib/env";

export const metadata: Metadata = {
  title: "広告・提携のご案内",
  description:
    "韓国旅行ノートへの広告掲載・アフィリエイト提携のご案内。サイト概要、カテゴリ、記事数、広告フォーマット、編集方針をまとめています。",
  alternates: { canonical: "/media-kit" },
};

const formats = [
  {
    title: "記事内の予約・購入導線",
    body: "ホテル・体験・eSIM・コスメの記事末に、提携先へのリンクを配置します。PR表記と rel=sponsored を付与します。",
  },
  {
    title: "タイアップ記事・PR記事",
    body: "取材・提供素材の利用条件を確認したうえで、広告であることを明示して掲載します。事実と異なる表現や順位保証は行いません。",
  },
  {
    title: "X（@bts_95_y）での紹介",
    body: "アフィリエイトを含む投稿はPR表記を行い、Xの有料パートナーシップ開示ポリシーに従います。自動投稿は既定で停止しています。",
  },
];

export default function MediaKitPage() {
  const email = contactEmail();
  return (
    <>
      <PageHeader
        eyebrow="Media Kit"
        title="広告・提携のご案内"
        lead="韓国旅行ノートは、ソウル・釜山・済州の旅行情報と韓国コスメ・ファッションの買い物情報を扱う日本語メディアです。"
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/media-kit", label: "広告・提携" }]} />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "サイト", value: "韓国旅行ノート" },
            { label: "公開記事", value: `${publishedArticles.length}本` },
            { label: "主な読者", value: "日本在住の韓国旅行・コスメ好き" },
          ].map((item) => (
            <div key={item.label} className="card border-2 border-ink p-5">
              <p className="text-[10px] font-black tracking-widest text-brand-700">{item.label}</p>
              <p className="mt-1 text-lg font-black text-ink">{item.value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-black">扱っているテーマ</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            ソウル・釜山・済州のエリアガイド、モデルコース、グルメ、カフェ、交通、宿泊、旅の準備、
            韓国コスメ、ファッション、免税・買い物。
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-black">広告フォーマット</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {formats.map((format) => (
              <div key={format.title} className="card border-2 border-ink p-5">
                <h3 className="text-base font-black">{format.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{format.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-black">編集・計測</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            <li>・公式情報を確認し、確認日時と出典を記事に表示します。</li>
            <li>・AI生成の下書きは人のレビュー後に公開し、現地体験を装いません。</li>
            <li>・GA4とSearch Consoleで流入を計測し、提携審査時に実績を共有できます。</li>
            <li>・広告の有無は記事内容や紹介順に影響しません。</li>
          </ul>
          <p className="mt-3 text-xs leading-6 text-slate-600">
            公開直後のため、月間訪問数などの実績値は確定していません。必要な場合は個別にお問い合わせください。
          </p>
        </section>

        <section className="mt-8 rounded-2xl border-2 border-ink bg-butter p-6">
          <h2 className="text-xl font-black">お問い合わせ</h2>
          {email ? (
            <p className="mt-2 text-sm leading-7 text-slate-700">
              広告・提携のご相談は{" "}
              <a href={`mailto:${email}`} className="text-brand-700 underline">
                {email}
              </a>{" "}
              までお願いします。
            </p>
          ) : (
            <p className="mt-2 text-sm leading-7 text-slate-700">
              お問い合わせ用のメールアドレスは、運営者情報の確定後に掲載します。
            </p>
          )}
          <p className="mt-3 text-xs text-slate-600">
            編集方針は
            <Link href="/editorial-policy" className="text-brand-700 underline">
              こちら
            </Link>
            、広告表記は
            <Link href="/disclosure" className="text-brand-700 underline">
              こちら
            </Link>
            をご覧ください。
          </p>
        </section>
      </div>
    </>
  );
}
