# アフィリエイト登録の準備と手順（韓国特化）

最終更新: 2026-11-07

## 方針
既存のASP（A8.net / もしも / バリューコマース / 楽天 / Amazon）は登録済み・利用可能。
ただし韓国特化で優先するのは、次の**直接提携5プログラム**です。

| 優先 | プログラム | 公式入口 | 用途 | 現状 |
|---|---|---|---|---|
| 1 | **Klook** | https://www.klook.com/ja/blog/klook-kreator-program-japan/ | 現地体験・空港送迎・eSIM | 未申請（要確認） |
| 2 | **Trip.com Partners** | https://jp.trip.com/partners/index | ホテル・旅行商品 | 未申請（要確認） |
| 3 | **Airalo Partners** | https://partners.airalo.com/ | eSIM | 未申請（要確認） |
| 4 | **OLIVE YOUNG Global** | https://global.oliveyoung.com/influencer/main | 韓国コスメ | 未申請（要確認） |
| 5 | **YesStyle Influencer** | https://web.yesstyle.com/en/influencers.html | コスメ・ファッション | 未申請（要確認） |

補完（既存ASP内）:
- 楽天トラベル（海外ホテル）
- 楽天市場・Amazon・Qoo10（韓国コスメ/ファッションの国内EC）
- A8.net / もしも / バリューコマース経由の旅行・コスメ案件

## いつやるか
**サイト側は登録できる状態です。運営者情報と問い合わせメールが決まり次第、今週中に優先5件の申請を開始**してください。
登録・規約同意・本人確認・口座登録は本人しか実行できません。AIは申請文・媒体情報・リンク実装を担当します。

## 申請前に必要なもの
- 運営者名（個人名または屋号）
- 所在地・電話番号
- 連絡先メールアドレス
- 銀行口座（報酬振込先）
- 本人確認書類
- サイトURL: https://sougakuhikaku.com
- サイトの説明・カテゴリ・記事数（33本）
- プライバシーポリシー / 広告表記 / 編集方針のURL
- 広告・提携の案内ページ: https://sougakuhikaku.com/media-kit

## 申請の順番とポイント
### 1. Klook
- Klook Kreator（SNS）とアフィリエイト（Web）で条件が異なるため、**Webサイト掲載が可能な制度**かを確認する。
- フォロワー条件・最低支払額・クーポン利用条件は変更されるため、申請画面で最新条件を確認。
- 承認されたら、体験・送迎・eSIMの記事末CTAにリンクを設定。

### 2. Trip.com Partners
- ホテル・旅行商品が成果対象か、日本向けサイトの掲載が許可されるかを確認。
- ホテル記事（ソウル/釜山/済州）とモデルコースに配置。
- 料率・キャンセル・計測期間を管理画面で確認。

### 3. Airalo Partners
- eSIM記事（韓国eSIM/Wi-Fiガイド）と旅の準備記事に配置。
- 国別・容量別のリンク発行方法、クーポンコードの扱いを確認。

### 4. OLIVE YOUNG Global
- Influencerプログラムの媒体（Web/X）と報酬条件を確認。
- コスメ記事（OLIVE YOUNG、韓国コスメ買い物）に配置。
- 商品画像・価格の利用条件を確認し、無断転載しない。

### 5. YesStyle Influencer
- サイト掲載可否、対象商品、クーポン条件を確認。
- ファッション・コスメ記事に配置。

## 承認後の作業（AIが担当）
1. 発行された成果リンクを `AFFILIATE_LINKS_JSON` に設定（[AFFILIATE_LINKS_SETUP](AFFILIATE_LINKS_SETUP.md)）。
2. 記事末CTAが成果リンクに切り替わり、PR表記・`rel="sponsored"` が付与される。
3. GA4の `affiliate_click` / `outbound_click` でクリックを計測。
4. ASP成果CSVを取り込み、承認・却下・返金を分離して月次集計。
5. 期限切れ・停止時はリンクを外して公式リンクへ戻す。

## 現在のサイト側の状態
- 公開記事33本、サイトマップ52 URL（Search Consoleで成功）
- GA4測定ID `G-C4CJ11GEDH` 接続済み
- 記事末に予約・購入導線（提携未承認のため公式リンク表示）
- 広告・提携の案内ページ `/media-kit` あり
- 運営者情報・問い合わせメールは未確定（**ここが申請のブロッカー**）

## 次に必要なアクション（本人）
1. 運営者名・所在地・電話番号・連絡先メールを確定。
2. 問い合わせメールを `NEXT_PUBLIC_CONTACT_EMAIL` に設定。
3. 優先5プログラムへ申請（本人確認・規約同意・口座）。
4. 承認された成果リンクを共有（または GitHub Secrets に登録）。
