# sougakuhikaku.com ドメイン再利用（実施済み）

最終更新: 2026-11-07

## 結論
- 旧サイト（運営者自身が制作した「総額比較」サイト）は、ユーザーの明示承認により**破棄**した。
- ドメイン `sougakuhikaku.com` は、既存の Cloudflare Pages プロジェクト `sougakuhikaku` とカスタムドメインを**そのまま再利用**した。
- **DNSレコードの変更は行っていない**（カスタムドメインが既存プロジェクトに紐づいていたため）。
- 旧コンテンツのバックアップは取得していない（「デザイン・サイト・サーバーはすべて壊してよい」との指示による）。

## 実施内容（2026-11-07）
1. 新サイトを静的書き出し（`STATIC_EXPORT=true`）でビルド。
2. `wrangler pages deploy out --project-name=sougakuhikaku --branch=preview` でプレビュー確認。
3. `--branch=main` で本番配信。カスタムドメイン `sougakuhikaku.com` は維持。
4. `public/_redirects` で新サイトに受け皿がある旧URLのみ308転送。
5. 旧ウォーターサーバー記事URLは404（意図どおり）。

## 確認結果
- https://sougakuhikaku.com/ : 200、新サイト表示、canonical/OGP正常。
- ソウル・釜山・済州・グルメ・カフェ・買い物・記事一覧・記事詳細 : 200。
- `/korea/travel/esim` → `/articles/korea-esim-wifi-guide` 308。
- `/korea/travel/airport-transport` → `/articles/incheon-airport-to-seoul` 308。
- `/methodology` → `/editorial-policy` 308。
- `robots.txt` : Allow、sitemap 42 URL。
- 旧記事 `/articles/premium-water-amadana-53b10b-24monthja-jp/` : 404。
- セキュリティヘッダー（`X-Frame-Options` 等）付与。

## ロールバック
- Cloudflare Pages のデプロイ履歴から直前のデプロイへ切り替え可能。上書き前の本番デプロイは `ec9e2f1d-2da8-4b2b-bc62-38811e586d90`。
- ただし旧サイトへの復帰はユーザーが不要と判断しているため、原則として行わない。
- 新サイトの不具合時は、修正版を再デプロイするか、直前の新サイトデプロイへ戻す。

## 残タスク（ユーザー権限が必要）
- Search Console のサイトマップ再送信・インデックス状況の確認。
- GA4 の測定ID設定とデータ確認。
- 旧サイト由来の被リンク・検索流入のモニタリング（旧記事は404のため、必要なら後日リダイレクトを追加）。
