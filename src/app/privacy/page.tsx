import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "韓国旅行ノートのプライバシーポリシー。取得する情報、利用目的、アクセス解析、Cookie、お問い合わせ情報の扱いを説明します。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="プライバシーポリシー"
        title="取得する情報と、その扱い"
        lead="当サイトは、会員登録・決済機能を持ちません。取得する情報は最小限に限定し、個人を特定できる形での保存を避けます。"
      />
      <div className="container-page py-8">
        <Breadcrumbs items={[{ href: "/privacy", label: "プライバシーポリシー" }]} />
        <div className="prose-jp max-w-3xl">
          <h2>取得する情報</h2>
          <p>
            当サイトは、ページ閲覧に関するアクセス解析情報（閲覧ページ、参照元、利用環境など）を取得する場合があります。
            会員登録、決済、氏名・住所・電話番号の入力を求める機能はありません。
          </p>

          <h2>アクセス解析</h2>
          <p>
            Google Analytics 4 を利用する場合、Cookie等により匿名の利用状況を計測します。
            IPアドレスの匿名化設定を行い、個人を特定する目的では利用しません。
            ブラウザの設定によりCookieを無効化できます。
          </p>

          <h2>アフィリエイトプログラム</h2>
          <p>
            リンク先の事業者が、Cookie等により成果を計測する場合があります。各事業者のプライバシーポリシーをご確認ください。
            当サイトは、成果の確定に必要な範囲を超えて個人情報を取得しません。
          </p>

          <h2>お問い合わせ情報</h2>
          <p>
            お問い合わせで取得した情報は、回答と記録の目的にのみ使用し、第三者へ提供しません。
            保存期間を過ぎた情報は削除します。お問い合わせ窓口の詳細は公開前に確定します。
          </p>

          <h2>改定</h2>
          <p>
            本方針を変更する場合は、本ページに掲載します。重要な変更がある場合は、サイト上でお知らせします。
          </p>
        </div>
      </div>
    </>
  );
}
