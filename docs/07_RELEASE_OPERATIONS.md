> **2026-11-06 方針更新**: 「総額比較エンジン」は廃止し、韓国旅行メディアへ転換しました（[ADR-0004](adr/0004-pivot-to-korea-travel-media.md)）。本文の比較前提は履歴として参照し、現行仕様は README・ADR-0004・`src/` を参照してください。

# リリース・運用・インフラ手順

## 環境
- local: `pnpm dev`, モックフィード・テストDB。秘密情報不要で主要UIのレビューが可能。
- preview: PRごとにデプロイ。robots noindex、テストリンクのみ、本番ASPリンク非表示。PRテスト必須。
- staging: 本番相当設定で確認。PR/広告投稿は外部公開禁止。
- production: `sougakuhikaku.com`。移行の明示承認後に切替、運用パラメータの監査ログ保管。

## デプロイ方式
最初の候補: Next.jsをVercelのPreviewへ。定期処理はGCP Cloud Run Jobs + Cloud Scheduler。DBはPostgreSQLを管理サービスで。選定前に定額/従量費、リクエスト制限、ホスティング地域、サイト規模、独自ドメイン、データ転送、無料枠の契約条項を確認しADR化。
GCPのみで完結させる案も比較し、安価で運用負荷の低い方を採用。既存GCPアカウントの課金設定に推測で依存しない。

## 環境変数
`.env.example` に一覧。実値はGitHub Actions Secrets / デプロイ先Secret Managerへ。ローカル.envをGit追跡しない。テスト/プレビューはテスト用アカウント。最小権限、鍵の定期ローテーション。

## CI/CD手順
- PR: lint, typecheck, unit, build, dependency audit (重要度判定), Playwright smoke, basic accessibility check。
- DB変更: migrationsを先に検証、本番backup先行、後方互換を維持。seedに実企業の架空価格を入れない。
- セキュリティ: 絶対URLリダイレクトallowlist、HTTPS-only、入力サイズ制限、サービス間認証、CSP、APIのrate limit。
- コードレビュー: AI自身でチェック表を更新し、必要ならPRを出す。本番のみ承認ゲート。
- 障害: alert→自動取得停止→公開停止スイッチ→データ再検証→原因分析/復旧。

## 定期ジョブ
- 1日1〜2回: 許諾データの更新/証跡検証、商品価格の整合性確認。
- 毎日: X草案・記事草案生成。ただし重複/広告表示/公開承認チェックを必須に。
- 毎朝: データ鮮度/エラー/昨日のPV/クリック/成果をレポート（値が得られる場合のみ）。
- 毎週: Search Consoleクエリ、記事修正優先度、広告主停止/条件変更、リンク切れ点検。
- 毎月: 確定報酬の照合と経費集計、税対応の出力。

## 費用の監視
予算上限・API利用量・LLMトークン使用量・Cloud Run費・DB費・ストレージ費を追跡。初期の自動収集/生成は日次上限を設け、過剰費用を防ぐ。固定額の予算はユーザー承認後設定。

## 緊急停止フラグ
`CONTENT_AUTO_PUBLISH_ENABLED=false`
`SOCIAL_PUBLISH_ENABLED=false`
`AFFILIATE_LINKS_ENABLED=false`
設定変更で即停止でき、停止時は既に公開された不正価格のキャッシュを無効化する運用を持つ。

## 未取得の権限
Cloudflare/DNS, GSC, GA4, ASP, OpenRouter, hosting, DB, Buffer publish access。AIは必要権限だけ要求し、パスワード/APIキーをチャットやGitHub Issuesに貼り付けるよう依頼しない。
