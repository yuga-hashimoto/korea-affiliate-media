import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminUiEnabled } from "@/lib/env";
import { programList, merchantList } from "@/data";
import { formatJstDate } from "@/lib/dates";
import { Badge } from "@/components/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "提携プログラム管理（内部）",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, string> = {
  unapplied: "未申請",
  pending: "審査中",
  approved: "承認済み",
  rejected: "却下",
  paused: "停止",
  expired: "期限切れ",
};

export default async function AdminAffiliatesPage() {
  if (!adminUiEnabled()) notFound();

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl">提携プログラム</h1>
      <p className="mt-2 text-sm text-slate-600">
        承認済みでも、媒体許可（web）と成果リンクが無い場合は公式リンクのみ配信します。
        申請・規約同意は運営者が行う必要があります。
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-slate-300 text-xs text-slate-600">
              <th scope="col" className="px-3 py-2">事業者</th>
              <th scope="col" className="px-3 py-2">状態</th>
              <th scope="col" className="px-3 py-2">媒体</th>
              <th scope="col" className="px-3 py-2">成果リンク</th>
              <th scope="col" className="px-3 py-2">承認日</th>
              <th scope="col" className="px-3 py-2">備考</th>
            </tr>
          </thead>
          <tbody>
            {programList.map((program) => {
              const merchant = merchantList.find((m) => m.id === program.merchantId);
              return (
                <tr key={program.id} className="border-b border-slate-200 align-top">
                  <td className="px-3 py-3 font-semibold">
                    {merchant?.name ?? program.merchantId}
                  </td>
                  <td className="px-3 py-3">
                    <Badge tone={program.status === "approved" ? "green" : "slate"}>
                      {STATUS_LABEL[program.status] ?? program.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {program.allowedMedia.length > 0
                      ? program.allowedMedia.join(", ")
                      : "未確認"}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {program.linkTemplate ? "発行済み" : "なし（未発行）"}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {program.approvedAt ? formatJstDate(program.approvedAt) : "—"}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">{program.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-xs leading-5 text-slate-500">
        リンクURLそのものは、承認後に管理画面/APIから取得してGit外（Secrets/DB）で管理します。
        ここには表示しません。
      </p>
    </div>
  );
}
