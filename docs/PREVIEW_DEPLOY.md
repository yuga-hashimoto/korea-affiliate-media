# Preview環境のデプロイ手順

最終更新: 2026-11-06

## 現状
- ローカル本番ビルドを `http://127.0.0.1:4321` で起動し、デスクトップ/モバイルの表示とE2Eを確認済み。
- 外部ホスティング（Vercel等）へのデプロイは、アカウント認証情報が無いため**未実施**。
- デプロイ用ワークフロー `.github/workflows/preview-deploy.yml` は用意済みで、Secretsを設定するとPRごとにPreview URLが発行される。

## Vercel Preview を有効化する（人間の作業）
1. Vercel にログインし、`korea-affiliate-media` をインポートする（Framework: Next.js）。
2. Project Settings → Environment Variables に以下を設定する（Preview環境のみ）。
   - `SITE_INDEXING_ENABLED=false`（**必須**: Previewをnoindexにする）
   - `NEXT_PUBLIC_DEMO_MODE=true`（サンプル価格を表示する場合）
   - `NEXT_PUBLIC_SITE_URL` は自動設定される `VERCEL_URL` を利用（未設定で可）。本番は `https://sougakuhikaku.com` を明示する。
   - サーバーレスのファイルシステムは読み取り専用のため、クリック計測は外部ストレージへの置き換えが必要（現状は計測失敗時も遷移は継続）。
3. GitHubリポジトリの Secrets に `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` を登録する。
4. PRを作成すると `.github/workflows/preview-deploy.yml` がPreviewをデプロイし、URLをPRにコメントする。

> 本番ドメイン（sougakuhikaku.com）はVercelプロジェクトに**接続しない**。接続するとDNS変更を伴うため、明示承認まで行わない。

## ローカルでの確認（認証不要）
```bash
pnpm install
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:4321 NEXT_PUBLIC_DEMO_MODE=true pnpm build
PORT=4321 pnpm start
```

## Previewで必ず確認する項目
- [ ] `robots.txt` が `Disallow: /` になっている（noindex）
- [ ] 比較表に「SAMPLE」表示があり、実価格と誤認しない
- [ ] 未確認項目が UNKNOWN と表示され、0円になっていない
- [ ] `/go/<id>` が登録済みオファーのみ307で遷移し、未登録は404
- [ ] 375px幅で横スクロールが発生しない
- [ ] 主要ページのLCP/CLS（実測条件を記録）

## ロールバック
- Vercel Previewは再デプロイ/削除で戻せる。本番ドメインは接続しないため影響なし。
- 問題がある場合は `SITE_INDEXING_ENABLED` を false のまま維持し、デプロイを停止する。
