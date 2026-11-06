# 自動化ランブック（記事生成・X投稿・データ取り込み）

最終更新: 2026-11-06

## 全体像
```
content/topics.json
  └─ pnpm jobs:article-draft  → 検証 → content/generated/articles.json (review/published)
        └─ pnpm jobs:social-draft → promotions/queue.json (needs_review)
              └─ pnpm social:approve --id ... --actor ...   ← 人手ゲート
                    └─ pnpm social:publish （SOCIAL_PUBLISH_ENABLED=true + Webhook）
```

## スイッチ（既定はすべてOFF）
| 変数 | 効果 |
|---|---|
| `CONTENT_AUTO_PUBLISH_ENABLED` | 記事の自動公開。実LLM・スコア85以上・証跡verifiedのみ |
| `SOCIAL_PUBLISH_ENABLED` | Webhookへの投稿送信 |
| `SOCIAL_PAID_PARTNERSHIP_SUPPORTED` | Xの開示設定を保証できる場合のみtrue |
| `AFFILIATE_LINKS_ENABLED` | 承認済み成果リンクの配信 |
| `INGESTION_ENABLED` | 許諾済みフィードの取得 |

## 記事の生成
```bash
# キー未設定ならモック（公開されません）
pnpm jobs:article-draft

# 実LLM（OpenRouter）
OPENROUTER_API_KEY=... OPENROUTER_MODEL=... pnpm jobs:article-draft
```
- 生成物: `content/generated/articles.json`（`review` は非公開）
- 監査ログ: `var/ai/audit.jsonl`（Git管理外）
- CI: `.github/workflows/content-bot.yml` が毎日06:00 JSTにPRを作成

## 記事の公開
1. PRで本文・出典・数値を確認する。
2. `state` を `published` に変更し、`article.status` を `published`、`reviewedAt`/`publishedAt` を設定する。
3. ビルドが通ることを確認してマージする。

## X投稿
```bash
pnpm jobs:social-draft                 # 下書き生成
# 内容を確認して承認（この操作は人間が行う）
pnpm social:approve --id promo-xxxx --actor "担当者名"
# 送信（Webhook設定 + SOCIAL_PUBLISH_ENABLED=true のときのみ）
pnpm social:publish
```
- 承認待ちは `/admin/promotions`（`ADMIN_UI_ENABLED=true` のときのみ）で確認できる。
- 同一内容は `contentHash` で二重送信を防止する。
- Paid Partnership開示を保証できない間は、PR投稿は**手動投稿**に回す。

## データ取り込み
```bash
INGESTION_ENABLED=true INGESTION_FEED_URL=https://... INGESTION_ALLOWED_HOSTS=... pnpm jobs:ingest
```
- `accessPermitted=yes` 以外、証跡が7日より古いもの、重複は保存しない。
- 失敗時は既存データを変更せず終了コード1。

## 日次レポート
```bash
pnpm jobs:report   # var/reports/daily-YYYY-MM-DD.md
```
- 成果CSV（`var/asp/conversions.csv`）が無い場合は「未取り込み」と表示し、0円とは書かない。

## 障害時
1. 該当スイッチを `false` にする（例: `SOCIAL_PUBLISH_ENABLED=false`）。
2. `promotions/queue.json` の該当投稿を `paused` にする。
3. 誤った価格・記事は `content/generated/articles.json` から削除して再ビルド。
4. 原因・影響・再発防止を `docs/PROGRESS.md` に記録する。
