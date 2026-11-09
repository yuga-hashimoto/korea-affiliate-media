import type { Category } from "@/lib/domain";
import { resolveOutbound } from "@/lib/affiliate";
import { TrackedOutboundLink } from "./tracked-outbound-link";

interface CtaTarget {
  programId: string;
  merchant: string;
  label: string;
  officialUrl: string;
}

const CTAS: Partial<Record<Category, CtaTarget[]>> = {
  seoul: [
    { programId: "prog-rakuten-travel", merchant: "楽天トラベル", label: "楽天トラベルで宿を探す", officialUrl: "https://travel.rakuten.co.jp/" },
    { programId: "prog-tripcom", merchant: "Trip.com", label: "Trip.comでホテルを探す", officialUrl: "https://jp.trip.com/" },
    { programId: "prog-rakuten-experience", merchant: "楽天トラベル観光体験", label: "楽天トラベル観光体験で探す", officialUrl: "https://experiences.travel.rakuten.co.jp/" },
    { programId: "prog-klook", merchant: "Klook", label: "Klookで体験を探す", officialUrl: "https://www.klook.com/ja/" },
  ],
  busan: [
    { programId: "prog-rakuten-travel", merchant: "楽天トラベル", label: "楽天トラベルで宿を探す", officialUrl: "https://travel.rakuten.co.jp/" },
    { programId: "prog-tripcom", merchant: "Trip.com", label: "Trip.comでホテルを探す", officialUrl: "https://jp.trip.com/" },
    { programId: "prog-rakuten-experience", merchant: "楽天トラベル観光体験", label: "楽天トラベル観光体験で探す", officialUrl: "https://experiences.travel.rakuten.co.jp/" },
    { programId: "prog-klook", merchant: "Klook", label: "Klookで体験を探す", officialUrl: "https://www.klook.com/ja/" },
  ],
  jeju: [
    { programId: "prog-rakuten-travel", merchant: "楽天トラベル", label: "楽天トラベルで宿を探す", officialUrl: "https://travel.rakuten.co.jp/" },
    { programId: "prog-tripcom", merchant: "Trip.com", label: "Trip.comでホテルを探す", officialUrl: "https://jp.trip.com/" },
    { programId: "prog-rakuten-experience", merchant: "楽天トラベル観光体験", label: "楽天トラベル観光体験で探す", officialUrl: "https://experiences.travel.rakuten.co.jp/" },
    { programId: "prog-klook", merchant: "Klook", label: "Klookで体験を探す", officialUrl: "https://www.klook.com/ja/" },
  ],
  hotel: [
    { programId: "prog-rakuten-travel", merchant: "楽天トラベル", label: "楽天トラベルで宿を探す", officialUrl: "https://travel.rakuten.co.jp/" },
    { programId: "prog-tripcom", merchant: "Trip.com", label: "Trip.comでホテルを探す", officialUrl: "https://jp.trip.com/" },
  ],
  transport: [
    { programId: "prog-klook", merchant: "Klook", label: "Klookで送迎・交通を探す", officialUrl: "https://www.klook.com/ja/" },
    { programId: "prog-tripcom", merchant: "Trip.com", label: "Trip.comで旅行商品を探す", officialUrl: "https://jp.trip.com/" },
  ],
  prepare: [
    { programId: "prog-airalo", merchant: "Airalo", label: "AiraloでeSIMを探す", officialUrl: "https://www.airalo.com/" },
    { programId: "prog-rakuten", merchant: "楽天市場", label: "楽天市場で旅行用品を探す", officialUrl: "https://www.rakuten.co.jp/" },
    { programId: "prog-amazon", merchant: "Amazon", label: "Amazonで旅行用品を探す", officialUrl: "https://www.amazon.co.jp/" },
  ],
  beauty: [
    { programId: "prog-rakuten", merchant: "楽天市場", label: "楽天市場で韓国コスメを探す", officialUrl: "https://www.rakuten.co.jp/" },
    { programId: "prog-amazon", merchant: "Amazon", label: "Amazonで韓国コスメを探す", officialUrl: "https://www.amazon.co.jp/" },
    { programId: "prog-qoo10", merchant: "Qoo10", label: "Qoo10で韓国コスメを探す", officialUrl: "https://www.qoo10.jp/" },
    { programId: "prog-oliveyoung", merchant: "OLIVE YOUNG", label: "OLIVE YOUNGで見る", officialUrl: "https://global.oliveyoung.com/" },
    { programId: "prog-yesstyle", merchant: "YesStyle", label: "YesStyleで韓国コスメを探す", officialUrl: "https://www.yesstyle.com/ja/" },
    { programId: "prog-bqcell", merchant: "BQCELL", label: "BQCELLのハーブピーリングを見る", officialUrl: "https://meon-premier.gangnamdoll.jp/" },
  ],
  fashion: [
    { programId: "prog-rakuten", merchant: "楽天市場", label: "楽天市場で探す", officialUrl: "https://www.rakuten.co.jp/" },
    { programId: "prog-qoo10", merchant: "Qoo10", label: "Qoo10で探す", officialUrl: "https://www.qoo10.jp/" },
    { programId: "prog-yesstyle", merchant: "YesStyle", label: "YesStyleで見る", officialUrl: "https://www.yesstyle.com/ja/" },
    { programId: "prog-sazo", merchant: "SAZO", label: "SAZOで韓国ファッションを探す", officialUrl: "https://sazo.shop/" },
  ],
  shopping: [
    { programId: "prog-rakuten", merchant: "楽天市場", label: "楽天市場で探す", officialUrl: "https://www.rakuten.co.jp/" },
    { programId: "prog-amazon", merchant: "Amazon", label: "Amazonで探す", officialUrl: "https://www.amazon.co.jp/" },
    { programId: "prog-qoo10", merchant: "Qoo10", label: "Qoo10で探す", officialUrl: "https://www.qoo10.jp/" },
    { programId: "prog-sazo", merchant: "SAZO", label: "SAZOで韓国商品を探す", officialUrl: "https://sazo.shop/" },
  ],
};

/**
 * 記事末の予約・購入導線。
 * 提携が未承認、または成果リンクが未設定の場合は公式サイトへのリンクを表示する。
 * 成果リンクはビルド時の環境変数 AFFILIATE_LINKS_JSON からのみ解決する。
 */
export function BookingCta({
  category,
  articleSlug,
}: {
  category: Category;
  articleSlug: string;
}) {
  const targets = CTAS[category];
  if (!targets || targets.length === 0) return null;

  const links = targets.map((target) => ({
    ...target,
    ...resolveOutbound(target.programId, target.officialUrl),
  }));
  const hasAffiliate = links.some((link) => link.isAffiliate);

  return (
    <section className="card mt-10 border-2 border-ink p-5 shadow-[4px_4px_0_var(--color-ink)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-700 px-3 py-1 text-[10px] font-black tracking-wider text-white">
          {hasAffiliate ? "PR" : "公式"}
        </span>
        <h2 className="text-base font-black">予約・購入先を探す</h2>
      </div>
      <p className="mt-2 text-xs leading-6 text-slate-600">
        リンク先で最新の料金・空室・送料・条件をご確認ください。提携が未承認の事業者は公式サイトへのリンクを表示しています。
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.programId}>
            <TrackedOutboundLink
              href={link.href}
              isAffiliate={link.isAffiliate}
              programId={link.programId}
              articleSlug={articleSlug}
              className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-paper px-4 py-3 text-sm font-bold text-ink no-underline hover:bg-butter"
            >
              <span>{link.label}</span>
              <span aria-hidden="true" className="text-brand-700">
                ↗
              </span>
            </TrackedOutboundLink>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] leading-5 text-slate-600">
        {hasAffiliate
          ? "当サイトはアフィリエイト広告を利用しています。広告の有無は記事内容に影響しません。"
          : "提携承認前のため、公式サイトへのリンクを表示しています。"}
      </p>
    </section>
  );
}
