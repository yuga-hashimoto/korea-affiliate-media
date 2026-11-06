> **2026-11-06 方針更新**: 「総額比較エンジン」は廃止し、韓国旅行メディアへ転換しました（[ADR-0004](adr/0004-pivot-to-korea-travel-media.md)）。本文の比較前提は履歴として参照し、現行仕様は README・ADR-0004・`src/` を参照してください。

# AIエージェント引き継ぎ

## 最短の起動方法
1. GitHubリポジトリ https://github.com/yuga-hashimoto/korea-affiliate-media にアクセス可能なエージェントへ docs/AI_MASTER_PROMPT.md の全文を渡す。
2. エージェントに AGENTS.md、docs/00_PROJECT_CHARTER.md、docs/08_IMPLEMENTATION_BACKLOG.md を最初に読むよう指示。
3. P0-01から既存サイトとサービスへの**読み取りのみ**の調査。P0-05以降はプレビューサイトの作成とCI導入を進める。
4. 実装/UI/テスト/SEOの進捗を docs/PROGRESS.md とREADMEへ更新。変更ごとに小さなコミット。
5. 本番ドメイン切替、課金契約、ASP規約への同意、Xへの公開投稿は明示承認ゲート。それ以外は安全な範囲で自律的に進める。

## ユーザーの意思決定を待つ事項
- 旧公開サイトのアーカイブ/保持/削除方式（現行8 URL）。
- ドメインDNS切替と本番公開、有料枠契約。
- 各ASPの登録/契約同意・承認された媒体/実リンク。
- XのPaid Partnership開示を満たす公開投稿。

## 最初の実行メッセージ
このリポジトリの docs/AI_MASTER_PROMPT.md を最上位の実行仕様として読み、AGENTS.md と docs/08_IMPLEMENTATION_BACKLOG.md を確認してください。特定の芸能グループには依存せず、「総額比較｜韓国旅行・韓国コスメ」のMVPを新規作成してください。実装・テスト・Preview公開・CI設定・進捗更新を原則自律実行し、既存ドメインの本番上書き、DNS変更、契約同意、課金、XへのPR公開など不可逆の作業だけは実施前に承認を求めてください。情報未取得の場合は虚偽の価格や架空の提携リンクを使わず、安全なサンプル表示にしてください。

## 参照文書
- docs/06_DOMAIN_MIGRATION.md: 現行サイトの移行とURLの保全
- docs/09_KPI_MODEL.md: 30万円達成に必要なKPIと仮定
- docs/10_QA_ACCEPTANCE.md: テストと受入基準
- docs/11_COMPLIANCE.md: 広告・AI・SNS・個人情報の規約

## 実行上の注意
- 日本語で報告し、英語識別子のコードは可。
- ライブラリやASP規約の変更を最新公式ページで検証する。
- ユーザーに毎回質問せず、ブロッカーだけ明確に説明し、安全な残作業を進める。
