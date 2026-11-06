import { NextResponse } from "next/server";
import { z } from "zod";
import {
  evidenceList,
  fxRateList,
  offerList,
  programList,
} from "@/data";
import { compareOffers, selectDisplayableOffers } from "@/lib/compare";
import { getMerchant } from "@/data";
import { demoMode } from "@/lib/env";

const QuerySchema = z.object({
  category: z.enum(["esim", "hotel", "transport", "beauty", "fashion", "experience"]),
  groupKey: z.string().min(1).optional(),
  days: z.coerce.number().int().positive().optional(),
  gb: z.coerce.number().positive().optional(),
});

/**
 * 公開API（読み取り専用）。認証不要の代わりに、価格の生データと出典のみを返し、
 * 成果リンクや個人情報は返さない。
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse({
    category: url.searchParams.get("category"),
    groupKey: url.searchParams.get("groupKey") ?? undefined,
    days: url.searchParams.get("days") ?? undefined,
    gb: url.searchParams.get("gb") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_query",
        message: "category は必須です（esim/hotel/transport/beauty/fashion/experience）。",
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { category, groupKey, days, gb } = parsed.data;
  const offers = offerList.filter(
    (offer) =>
      offer.category === category &&
      (groupKey ? offer.condition.groupKey === groupKey : true) &&
      (days ? offer.condition.days === days : true) &&
      (gb ? offer.condition.gb === gb : true),
  );

  const result = compareOffers(selectDisplayableOffers(offers, demoMode()), {
    now: new Date(),
    rates: fxRateList,
    evidence: evidenceList,
    programs: programList,
    allowSample: demoMode(),
    merchantLabel: (merchantId) => getMerchant(merchantId)?.name ?? merchantId,
  });

  return NextResponse.json(
    {
      category,
      generatedAt: new Date().toISOString(),
      demoMode: demoMode(),
      verdict: result.verdict,
      notes: result.notes,
      offers: result.priced.map((priced) => ({
        offerId: priced.offer.id,
        merchantId: priced.offer.merchantId,
        label: priced.offer.condition.label,
        currency: priced.offer.currency,
        priceBasis: priced.offer.priceBasis,
        sample: priced.offer.sample,
        observedAt: priced.offer.observedAt,
        expiresAt: priced.offer.expiresAt,
        complete: priced.breakdown.complete,
        totalJpy: priced.breakdown.totalJpy,
        minKnownJpy: priced.breakdown.minKnownJpy,
        unknownFields: priced.breakdown.unknownFields,
        coupon: priced.breakdown.coupon,
        fx: priced.breakdown.fx,
        rankable: priced.rankable,
        rank: priced.rank,
        notes: priced.blockers,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
