import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminUiEnabled } from "@/lib/env";
import { generatedRecords } from "@/data";
import { formatJstDateTime } from "@/lib/dates";
import { Badge } from "@/components/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI記事レビュー（内部）",
  robots: { index: false, follow: false },
};

export default async function AdminArticlesPage() {
  if (!adminUiEnabled()) notFound();

  const data = { records: generatedRecords };

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl">AI記事レビュー</h1>
      <p className="mt-2 text-sm text-slate-600">
        state=review の記事は公開されません。数値・出典・禁止表現を確認し、問題がなければ
        state を published に変更してビルドします。AI生成の記事は公開時にAI利用を表示します。
      </p>

      {data.records.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          生成済みの記事はありません。`pnpm jobs:article-draft` で生成できます。
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {data.records.map((record) => (
            <details key={record.topicId} className="card p-4">
              <summary className="cursor-pointer list-none">
                <span className="flex flex-wrap items-center gap-2">
                  <Badge
                    tone={
                      record.state === "published"
                        ? "green"
                        : record.state === "review"
                          ? "amber"
                          : "red"
                    }
                  >
                    {record.state}
                  </Badge>
                  <span className="font-semibold text-slate-900">
                    {record.article.title}
                  </span>
                  <span className="text-xs text-slate-500">
                    score {record.score} / {record.provider} / {formatJstDateTime(record.createdAt)}
                  </span>
                </span>
              </summary>
              <div className="mt-3 border-t border-slate-100 pt-3 text-sm">
                {record.issues.length > 0 ? (
                  <ul className="mb-3 space-y-1 text-xs text-amber-800">
                    {record.issues.map((issue) => (
                      <li key={issue}>・{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-3 text-xs text-emerald-700">検証エラーなし</p>
                )}
                {record.article.sections.map((section) => (
                  <section key={section.heading} className="mb-3">
                    <h3 className="font-semibold text-slate-800">{section.heading}</h3>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 20)} className="mt-1 leading-6 text-slate-600">
                        {paragraph}
                      </p>
                    ))}
                  </section>
                ))}
                <p className="text-xs text-slate-500">
                  出典: {record.article.evidenceIds.join(", ") || "なし"} / prompt {record.promptVersion}
                </p>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
