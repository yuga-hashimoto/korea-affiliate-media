import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "広告表記について",
  description:
    "アフィリエイト広告の表記、成果リンクの扱い、広告と記事内容の関係、X投稿における開示方針を説明します。",
  alternates: { canonical: "/disclosure" },
};

export default function DisclosurePage() {
  return (
    <>
      <PageHeader
        eyebrow="広告表記"
        title="広告であることを、わかりやすく表示します"
        lead="当サイトは、旅行・宿泊・コスメなどの紹介によるアフィリエイト報酬を得る場合があります。広告の有無が記事の内容や紹介順に影響しないことを明確にします。"
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/disclosure", label: "広告表記" }]} />
        <div className="prose-jp max-w-3xl">
          <h2>広告の表示</h2>
          <p>
            アフィリエイトリンクを含むページには、分かりやすい位置に「広告」「PR」と表示します。
            外部リンクには rel=&quot;sponsored&quot; または rel=&quot;nofollow&quot; を付与し、成果リンクであることを検索エンジンにも示します。
          </p>

          <h2>成果リンクの条件</h2>
          <p>
            成果パラメータ付きのリンクは、広告主の審査承認と媒体許可が確認できた場合にのみ使用します。
            未承認の事業者へは公式ページへの通常リンクを表示し、「公式パートナー」「提携中」などの表現は行いません。
          </p>

          <h2>記事内容との関係</h2>
          <p>
            記事の内容・紹介する場所・注意点は、編集部の判断で決めます。報酬率の高い事業者を不当に優先したり、
            事実と異なる紹介をしたりすることはありません。
          </p>

          <h2>X（旧Twitter）での投稿</h2>
          <p>
            Xでアフィリエイトリンクや報酬対象のクーポンを紹介する場合は、Xの有料パートナーシップポリシーに従い、
            投稿の開示設定と本文のPR表記を行います。API経由で開示設定を確実に担保できない場合は、自動投稿せず手動投稿に切り替えます。
          </p>

          <h2>ステルスマーケティング規制への対応</h2>
          <p>
            一般消費者が広告であることを認識できない表示は行いません。景品表示法および消費者庁の考え方に沿って、
            広告であることを明瞭に示します。詳細は
            <a
              href="https://www.caa.go.jp/policies/policy/representation/fair_labeling/faq/stealth_marketing"
              target="_blank"
              rel="noopener noreferrer"
            >
              消費者庁の解説
            </a>
            をご確認ください。
          </p>
        </div>
      </div>
    </>
  );
}
