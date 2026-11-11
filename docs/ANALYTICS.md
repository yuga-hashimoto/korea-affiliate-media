# アクセス計測（GA4 / Search Console）の運用

最終更新: 2026-11-11

## 1. いまの構成

| 種別 | 内容 |
|---|---|
| GA4プロパティ | 「韓国旅行ノート」 ID `563135187`（アカウント「Default Account for Firebase」） |
| GA4測定ID（公開値） | `G-C4CJ11GEDH` |
| Search Console | URLプレフィックス プロパティ `https://sougakuhikaku.com/` |
| 公開日 | 2026-11-07（Cloudflare Pages） |

## 2. 自動取得（GA4 Data API・読み取り専用）

GA4の数値をコマンドで取得できる。設定が無いときは取得せずに「スキップ」と表示する（推測で埋めない）。

### 認証の構成（2026-11-11 設定）

| 項目 | 値 |
|---|---|
| GCPプロジェクト | `korea-travel-analytics-x0qpka`（API: `analyticsdata.googleapis.com` を有効化） |
| サービスアカウント | `ga4-reader@korea-travel-analytics-x0qpka.iam.gserviceaccount.com` |
| GA4側の権限 | 「プロパティのアクセス管理」で**閲覧者**として追加 |
| 鍵JSON | `var/secrets/ga4-reader.json`（`var/` は `.gitignore` 済み。**コミットしない**） |

`.env.local`（Git管理外）:

```dotenv
GA4_PROPERTY_ID=563135187
GOOGLE_APPLICATION_CREDENTIALS=/<リポジトリの絶対パス>/var/secrets/ga4-reader.json
```

### コマンド

```bash
pnpm analytics:traffic -- --days 14        # 日別のユーザー/PV/セッション
pnpm analytics:traffic -- --days 30 --json # JSONで出力
pnpm analytics:traffic -- --days 14 --save # var/reports/ga4-traffic.{json,md} に保存
pnpm analytics:ga4-pages -- --days 7       # ページ別の表示回数ランキング
pnpm jobs:report                          # 日次レポート（GA4の直近3日を含む）
pnpm jobs:weekly-report                   # 週次レポート（GA4の直近7日を含む）
```

- npm scripts は `node --env-file-if-exists=.env.local --import tsx` で起動するため、`.env.local` を自動で読む。
- GA4が未設定のときはレポートにアクセス欄自体が出ない。取得に失敗したときは「取得できませんでした（数値は推測しません）」と表示する。
- 数値はGA4 Data APIの値をそのまま出す。取得できない場合は「まだデータがありません」等を表示し、0や確定値として扱わない。

## 3. 数値の読み方（誤読しやすい点）

- **日別ユーザー（activeUsers）は各日のユニーク**。日別の合計は期間のユニークユーザー数と一致しない（出力にも注記している）。
- 直近のデータは**最大24時間ほど遅れる**。当日分は少なく見える。
- **クローラーや自己アクセスを含む**ことがある。国・都市（例: 米国のデータセンター都市）を見て判断する。
- **ASPの成果（確定報酬・見込）とは別物**。混ぜて集計しない（売上は [AFFILIATE_DASHBOARD](AFFILIATE_DASHBOARD.md)）。
- KPIの考え方は [09_KPI_MODEL](09_KPI_MODEL.md)（公開初期はPVではなくインデックス率・表示回数・平均掲載順位で評価）。

## 4. 実装メモ

- 認証: サービスアカウントのJWTを `node:crypto` で署名 → OAuth2トークン交換。依存パッケージは増やしていない（`src/lib/analytics/ga4.ts`）。
- レポート: GA4 Data API `batchRunReports`。
  - エンドポイントは `https://analyticsdata.googleapis.com/v1beta/properties/{propertyId}:batchRunReports`。
  - **プロパティIDはURLパスに入れる**。リクエストbodyに `property` / `entity` を含めない（入れると404/400になる。2026-11-11に修正）。
- テスト: `tests/unit/ga4.test.ts`（未設定時の安全停止、行の整形、リクエストURL・body、日別出力の注記）。
- 鍵の再発行 / 失効:

```bash
gcloud iam service-accounts keys list --iam-account=ga4-reader@korea-travel-analytics-x0qpka.iam.gserviceaccount.com
gcloud iam service-accounts keys create var/secrets/ga4-reader.json --iam-account=ga4-reader@korea-travel-analytics-x0qpka.iam.gserviceaccount.com
gcloud iam service-accounts keys delete <KEY_ID> --iam-account=ga4-reader@korea-travel-analytics-x0qpka.iam.gserviceaccount.com
```

- 停止したいとき: GA4の「プロパティのアクセス管理」からサービスアカウントを削除する（または鍵を削除）。以後のコマンドは設定なしとして安全に停止する。

## 5. この環境で自動化できなかったこと（手動で実施）

- **Search Console「インデックス登録をリクエスト」**: UI操作のみでAPIが無い。自動操作を試したが、GSCの画面がTrusted Typesのエラー（`This document requires 'TrustedHTML' assignment`）で反応せず、2026-11-11時点では未実施。主要URLは手動でURL検査→リクエストが必要。
- **GA4 ↔ Search Console のリンク**: GA4管理画面の「新しいGA統合リンクを作成」フローで、プロパティを選択しても「次へ」が有効化されず未完了。手動で設定する。
