> **2026-11-06 方針更新**: 「総額比較エンジン」は廃止し、韓国旅行メディアへ転換しました（[ADR-0004](adr/0004-pivot-to-korea-travel-media.md)）。本文の比較前提は履歴として参照し、現行仕様は README・ADR-0004・`src/` を参照してください。

# AI / データ収集 / X運用の自動化設計

## 最小実用パイプライン
```
Scheduler -> Fetch official API/approved feed -> Normalize -> Validate Evidence
-> Calculate Total -> Generate Draft (optional LLM) -> QA Gate -> Review Queue
-> Publish Article OR Schedule X via Buffer -> Analytics -> Daily Report
```
AIが価格などの事実値を創作しないよう、取得JSONを先にスキーマ検証し、LLMには読み取り専用の検証済みデータを渡す。

## 情報取得
- 優先: 公式API / ASP提供フィード / 明示許可を得た公開データ / 手動で確認した公式料金。
- robots.txtだけをもってスクレイピング許可とみなさない。利用規約/レート制限を確認し、禁止/不明なら自動収集をしない。
- 旅行商品は価格が日付/人数/通貨/空室で変わるため、観測時点の参考価格だけ掲載。ライブ価格の代用にはしない。
- 時刻はUTCで保存し、サイト表示はAsia/Tokyo。更新日時は必ず表示。
- 429はRetry-After、5xxは指数バックオフ＋ジッター、失敗連続時にcircuit breakerと通知。
- 既存レコードとの差分、重複ハッシュ、更新期限、証跡URLを保存。
- 次の条件で publish blocked: ソース不在/期限切れ/料率未承認/販促規約不明/表示法上の懸念/画像権限不明/価格の欠損をゼロ扱いした場合。

## LLM
入力: 比較条件、取得元の事実値、許容語彙、禁則、指定文字数/対象。
出力: 型付きJSON `{title,summary,body,sourceIds,disclosure,risks,confidence}` 。
別モデル/ルールによる数値照合、根拠URL検証、二重レビュー。根拠のない体験談/口コミ/ランキングは禁止。
LLMプロンプトやモデルID/料金を設定ファイルと監査ログで管理。キー未設定時は処理をスキップしモックを実行可能。

## 自動投稿
- Xハンドル `@bts_95_y`、Buffer接続済（2026-11-06時点）。投稿実行の前に現在の接続と同時予約上限を再確認。
- 品質重視で最初1日2投稿、うちPR頻度は控えめ。規約とデータを確認しながら最適化。
- 投稿内容の指紋（本文のn-gram/URL/記事ID）で同一・類似投稿を防止。
- `draft -> needs_review -> approved -> scheduled -> published -> measured`。再試行で二重投稿しないidempotency key。
- Buffer経由でXの「Paid Partnership」開示が確実にできない場合は、**アフィリエイト投稿を自動公開せずレビュー/手動X投稿に回す**。本文のPR表記だけでAPIの開示設定を満たしたとは断定しない。
- リンクは短縮先が安全か検査。SNSリンクパラメータは広告主規約準拠。
- 自動返信、無差別フォロー、いいね、DM、過剰な重複投稿、プロモコードスパムを実装しない。
- SNSの編集/投稿を止める `SOCIAL_PUBLISH_ENABLED=false` をデフォルト。実運用への切替には承認が必要。

## コンテンツ運用
記事の新規公開は最初はレビュー必須。定型の変更検知と証跡更新は自動化できるが、価格高騰や条件変更時は承認状態を保留に戻す。記事を100本生成することを成果指標にしない。検索意図/独自比較/実際の成果を重視。

## モニタリング
- 日次: 収集成功率、ソース鮮度、重大な欠損、ドラフト数、公開数、予約失敗、外部リンクのエラー。
- 週次: GSC検索クエリ、X反応、サイト訪問、リンクCTR、承認成果、RPM/EPV、投稿当たり収益。
- 月次: 計算上の目標と実績の差、広告主変更、運用費・純利益、プログラムの再審査。
- 機密情報をログに出力しない。投稿停止スイッチと障害通知チャネルを持つ。

公式 X 規約: https://help.x.com/en/rules-and-policies/x-automation
公式 X 広告表示: https://help.x.com/ja/rules-and-policies/paid-partnerships-policy
