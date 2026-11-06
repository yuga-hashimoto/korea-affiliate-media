import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminUiEnabled } from "@/lib/env";
import { readJsonFile } from "@/lib/store";
import type { Promotion } from "@/lib/domain";
import { programList, publishedArticles, generatedRecords } from "@/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "運用ダッシュボード（内部）",
  robots: { index: false, follow: false },
};

export default async function AdminIndexPage() {
  if (!adminUiEnabled()) notFound();

  const promotions = await readJsonFile<Promotion[]>("promotions/queue.json", []);
  const generated = { records: generatedRecords };

  const cards = [
    {
      href: "/admin/promotions",
      title: "X投稿レビュー",
      value: `${promotions.filter((p) => p.status === "needs_review").length}件待ち`,
      detail: "承認はCLI（pnpm social:approve）で行います。",
    },
    {
      href: "/admin/articles",
      title: "AI記事レビュー",
      value: `${generated.records.filter((r) => r.state === "review").length}件待ち`,
      detail: "公開は state=published への変更とビルドが必要です。",
    },
    {
      href: "/admin/affiliates",
      title: "提携プログラム",
      value: `${programList.filter((p) => p.status === "approved").length}件承認済み`,
      detail: "未承認の成果リンクは配信されません。",
    },
  ];

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl">運用ダッシュボード</h1>
      <p className="mt-2 text-sm text-slate-600">
        ADMIN_UI_ENABLED=true のときだけ表示されます。認証は未実装のため、本番環境では有効化しないでください。
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="card block p-5 no-underline hover:border-brand-400"
          >
            <p className="text-sm font-semibold text-slate-600">{card.title}</p>
            <p className="mt-2 text-xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{card.detail}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-xs text-slate-500">
        公開記事数: {publishedArticles.length} ／ 停止スイッチの状態は環境変数で確認してください。
      </p>
    </div>
  );
}
