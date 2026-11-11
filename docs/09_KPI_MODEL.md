> **2026-11-06 方針更新**: 「総額比較エンジン」は廃止し、韓国旅行メディアへ転換しました（[ADR-0004](adr/0004-pivot-to-korea-travel-media.md)）。本文の比較前提は履歴として参照し、現行仕様は README・ADR-0004・`src/` を参照してください。

# KPI・収益モデル（月30万円目標）

## 定義
- 最終目標: ASP確定報酬月300,000円（経費/税引前）。見込報酬やクリック単価ではない。
- 検証指標: Search Consoleの自然検索クリック、GA4の訪問/ランディング、外部クリック、承認成果数、1訪問あたりの確定報酬 `EPV`、記事更新工数、月間経費。
- 取得方法: GA4の数値は `pnpm analytics:traffic`（日別）/ `pnpm analytics:ga4-pages`（ページ別）で取得する。設定と読み方の注意は [ANALYTICS](ANALYTICS.md)。
- `Revenue = Σ(Approved conversions × Approved commission per conversion)`
- `Traffic needed = Target approved commission / EPV`
- `EPV = Outbound click rate × Advertiser CVR × Approved commission per conversion × Approval rate`
- 要素は商材・ページ・時期で異なるため、全体の一律コンバージョン率を事実としない。

## モデルケース（仮定、予測ではない）
| 商材 | 1承認成果の報酬仮定 | 必要承認成果 | 成果報酬 | 広告主サイトでのCVR仮定 | 必要外部クリック |
|---|---:|---:|---:|---:|---:|
| ホテル | 3,000円 | 45 | 135,000円 | 2% | 2,250 |
| 現地体験 | 600円 | 100 | 60,000円 | 4% | 2,500 |
| コスメ | 600円 | 150 | 90,000円 | 3% | 5,000 |
| eSIM | 150円 | 100 | 15,000円 | 5% | 2,000 |
| **合計** | — | **395** | **300,000円** | — | **11,750** |

※この表は**承認成果ベースのCVR**を仮定している。承認率による減額はCVRに織り込んだ想定であり、実データでは発生→承認の2段階に分解する。
※ホテル3,000円/現地体験600円/コスメ600円/eSIM150円は案件適用が未確認の仮置き値。開始後に確定報酬で更新。

## 訪問数の目安（仮定）
外部クリック率25%なら `11,750 / 0.25 = 47,000` サイト訪問/月。
より慎重に **EPV 3円** と仮置きすると `300,000 / 3 = 100,000` サイト訪問/月。
EPVが1.5円なら20万訪問、6円なら5万訪問。トラフィック自体は売上を保証しない。

## 収益の段階ゲート
- Gate 1: コンテンツ/ASP承認/法令レビュー完了（PVにかかわらず）。
- Gate 2: 外部クリック100件以上で複数商材のクリックを測る。
- Gate 3: 初の確定成果、報酬ID/トラッキング照合ができる。
- Gate 4: 商材別承認CVRとEPVの推定可能な母数。早すぎる結論を避ける。
- Gate 5: 月3万→10万→30万円の確定報酬、黒字/費用・労力を月次確認。

## 成長計画（目標であり達成予測でない）
M1: 法令・技術基盤、8〜12記事、Xの反応測定、計測実装。
M2-3: 30〜50の有用コンテンツ候補（根拠あるものだけ公開）、初成果、勝ちトピック選定。
M4-6: 比較機能とSEO/成果導線を改善、支払総額の独自データ資産を強化。
M6-18: 月30万円を目指す。到達時期は検索順位・承認率・費用で大きく前後し、未達もあり得る。

## ダッシュボード
- Acquisition: impressions, organic clicks, X impressions/clicks, unique sessions（取得できる範囲）。
- Engagement: article CTR, compare interactions, scroll engagement, entry→merchant click。
- Monetization: pending, approved, reversed, paid commissions, revenue per 1000 visits, CPA相当。
- Quality: stale offers, missing evidence, correction tickets, broken outgoing links, Core Web Vitals。
- Operations: LLM/cloud costs, jobs success, review queue age, publishing error, manual review hours。

## 運用原則
小さい標本での見込み売上を断定しない。ASPとの照合不能な推計を確定収益に加算しない。金額は日時・通貨・税込/税別/税引前の別を示す。
