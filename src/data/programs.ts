import type { AffiliateProgram } from "@/lib/domain";

/**
 * 提携プログラムの状態。すべて未申請/未承認で、成果リンクは存在しない。
 * 承認後もリンク発行は広告主の管理画面/APIの仕様に従う（架空のタグを作らない）。
 */
const UPDATED_AT = "2026-11-06T09:00:00.000Z";

export const programs: AffiliateProgram[] = [
  {
    id: "prog-airalo",
    merchantId: "airalo",
    status: "unapplied",
    allowedMedia: [],
    termsUrl: "https://partners.airalo.com/",
    approvedAt: null,
    linkTemplate: null,
    commissionNote: "未確認",
    notes: "承認・媒体許可・報酬条件は未確認。",
    updatedAt: UPDATED_AT,
  },
  {
    id: "prog-tripcom",
    merchantId: "tripcom",
    status: "unapplied",
    allowedMedia: [],
    termsUrl: "https://jp.trip.com/partners/index",
    approvedAt: null,
    linkTemplate: null,
    commissionNote: "未確認",
    notes: "承認・料率・対象商品は未確認。",
    updatedAt: UPDATED_AT,
  },
  {
    id: "prog-oliveyoung",
    merchantId: "oliveyoung",
    status: "unapplied",
    allowedMedia: [],
    termsUrl: "https://global.oliveyoung.com/influencer/main",
    approvedAt: null,
    linkTemplate: null,
    commissionNote: "未確認",
    notes: "媒体許可（Web/X）と報酬条件は未確認。",
    updatedAt: UPDATED_AT,
  },
  {
    id: "prog-rakuten",
    merchantId: "rakuten",
    status: "unapplied",
    allowedMedia: [],
    termsUrl: "https://affiliate.rakuten.co.jp/",
    approvedAt: null,
    linkTemplate: null,
    commissionNote: "未確認",
    notes: "登録サイト・商品別料率は未確認。",
    updatedAt: UPDATED_AT,
  },
];
