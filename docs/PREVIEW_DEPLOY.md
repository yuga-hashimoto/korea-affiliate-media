# Preview / 本番デプロイ（Cloudflare Pages）

最終更新: 2026-11-07

## 構成
- ホスティング: Cloudflare Pages プロジェクト `sougakuhikaku`
- 本番: https://sougakuhikaku.com （本番ブランチ `main`）
- プレビュー: https://preview.sougakuhikaku.pages.dev （ブランチ `preview`）
- ビルド: Next.js 静的書き出し（`STATIC_EXPORT=true` → `out/`）
- 旧URL転送: `public/_redirects` / セキュリティヘッダー: `public/_headers`

## 手元からデプロイ
```bash
# 依存関係
pnpm install

# プレビュー（noindex）
STATIC_EXPORT=true NEXT_PUBLIC_SITE_URL=https://sougakuhikaku.com NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-C4CJ11GEDH SITE_INDEXING_ENABLED=false pnpm build
npx wrangler pages deploy out --project-name=sougakuhikaku --branch=preview

# 本番（index許可）
STATIC_EXPORT=true NEXT_PUBLIC_SITE_URL=https://sougakuhikaku.com NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-C4CJ11GEDH SITE_INDEXING_ENABLED=true pnpm build
npx wrangler pages deploy out --project-name=sougakuhikaku --branch=main
```

## CIからデプロイ
- `.github/workflows/pages-deploy.yml` を手動実行する（`preview` / `main` を選択）。
- リポジトリ Secrets に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` を登録する。未設定時は自動でスキップする。
- 本番（`main`）は手動実行のみ。PRではデプロイしない。

## デプロイ後の確認
- [ ] `https://sougakuhikaku.com/` が新サイト（韓国旅行ノート）を表示
- [ ] `robots.txt` が Allow / `sitemap.xml` が42 URL
- [ ] 旧URL3件が308で転送
- [ ] 記事・カテゴリ・記事一覧の絞り込み・検索が動作
- [ ] 375pxで横スクロールなし
- [ ] セキュリティヘッダー（`X-Frame-Options` 等）
- [ ] OGP画像（`/og-default.png`）が表示

## ロールバック
- Cloudflare Pages のデプロイ履歴から直前のデプロイへ切り替える。
- 上書き前の旧サイト: `ec9e2f1d-2da8-4b2b-bc62-38811e586d90`（復帰は非推奨）。
- 新サイトの不具合時は、修正版を再デプロイするか、直前の新サイトデプロイへ戻す。

## 制約
- 静的配信のため、サーバーサイド処理（管理画面・API・動的検索）は含まない。
- 検索・絞り込みはクライアント側で処理する。
- 動的処理が必要になった場合は Cloudflare Workers（OpenNext）等へ移行する。
