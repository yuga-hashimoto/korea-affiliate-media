import { NextResponse, type NextRequest } from "next/server";
import { getOffer, getProgram } from "@/data";
import { resolveGoTarget } from "@/lib/affiliate";
import { recordOutboundClick } from "@/lib/click";

const ALLOWED_CHANNELS = ["x", "search", "direct", "internal", "other"] as const;
type Channel = (typeof ALLOWED_CHANNELS)[number];

function parseChannel(value: string | null): Channel {
  return ALLOWED_CHANNELS.includes(value as Channel) ? (value as Channel) : "other";
}

/**
 * 外部リンクの計測付きリダイレクト。
 * - 登録済みオファーIDのみ許可（オープンリダイレクト防止）
 * - 提携未承認なら公式URLへ
 * - 計測失敗時も遷移は妨げない
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const offer = getOffer(id);
  if (!offer) {
    return new NextResponse("指定されたリンクは登録されていません。", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const program = getProgram(offer.programId);
  const target = resolveGoTarget(offer, program);
  if (!target.href) {
    return new NextResponse("このリンクは現在利用できません。", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const url = new URL(request.url);
  const forwarded = request.headers.get("x-forwarded-for");
  await recordOutboundClick({
    offerId: offer.id,
    channel: parseChannel(url.searchParams.get("ch")),
    ip: forwarded ? (forwarded.split(",")[0]?.trim() ?? null) : null,
    userAgent: request.headers.get("user-agent"),
  });

  return NextResponse.redirect(target.href, {
    status: 307,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
