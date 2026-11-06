# Preview環境のデプロイ手順

最終更新: 2026-11-06（旅行メディア版）

## 現状
- ローカル本番ビルドを `http://127.0.0.1:4321` で起動し、トップ・カテゴリ・記事・モバイル表示とE2Eを確認済み。
- 外部ホスティング（Vercel等）へのデプロイは、アカウント認証情報が無いため**未実施**。
- デプロイ用ワークフロー `.github/workflows/preview-deploy.yml` は用意済みで、Secretsを設定するとPRごとにPreview URLが発行される。

## Vercel Preview を有効化する（人間の作業）
1. Vercel にログインし、`korea-affiliate-media` をインポートする（Framework: Next.js）。
2. Project Settings → Environment Variables に以下を設定する（Preview環境のみ）。
   - `SITE_INDEXING_ENABLED=false`（**必須**: Previewをnoindexにする）
   - `NEXT_PUBLIC_SITE_URL` は自動設定される `VERCEL_URL` を利用（未設定で可）
3. GitHubリポジトリの Secrets に `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` を登録する。
4. PRを作成すると `.github/workflows/preview-deploy.yml` がPreviewをデプロイし、URLをPRにコメントする。

> 本番ドメイン（sougakuhikaku.com）はVercelプロジェクトに**接続しない**。接続するとDNS変更を伴うため、明示承認まで行わない。

## ローカルでの確認（認証不要）
```bash
pnpm install
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:4321 pnpm build
PORT=4321 pnpm start
```

## Previewで必ず確認する項目
- [ ] `robots.txt` が `Disallow: /` になっている（noindex）
- [ ] トップ・ソウル・釜山・済州・グルメ・カフェ・買い物・準備の各ページが表示される
- [ ] 旧URL（`/korea/travel/esim`, `/korea/travel/airport-transport`, `/methodology`）が308で転送される
- [ ] 記事の出典・確認日時・広告表記が表示される
- [ ] 375px幅で横スクロールが発生しない
- [ ] 主要ページのLCP/CLS（実測条件を記録）

## ロールバック
- Vercel Previewは再デプロイ/削除で戻せる。本番ドメインは接続しないため影響なし。
- 問題がある場合はデプロイを停止し、`SITE_INDEXING_ENABLED=false` を維持する。
