# 成果リンクの設定手順（5プログラム優先）

最終更新: 2026-11-07

## 対象プログラム
| プログラムID | サービス | 用途 |
|---|---|---|
| `prog-klook` | Klook | 現地体験・空港送迎・eSIM |
| `prog-tripcom` | Trip.com | ホテル・旅行商品 |
| `prog-airalo` | Airalo | eSIM |
| `prog-oliveyoung` | OLIVE YOUNG Global | 韓国コスメ |
| `prog-yesstyle` | YesStyle | コスメ・ファッション |

補完（既存ASP）: `prog-rakuten-travel`（楽天トラベル）、`prog-rakuten`（楽天市場）、`prog-amazon`、`prog-qoo10`。

## 仕組み
- 記事末の「予約・購入先を探す」は、承認済みリンクがあれば成果リンク、なければ公式サイトリンクを表示します。
- 成果リンクは **ビルド時の環境変数** `AFFILIATE_LINKS_JSON` でのみ設定します。Gitにはコミットしません。
- `AFFILIATE_LINKS_ENABLED=true` のときだけ成果リンクを使用します。
- 成果リンクには `rel="sponsored nofollow noopener noreferrer"` とPR表記を付け、GA4に `affiliate_click` を送信します。

## 設定例
`.env.local`（Git管理外）:
```bash
AFFILIATE_LINKS_ENABLED=true
AFFILIATE_LINKS_JSON='{"prog-klook":"https://...","prog-tripcom":"https://...","prog-airalo":"https://...","prog-oliveyoung":"https://...","prog-yesstyle":"https://..."}'
```

ビルド:
```bash
STATIC_EXPORT=true \
NEXT_PUBLIC_SITE_URL=https://sougakuhikaku.com \
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-C4CJ11GEDH \
SITE_INDEXING_ENABLED=true \
AFFILIATE_LINKS_ENABLED=true \
AFFILIATE_LINKS_JSON='{"prog-klook":"https://..."}' \
pnpm build
npx wrangler pages deploy out --project-name=sougakuhikaku --branch=main
```

## GitHub Actions からデプロイする場合
リポジトリ Secrets に以下を登録してください。
- `AFFILIATE_LINKS_ENABLED` = `true`
- `AFFILIATE_LINKS_JSON` = 上記JSON

`.github/workflows/pages-deploy.yml` がビルド時に読み込みます。未設定の場合は公式リンクにフォールバックします。

## 承認後のチェックリスト
- [ ] 広告主の管理画面で媒体（Web）が許可されている
- [ ] 成果リンクが発行され、httpsで始まる
- [ ] リンク先が意図した商品・キャンペーンに遷移する
- [ ] PR表記がリンク近辺にある
- [ ] GA4の `affiliate_click` が計測できる
- [ ] ASPの成果CSVと突合できる（クリック日・プログラムID）
- [ ] 期限切れ・停止時は環境変数から該当リンクを外して再デプロイ

## 注意
- 承認前に成果パラメータ付きURLを作らない。
- リンクの改変が規約で禁止されている場合は、発行されたURLをそのまま使う。
- 価格・在庫・セールを自動取得しない（規約で許可されたAPIのみ）。
