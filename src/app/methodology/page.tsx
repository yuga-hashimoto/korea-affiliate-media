import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "比較手法・計算式｜総額比較",
  description:
    "総額比較の計算式、UNKNOWNの扱い、順位付けの条件、為替・クーポン・税金の反映ルールを公開します。",
  alternates: { canonical: "/methodology" },
};

const rules = [
  {
    title: "総額の計算式",
    body: "総額 = 本体価格 + 送料 + 税金 + 手数料 − 適用条件を満たすクーポン。税込表記の商品には税金を二重計上しません。ポイントは今回の支払額ではないため、原則として別表示にします。",
  },
  {
    title: "UNKNOWN（未確認）の扱い",
    body: "確認できない金額項目は null として保持し、0 円に置き換えません。未確認項目があるオファーは合計額を確定せず「確認済み項目の最低額」として表示し、順位付けの対象外とします。",
  },
  {
    title: "円換算",
    body: "外貨建ての場合は各項目を同じ為替レートで円換算し、レートと観測日時を併記します。レートが取得できない場合は円換算額を UNKNOWN とし、順位付けしません。",
  },
  {
    title: "クーポン",
    body: "閾値・上限・対象・有効期限・会員条件を確認できたクーポンのみ総額に反映します。条件が未確認のクーポンは「未適用」として表示し、その分を割引いた金額を「最安」と断定しません。",
  },
  {
    title: "順位付け",
    body: "同一条件グループ（日数・容量・人数・日程などが一致）の中で、出典が検証済み・期限内・購入可能なオファーのみを総額の昇順で並べます。条件が異なる場合は順位を付けません。",
  },
  {
    title: "報酬の非依存",
    body: "アフィリエイト報酬の有無・金額は順位に影響しません。報酬額で順位を変える操作は行いません。",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="比較手法"
        title="比較の計算式と、順位を決めるルール"
        lead="当サイトの比較結果は、確認できたデータと明示した条件に基づきます。不明な値を推測で埋めず、比較できない場合は比較しない方針です。"
        meta={<span>最終更新: 2026-11-06</span>}
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/methodology", label: "比較手法" }]} />
        <div className="grid gap-4 md:grid-cols-2">
          {rules.map((rule, index) => (
            <section key={rule.title} className="card p-6">
              <p className="text-xs font-bold text-brand-700">RULE {index + 1}</p>
              <h2 className="mt-1 text-lg">{rule.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{rule.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg text-amber-950">比較しないケース</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
            <li>・日程・人数・容量・宿泊日数など条件が揃っていない場合</li>
            <li>・出典が未検証、または確認から時間が経過して再確認が必要な場合</li>
            <li>・提携が未承認で、価格条件が確認できない場合</li>
            <li>・取得条件が規約上許可されていないデータしかない場合</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl">データの更新</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            価格・条件は定期的に再確認し、確認日時を更新します。再確認できない場合は「要再確認」と表示し、
            順位付けから外します。掲載期限を過ぎたオファーは表示から除外します。
            更新の履歴は記事の更新日時と各オファーの確認日時で追跡できます。
          </p>
        </section>
      </div>
    </>
  );
}
