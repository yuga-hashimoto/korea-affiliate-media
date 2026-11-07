# 自動化ランブック（旅行記事生成・X投稿）

最終更新: 2026-11-06（旅行メディア版）

## 全体像
```
content/topics.json（旅行テーマ）
  └─ pnpm jobs:article-draft  → 検証 → content/generated/articles.json (review/published)
        └─ pnpm jobs:social-draft → promotions/queue.json (needs_review)
              └─ pnpm social:approve --id ... --actor ...   ← 人手ゲート
                    └─ pnpm social:publish （SOCIAL_PUBLISH_ENABLED=true + Webhook）
```

## スイッチ（既定はすべてOFF）
| 変数 | 効果 |
|---|---|
| `CONTENT_AUTO_PUBLISH_ENABLED` | 記事の自動公開。実LLM・スコア85以上・出典verifiedのみ |
| `SOCIAL_PUBLISH_ENABLED` | Webhookへの投稿送信 |
| `SOCIAL_PAID_PARTNERSHIP_SUPPORTED` | Xの開示設定を保証できる場合のみtrue |
| `AFFILIATE_LINKS_ENABLED` | 将来の成果リンク配信（未実装） |

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
- トピックは `content/topics.json` に追加する（カテゴリは旅行カテゴリのみ）

## 記事の公開
1. PRで本文・出典・数値・営業時間の表現を確認する。
2. `state` を `published`、`article.status` を `published` にし、`reviewedAt`/`publishedAt` を設定。
3. ビルドが通ることを確認してマージする。

## X投稿
```bash
pnpm jobs:social-draft                 # 下書き生成（PR表記付き）
pnpm social:approve --id promo-xxxx --actor "担当者名"   # 人手承認
pnpm social:publish                    # Webhook設定 + SOCIAL_PUBLISH_ENABLED=true のときのみ
```
- 承認待ちは `var/promotions/queue.json`（または `pnpm social:approve` の一覧）で確認できる。管理画面は静的配信のため公開していない。
- 同一内容は `contentHash` で二重送信を防止する。
- Paid Partnership開示を保証できない間は、PR投稿は**手動投稿**に回す。

## 鮮度監査
```bash
pnpm jobs:audit   # var/reports/content-audit.json
```
- 出典の再確認・長期間未更新の記事・古い下書きを検出する。
- 検出結果を元に記事を更新し、`updatedAt` と出典の `checkedAt` を更新する。

## レポート
```bash
pnpm jobs:report          # 日次（var/reports/daily-YYYY-MM-DD.md）
pnpm jobs:weekly-report   # 週次
```
- 成果CSV（`var/asp/conversions.csv`）が無い場合は「未取り込み」と表示し、0円とは書かない。
- 通貨が異なる成果は合算しない。

## 障害時
1. 該当スイッチを `false` にする。
2. `promotions/queue.json` の該当投稿を `paused` にする。
3. 誤った記事は `content/generated/articles.json` から削除して再ビルド。
4. 原因・影響・再発防止を `docs/PROGRESS.md` に記録する。
