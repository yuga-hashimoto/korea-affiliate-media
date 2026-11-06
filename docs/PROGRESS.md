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

## 2026-11-06 — P2/P3 自動化・CI・Preview検証（AIエージェント）
- [x] P2-03 許諾フィードの取り込みコネクター（`src/lib/ingestion/connector.ts`）。`INGESTION_ENABLED=false` が既定で、許可ホスト・許諾`yes`・証跡7日以内・重複ハッシュを検証。失敗時は既存データを変更しない。実フィード未接続。
- [x] P2-04 クーポン条件（閾値・上限・会員・期限・条件未確認）、為替換算、税込/税別、未確認項目の順位除外を実装。
- [x] P2-05 匿名クリックのJSONL集計、ASP成果CSVのパーサ（見込/承認/却下/返金/支払済を分離、重複排除、為替未取得は未換算）、日次レポートを実装。
- [x] P3-01 OpenRouter連携（`response_format=json_object`、429/5xxの指数バックオフ、タイムアウト）。キー未設定時は決定的モック。
- [x] P3-02 品質ゲート（スキーマ・禁止表現・根拠のない数値・出典ID・広告開示・スコア）と review/published 状態、監査ログ（`var/ai/audit.jsonl`）、`/admin/articles` のレビュー画面。
- [x] P3-03/04 投稿配信アダプター（署名付きWebhook、idempotency key、二重送信防止、再試行）。XのPaid Partnership開示を技術的に保証できないため、**PR投稿の自動配信はブロック**し手動運用に固定。Buffer公式APIの仕様確認と接続は資格情報が必要なため未実施。
- [x] P3-05 X下書き2件/日の生成（PR表記・280文字・重複検知）。公開ボタンは既定OFF。
- [x] P3-06 日次/週次レポート、4つの停止スイッチ（`CONTENT_AUTO_PUBLISH_ENABLED` / `SOCIAL_PUBLISH_ENABLED` / `AFFILIATE_LINKS_ENABLED` / `INGESTION_ENABLED`）。
- [x] CI: GitHub Actions `CI` が lint / typecheck / unit / build / E2E（desktop + 375px）を実行。初回はpnpmバージョン競合で失敗→修正し、run `42248160998` で success。
- [x] Preview: ローカル本番ビルドを `http://127.0.0.1:4321` で起動。`SITE_INDEXING_ENABLED=false` の robots を確認。
- [x] 本番相当ビルド（`NEXT_PUBLIC_DEMO_MODE`未設定）でサンプル価格が非表示になることを確認。サンプルは実価格として表示されない。
- [x] サンプル表示の制御を `selectDisplayableOffers` に集約（本番ビルドではサンプルをDOMに出さない）。
- [x] OG画像（1200×630）とfaviconを追加。色コントラストの低い小さい文字を修正。
- [x] テスト: unit 73件 / E2E 22件（desktop + mobile 375px）すべて成功。`pnpm lint` / `pnpm typecheck` / `pnpm build` 成功。
- [ ] ブロッカー（資格情報・承認）: Vercel Previewデプロイ、Buffer公式API接続、実ASPリンク・報酬データ、GA4/GSC実データ、既存サイトのバックアップ、本番DNS切替。
- [ ] 次の安全な作業: 記事の継続追加（根拠が取れたもの）、条件入力による比較UI、GSC/GA4連携コードの実装（資格情報なしでdry-run可能な形）、アクセシビリティの自動検査（axe）追加。

## 2026-11-06 — アクセシビリティ検査・最終検証（AIエージェント）
- [x] `@axe-core/playwright` によるWCAG 2.1 AA（A/AA）検査をE2Eに追加。トップ・eSIM・記事・比較手法の4ページ×desktop/mobile。
- [x] 検出された違反を修正: ロゴリンクのアクセシブル名と可視テキストの不一致、本文中リンクの色のみによる区別（下線追加）。
- [x] 最終テスト: unit 73件 / E2E 30件（smoke 22 + a11y 8）すべて成功。`pnpm lint` / `pnpm typecheck` / `pnpm build` 成功。
- [x] CI: run `42248160998` success（verify / e2e）。追加コミット分もCIで検証中。
