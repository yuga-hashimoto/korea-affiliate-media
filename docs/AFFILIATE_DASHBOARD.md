# アフィリエイト売上ダッシュボード（ローカル専用）

最終更新: 2026-11-09 / 実装: `pnpm dashboard`

## これは何か

ASP（A8.net・もしも・ValueCommerce・楽天・Amazon・Klook・Trip.com・Impact など）は
**管理画面が各社バラバラで、横断の公式ダッシュボードは存在しません**。
そこで、各ASPの成果CSVを正規化して取り込み、**1枚のページ**に集約するのがこの機能です。

- 出力: `var/reports/dashboard.html`（＋ `dashboard.json`）
- 生成物は `var/` 配下＝Git管理外。**外部に公開しません**（`noindex` を付けています）。
- 数値が無いものは「0」ではなく**未取込**として表示します。架空の売上は作りません。

## 使い方

```bash
# 1. 各ASPの管理画面から成果CSVをダウンロードし、正規化して var/asp/ に置く（複数ファイル可）
# 2. 集約ページを生成
pnpm dashboard

# 期間を絞る（event_at の日付で比較。UTC基準）
pnpm dashboard -- --since 2026-11-01 --until 2026-11-30

# 単一ファイルだけ取り込む
pnpm dashboard -- --input var/asp/klook-2026-11.csv

# 形式の確認（ヘッダーのみ表示）
pnpm dashboard -- --print-template

# 動作確認（架空のサンプルで表示。HTMLに「サンプルデータ」警告が出ます）
pnpm dashboard -- --demo
```

生成後、`var/reports/dashboard.html` をブラウザで開きます。

## 成果CSVの形式（正規化スキーマ）

| 列 | 必須 | 内容 |
|---|---|---|
| `conversion_id` | ○ | ASP側の成果ID（重複排除のキー） |
| `program_id` | ○ | 提携プログラムID（`src/data/programs.ts` のID。例 `prog-klook`） |
| `amount` | ○ | 売上（注文額などのGMV）。報酬ではない |
| `commission` | ○ | 成果報酬（ASPが支払う額） |
| `currency` | ○ | `JPY` / `USD` / `KRW` |
| `status` | ○ | `pending` / `approved` / `paid` / `rejected` / `reversed` |
| `event_at` | ○ | 成果発生日時（ISO 8601） |
| `confirmed_at` | — | 確定日時（ISO 8601 or 空） |

```csv
conversion_id,program_id,amount,commission,currency,status,event_at,confirmed_at
c-001,prog-klook,48000,1440,JPY,paid,2026-11-08T03:12:00.000Z,2026-11-09T01:00:00.000Z
```

- ASPごとに列名が違うため、**取り込み前にこの形式へ変換**します。変換表はASPの実CSVを確認してから作ります（推測で列を当てない）。
- 同じ `conversion_id` が複数ある場合は、状態の進んだ行（`paid` > `approved` > `pending` > `reversed` > `rejected`）を採用します。
- 登録済みプログラムに無い `program_id` も金額を落とさず「未登録」として表示します。

## ASP管理画面の実測サマリ（`var/asp/reports.json`）

ASP管理画面の中には注文明細CSVを出せない/出しにくいものがあり、また明細CSVには
「どのサイト経由か」が無いことが多いため、**管理画面で確認した集計値**を別枠で記録できます。

`var/asp/reports.json`（Git管理外）:

```json
{
  "checkedAt": "2026-11-10T00:30:00.000Z",
  "reports": [
    {
      "id": "amazon-2026-11-08",
      "provider": "Amazonアソシエイト",
      "programIds": ["prog-amazon"],
      "period": { "from": "2026-11-08", "to": "2026-11-09" },
      "checkedAt": "2026-11-10T00:30:00.000Z",
      "clicks": 4,
      "confirmedCommission": { "JPY": 0 },
      "pendingCommission": {},
      "confirmedSales": {},
      "note": "期間を当サイトのリンク稼働日以降に限定して確認",
      "sourceUrl": "https://affiliate.amazon.co.jp/p/reporting/earnings"
    }
  ]
}
```

- `provider`: ASP名 / `programIds`: 対象プログラム（ASP全体なら `[]`）/ `period`: レポートの対象期間
- `clicks`: 管理画面のクリック数。取得できない場合は `null`（「0」と混同しない）
- `confirmedCommission` / `pendingCommission` / `confirmedSales`: 通貨別（JPY/USD/KRW）
- **明細CSVとは合算しません**（二重計上防止）。ページ上も別セクションで表示します。
- 帰属の注意: 同一タグを他サイトでも使っている場合、Amazon等の成果は当サイト分と区別できません。
  期間を当サイトのリンク稼働日以降に絞る・noteに前提を書く、の両方を行います。
- 確認手順の例: 各ASP管理画面 → レポート → 期間をサイトのリンク稼働日以降に指定 → 数値を記録。

## ページに出す内容

- 通貨別（JPY / USD / KRW）の **確定報酬・見込報酬・却下/返金・確定売上（GMV）・件数**
- **プログラム別**の同じ内訳、最終成果日時、取込元ファイル
- 提携済みなのにCSVが無いプログラム（＝未取込。0件ではない）
- 重複ID・未登録ID・CSV読み取りエラーの警告

## 集計ルール

- 確定報酬 = `approved` + `paid`。`pending`（見込）は含めません。
- 却下・返金 = `rejected` + `reversed`。
- 売上（GMV）と成果報酬は別列で持ちます。
- **通貨をまたいだ合算はしません**。為替レートを取得していないため換算しません。
- クリック数・CVRは含みません（GA4の別レポート）。

## できないこと（現実的な制約）

- 各ASPからの**自動取得はしません**。公開の成果APIが無いASPが多く、管理画面からのCSV出力が確実なためです。
- クリック→成果の突合は行いません（GA4の `affiliate_click` とASPの成果IDは直接は紐づきません）。
- ページは静的HTMLなので、**公開サーバーに置かない**でください。共有が必要な場合はCloudflare Access等で保護します。

## 関連

- 集計ロジック: `src/lib/analytics/dashboard.ts`、CSV取り込み: `src/lib/analytics/asp.ts`
- 実行: `scripts/dashboard.ts`
- 日次/週次レポート: `scripts/daily-report.ts` / `scripts/weekly-report.ts`
- 提携状況: `docs/04_AFFILIATES.md`、`docs/PROGRESS.md`、`src/data/programs.ts`
