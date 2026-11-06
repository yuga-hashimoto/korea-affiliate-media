import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminUiEnabled } from "@/lib/env";
import { readJsonFile } from "@/lib/store";
import type { Promotion } from "@/lib/domain";
import { formatJstDateTime } from "@/lib/dates";
import { Badge } from "@/components/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "投稿レビューキュー（内部）",
  robots: { index: false, follow: false },
};

/**
 * 内部レビュー画面。ADMIN_UI_ENABLED=true のときだけ表示する。
 * 認証はMVPでは未実装のため、本番では公開しない（noindex + robots disallow + フラグOFF）。
 */
export default async function AdminPromotionsPage() {
  if (!adminUiEnabled()) notFound();

  const promotions = await readJsonFile<Promotion[]>(
    "promotions/queue.json",
    [],
  );

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl">X投稿レビューキュー</h1>
      <p className="mt-2 text-sm text-slate-600">
        SOCIAL_PUBLISH_ENABLED=false の間、ここから公開されることはありません。
        公開は承認後にCLI（scripts/approve-promotion.ts）で行います。
      </p>

      {promotions.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          キューは空です。`pnpm jobs:social-draft` で下書きを生成できます。
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300 text-xs text-slate-600">
                <th scope="col" className="px-3 py-2">状態</th>
                <th scope="col" className="px-3 py-2">本文</th>
                <th scope="col" className="px-3 py-2">開示</th>
                <th scope="col" className="px-3 py-2">更新日時</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr key={promotion.id} className="border-b border-slate-200 align-top">
                  <td className="px-3 py-3">
                    <Badge
                      tone={
                        promotion.status === "approved"
                          ? "green"
                          : promotion.status === "failed"
                            ? "red"
                            : "slate"
                      }
                    >
                      {promotion.status}
                    </Badge>
                  </td>
                  <td className="max-w-md px-3 py-3 leading-6">{promotion.content}</td>
                  <td className="px-3 py-2 text-xs">{promotion.disclosureMode}</td>
                  <td className="px-3 py-2 text-xs">
                    {formatJstDateTime(promotion.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {promotions.some((p) => p.risks.length > 0) ? (
        <section className="mt-8">
          <h2 className="text-lg">検出されたリスク</h2>
          <ul className="mt-3 space-y-2 text-sm text-amber-900">
            {promotions.flatMap((promotion) =>
              promotion.risks.map((risk) => (
                <li key={`${promotion.id}-${risk}`}>
                  {promotion.id}: {risk}
                </li>
              )),
            )}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
