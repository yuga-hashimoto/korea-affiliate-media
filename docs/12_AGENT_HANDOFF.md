# AIエージェント引き継ぎ（旅行メディア版）

## 最短の起動方法
1. リポジトリ https://github.com/yuga-hashimoto/korea-affiliate-media を開く。
2. 以下の順で読む。
   - `AGENTS.md`
   - `docs/adr/0004-pivot-to-korea-travel-media.md`
   - `README.md`
   - `docs/PROGRESS.md`
   - `docs/AUTOMATION_RUNBOOK.md`
3. `pnpm install && pnpm dev` で表示確認。`pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm e2e` で検証。
4. 記事を追加する場合は `src/content/*.ts` に出典ID・確認日時付きで追加する（`docs/AUTOMATION_RUNBOOK.md` の品質ルールに従う）。

## 現在の状態（2026-11-06）
- 韓国旅行メディア「韓国旅行ノート」（暫定）として実装済み。比較エンジンは廃止。
- 公開記事23本。カテゴリは ソウル/釜山/済州/グルメ/カフェ/買い物/交通/宿泊/準備/コスメ/ファッション。
- Preview: `http://127.0.0.1:4321`（ローカル本番ビルド）。外部PreviewはVercelトークン未設定のため未実施。
- CI: `.github/workflows/ci.yml`（lint/typecheck/unit/build/E2E）。`content-bot.yml` が毎日06:00 JSTに記事・X下書きをPR。
- 停止スイッチ: `CONTENT_AUTO_PUBLISH_ENABLED` / `SOCIAL_PUBLISH_ENABLED`（既定false）。

## ユーザーの意思決定を待つ事項
- 正式ブランド名（暫定「韓国旅行ノート」）。
- 本番DNS切替と既存サイト（ウォーターサーバー記事2件）の削除実行。
- ASPの登録・規約同意・承認リンク、Buffer/Paid Partnershipの運用可否。
- 運営者情報・問い合わせ窓口・特商法表記。
- 外部ホスティング（Vercel等）の契約/トークン設定。

## 次にやるべき安全な作業
1. 釜山・済州・ソウルの記事拡充（公式情報の確認が取れたもの）。
2. 記事の鮮度監査（`pnpm jobs:audit`）で検出された出典の再確認。
3. GA4/GSC接続コードの実装（資格情報なしでdry-run可能な形）。
4. 条件入力ではなく、旅行者向けの「持ち物チェック」「モデルコース」など静的コンテンツの拡充。
5. アクセシビリティ・SEOの継続改善（Lighthouse実測、内部リンク点検）。

## やってはいけないこと
- 比較エンジン・比較順位付け・サンプル価格の復活。
- 未確認の営業時間・料金・体験談の生成、現地体験を装う表現。
- 本番DNS・既存サイト削除・ASP同意・X実投稿の無承認実行。
