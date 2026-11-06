# ADR-0003: AIコンテンツ生成・X投稿の自動化と承認ゲート

- 日付: 2026-11-06
- 状態: 採用（自動生成は有効、自動公開は既定OFF）
- 関連: P3-01〜P3-06, `docs/05_AUTOMATION.md`, `docs/11_COMPLIANCE.md`

## 論点
記事・X投稿を全自動で作り続ける際、誤情報・ステマ・規約違反をどう防ぐか。

## 判断
1. **生成**: `content/topics.json` のキューから、GitHub Actions（`.github/workflows/content-bot.yml`）が1日1回 `pnpm jobs:article-draft` を実行。`OPENROUTER_API_KEY` 未設定時は決定的なモックで動作し、公開しない。Muse等の外部エージェントは同じCLIを呼び出すだけでよい。
2. **検証**: Zodスキーマ、禁止表現、根拠のない数値、出典IDの範囲、広告開示を検査。品質スコア70未満・指摘ありは `review` 止まり。
3. **公開**: `CONTENT_AUTO_PUBLISH_ENABLED=true` かつ 実LLM・スコア85以上・証跡が verified の場合のみ `published`。既定は false で、CIはPRを作成して人が確認する。
4. **X投稿**: 下書きはPR表記付きで `needs_review` に蓄積。承認は `pnpm social:approve --id ... --actor ...`（人手）。配信は `SOCIAL_PUBLISH_ENABLED=true` かつ Webhook 設定時のみ。
5. **Paid Partnership**: Buffer等のAPIで開示設定を保証できると確認できるまで、PR投稿の自動配信は行わない（`SOCIAL_PAID_PARTNERSHIP_SUPPORTED=false`）。
6. **停止**: `CONTENT_AUTO_PUBLISH_ENABLED` / `SOCIAL_PUBLISH_ENABLED` / `INGESTION_ENABLED` / `AFFILIATE_LINKS_ENABLED` の4スイッチで即時停止。

## 理由
- 収益記事の誤りは読者被害と広告主契約の両方に影響する。生成より検証を重くする。
- 数値は「検証済みデータとの照合」を通過しない限り本文に入れない。LLMに価格を書かせない。
- Xの開示要件はAPI仕様の確認が前提。確認できない機能を「対応済み」と扱わない。

## 影響
- 完全無人公開は既定では行わない。人が承認キューを処理する運用が残る。
- LLM利用時はトークン費用が発生する（`JOB_DAILY_BUDGET_JPY` と生成件数で上限管理）。

## ロールバック
- 生成物は Git 履歴で取り消せる。`content/generated/articles.json` を空に戻せば公開記事から消える。
- 投稿は `promotions/queue.json` の状態を `paused` に変更し、Webhook 側でも停止できる。
