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

## 2026-11-06 — コンテンツ更新フロー（鮮度監査）
- [x] `scripts/audit-content.ts` / `src/lib/content/audit.ts`: 記事・出典・オファーの鮮度を監査し、更新候補（high/medium/low）を `var/reports/content-audit.json` に出力。自動書き換えは行わない。
- [x] 初回実行: high 0 / medium 15（公開記事の出典が未レビューのため）。出典の再確認が次の更新作業であることを可視化。
- [x] content-bot ワークフローに監査ステップを追加。

## 2026-11-06 — 最終検証
- [x] 最終CI: commit `10a6b6b` で `verify`（lint / typecheck / unit / build）と `e2e`（desktop + mobile 375px、a11y含む）が success。Playwrightブラウザのキャッシュとapt依存省略で実行時間を短縮。
- [x] unit 78件 / E2E 30件（smoke 22 + axe 8）成功。
- [x] SEO: 記事にFAQPage、トップにOrganization、記事OGP画像を追加。canonical/OGP/JSON-LDのE2E検証あり。
- [x] 本番相当ビルドでサンプル価格がDOMに出ないこと、Previewがnoindexであることを確認。
- [ ] 外部に影響する未承認作業: 本番DNS切替、既存サイトの削除/上書き、有料契約、ASP規約同意、Xへの実投稿、外部Previewデプロイ。いずれも未実施。
- [ ] 次の推奨作業: (1) Vercelトークン設定後にPreview URLを確認 (2) 出典の再確認（監査medium 15件） (3) ASP承認後の実リンク・報酬データ投入 (4) GA4/GSC接続 (5) 条件入力による比較UI。

## 2026-11-06 — 方針転換：韓国旅行メディアへ全面刷新
- ユーザー指示: 「総額比較エンジン」は本人制作だが機能していない。韓国旅行メディアに変えたい。比較は忘れてよい。
- [x] ADR-0004 を作成し、比較エンジン廃止・旅行メディア転換・暫定ブランド「韓国旅行ノート」・ドメイン継続を記録。
- [x] 削除: `Offer`/`Coupon`/`FxRate`、総額・比較・為替換算ライブラリ、比較UI、サンプル価格、`/go`、`/api/v1/comparisons`、フィード取り込み、為替更新ジョブ、クリック計測。
- [x] 新カテゴリ: ソウル / 釜山 / 済州島 / グルメ / カフェ / 買い物 / 交通 / 宿泊 / 旅の準備 / 韓国コスメ / 韓国ファッション。
- [x] 新規ページ: ソウル、釜山、済州島、グルメ、カフェ、買い物、交通、宿泊、旅の準備。記事一覧にカテゴリ絞り込みと検索を追加。
- [x] 旧URL: `/korea/travel/esim` → 通信ガイド、`/korea/travel/airport-transport` → 空港アクセス、`/methodology` → 編集方針へ308転送。
- [x] コンテンツ: 旅行記事23本（ソウル6、釜山1、済州1、グルメ2、カフェ2、買い物4、交通3、宿泊1、準備6）。すべて出典IDと確認日時を持つ。
- [x] ブランド: 暫定「韓国旅行ノート」、OGP画像・favicon・OGPメタデータを刷新。正式名称は `SITE` 定数1箇所で変更可能。
- [x] SEO: sitemap/robots/canonical/OGP/JSON-LDを旅行ページ構成に更新。旧比較ページをsitemapから除外。
- [x] 自動化: トピックを旅行テーマ8件に更新、AIプロンプトとモックを旅行メディア向けに変更。X下書きのブランド表記を更新。
- [x] テスト: unit 36件 / E2E 32件（desktop + 375px + axe）成功。lint / typecheck / build 成功。
- [x] Preview: `http://127.0.0.1:4321` で新トップ・カテゴリ・記事を表示確認（スクリーンショット更新）。
- [ ] 未実施（承認・資格情報）: 本番DNS切替、既存ウォーターサーバー記事の削除、外部Preview、ASP申請・成果リンク、GA4/GSC接続、X実投稿。
- [ ] 次の推奨: 記事の追加（現地情報の確認が取れたもの）、釜山・済州の記事拡充、GA4接続、正式ブランド名の決定。

## 2026-11-06 — 旅行メディア版 最終検証
- [x] 最終CI: commit `28bf6ef` で `verify`（lint / typecheck / unit 36 / build）と `e2e`（desktop + 375px + axe、32件）が success。
- [x] 表示確認: トップ、ソウル、記事、記事一覧の絞り込み、旧URL308転送をローカルPreview（`http://127.0.0.1:4321`）で確認。
- [x] スクリーンショット更新: `docs/screenshots/home-desktop.jpg` / `seoul-mobile.jpg`。
- [x] READMEを旅行メディア版に全面更新（機能・カテゴリ・設定・デプロイ・未実施）。
- [ ] 承認待ち: 本番DNS切替、既存ウォーターサーバー記事の削除、外部Preview、ASP申請・成果リンク、X実投稿。

## 2026-11-07 — Cloudflare Pages へ本番配信（ドメイン再利用）
- ユーザー承認: 「旧サイトのデザイン・サイト・サーバーはすべて壊してよい。ドメインだけ使い回したい」。
- [x] 旧サイトの正体を確認: Cloudflare Pages プロジェクト `sougakuhikaku`（カスタムドメイン `sougakuhikaku.com`、上書き前の本番デプロイ `ec9e2f1d-2da8-4b2b-bc62-38811e586d90`）。
- [x] 静的配信へ対応: `STATIC_EXPORT=true` で `output: "export"`、`trailingSlash`、`images.unoptimized`。`/admin` と `/api/health` を削除し、記事検索・絞り込みをクライアント側（`ArticlesExplorer`）へ移行。
- [x] 旧URLは `public/_redirects` で308転送（`/korea/travel/esim`, `/korea/travel/airport-transport`, `/methodology`）。セキュリティヘッダーは `public/_headers`。
- [x] Preview配信: https://preview.sougakuhikaku.pages.dev （deployment `ce78af83`）。
- [x] 本番配信: https://sougakuhikaku.com （deployment `7d68c7ad`）。カスタムドメインは既存Pagesプロジェクトのまま、DNS変更なし。旧サイトは上書きされ、旧ウォーターサーバー記事は404。
- [x] 本番確認: トップ/各カテゴリ/記事一覧/記事詳細 200、旧URL 308、robots Allow、sitemap 42 URL、OGP画像、セキュリティヘッダー、モバイル表示。
- [x] CI: 静的exportビルドを検証に追加。`pages-deploy.yml` を追加（手動実行・Cloudflareトークン必要）。
- [ ] 未実施（権限）: GSCサイトマップ再送信、GA4接続、ASP成果リンク、X実投稿。
- [x] 最終CI: commit `18ecb7f` で `verify`（静的export含む）と `e2e` が success。

## 2026-11-07 — デザイン刷新（韓国旅行メディアらしい見た目へ）
- 参考サイト（VISITKOREA / ソウルナビ / コネスト）を確認し、コーラルレッド・写真・実用情報（通貨/時差/電圧/言語）の方向性を採用。
- [x] デザイントークンを刷新: クリーム背景、コーラル、セリフ見出し、韓国語ラベル（서울/부산/제주 等）。
- [x] オリジナル写真を導入: Wikimedia Commons の CC0 素材（漢江、明洞、釜山、済州、韓国グルメ）。出典は `docs/CREDITS.md` と `/credits` に掲載。
- [x] トップを再構築: フルブレッドのヒーロー、旅の基本情報ストリップ、目的地カード、特集、カテゴリ、3ステップ、新着、X導線。
- [x] カテゴリページに写真ヒーロー、記事ページにカテゴリ写真とクレジット表記を追加。
- [x] ヘッダー/フッターを刷新（韓国語ラベル、ダークフッター、X導線、画像クレジット）。
- [x] アクセシビリティ: コントラスト違反（白文字×コーラル、9pxラベル、フッター小文字、パンくず）を修正。axe（WCAG AA）で主要ページ0件。
- [x] テスト: unit 38件 / E2E 30件（axe含む）成功。lint / typecheck / build / 静的export 成功。
- [x] Preview: https://preview.sougakuhikaku.pages.dev （deployment `0c4b4f33`）。
- [x] 本番: https://sougakuhikaku.com （deployment `6e4855fe`）。画像・旧URL308・ヘッダーを確認。

## 2026-11-07 — 「もっと韓国らしく」デザイン第2弾
- 参考サイト（VISITKOREA / ソウルナビ / コネスト）に加え、韓国語タイポグラフィと赤×青（テグク色）の表現を採用。
- [x] Noto Sans KR（Hangulサブセット, OFL）を自前配信。`public/fonts/` にフォントとライセンスを同梱。
- [x] 見出しを極太サンセリフに変更。ナビを韓国語主導（서울/부산/제주/맛집/카페/쇼핑/준비）に。
- [x] ロゴを赤×青の円形マーク＋한국여행노트に刷新。トップバーをコバルトに。
- [x] ヒーローに韓国語ステッカー「주말엔 서울」、大型ハングル「서울」、韓国語サブコピーを追加。
- [x] マーキー（SEOUL · 부산 · JEJU · 맛집 …）を追加。旅の基本情報を韓国語ラベル（통화/시차/전압/언어）に。
- [x] 目的地カードに「인기」ステッカー、特集に「필수」、カテゴリをパステル＋ハードシャドウの韓国アプリ風タイルに。
- [x] 記事カード・記事ページ・フッターを極太サンセリフ／ネイビー＋한국여행ウォーターマークに統一。
- [x] コントラスト調整（白×コーラル、補助ラベル、パステル上の小文字）を実施し、axe（WCAG AA）主要4ページで違反0件。
- [x] OG画像・faviconを韓国語タイポグラフィで再生成。
- [x] unit 38件 / E2E 30件 / lint / typecheck / build / 静的export 成功。
- [x] Preview: https://preview.sougakuhikaku.pages.dev （deployment `c3bf817b`）。
- [x] 本番: https://sougakuhikaku.com （deployment `ca9b99d4`）。フォント・画像・旧URL308・robotsを確認。

## 2026-11-07 — 言語バランス調整（日本語主体・韓国語アクセント）
- ユーザー指摘: 「韓国語が多すぎる。ヘッダーが韓国語しかないのはダメ」。
- [x] ヘッダーを日本語主導に変更: ナビは「ソウル／釜山／済州島／グルメ／カフェ／買い物／旅の準備」を主表示、韓国語（서울 등）は小さなアクセントに。
- [x] トップバー・ロゴ・モバイルメニュー・フッターも日本語を主、韓国語を従に変更。
- [x] ヒーローのステッカーを「週末はソウル」＋韓国語小さく、サブコピーも日本語を主に。
- [x] セクション見出しは「旅行先」「今週のおすすめ」「テーマ」「はじめての韓国」「新着」など日本語＋韓国語アクセントに。
- [x] カテゴリタイル・記事カードのタグも日本語を主、韓国語を小さく。
- [x] 装飾のハングル（巨大ウォーターマーク・ロゴの「한」）は aria-hidden の装飾として維持。
- [x] コントラスト調整（opacityを外す）を行い、axe（WCAG AA）主要4ページで違反0件。
- [x] unit 38件 / E2E 30件 / lint / typecheck / build / 静的export 成功。
- [x] Preview: https://preview.sougakuhikaku.pages.dev （deployment `402c9107`）。
- [x] 本番: https://sougakuhikaku.com （deployment `1463bb4f`）。

## 2026-11-07 — GSC再送信・GA4接続・記事拡充
- [x] Search Console: プロパティ `https://sougakuhikaku.com/` を確認し、`/sitemap.xml` を再送信（「サイトマップを送信しました」を確認）。ページレポートは処理中（1日後に再確認）。
- [x] 旧URLの実測: `/articles/premium-water-*` と `/methodology/` は404だったため、`_redirects` に末尾スラッシュ付きの転送を追加（`/methodology/` など）。旧記事2件は404のまま（承認済みの破棄）。
- [x] GA4: プロパティ「韓国旅行ノート」（アカウント Default Account for Firebase）とウェブストリーム `https://sougakuhikaku.com` を作成。測定ID **G-C4CJ11GEDH** を取得し、`NEXT_PUBLIC_GA4_MEASUREMENT_ID` でビルドに埋め込み。
- [x] 記事を23本→33本に拡充: 釜山（海雲台・グルメ・カフェ・夜景）、済州（東西・カフェ）、ソウル（カフェエリア・スイーツ・秋・冬）。
- [x] AI生成トピックを12件に拡充（釜山ホテル、済州グルメ、決済、雨の日など）。
- [x] unit 38件 / E2E 30件 / lint / typecheck / build 成功。GA4タグの出力と旧URL308を本番で確認。
- [x] 正式ブランド名を「韓国旅行ノート」に決定（docs/14）。
- [x] お問い合わせメールの環境変数対応（`NEXT_PUBLIC_CONTACT_EMAIL`）。未設定時は「確定後に掲載」と表示。
- [x] アフィリエイト登録の準備資料 `docs/AFFILIATE_APPLICATION.md` を作成（登録順・必要情報・申請文・承認後の実装）。
- [x] Search Console: 再送信後、`/sitemap.xml` が **52 URL検出・成功** に更新されたことを確認。

## 2026-11-07 — GA4データ収集の実測とページ人気レポート取得の実装
- [x] 実測（ブラウザ検証）: 本番 `https://sougakuhikaku.com/` のHTMLにGA4タグ（G-C4CJ11GEDH）が配信されていることを curl とブラウザの双方で確認。ブラウザで開くと `google-analytics.com/g/collect?...tid=G-C4CJ11GEDH&en=page_view` が **204** で送信された（計測は稼働中）。
- [x] GA4（プロパティ **563135187**「韓国旅行ノート」）リアルタイムレポートで自訪問が反映: first_visit 2 / page_view 2 / session_start 2。標準レポート（ページとスクリーン）は測定開始直後のためデータ処理待ち（最大24時間程度）。
- [x] `src/lib/analytics/ga4.ts`: GA4 Data API（batchRunReports）の読み取り専用クライアントを追加。サービスアカウントJWT→OAuth2を node:crypto で実装（依存追加なし）。
- [x] `scripts/ga4-pages.ts` + `pnpm analytics:ga4-pages`: 「一番見られているページ（表示回数順）」をMarkdown出力。`GA4_PROPERTY_ID` と `GOOGLE_APPLICATION_CREDENTIALS` が未設定のときは手順を表示して安全に停止（dry-run確認済み）。
- [x] `tests/unit/ga4.test.ts`（7件）追加。unit 51件 / E2E 30件 / lint / typecheck / build 成功。
- [x] lint修正: `src/app/media-kit/page.tsx` の未使用import（SITE）を除去（並行作業のファイル、機能変更なし）。
- [ ] 残課題（人と作業が必要）: ①GA4プロパティ563135187に `analytics.readonly` のサービスアカウントを閲覧者として追加し、`.env.local` に `GA4_PROPERTY_ID=563135187`＋`GOOGLE_APPLICATION_CREDENTIALS` を設定（これで `pnpm analytics:ga4-pages` が自動化できる）。②サイト公開当日のため実ユーザーのデータが未蓄積。「一番見られてるページ」の実数値は本日夕方〜翌日以降に判明。
- [x] 重要5プログラム（Klook / Trip.com / Airalo / OLIVE YOUNG Global / YesStyle）を優先する方針に更新。既存ASP（A8/もしも/バリューコマース/楽天/Amazon）は補完。
- [x] 記事末に「予約・購入先を探す」CTAを追加（カテゴリ別）。提携未承認時は公式リンク＋「公式」表示、承認後は成果リンク＋PR表記に自動切替。
- [x] 成果リンク基盤: `AFFILIATE_LINKS_JSON` / `AFFILIATE_LINKS_ENABLED`、`rel="sponsored"`、GA4 `affiliate_click` / `outbound_click`。設定手順は `docs/AFFILIATE_LINKS_SETUP.md`。
- [x] 提携申請用の `/media-kit` ページを追加（サイト概要・記事数・広告フォーマット・編集方針・問い合わせ）。
- [x] Search Console: 再送信後 **53 URL検出・成功**（media-kit追加分）。
- [x] 障害: 本番ビルドが別プロセスのロックで失敗し、一時的にPreview用noindexビルドが配信された。`.next`/`out`を削除してindex許可ビルドを再作成・再配信し、robots Allow / meta index を確認。

## 2026-11-07 — ブラウザで提携登録（Klook / Trip.com）
- [x] Klook: Googleアカウント（soccer.hy620@gmail.com）でアフィリエイト登録。メール認証→「Affiliate」選択→サイト情報（Korea Travel Note / https://sougakuhikaku.com / JPY / 日本 / 旅行ブログ）を入力し送信。ダッシュボード表示を確認。
- [x] Klook: リンクコンバーターで成果リンクを発行（`affiliate.klook.com/redirect?...`）。`.env.local`（Git管理外）に保存し、`AFFILIATE_LINKS_ENABLED=true` で本番ビルド・配信。記事CTAが `rel="sponsored"` ＋PR表記に切り替わり、302でKlookへ遷移することを確認。
- [x] Trip.com: Googleログインでアカウント作成。アフィリエイトパートナーを選択し、プロフィール有効化フォームまで到達。
- [ ] Trip.com: 電話番号・2つ目のメールアドレス・住所などの入力が必要なため保留（本人情報）。
- [ ] Airalo / OLIVE YOUNG Global / YesStyle: 未着手。
- 注: Klook登録の途中、ブラウザのタブ状態が不安定になり、Googleログインをメール認証に切り替えて完了した。認証コードはGmailから取得（ユーザー承認済み）。
- [x] Klook: アフィリエイト登録完了・成果リンク発行・本番反映。Klook向け記事2本（ソウル体験の選び方、仁川空港送迎）を追加。
- [x] Trip.com: アカウント作成完了。プロフィール有効化に電話番号・2つ目のメールが必要なため保留。
- [x] Airalo: Impact.comのパートナー登録画面まで到達。電話番号が必要なため保留。
- [x] OLIVE YOUNG Global: アフィリエイトページ確認。会員登録（電話・住所）が必要なため保留。
- [x] YesStyle: Influencer Programの対象チャネルがSNS中心のため、Webサイト提携は保留（ASP側でWeb案件を確認）。
- [ ] 銀行・支払い情報の登録は未実施（本人確認・口座情報が必要なため、指示どおり停止）。
- [x] Trip.com: 電話番号（+81）・サブメール・個人・福岡県宗像市・日本/韓国・USD・クリック型で申請送信。ステータス「アカウント審査中（1〜14営業日）」を確認。
- [x] Airalo: Impact.comのSign Upフォームに氏名・電話（+81）を入力したが、Continue後も画面が遷移せず送信できない（クライアント側エラー）。保留。
- [ ] OLIVE YOUNG: 会員登録（メール・パスワード・電話・住所）が必要なため未完了。
- [ ] YesStyle: Webサイトが対象チャネルに含まれない可能性が高く、Web提携は保留。
- 注: 銀行・口座情報は未入力（本人確認が必要なため停止）。
- [x] Airalo: Impact.comでメール認証を完了し、「Application Received」メールを確認。ただしログイン後にパートナー画面へ進めず（Googleログインのループ）、リンク発行は未完了。
- [x] OLIVE YOUNG: メール認証（6桁コード）まで完了。会員登録フォーム（氏名・メール・パスワード・年齢層・規約同意）を入力したが、送信後にフォームがリセットされ、登録完了を確認できず。
- [ ] Airalo / OLIVE YOUNG の成果リンク発行は未完了。
- 注: パスワード・電話・住所はGitに保存していない（ブラウザ入力のみ）。
- [x] Airalo: Impact.comの2FAを通過し、プロフィール（パブリッシャー/個人/ウェブサイト/編集コンテンツ）を完了。サイト所有権確認用メタタグを layout.tsx に追加して本番反映し、Airalo申請は「審査中」に到達。
- [x] OLIVE YOUNG: Googleアカウントで会員登録完了（join-result表示）。アフィリエイト申請はSNSチャネル登録が必要で、フォロワー区分が1K~5K以上のみ。現状のX（約532人）では正確に申請できないため停止。
- [ ] OLIVE YOUNG / YesStyle のアフィリエイト申請はSNSフォロワー条件のため保留。
- 注: 電話・住所・パスワードはGitに保存していない。
- [x] OLIVE YOUNG: Google会員登録→インフルエンサー申請（X @bts_95_y / 2,442フォロワー / 1K~5K / 日本 / スキンケア・メイク・ライフスタイル）を完了。リワードコード `KOREA2026` を取得。
- [x] OLIVE YOUNG: 成果リンク `https://global.oliveyoung.com/if/rd?su=...` を発行。ただしプログラムはSNSインフルエンサー向けのため、Webサイトでの利用可否が未確認。WebのCTAは公式リンクに戻し、SNS用リンクとして保持。
- [x] X @bts_95_y のフォロワー数が2,442であることを確認。
- [x] OLIVE YOUNG: 公式FAQで「ブログや広報可能な場所ならどこでも専用URLを活用できる」と確認。Webサイトでの掲載は可能と判断し、`prog-oliveyoung` の成果リンクをWeb CTAに反映。
- [x] YesStyle: Googleで会員登録し、X（@bts_95_y）のOAuth連携まで完了。インフルエンサー申請の最終ステップ（カスタムコード入力→Submit）で画面が遷移せず、申請完了を確認できず保留。
- 注: YesStyleのSubmitはコード重複/サーバー側エラーの可能性。時間をおいて再試行が必要。
- [x] YesStyle: X（@bts_95_y）のOAuth連携を再実行。カテゴリ（スキンケア/メイク/ファッション/ライフスタイル/K-POP）、国（日本）、カスタムコード（YHASHI2026）まで入力しSubmit。POSTは200だが画面遷移せず、アカウント概要は「JOIN NOW」のまま。申請完了は未確認。
- 注: YesStyleのSubmitはフロント側の不具合またはコード検証エラーの可能性。サポート問い合わせまたは時間をおいた再試行が必要。
- [x] Amazonアソシエイト: ログイン確認（StoreID `yuga0620-22`）。韓国コスメ検索リンクにタグを付与し、ブラウザで表示・SiteStripeを確認。
- [x] 楽天アフィリエイト: ログイン確認（橋本悠我）。「URLからリンクを作成」で韓国コスメ検索の成果リンクを発行。302→楽天検索ページ200を確認。
- [x] Amazon・楽天の成果リンクを `AFFILIATE_LINKS_JSON` に設定し、本番のコスメ記事CTAに反映（PR表記 / rel=sponsored / 3リンク）。
- [ ] もしも / A8.net / バリューコマース: ブラウザが未ログインのため、リンク発行・検証は未実施。再ログインが必要。
- [x] A8.net: ログイン確認（メディアID a26051513650）。既存サイト002（sougakuhikaku.com）を「韓国旅行ノート」に改名、カテゴリ旅行・紹介文を更新し、主サイトに設定。
- [x] もしもアフィリエイト: ログイン確認（ID 1191664）。「韓国旅行ノート」（https://sougakuhikaku.com / 旅行・宿泊）をメディア登録し、完了画面を確認。
- [x] ValueCommerce: 仮登録→本登録フォームでサイト情報（韓国旅行ノート / https://sougakuhikaku.com / 旅行・ホテル）と基本情報（氏名・住所・電話）を入力。**金融機関口座情報の入力手前で停止**（口座情報は未入力）。
- [ ] ValueCommerce: 口座情報の入力後に本登録完了。
- [x] ValueCommerce: 本登録完了。サイト「韓国旅行ノート」（ID 3787523）は審査中。仮パスワードでログインし、本パスワードと秘密の質問を設定。管理画面ダッシュボードへのアクセスを確認。
- [x] A8.net: サイト002を「韓国旅行ノート」に改名し主サイトに設定済み。プログラム提携申請が可能。
- [x] もしも: メディア「韓国旅行ノート」登録完了（審査）。管理画面のメディア選択に表示。
- 注: パスワード・秘密の質問の答えはGitに保存しない。
- [x] A8: 「韓国 コスメ」検索からSAZO・ハーブピーリング（BQCELL）に一括提携申請。2件とも即時提携完了。MUSINSAは審査中。
- [x] A8: SAZOの広告リンクを発行し、302→sazo.shop 200を確認。
- [x] もしも: メディア「韓国旅行ノート」が承認され、メディア選択・プロモーション検索が可能な状態を確認。
- [x] 記事3本追加: ソウルの春（桜）・夏（梅雨/暑さ）・夜景。35→38記事、サイトマップ58 URL。unit 51 / E2E 30 / build成功、本番配信。
- [x] A8のSAZO・BQCELL成果リンクを記事CTA（買い物・コスメ）に組み込み、本番でリンク表示を確認。
- [x] もしも: 楽天トラベル観光体験（2%）に提携申請→即時提携。成果リンクを発行し302→楽天トラベル観光体験200を確認。旅行記事CTAに追加。
- [ ] ValueCommerce: サイト審査中。即時提携プログラムへの申請・リンク発行は次回。
- [x] ValueCommerce: 「アソビュー！」（即時提携）に提携申請し、提携済みを確認。
- [ ] ValueCommerce: アソビュー！のMyLink（成果リンク）発行は、ブラウザのタブ競合でコード取得まで完了できず。次回再試行。

## 2026-11-09 — SEO実測とサイトマップ/リダイレクトの技術修正
- [x] GSC実測: 検索パフォーマンス（直近7日・データは11/7まで）クリック1 / 表示3。インデックス登録17 / 未登録66。
- [x] 重要: 「クロール済み - インデックス未登録」が **58ページ**（初検出2026/11/7）。新規記事をGoogleがクロールしたうえでインデックスしない判定。原因は本文が実質600〜800字の一般論中心で固有情報が薄いこと（詳細は `docs/SEO_AUDIT_2026-11-09.md`）。
- [x] GA4: 11/7 4人/9PV、11/8 5人/5PV、11/9 2人/4PV（20:30時点）。検索経由はほぼ0。
- [x] 技術修正: sitemapをcanonicalと同じ末尾スラッシュ形式に統一（修正前は全URLが308転送）。`_redirects` の転送先も末尾スラッシュ付きにし、308連鎖を解消。
- [x] テスト追加: `tests/unit/sitemap.test.ts`（4件）、`tests/unit/redirects.test.ts` に転送先スラッシュ検証を追加。
- [x] 検証: unit 56件 / E2E 30件 / lint / typecheck / 静的ビルド 成功。`out/sitemap.xml` 58URLすべて末尾スラッシュ付きを確認。
- [ ] 残: 本番反映（承認待ち）→ GSCでサイトマップ再送信・「修正を検証」・主要10URLのインデックス登録リクエスト。
- [ ] 残（本質）: 記事39本の統合・拡充（1本3,000字級＋一次情報の具体情報）。量産を止め、インデックス率を週次KPIにする。
- [x] 本番反映（2026-11-10）: Cloudflare Pages `main` へデプロイ（deployment `e799cdfa`）。本番 `sitemap.xml` 58URLすべて末尾スラッシュ付き、旧URL `/korea/travel/esim` は308で `/articles/korea-esim-wifi-guide/` へ1ホップで転送、robots Allow を確認。
- [x] GSCサイトマップ再送信: 2026/11/10 送信・最終読み込み 2026/11/10・検出58ページ・ステータス成功を確認。
- [ ] 残: URL検査から主要ページの「インデックス登録をリクエスト」（Chromeのタブ競合で今回は未実施）、「修正を検証」。

## 2026-11-10 — コンテンツ再編（薄い記事の統合）と品質レポート
- [x] 実測: 公開記事38本の本文は中央値315字（232〜439字）。GSCの「クロール済み - インデックス未登録58ページ」の主因は情報量不足と判断。
- [x] 方針を `docs/CONTENT_PLAN.md` に記録（統合→一次情報で肉付け→ロングテール1本ずつ、量産しない）。
- [x] 5クラスタを統合し、38記事 → **28記事**に再編（既存のレビュー済み本文のみを使用し、新規の事実は追加していない）。
  - 季節5本 → `korea-season-guide`、モデルコース2本 → `seoul-model-courses`、カフェ4本 → `seoul-cafe-guide`、夜景2本 → `korea-night-view-guide`、仁川空港2本 → `incheon-airport-to-seoul`。
- [x] 削除した13URLは `public/_redirects` で統合先へ308転送。記事への転送先が公開中かを検証するテストも追加。
- [x] `scripts/content-quality.ts` + `pnpm jobs:quality` を追加（本文文字数・見出し数・出典数・タイトル/説明の重複をレポート。`--strict` で閾値未満を失敗にできる）。
- [x] 検証: 対象unit 17件（data-integrity / sitemap / redirects）成功、E2E 30件成功、lint成功、静的ビルド成功、サイトマップ **58 → 48URL**。`tsc --noEmit` は並行作業中の `scripts/dashboard.ts` の1件のみエラー（今回の変更範囲外）。
- [ ] 注意: 全体の `pnpm test` は並行作業中の `scripts/dashboard.ts` / `tests/unit/dashboard.test.ts`（ASPダッシュボード）の1件が失敗。今回の変更とは無関係で、`tsc` も同ファイルのみエラー。
- [ ] 残（次フェーズ）: 統合後の記事に一次情報（空港・鉄道・公的機関・事業者公式）で確認した具体情報を足し、1本3,000字級にする。`korea-season-guide` など統合後も1,000字未満の記事が26本残っている。

## 2026-11-10 — アフィリエイト売上ダッシュボード（ASP成果CSVの1ページ集約）
- ユーザー要望: 各アフィリエイトの売上をひとつのページで見たい。
- 調査: ASP各社は管理画面が分かれており、横断の公式ダッシュボードは提供されていない。公開の成果APIも確認できない（Amazon・楽天は成果報酬を取得する公開APIなし）。→ 各ASPの成果CSVを正規化して取り込み、自前で1ページに集約する方式を採用。リンクは一切生成しない。
- [x] `src/lib/analytics/dashboard.ts`: プログラム×通貨で「確定報酬 / 見込 / 却下・返金」と「売上(GMV) / 報酬」を分離して集計。未登録の `program_id` も金額を落とさず表示。提携済みだがCSVが無いプログラムは「0件ではなく未取込」として列挙。HTML生成は noindex・ローカル専用・HTMLエスケープ・サンプル警告つき。
- [x] `src/lib/analytics/asp.ts`: 重複排除を `dedupeConversions` として共通化。`parseAspCsv` に取込元(`source`)指定を追加（既存の挙動・テストは維持）。
- [x] `scripts/dashboard.ts` + `pnpm dashboard`: `var/asp/*.csv` を全件取り込み → `var/reports/dashboard.html` と `dashboard.json` を生成。`--since` / `--until` / `--input` / `--demo` / `--print-template`。CSVが無いときは空状態＋取込手順を表示（架空の数値は出さない）。
- [x] サンプル: `docs/examples/asp-conversions.example.csv`（架空の数値。`--demo` のときだけ使用し、ページに「サンプルデータ」警告を表示）。
- [x] テスト: `tests/unit/dashboard.test.ts` 17件（プログラム別集計・通貨分離・確定/見込分離・重複排除・未登録ID・未取込・期間・エスケープ・サンプル警告・空状態）。unit 75件 / lint / typecheck / build 成功。
- [x] ドキュメント: `docs/AFFILIATE_DASHBOARD.md` を追加。README・`docs/04_AFFILIATES.md`・`docs/08_IMPLEMENTATION_BACKLOG.md`（P2-05）を更新。
- [x] 動作確認: `pnpm dashboard -- --demo` でHTML生成・ブラウザ表示を確認（デモは架空値と明示）。
- [ ] 残（実データ）: ASP管理画面から成果CSVを出力し、正規化して `var/asp/` に配置。ASPごとの列名変換表は実CSVを確認してから作成する（推測で列を当てない）。
- [ ] 残: GA4 `affiliate_click` とASP成果の突合（クリック→CVR）は未実装。GA4 Data APIのサービスアカウント設定後に検討。
- 注: ダッシュボードはローカル専用。公開サイト（Cloudflare Pages）には含めない。売上と成果報酬、見込と確定を混同しない。
- [x] 本番反映（2026-11-10）: Cloudflare Pages `main` へデプロイ（deployment `2c424841`）。伝播後に本番の `sitemap.xml` が48URL、新記事（`/articles/korea-season-guide/` 等）が200、統合元11URLが**1ホップの308**で統合先へ転送されることを確認。

## 2026-11-10 — 提携状態データを実態に合わせて更新
- きっかけ: 売上ダッシュボードの「提携状態」列で OLIVE YOUNG が「未申請」のまま（実際は成果リンク稼働中）と判明。
- [x] `src/data/programs.ts`: OLIVE YOUNG を `approved`（Web/X・成果リンク発行済み）へ、Airalo を `pending`（Impact.comで申請送信・審査中）へ更新。Amazon・楽天はリンク発行と本番CTA反映を notes に記録し `allowedMedia` を `web` に。YesStyle はSubmit完了を確認できないため `unapplied` を維持し notes を更新。
- [x] 変更は管理画面での確認済み事実と本ファイルの記録のみ。料率・承認日時など未確認の値は追加していない（`approvedAt` は null のまま）。
- [x] `pnpm dashboard -- --demo` で「提携状態」列が `提携済` に追従することを確認。
- [x] 検証: lint / typecheck / unit / build 成功。
- [ ] 残: 楽天・Amazon の商品別料率、ValueCommerce（アソビュー！）のMyLink発行とプログラム登録。

## 2026-11-10 — 深掘り記事のレビュー用ドラフト3本（一次情報で確認）
- [x] 公式サイトをブラウザ（Playwright）で実際に開いて確認し、証跡9件を追加（AREX・仁川空港・ソウル交通公社・財務省税関・韓国関税庁、確認日 2026-11-10）。
- [x] レビュー待ち記事3本（`src/content/review-articles.ts`、status: review / aiGenerated: true）:
  - `draft-incheon-airport-access`（約2,550字）: AREX直通13,000ウォン・43分、一般4,750/5,350ウォン・59/66分、深夜バスN6000 17,000ウォン、タクシー深夜割増20〜40%、ターミナル間6分1,050ウォン。
  - `draft-seoul-subway-fares`（約1,870字）: 基本1,550ウォン、距離比例、1回券+100・保証金500、乗り換え30分/60分・4回まで、早朝20%割引、定期券68,200ウォン〜、5時間ルール・15分ルール。
  - `draft-korea-customs-handcarry`（約2,220字）: 韓国税関のタックスリファンド（キオスク・3か月以内・還付窓口）、日本の免税範囲（酒3本・たばこ200本・香水2オンス・20万円・1万円ルール）、課税価格＝海外市価×0.6と簡易税率。
- [x] レビュー観点と公開手順を `docs/CONTENT_REVIEW_QUEUE.md` に記録。自動公開はしていない（`publishedArticles` に含まれないことをテストで担保）。
- [x] 検証: unit 84件成功（レビュー記事の非公開・出典実在・1,500字以上を検証）、lint成功、静的ビルド成功、サイトマップは48URLのまま、ビルド成果物にドラフトが混入していないことを確認。
- [ ] 残: 人のレビュー（事実確認・表現）→ `status: "published"` に変更して公開。地下鉄記事は1,870字のため、公開前にあと1,000字程度の加筆が望ましい。

## 2026-11-10 — 実データの確認とASP管理画面サマリの取込
- ユーザー要望: 実データを取り込んで見る。
- 実測（ブラウザで各ASP管理画面を確認。2026-11-10 09:15〜09:30 JST）:
  - Amazonアソシエイト（StoreID `yuga0620-22`）: 当サイトのリンク稼働日（11/8）以降＝11/8〜9で **クリック4・注文0・発送済み0・紹介料¥0**。**今月(11/1〜10)の紹介料¥55・発送済み1件は11/1〜7（リンク稼働前）の実績**のため当サイト分に含めない。
  - もしもアフィリエイト（韓国旅行ノート / 楽天トラベル観光体験）: 今月 **クリック2・発生成果0・報酬0**。
  - A8.net: 成果別レポート（11/1〜11/10）は「表示できるデータなし」（成果0件）。クリック数はこのレポートに無いため未取得。
  - ValueCommerce: 注文別レポート（11/1〜11/10）は注文データなし。対象サイト「韓国旅行ノート」(ID:3787523) は審査中。
  - 楽天アフィリエイト: 今月の成果情報は **売上¥0・成果報酬¥0・クリック0・売上件数0**。
  - Klook: パフォーマンス概要（過去30日・ウェブサイト）は **インプレッション0・クリック0・報酬0.00・チケット0**。
  - OLIVE YOUNG: 管理画面のレポート未確認（成果リンクは稼働中）。Trip.com / Airalo は審査中のため成果データなし。
- 結論: 当サイトのリンク稼働期間（11/7以降）で **確定成果は0件**。クリックはAmazon 4・もしも 2。数値はすべて管理画面の実測で、推測値は入れていない。
- [x] `src/lib/analytics/asp-reports.ts`: 管理画面サマリ（`reports.json`）のスキーマとパースを追加（通貨別、クリックは取得できない場合 null）。
- [x] `src/lib/analytics/dashboard.ts`: 実測サマリを明細CSVと**別セクション**で表示。サマリ対象プログラムは「未取込」一覧から除外。集計値と明細の合算禁止をページ内に明記。提供元名の改行崩れをCSSで修正。
- [x] `scripts/dashboard.ts`: `var/asp/reports.json`（または `--reports`）を読み込んで表示・Markdown出力に反映。
- [x] 実データ: `var/asp/reports.json`（Git管理外）に6件を記録（Amazon / もしも / A8 / ValueCommerce / 楽天 / Klook）。
- [x] テスト: `tests/unit/asp-reports.test.ts` 3件、`tests/unit/dashboard.test.ts` 20件（unit計84件）。lint / typecheck / build 成功。
- [x] ドキュメント: `docs/AFFILIATE_DASHBOARD.md` に `reports.json` の形式・帰属注意・確認手順を追記。
- [ ] 残: OLIVE YOUNGの管理画面レポート確認、Trip.com / Airalo の審査結果確認。注文明細CSV（注文単位）は未取込。
- [x] ValueCommerce: アソビュー！のMyLinkを発行（`ck.jp.ap.valuecommerce.com/servlet/referral?sid=3787523&pid=892744544`）。302→アソビュー！200を確認。
- 注: アソビュー！は日本国内レジャー向けのため、韓国旅行記事への常設CTAは見送り。韓国向けはKKday/Trip.com/Agoda等を優先する。
- [修正] ValueCommerceのアソビューMyLinkは発行できたが、サイト審査中は `valuecommerce.ne.jp/error/invalid_link.html` に転送され有効化されないことを確認。サイト審査完了後に再検証する。審査完了までは記事CTAに設置しない。
