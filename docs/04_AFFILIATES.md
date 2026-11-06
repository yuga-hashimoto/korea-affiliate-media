> **2026-11-06 方針更新**: 「総額比較エンジン」は廃止し、韓国旅行メディアへ転換しました（[ADR-0004](adr/0004-pivot-to-korea-travel-media.md)）。本文の比較前提は履歴として参照し、現行仕様は README・ADR-0004・`src/` を参照してください。

# 収益化・提携プログラム / ライフサイクル

記録日 2026-11-06。以下は**候補**であり、申請/承認/料率適用/媒体許可は未確認。提携の最新条件は公式規約と実際の管理画面で再確認する。

| 商材 | 候補 | 公式入口/情報 | 確認項目 |
|---|---|---|---|
| 韓国コスメ | OLIVE YOUNG Global | https://global.oliveyoung.com/influencer/main | 国別対象・Web掲載許可・審査・報酬ランク |
| 韓国コスメ/服 | YesStyle Influencer | https://web.yesstyle.com/en/influencers.html | X/自社サイトの可否、対象取引、クーポン |
| 韓国体験 | Klook Kreator / Affiliate | https://www.klook.com/ja/blog/klook-kreator-program-japan/ | クーポン紹介とサイトリンク用制度の区別、最低支払い |
| 旅行/ホテル | Trip.com Partners | https://jp.trip.com/partners/index | 成果対象の旅程・宿泊商品、料率、計測 |
| eSIM | Airalo Partner | https://partners.airalo.com/ | 国別対象、API/リンク、報酬、キャンセル |
| 国内EC | 楽天アフィリエイト | https://affiliate.rakuten.co.jp/ | 登録済みサイト、商品別料率、報酬上限 |
| 国内EC | Amazonアソシエイト | https://affiliate.amazon.co.jp/ | サイト/SNS登録、規約、価格・画像表示/更新条件 |

参考（2026-11-06公開情報の目安）:
- OLIVE YOUNG Global は最大13%を掲示、条件によって変化。最低支払額20米ドル: https://global.oliveyoung.com/influencer/main
- Klookクリエイターは紹介クーポン利用額の5%を案内（変更可能）。支払い条件150米ドル以上、SNSフォロワー1000人以上: https://www.klook.com/ja/blog/klook-kreator-program-japan/
- Xではアフィリエイト紹介もPaid Partnership対象: https://help.x.com/ja/rules-and-policies/paid-partnerships-policy
**これらはユーザーに適用される料率/承認を保証しない。**

## 審査・契約の状態
`unapplied -> pending -> approved / rejected -> paused / expired`
提携条件、媒体（X/Web）、取得データ/API、画像の利用範囲、禁止事項、Cookie期間、キャンセル/返品、最低払出額、支払日・通貨、利用規約版を保存。未承認リンクは公開しない。

## 成果の扱い
- click / conversion pending / approved / rejected / reversal / paid を区別。
- 売上額・成果見込・確定報酬・入金額を混同しない。
- 自社クリック計測とASP集計の二重計上を防ぐ。取引IDがない場合はインポート単位にハッシュと重複検知。
- 利益管理は「確定報酬 - ホスティング・API・外注費」を月次で出す。税引前と明記。

## 高優先キャンペーン
A. 韓国ホテル/旅行の予約に直結する比較記事
B. 韓国コスメの配送/クーポン込み比較
C. eSIM/空港交通の旅行準備。低単価でもCVRが高い可能性を実測で評価。

## リンク/表示規則
- affiliate URLの発行は広告主の管理画面/APIの仕様のみ。架空のタグ・URLは作らない。
- URLパラメータ改変を認めない規約ならリンクはそのまま利用。
- 自社 `/go/id` によるリダイレクトはASPが許可する範囲で使用し、透明性を損なわない。外部ドメインallowlistが必須。
- コンテンツ冒頭に「広告/PRが含まれます」と明示し、スポンサー報酬は順位の独立性に影響させない。
- 製品画像、レビュー、商品説明は転載許可を確認。提携先の提供API/素材を優先。
- 取得値の更新停止・報酬停止・アカウント失効時にはリンクを非表示/通常リンクへ切替し、古いセール文言は取り消す。
