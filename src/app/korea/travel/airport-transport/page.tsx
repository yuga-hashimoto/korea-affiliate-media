import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ComparisonSection } from "@/components/comparison-section";
import { offersForGroup } from "@/data";

export const metadata: Metadata = {
  title: "仁川空港からソウル市内への交通比較｜総額と所要時間",
  description:
    "仁川空港からソウル市内への交通手段を、運賃・所要時間・乗り換え・荷物の観点で比較。公式情報の確認手順と、総額に含める費用を整理します。",
  alternates: { canonical: "/korea/travel/airport-transport" },
};

export default function AirportTransportPage() {
  const offers = offersForGroup("icn-seoul-1p");

  return (
    <>
      <PageHeader
        eyebrow="韓国旅行 / 空港交通"
        title="仁川空港からソウル市内への交通を総額で比べる"
        lead="運賃だけでなく、乗り換え・荷物・深夜到着・決済手数料まで含めた総額で比較します。運賃は各運行事業者の公式情報で確認し、未確認の値は表示しません。"
        meta={<span>最終更新: 2026-11-06 ／ 比較条件: 仁川空港 → ソウル市内・1人</span>}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/korea/travel", label: "韓国旅行" },
            { href: "/korea/travel/airport-transport", label: "空港交通" },
          ]}
        />

        <ComparisonSection
          offers={offers}
          scenarioTitle="仁川空港 → ソウル市内 / 1人"
          scenarioDetail="運賃に加えて、空港内の移動・乗り換え運賃・深夜割増・予約手数料を含めます。グループの場合は人数分を掛けた総額で比較します。"
        />

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "鉄道",
              body: "定時性が高く、1人旅向き。乗り換え回数と駅からの徒歩を確認。",
            },
            {
              title: "空港バス",
              body: "荷物が多い場合に乗り換えが少ない。渋滞の影響と深夜運行の有無を確認。",
            },
            {
              title: "タクシー",
              body: "人数が多いと1人あたりは下がる場合がある。深夜割増・通行料を確認。",
            },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <h2 className="text-base">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg">公式情報の確認手順</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>運行事業者の公式サイトで運賃・時刻表・運行日を確認する。</li>
            <li>確認した日時を記録し、料金改定の有無を再確認する。</li>
            <li>予約手数料・決済手数料・深夜割増の有無を確認する。</li>
            <li>公式情報が取得できない場合はUNKNOWNと表示し、推測値を掲載しない。</li>
          </ol>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            参照元の例:{" "}
            <a
              href="https://www.arex.or.kr/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-brand-700 underline"
            >
              空港鉄道 AREX 公式サイト
            </a>
            （外部サイト・新しいタブ）
          </p>
        </section>
      </div>
    </>
  );
}
