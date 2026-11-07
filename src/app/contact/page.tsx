import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { contactEmail } from "@/lib/env";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "韓国旅行ノートへのお問い合わせ、掲載情報の訂正依頼、取材・提携に関するご連絡について。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const email = contactEmail();
  return (
    <>
      <PageHeader
        eyebrow="お問い合わせ"
        title="掲載情報の訂正・ご意見をお寄せください"
        lead="営業時間・料金・交通などの誤り、リンク切れ、掲載に関するご指摘を受け付けます。確認のうえ、必要に応じて記事を更新します。"
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/contact", label: "お問い合わせ" }]} />
        <div className="max-w-3xl space-y-4">
          <div className="card p-6">
            <h2 className="text-lg">お問い合わせ窓口</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {email ? (
                <>
                  お問い合わせは{" "}
                  <a href={`mailto:${email}`} className="text-brand-700 underline">
                    {email}
                  </a>{" "}
                  までお願いします。以下の内容を添えてください。
                </>
              ) : (
                <>
                  お問い合わせ用のメールアドレスは、運営者情報の確定後に掲載します。
                  公開までは外部からの送信を受け付けていません。確定後は以下を添えてご連絡いただける窓口を用意します。
                </>
              )}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              <li>訂正したいページのURL</li>
              <li>誤っている内容と、根拠となる公式情報のURL</li>
              <li>確認日時</li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-lg">取材・提携について</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              提携のご提案は、媒体条件・報酬条件・掲載可能な情報の範囲を確認したうえで判断します。
              順位の保証や、事実と異なる表示の依頼には対応しません。
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            本ページはプレビュー環境です。個人情報を入力するフォームは設置していません。
          </div>
        </div>
      </div>
    </>
  );
}
