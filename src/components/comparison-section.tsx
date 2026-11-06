import type { Offer, SourceEvidence } from "@/lib/domain";
import { compareOffers, type PricedOffer } from "@/lib/compare";
import { demoMode } from "@/lib/env";
import { evidenceList, getMerchant, fxRateList, programList } from "@/data";
import { formatMoney, formatMoneyOrUnknown } from "@/lib/money";
import { formatJstDate } from "@/lib/dates";
import { Badge } from "./badge";
import { SourceStamp } from "./source-stamp";
import { SampleBanner } from "./sample-banner";
import { DisclosureNote } from "./disclosure-note";

const PRICE_BASIS_LABEL: Record<Offer["priceBasis"], string> = {
  live: "ライブ取得",
  cached: "キャッシュ",
  reference: "参考価格",
  sample: "サンプル",
};

function evidenceOf(offer: Offer): SourceEvidence | undefined {
  return evidenceList.find((e) => e.id === offer.evidenceId);
}

function rankLabel(priced: PricedOffer, isSample: boolean): string {
  if (priced.rank === null) return "—";
  return isSample ? `サンプル順 ${priced.rank}` : `第${priced.rank}位`;
}

function TotalDisplay({ priced }: { priced: PricedOffer }) {
  const { breakdown } = priced;
  if (breakdown.totalJpy !== null) {
    return (
      <span className="num text-lg font-bold text-slate-900">
        {formatMoney(breakdown.totalJpy, "JPY")}
      </span>
    );
  }
  const hasKnownAmount = (breakdown.minKnownJpy ?? 0) > 0;
  return (
    <span className="block">
      <span className="block text-sm font-bold text-amber-800">UNKNOWN</span>
      <span className="num mt-0.5 block text-xs text-slate-600">
        {hasKnownAmount
          ? `確認済み ${formatMoney(breakdown.minKnownJpy ?? 0, "JPY")} ＋ 未確認項目`
          : "価格を取得できていません"}
      </span>
    </span>
  );
}

function OfferDetail({ priced }: { priced: PricedOffer }) {
  const { offer, breakdown, blockers } = priced;
  const evidence = evidenceOf(offer);
  return (
    <details className="group mt-3 rounded-xl border border-slate-200 bg-white">
      <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
        内訳と計算式を見る（{getMerchant(offer.merchantId)?.name ?? offer.merchantId}）
      </summary>
      <div className="border-t border-slate-100 px-3 py-3 text-sm">
        <dl className="grid gap-1.5">
          {breakdown.components.map((component) => (
            <div
              key={component.key}
              className="flex items-baseline justify-between gap-4 border-b border-dashed border-slate-100 pb-1 last:border-0"
            >
              <dt className="text-slate-600">
                {component.label}
                {component.note ? (
                  <span className="ml-1 text-xs text-slate-400">{component.note}</span>
                ) : null}
              </dt>
              <dd className="num text-right">
                {component.unknown ? (
                  <span className="font-semibold text-amber-800">UNKNOWN</span>
                ) : (
                  <>
                    <span>{formatMoneyOrUnknown(component.amount, offer.currency)}</span>
                    {offer.currency !== "JPY" && component.amountJpy !== null ? (
                      <span className="ml-2 text-xs text-slate-500">
                        約{formatMoney(component.amountJpy, "JPY")}
                      </span>
                    ) : null}
                  </>
                )}
              </dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 pt-1">
            <dt className="font-semibold text-slate-800">合計（円換算）</dt>
            <dd className="num font-bold">
              {breakdown.totalJpy === null
                ? "UNKNOWN"
                : formatMoney(breakdown.totalJpy, "JPY")}
            </dd>
          </div>
        </dl>

        <p className="mt-2 rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-600">
          計算式: 本体 {formatMoneyOrUnknown(offer.baseAmount, offer.currency)}
          {" + "}送料 {formatMoneyOrUnknown(offer.shippingAmount, offer.currency)}
          {" + "}税 {offer.taxIncluded ? "内税" : formatMoneyOrUnknown(offer.taxAmount, offer.currency)}
          {" + "}手数料 {formatMoneyOrUnknown(offer.feesAmount, offer.currency)}
          {breakdown.coupon.status === "applied"
            ? ` − クーポン ${formatMoney(breakdown.coupon.discount, offer.currency)}`
            : ""}
        </p>

        {breakdown.coupon.status === "applied" ? (
          <p className="mt-2 text-xs text-emerald-800">
            クーポン適用: {breakdown.coupon.label}
          </p>
        ) : null}
        {breakdown.coupon.status === "unverified" ? (
          <p className="mt-2 text-xs text-amber-800">
            クーポン「{breakdown.coupon.label}」は{breakdown.coupon.detail}。
          </p>
        ) : null}
        {breakdown.coupon.status === "not_applicable" ? (
          <p className="mt-2 text-xs text-slate-600">
            クーポン「{breakdown.coupon.label}」は{breakdown.coupon.detail}。
          </p>
        ) : null}

        {offer.currency !== "JPY" && breakdown.fx.rate ? (
          <p className="mt-2 text-xs text-slate-500">
            為替: 1{offer.currency} = {breakdown.fx.rate} JPY（{breakdown.fx.source}、
            観測 {breakdown.fx.observedAt ? formatJstDate(breakdown.fx.observedAt) : "UNKNOWN"}）
          </p>
        ) : null}

        {blockers.length > 0 ? (
          <ul className="mt-2 space-y-1 text-xs text-amber-800">
            {blockers.map((blocker) => (
              <li key={blocker}>・{blockerLabel(blocker)}</li>
            ))}
          </ul>
        ) : null}

        {evidence ? (
          <SourceStamp evidence={evidence} stale={evidence.reviewStatus === "stale"} />
        ) : null}
      </div>
    </details>
  );
}

function blockerLabel(blocker: string): string {
  const map: Record<string, string> = {
    sample_data: "サンプルデータのため順位付けの対象外",
    unknown_amount: "未確認の金額項目があるため順位付けの対象外",
    fx_missing: "為替レート未取得のため順位付けの対象外",
    expired: "掲載期限切れ",
    unavailable: "現在購入・予約できない",
    evidence_missing: "出典証跡が紐づいていない",
    evidence_unverified: "出典が未検証",
    evidence_stale: "出典が古く再確認が必要",
    evidence_not_permitted: "取得・引用の許諾が未確認",
    program_not_approved: "提携が未承認（参考表示のみ）",
  };
  return map[blocker] ?? blocker;
}

function LinkButton({ priced }: { priced: PricedOffer }) {
  const { offer } = priced;
  // next/link はプリフェッチで /go にアクセスしてしまうため、計測付き遷移は <a> を使う。
  return (
    <a
      href={`/go/${offer.id}`}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-3 py-2 text-xs font-semibold text-white no-underline hover:bg-brand-800"
    >
      公式で条件を確認
      <span className="sr-only">（{getMerchant(offer.merchantId)?.name}・新しいタブで開きます）</span>
    </a>
  );
}

export function ComparisonSection({
  offers,
  scenarioTitle,
  scenarioDetail,
  now = new Date(),
}: {
  offers: Offer[];
  scenarioTitle: string;
  scenarioDetail: string;
  now?: Date;
}) {
  const allowSample = demoMode();
  const result = compareOffers(offers, {
    now,
    rates: fxRateList,
    evidence: evidenceList,
    programs: programList,
    allowSample,
    merchantLabel: (merchantId) => getMerchant(merchantId)?.name ?? merchantId,
  });

  const ordered = [
    ...result.ranked,
    ...result.priced.filter((p) => !p.rankable),
  ];

  const verdictTone =
    result.verdict.kind === "cheapest"
      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
      : result.verdict.kind === "lowest_known"
        ? "border-amber-300 bg-amber-50 text-amber-950"
        : "border-slate-300 bg-slate-50 text-slate-800";

  return (
    <section aria-labelledby="comparison-heading" className="mt-8">
      <h2 id="comparison-heading" className="text-xl sm:text-2xl">
        総額比較（{scenarioTitle}）
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{scenarioDetail}</p>

      {result.hasSampleData ? <div className="mt-4"><SampleBanner /></div> : null}

      <div className={`mt-4 rounded-2xl border p-4 ${verdictTone}`}>
        <p className="text-sm font-bold">{result.verdict.headline}</p>
        <p className="mt-1 text-sm leading-6">{result.verdict.detail}</p>
      </div>

      {result.notes.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs leading-5 text-slate-600">
          {result.notes.map((note) => (
            <li key={note}>・{note}</li>
          ))}
        </ul>
      ) : null}

      {/* モバイル: カード表示 */}
      <div className="mt-6 space-y-4 md:hidden">
        {ordered.map((priced) => {
          const merchant = getMerchant(priced.offer.merchantId);
          return (
            <article key={priced.offer.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {merchant?.name ?? priced.offer.merchantId}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {priced.offer.productName}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge tone={priced.rankable ? "brand" : "slate"}>
                    {rankLabel(priced, priced.offer.sample)}
                  </Badge>
                  {priced.offer.sample ? <Badge tone="amber">SAMPLE</Badge> : null}
                </div>
              </div>
              <div className="mt-3">
                <TotalDisplay priced={priced} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                確認日 {formatJstDate(priced.offer.observedAt)}・
                {PRICE_BASIS_LABEL[priced.offer.priceBasis]}
              </p>
              <div className="mt-3">
                <LinkButton priced={priced} />
              </div>
              <OfferDetail priced={priced} />
            </article>
          );
        })}
      </div>

      {/* デスクトップ: テーブル */}
      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[840px] border-collapse text-left text-sm">
          <caption className="sr-only">
            {scenarioTitle}の総額比較。未確認項目はUNKNOWNと表示し、順位付けの対象外としています。
          </caption>
          <thead>
            <tr className="border-b-2 border-slate-300 text-xs text-slate-600">
              <th scope="col" className="px-3 py-3 font-semibold">順位</th>
              <th scope="col" className="px-3 py-3 font-semibold">事業者・プラン</th>
              <th scope="col" className="px-3 py-3 text-right font-semibold">総額（円換算）</th>
              <th scope="col" className="px-3 py-3 font-semibold">内訳</th>
              <th scope="col" className="px-3 py-3 font-semibold">確認日</th>
              <th scope="col" className="px-3 py-3 font-semibold">リンク</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((priced) => {
              const merchant = getMerchant(priced.offer.merchantId);
              const components = priced.breakdown.components
                .filter((c) => c.key !== "base")
                .map((c) =>
                  c.unknown
                    ? `${c.label}:UNKNOWN`
                    : `${c.label}:${formatMoneyOrUnknown(c.amount, priced.offer.currency)}`,
                )
                .join(" / ");
              return (
                <tr key={priced.offer.id} className="border-b border-slate-200 align-top">
                  <td className="px-3 py-4">
                    <Badge tone={priced.rankable ? "brand" : "slate"}>
                      {rankLabel(priced, priced.offer.sample)}
                    </Badge>
                  </td>
                  <td className="px-3 py-4">
                    <p className="font-semibold text-slate-900">
                      {merchant?.name ?? priced.offer.merchantId}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {priced.offer.productName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {priced.offer.condition.label}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <Badge tone="slate">{PRICE_BASIS_LABEL[priced.offer.priceBasis]}</Badge>
                      {priced.offer.sample ? <Badge tone="amber">SAMPLE</Badge> : null}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <TotalDisplay priced={priced} />
                  </td>
                  <td className="px-3 py-4 text-xs leading-5 text-slate-600">
                    <p>本体: {formatMoneyOrUnknown(priced.offer.baseAmount, priced.offer.currency)}</p>
                    <p>{components}</p>
                  </td>
                  <td className="px-3 py-4 text-xs text-slate-600">
                    {formatJstDate(priced.offer.observedAt)}
                  </td>
                  <td className="px-3 py-4">
                    <LinkButton priced={priced} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 hidden space-y-2 md:block">
        {ordered.map((priced) => (
          <OfferDetail key={`detail-${priced.offer.id}`} priced={priced} />
        ))}
      </div>

      <DisclosureNote />
    </section>
  );
}
