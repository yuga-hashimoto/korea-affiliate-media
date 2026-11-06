# 作業進捗と監査メモ

## 2026-11-06 — 計画策定
- [x] GitHub Privateリポジトリ yuga-hashimoto/korea-affiliate-media を新規作成（直前の作業）。
- [x] ユーザー要望に合わせ、初期対象から特定芸能グループを除外。
- [x] 所有ドメイン sougakuhikaku.com の公開トップ/robots/sitemapを読み取り専用で確認。
- [x] 現サイトが「総額比較｜公式料金に基づく比較・試算」として稼働、ウォーターサーバー記事2件、サイトマップ8 URLを発見。
- [x] 既存サイトの「総額比較」ブランドを活かし、韓国旅行・韓国コスメの総支払額比較を提案。
- [x] AIマスタープロンプト、PRD、技術構成、SEO/集客、ASP、データ収集/自動化、移行、運用、バックログ、KPI、QA、コンプライアンスを文書化。
- [ ] 未実施: 現サイトの実バックアップ、DNS/ホスト管理画面へのアクセス、Search Console実データ分析、サイトの実コード実装。
- [ ] 未実施: ASP提携審査、実リンク取得、X投稿・公開、デプロイ、本番ドメイン切替。
- [ ] 注意: 計画書の報酬単価・PV/CVRは仮定。実績値が得られた時点で更新する。

## 今後の作業ログ
AIエージェントは日時/タスクID/変更ファイル/テスト/ブロッカー/次のアクションを追記。
承認を得た本番変更は承認内容・変更前後の観測・復旧手順を記録する。

## 2026-11-06 — P0-05〜P0-08 / P1-01〜P1-03 実装（AIエージェント）
- [x] P0-05 Next.js 16 / TypeScript / Tailwind CSS 4 の初期実装。`next.config.ts`、ESLint flat config、Vitest、Playwright、GitHub Actions（`ci.yml`）を追加。
- [x] P0-06 レスポンシブUI（トップ・カテゴリ・比較表・モバイルカード）、共通ヘッダー/フッター、スキップリンク、広告表記コンポーネントを実装。
- [x] P0-07 ドメイン型（`Offer` / `Coupon` / `SourceEvidence` / `AffiliateProgram` / `Article` / `Promotion` / `Conversion`）をZodで定義。サンプルデータは `sample=true` + `priceBasis=sample` を必須にし、`priceBasis=sample` で `sample=false` のデータは検証エラーでビルド失敗。
- [x] P0-08 総額計算エンジン（`src/lib/total.ts`）と比較エンジン（`src/lib/compare.ts`）。UNKNOWNを0円にせず、未確認項目があるオファーは順位付けから除外。為替未取得は円換算UNKNOWN。クーポンは閾値・上限・会員条件・有効期限・条件未確認を判定。
- [x] P1-01 トップ、韓国旅行ハブ、eSIM、ホテル、空港交通、韓国コスメ、ファッション（価格未取得の空状態）、記事一覧・記事詳細を実装。
- [x] P1-02 比較手法、編集方針、広告表記、運営者、プライバシー、問い合わせを実装。
- [x] P1-03 各比較ページに計算式・内訳・為替レート・確認日時・出典・UNKNOWN表示・広告表記を実装。`/go/[id]` は登録済みオファーのみ許可（オープンリダイレクト防止）、`noindex` 付与、匿名クリック記録（IPは日替わりソルト付きハッシュのみ）。
- [x] SEO: sitemap / robots / canonical / OGP / JSON-LD（WebSite, Article, FAQPage, BreadcrumbList）。Previewは `SITE_INDEXING_ENABLED=false` で全面noindex。価格のOffer構造化データは未確認のため出力しない。
- [x] テスト: `pnpm lint` / `pnpm typecheck` / `pnpm test`（46件）/ `pnpm build` / `pnpm e2e`（22件、desktop+mobile 375px）。
- [x] プレビュー: ローカル本番ビルドを `http://127.0.0.1:4321` で起動して表示確認（スクリーンショット取得済み）。デモデータ表示は `NEXT_PUBLIC_DEMO_MODE=true` のときのみ。本番ビルドではサンプル価格を非表示にする設計。
- [ ] 未実施（承認または資格情報が必要）: Vercel等へのPreviewデプロイ、本番DNS切替、ASP申請/規約同意、実アフィリエイトリンク、Xへの実投稿。
- [ ] 未確認: 現サイトのホスティング/デプロイ元、GSC/GA4の実データ、Cloudflare権限。P0-01〜P0-04は調査項目をADRに記録中。
