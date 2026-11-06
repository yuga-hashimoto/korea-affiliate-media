import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "編集方針",
  description:
    "韓国旅行ノートの編集方針。情報の確認方法、AI生成コンテンツの扱い、広告と編集の分離、訂正と更新のルールを公開します。",
  alternates: { canonical: "/editorial-policy" },
};

const policies = [
  {
    title: "一次情報を優先する",
    body: "営業時間・料金・交通・制度は、事業者や公的機関の公式情報を優先します。出典URLと確認日時を記録し、確認できない情報は掲載しません。",
  },
  {
    title: "体験を装わない",
    body: "現地取材・購入・利用をしていない場所について「実際に行ってみた」「泊まってみた」などの表現を使いません。体験談が必要な記事は、実際の確認が取れるまで公開しません。",
  },
  {
    title: "AI生成コンテンツの扱い",
    body: "AIは下書き・要約・検査の補助に使用します。AIが生成した内容は、検証済みの情報と照合できない限り公開しません。AI生成の記事には表示を行い、公開前に人のレビューを必須とします。",
  },
  {
    title: "広告と編集の分離",
    body: "アフィリエイト報酬は記事内容や紹介順に影響しません。広告リンクには広告であることを示し、PR表記を行います。広告主の都合による事実の書き換えは行いません。",
  },
  {
    title: "訂正と更新",
    body: "誤りを確認した場合は速やかに訂正し、更新日時を変更します。重要な訂正は記事内に記載します。",
  },
  {
    title: "表現の制約",
    body: "化粧品の効能効果について医療的な断定表現を用いません。飲食店・観光地についても、確認できた範囲を超えた「必ず」「日本一」といった表現を使いません。",
  },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="編集方針"
        title="読者の旅に役立つ情報だけを載せる"
        lead="当サイトは、アクセスの多さより、情報の正確さ・更新日時・前提条件を重視します。不確実な情報は公開せず、確認できた範囲を明示します。"
        meta={<span>最終更新: 2026-11-06</span>}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/editorial-policy", label: "編集方針" }]} />
        <div className="grid gap-4 md:grid-cols-2">
          {policies.map((policy, index) => (
            <section key={policy.title} className="card p-6">
              <p className="text-xs font-bold text-brand-700">POLICY {index + 1}</p>
              <h2 className="mt-1 text-lg">{policy.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{policy.body}</p>
            </section>
          ))}
        </div>
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
          <h2 className="text-lg text-slate-900">参照している公的な情報源</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href="https://japanese.visitkorea.or.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline"
              >
                韓国観光公社（VisitKorea）
              </a>
            </li>
            <li>
              <a
                href="https://www.airport.kr/ap_jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline"
              >
                仁川国際空港 公式サイト
              </a>
            </li>
            <li>
              <a
                href="https://www.seoulmetro.co.kr/jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline"
              >
                ソウル交通公社
              </a>
            </li>
            <li>
              <a
                href="https://www.customs.go.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline"
              >
                税関（財務省）
              </a>
            </li>
            <li>
              <a
                href="https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/stealth_marketing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 underline"
              >
                消費者庁: ステルスマーケティングに関する考え方
              </a>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
