# 韓国旅行ノート — 韓国旅行メディア

> 本番ドメイン: **https://sougakuhikaku.com/**（既存サイトあり・DNS未切替）
> GitHub: **yuga-hashimoto/korea-affiliate-media**（Private）
> ステータス: **旅行メディア版MVP・CI/E2E検証済み（2026-11-06）** / 本番公開は未承認

ソウル・釜山・済州を中心に、韓国旅行をもっと楽しくする日本語メディアです。
エリアガイド、モデルコース、グルメ、カフェ、買い物、交通、宿泊、旅の準備を、公式情報の確認日時つきで紹介します。

![トップページ](docs/screenshots/home-desktop.jpg)

## 重要：既存サイトとの関係

`sougakuhikaku.com` には、運営者自身が制作した「総額比較」サイト（ウォーターサーバー記事2件）が公開されています。
このサイトは機能しておらず、**韓国旅行メディアへ転換する方針**です（[ADR-0004](docs/adr/0004-pivot-to-korea-travel-media.md)）。

- 比較エンジン・比較ページ・サンプル価格・`/go` 計測は**廃止**しました。
- 既存のウォーターサーバー記事は「新サイト公開時に削除してよい」との承認を得ていますが、**削除・DNS切替は未実施**です。
- 本番切替は、バックアップ・GSC確認・明示承認を経てから行います（[ドメイン移行計画](docs/06_DOMAIN_MIGRATION.md)）。

## 動作する機能（2026-11-06 時点）

- **ページ**: トップ、旅行ガイド、ソウル、釜山、済州島、グルメ、カフェ、買い物、韓国コスメ、韓国ファッション、交通、宿泊、旅の準備、記事一覧・記事詳細、編集方針、広告表記、運営者、プライバシー、問い合わせ。
- **記事**: 公開23本（ソウル5、宿泊1、釜山1、済州1、交通3、グルメ2、カフェ2、コスメ2、ファッション1、買い物1、旅の準備4）。AIによる追加下書きは `review` 状態で保持。
- **SEO**: ページ別metadata、canonical、OGP（1200×630）、sitemap.xml、robots.txt、JSON-LD（WebSite/Organization/Article/FAQPage/BreadcrumbList）。Previewはnoindex。
- **自動化**: AI記事下書き（品質ゲート付き）、鮮度監査、X投稿下書き、人手承認、署名付きWebhook配信（既定OFF）、日次/週次レポート、停止スイッチ。
- **管理画面**（`ADMIN_UI_ENABLED=true` のときのみ）: `/admin`, `/admin/promotions`, `/admin/articles`, `/admin/affiliates`。
- **旧URL**: `/korea/travel/esim` → 通信ガイド記事、`/korea/travel/airport-transport` → 空港アクセス記事、`/methodology` → 編集方針へ308転送。

![ソウルのカテゴリページ（モバイル）](docs/screenshots/seoul-mobile.jpg)

## カテゴリ

| カテゴリ | パス | 内容 |
|---|---|---|
| ソウル | `/korea/travel/seoul` | エリア、モデルコース、ホテル選び |
| 釜山 | `/korea/travel/busan` | 海雲台・南浦洞、1泊2日 |
| 済州島 | `/korea/travel/jeju` | レンタカー旅、2泊3日 |
| グルメ | `/korea/food` | 食堂・屋台・コンビニ |
| カフェ | `/korea/cafe` | カフェ文化と注文 |
| 買い物 | `/korea/shopping` | 免税・タックスリファンド |
| 韓国コスメ | `/korea/beauty` | OLIVE YOUNG、持ち帰り |
| 韓国ファッション | `/korea/fashion` | サイズ・返品・関税 |
| 交通 | `/korea/travel/transport` | 空港アクセス・地下鉄・都市間 |
| 宿泊 | `/korea/travel/hotels` | エリアと予約前チェック |
| 旅の準備 | `/korea/travel/prepare` | 持ち物・通信・予算・季節 |

## ローカルでの確認

```bash
pnpm install
pnpm dev                              # http://localhost:3000
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm e2e                              # desktop + mobile 375px + axe
```

## 環境変数

`.env.example` を参照。秘密情報はコミットしません。

| 変数 | 用途 | 未設定時の挙動 |
|---|---|---|
| `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` | AI記事生成 | モックで動作（公開しない） |
| `SOCIAL_WEBHOOK_URL` / `SOCIAL_WEBHOOK_SECRET` | X投稿の配信 | 送信しない |
| `SOCIAL_PAID_PARTNERSHIP_SUPPORTED` | Paid Partnership開示の保証 | false の間はPR投稿を自動配信しない |
| `AFFILIATE_LINKS_ENABLED` | 将来の成果リンク配信 | 未使用（承認後に実装） |
| `SITE_INDEXING_ENABLED` | index許可 | noindex |
| `NEXT_PUBLIC_SITE_URL` | canonical/OGPの基準URL | Vercel URL / localhost |
| `ADMIN_UI_ENABLED` | 管理画面 | 404 |

## 自動化（AI記事・X投稿）

```bash
pnpm jobs:article-draft      # トピックから下書き生成（キーなしはモック / review止まり）
pnpm jobs:social-draft       # 記事からX下書きを生成（needs_review）
pnpm social:approve --id ... --actor ...   # 人手承認
pnpm social:publish          # SOCIAL_PUBLISH_ENABLED=true + Webhook設定時のみ送信
pnpm jobs:audit              # 記事・出典の鮮度監査（更新候補の出力）
pnpm jobs:report             # 日次レポート（var/reports/）
pnpm jobs:weekly-report      # 週次レポート
```

- 生成物の公開は既定で停止しています（`CONTENT_AUTO_PUBLISH_ENABLED=false` / `SOCIAL_PUBLISH_ENABLED=false`）。
- 品質ゲート: Zodスキーマ、禁止表現、根拠のない数値、出典ID、広告開示。詳細は [AUTOMATION_RUNBOOK](docs/AUTOMATION_RUNBOOK.md)。
- CI: `.github/workflows/content-bot.yml` が毎日06:00 JSTに実行し、PRでレビューします。

## デプロイ

- Preview: [PREVIEW_DEPLOY](docs/PREVIEW_DEPLOY.md)（Vercelトークン未設定時はワークフローが自動スキップ）。
- 本番: `sougakuhikaku.com` のDNS切替は**未実施**。既存サイトのバックアップ・GSC確認・ユーザー承認後に実施します。

## ドキュメント一覧

| ファイル | 内容 |
|---|---|
| [AGENTS.md](AGENTS.md) | AIエージェントの全体ルール、安全な承認ゲート |
| [AI_MASTER_PROMPT](docs/AI_MASTER_PROMPT.md) | AIへ作業を委任するマスタープロンプト |
| [ADR-0001](docs/adr/0001-content-migration.md) | 既存サイトとの共存・移行方針 |
| [ADR-0002](docs/adr/0002-tech-stack.md) | 技術スタック・ホスティング・コスト |
| [ADR-0003](docs/adr/0003-content-automation.md) | AI生成・X投稿の自動化と承認ゲート |
| [ADR-0004](docs/adr/0004-pivot-to-korea-travel-media.md) | 比較エンジン廃止と旅行メディアへの転換 |
| [06_DOMAIN_MIGRATION](docs/06_DOMAIN_MIGRATION.md) | 既存サイトの保全、DNS/公開、復旧 |
| [07_RELEASE_OPERATIONS](docs/07_RELEASE_OPERATIONS.md) | 環境、Secrets、CI/CD、運用 |
| [08_IMPLEMENTATION_BACKLOG](docs/08_IMPLEMENTATION_BACKLOG.md) | バックログ（旅行メディア版を追記） |
| [10_QA_ACCEPTANCE](docs/10_QA_ACCEPTANCE.md) | テスト計画と受入基準 |
| [11_COMPLIANCE](docs/11_COMPLIANCE.md) | 広告表示、著作権、個人情報 |
| [AUTOMATION_RUNBOOK](docs/AUTOMATION_RUNBOOK.md) | 記事生成・X投稿の運用手順 |
| [PREVIEW_DEPLOY](docs/PREVIEW_DEPLOY.md) | Preview環境のデプロイ手順 |
| [PROGRESS](docs/PROGRESS.md) | 作業ログ、テスト結果、残課題 |
| [.env.example](.env.example) | 秘密情報を含まない設定キー一覧 |

## 未実施・承認待ち

- 外部Preview（Vercelトークン未設定）、本番DNS切替、既存ウォーターサーバー記事の削除。
- ASP申請・規約同意・成果リンク、Buffer公式API接続、GA4/GSC実データ。
- 運営者情報・お問い合わせ窓口・特商法表記の確定。
- 正式ブランド名の決定（暫定: 韓国旅行ノート）。

## 方針

月額30万円は**確定アフィリエイト報酬（税・経費控除前）の長期目標**であり、保証ではありません。
営業時間・料金・交通は変動するため、確認日時と公式情報へのリンクを明記し、未確認の情報は掲載しません。
AI生成の記事は公開前にレビューし、現地体験を装う表現や根拠のない断定は行いません。
