# 総額比較 — 韓国旅行・韓国コスメの総額比較メディア

> 本番ドメイン候補: **https://sougakuhikaku.com/**  
> GitHub: **yuga-hashimoto/korea-affiliate-media** （Private）  
> ステータス: **MVP実装・自動化パイプライン・CI/E2E検証済み（2026-11-06）** / 本番公開は未承認

韓国旅行・ホテル・交通・eSIM、韓国コスメ・ファッションの**実際に支払う総額**を比較し、日本人が選びやすい情報メディアをAI主体で構築する。特定芸能グループへの依存は初期対象外。Xアカウント @bts_95_y を初期の集客チャネルとし、検索流入の独立したサイト資産を育てる。

## 重要：既存ドメインに公開サイトが存在する

2026-11-06に https://sougakuhikaku.com/ で現行の「総額比較」サイト（ウォーターサーバー記事2件、サイトマップ8 URL）を確認。**DNSや現行サイトを未保全のまま上書きしない。** 既存コンテンツ/URL/検索流入の棚卸し・バックアップ・移行計画を [ドメイン移行計画](docs/06_DOMAIN_MIGRATION.md) に明記した。ドメイン切替はユーザー明示承認後。

## AIに開発を任せるには

1. AIコーディングエージェントでこのリポジトリを開く。
2. **[AIマスタープロンプト](docs/AI_MASTER_PROMPT.md)** を最初に読み込ませ、その指示で実装を開始する。
3. [AGENTS.md](AGENTS.md) に従い、[実装バックログ](docs/08_IMPLEMENTATION_BACKLOG.md) を依存順に進める。
4. 仕様に不明点があっても、プレビューMVP・テストなど安全な作業を先に進める。不可逆な変更/契約/課金/本番DNS/PRのX公開には明示承認が必要。
5. 実装やテストの結果を [進捗](docs/PROGRESS.md) に記録。

[エージェントへの短い実行指示](docs/12_AGENT_HANDOFF.md) も用意。

## ドキュメント一覧

| ファイル | 内容 |
|---|---|
| [AGENTS.md](AGENTS.md) | AIエージェントの全体ルール、安全な承認ゲート |
| [AI_MASTER_PROMPT](docs/AI_MASTER_PROMPT.md) | 全作業をAIへ委任するコピペ用のマスター指示 |
| [00_PROJECT_CHARTER](docs/00_PROJECT_CHARTER.md) | 事業目標と対象、現サイトの観測結果 |
| [01_PRD](docs/01_PRD.md) | 要件定義、ページ設計、受入条件 |
| [02_ARCHITECTURE](docs/02_ARCHITECTURE.md) | 技術構成、DB、比較計算式、API、CI |
| [03_CONTENT_SEO](docs/03_CONTENT_SEO.md) | 記事計画、SEO、X集客 |
| [04_AFFILIATES](docs/04_AFFILIATES.md) | 提携候補、成果集計、審査/広告リンク管理 |
| [05_AUTOMATION](docs/05_AUTOMATION.md) | 収集→検証→AI草案→審査→配信→計測 |
| [06_DOMAIN_MIGRATION](docs/06_DOMAIN_MIGRATION.md) | 既存サイトの保全、SEO、DNS/公開、復旧 |
| [07_RELEASE_OPERATIONS](docs/07_RELEASE_OPERATIONS.md) | 環境、Secrets、CI/CD、日常運用、費用上限 |
| [08_IMPLEMENTATION_BACKLOG](docs/08_IMPLEMENTATION_BACKLOG.md) | AI向けP0〜P5の全タスク |
| [09_KPI_MODEL](docs/09_KPI_MODEL.md) | 目標月30万円のアクセス・成約・報酬試算 |
| [10_QA_ACCEPTANCE](docs/10_QA_ACCEPTANCE.md) | 単体/統合/E2E/SEO/本番受け入れ |
| [11_COMPLIANCE](docs/11_COMPLIANCE.md) | 広告表示、X/Google、著作権、個人情報 |
| [12_AGENT_HANDOFF](docs/12_AGENT_HANDOFF.md) | AI開発エージェントへの最短引き継ぎ |
| [13_UI_CONTENT_DESIGN](docs/13_UI_CONTENT_DESIGN.md) | UI/UXと比較コンポーネント |
| [14_DECISIONS_AND_OPEN_ITEMS](docs/14_DECISIONS_AND_OPEN_ITEMS.md) | 仮の技術判断と未確定項目/ADR |
| [ADR-0001](docs/adr/0001-content-migration.md) | 既存サイトとの共存・移行方針 |
| [ADR-0002](docs/adr/0002-tech-stack.md) | 技術スタック・ホスティング・コスト |
| [ADR-0003](docs/adr/0003-content-automation.md) | AI生成・X投稿の自動化と承認ゲート |
| [PREVIEW_DEPLOY](docs/PREVIEW_DEPLOY.md) | Preview環境のデプロイ手順 |
| [AUTOMATION_RUNBOOK](docs/AUTOMATION_RUNBOOK.md) | 記事生成・X投稿・取り込みの運用手順 |
| [PROGRESS](docs/PROGRESS.md) | 作業ログ、済/未着手 |
| [.env.example](.env.example) | 秘密情報を含まない設定キー一覧 |

## MVPのページ構成

- トップ、韓国旅行の総額比較、ホテルエリア比較、eSIM比較、韓国コスメ送料込み比較、記事一覧・詳細
- 比較条件と内訳（税/送料/手数料/クーポン/為替）、一次情報と確認日時、UNKNOWNの明示
- 比較手法、編集方針、広告表記、運営者、プライバシー、問い合わせ
- 提携承認後の広告リンク、匿名クリック計測、成果集計
- AIが生成した記事/X投稿のレビューキュー、投稿停止スイッチ

## 事業目標・注意点

月額30万円は**確定アフィリエイト報酬（税/経費控除前）の長期目標**。必要アクセス数や成約率は仮定で、予測・保証ではない。事実に基づく総額比較がサイトの競争優位性。大量の低品質なAI記事、無許可スクレイピング、架空のレビュー/価格、ステルスマーケティングは禁止。

## 現状

- [x] GitHubリポジトリ作成
- [x] ドメイン公開状態の読み取り確認
- [x] AI向け実装計画・マスタープロンプト・運用/移行計画
- [x] Next.js/TypeScript/Tailwind の実装、比較エンジン、SEO、テスト、GitHub Actions
- [x] ローカルPreviewビルドとE2E（desktop / mobile 375px）
- [x] AI記事・X投稿の下書き生成パイプライン（品質ゲート付き・既定はレビュー必須）
- [ ] Vercel等へのPreviewデプロイ（アカウント連携が必要）
- [ ] 提携審査/実リンク/本番DNS切替（承認後）

## ローカルでの確認

```bash
pnpm install
NEXT_PUBLIC_DEMO_MODE=true pnpm dev   # サンプルデータを表示
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm e2e                              # desktop + mobile 375px
```

- サンプル価格は `NEXT_PUBLIC_DEMO_MODE=true` のときだけ表示されます。`pnpm build`（本番相当）では表示されません。
- Preview/ステージングは `SITE_INDEXING_ENABLED=false`（既定）で全面 `noindex` です。
- 環境変数は [.env.example](.env.example) を参照。秘密情報はコミットしません。

## 自動化（AI記事・X投稿）

```bash
pnpm jobs:article-draft      # トピックから下書き生成（キーなしはモック / review止まり）
pnpm jobs:social-draft       # 記事からX下書きを生成（needs_review）
pnpm social:approve --id ... --actor ...   # 人手承認
pnpm social:publish          # SOCIAL_PUBLISH_ENABLED=true + Webhook設定時のみ送信
pnpm jobs:report             # 日次レポート（var/reports/）
pnpm jobs:weekly-report      # 週次レポート
pnpm jobs:ingest             # 許諾済みフィードの取り込み（既定OFF）
```

- 生成物の公開は既定で停止しています（`CONTENT_AUTO_PUBLISH_ENABLED=false` / `SOCIAL_PUBLISH_ENABLED=false`）。
- 品質ゲート: Zodスキーマ、禁止表現、根拠のない数値、出典ID、広告開示。詳細は [AUTOMATION_RUNBOOK](docs/AUTOMATION_RUNBOOK.md)。
- CI: `.github/workflows/content-bot.yml` が毎日06:00 JSTに実行し、PRでレビューします。

## デプロイ

- Preview: [PREVIEW_DEPLOY](docs/PREVIEW_DEPLOY.md)（Vercelトークン未設定時はワークフローが自動スキップ）。
- 本番: `sougakuhikaku.com` のDNS切替は**未実施**。既存サイトのバックアップ・GSC確認・ユーザー承認後に別途実施します。
