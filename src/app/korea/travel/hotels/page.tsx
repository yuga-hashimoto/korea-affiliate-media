import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ComparisonSection } from "@/components/comparison-section";
import { articlesByCategory, offersForGroup } from "@/data";
import { ArticleCard } from "@/components/article-card";
import { DisclosureNote } from "@/components/disclosure-note";

export const metadata: Metadata = {
  title: "ソウルのホテル総額比較｜税・手数料・キャンセル条件込み",
  description:
    "ソウル・明洞エリアのホテルを、税・サービス料・清掃料・キャンセル条件まで含めた総額で比較する方法。表示価格と支払額がずれる原因も解説します。",
  alternates: { canonical: "/korea/travel/hotels" },
};

const areas = [
  {
    name: "明洞",
    good: "初めてのソウル、観光・買い物の起点に。地下鉄の乗り換えがしやすい。",
    caution: "宿泊費は高めの傾向。夜間も人通りが多い。",
  },
  {
    name: "弘大",
    good: "カフェ・古着・ライブハウスなど、街歩きを目的にする場合に。",
    caution: "観光地への移動に時間がかかる場合がある。空港鉄道のアクセスは良好。",
  },
  {
    name: "江南",
    good: "ビジネス・高級ホテル・ショッピング中心。",
    caution: "空港からの移動が長め。観光中心なら移動費が増える。",
  },
  {
    name: "東大門",
    good: "深夜の買い物・市場・卸売エリア。",
    caution: "深夜の移動手段と治安情報を確認。",
  },
];

export default function HotelsPage() {
  const offers = offersForGroup("hotel-2n-2p-myeongdong");
  const articles = articlesByCategory("hotel");

  return (
    <>
      <PageHeader
        eyebrow="韓国旅行 / ホテル"
        title="ソウルのホテル総額比較（明洞・2泊・2人）"
        lead="宿泊費は、税・サービス料・清掃料・現地徴収で表示額から変わります。同じ日程・人数・グレードの条件で、総額を比較します。"
        meta={<span>最終更新: 2026-11-06 ／ 比較条件: 明洞エリア・2泊・2人・1室</span>}
      />
      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { href: "/korea/travel", label: "韓国旅行" },
            { href: "/korea/travel/hotels", label: "ホテル" },
          ]}
        />

        <ComparisonSection
          offers={offers}
          scenarioTitle="明洞エリア / 2泊 / 2人"
          scenarioDetail="税込・税別、清掃料、現地徴収税の有無を揃えて比較します。未確認の現地税は0円にせず、順位付けの対象外とします。"
        />

        <section className="mt-10" aria-labelledby="area-heading">
          <h2 id="area-heading" className="text-xl sm:text-2xl">
            エリア別の特徴（費用以外の比較軸）
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300 text-xs text-slate-600">
                  <th scope="col" className="px-3 py-3">エリア</th>
                  <th scope="col" className="px-3 py-3">向いている旅程</th>
                  <th scope="col" className="px-3 py-3">注意点</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area.name} className="border-b border-slate-200 align-top">
                    <th scope="row" className="px-3 py-3 font-semibold">{area.name}</th>
                    <td className="px-3 py-3 leading-6 text-slate-700">{area.good}</td>
                    <td className="px-3 py-3 leading-6 text-slate-600">{area.caution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            エリアの優劣を一律に断定するものではありません。宿泊費・交通費・移動時間を合わせて判断してください。
          </p>
        </section>

        <div className="mt-6">
          <DisclosureNote />
        </div>

        <section className="mt-10">
          <h2 className="text-xl sm:text-2xl">関連記事</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
