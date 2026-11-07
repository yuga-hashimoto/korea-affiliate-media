# ADR-0005: Cloudflare Pages への静的配信とドメイン再利用

- 日付: 2026-11-07
- 状態: 実施済み
- 関連: ADR-0004, `docs/06_DOMAIN_MIGRATION.md`

## 背景
- 旧サイトは Cloudflare Pages プロジェクト `sougakuhikaku`（カスタムドメイン `sougakuhikaku.com`）で配信されていた。
- ユーザーから「旧サイトのデザイン・サイト・サーバーはすべて壊してよい。ドメインだけ使い回したい」と明示承認を得た。
- 新しい韓国旅行メディアは記事中心で、リクエストごとのサーバー処理を必要としない。

## 判断
1. **静的書き出し**（`STATIC_EXPORT=true` で `output: "export"`）を採用し、`out/` を Cloudflare Pages に配信する。
2. **既存の Pages プロジェクトとカスタムドメインを再利用**する。DNSレコードの変更は不要（カスタムドメインは既にプロジェクトに紐づいている）。
3. 旧サイトのコンテンツは上書きされ、旧ウォーターサーバー記事のURLは404になる（ユーザー承認済み）。
4. 旧URLのうち新サイトで受け皿があるものは `public/_redirects` で308転送する。
5. 管理画面（`/admin`）とAPI（`/api/health`）は静的配信に含めない。レビューはCLI（`promotions/queue.json`）で行う。
6. 検索・カテゴリ絞り込みはクライアント側で処理する（`ArticlesExplorer`）。

## 配信手順
```bash
# 本番
STATIC_EXPORT=true NEXT_PUBLIC_SITE_URL=https://sougakuhikaku.com SITE_INDEXING_ENABLED=true pnpm build
npx wrangler pages deploy out --project-name=sougakuhikaku --branch=main

# プレビュー
STATIC_EXPORT=true NEXT_PUBLIC_SITE_URL=https://sougakuhikaku.com SITE_INDEXING_ENABLED=false pnpm build
npx wrangler pages deploy out --project-name=sougakuhikaku --branch=preview
```
- CI用: `.github/workflows/pages-deploy.yml`（`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` が必要。手動実行のみ）。
- セキュリティヘッダーは `public/_headers` で付与する（`next.config` の headers は静的配信では使われない）。

## 実施記録（2026-11-07）
- Preview: https://preview.sougakuhikaku.pages.dev （deployment `ce78af83`）
- Production: https://sougakuhikaku.com （deployment `7d68c7ad`、カスタムドメイン維持）
- 上書き前の本番デプロイ: `ec9e2f1d-2da8-4b2b-bc62-38811e586d90`
- 確認: トップ/カテゴリ/記事/記事一覧 200、`/korea/travel/esim` 308、robots allow、sitemap 42 URL、旧ウォーターサーバー記事 404、セキュリティヘッダー付与。

## 影響・制約
- サーバーサイドの動的処理は行えない。将来必要になった場合は Cloudflare Workers（OpenNext）か別ホスティングへ移行する。
- Cloudflare のデプロイ履歴から旧デプロイへ戻すことは技術的には可能だが、ユーザーは旧サイトの破棄を承認しているため、原則として戻さない。
- GSCのサイトマップ再送信・所有確認はユーザー側の権限が必要。

## ロールバック
- 新サイトに重大な不具合がある場合: Cloudflare Pages のダッシュボードで直前のデプロイ（`7d68c7ad` 以前）に切り替える、または `wrangler pages deployment` で再デプロイする。
- 旧サイトへ戻す場合は `ec9e2f1d...` をロールバック先に指定する（非推奨）。
