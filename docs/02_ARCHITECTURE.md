> **2026-11-06 方針更新**: 「総額比較エンジン」は廃止し、韓国旅行メディアへ転換しました（[ADR-0004](adr/0004-pivot-to-korea-travel-media.md)）。本文の比較前提は履歴として参照し、現行仕様は README・ADR-0004・`src/` を参照してください。

# 技術アーキテクチャ / データモデル

## 推奨スタック（最終選定は実行時にADR）
- UI/SEO: Next.js App Router + TypeScript + Tailwind CSS、サーバー描画/ISR、モバイルファースト。Node.jsとパッケージの安定バージョンは実装時に公式ドキュメントで確認。
- 公開先: まず Vercel などのPreview（無料/低コスト枠の条件要確認）。本番は現行DNS/既存インフラの調査後に決める。バックエンドの定期ジョブは既存GCPのCloud Run Jobs + Cloud Schedulerを候補。
- DB: PostgreSQL（商用環境の接続先は未定）。ローカルはDocker Composeまたはテスト用DB。ORMはPrisma/Drizzleいずれか一方に統一しADRを残す。
- コンテンツ: 初期はMDX/構造化Markdown + Gitレビュー、将来は承認ワークフロー付きCMS/DBへ。外部ソースの証跡はオブジェクトストレージへの保存も検討。
- AI: OpenRouter（任意）＋JSON Schema出力のバリデーション。キーなしでもモックでテスト可能。
- SNS: Buffer APIを介した投稿予約、Xで必要なPaid Partnership開示をAPIで担保できない場合はPR投稿を自動配信しない。
- 分析: GA4 / Search Console / 匿名クリックイベント / ASP承認実績（CSVまたは提供API）。

## 論理コンポーネント
```
Official/Approved feeds ──> Ingestion Job ──> Evidence Validator ──> PostgreSQL
                                                    │
                                          Price comparison engine
                                                    │
      Editor/AI drafts ──> Validation/Approval ──> Next.js site ──> /go/{id} ──> merchants
                                                    │
                                      SNS scheduler (Buffer -> X)
                                                    │
                          GA4 + GSC + ASP approved revenue -> KPI report
```

## データエンティティ（最小）
- `Merchant(id,name,siteUrl,country,trackingPolicy,updatedAt)`
- `AffiliateProgram(id,merchantId,status[unapplied|pending|approved|rejected|paused],allowedMedia[],termsUrl,approvedAt,linkTemplateRef,commissionType,notes)`。**リンクURL・報酬は承認後に管理**。
- `Product(id,category,brand,title,sku,canonicalKey)`
- `Offer(id,productId,merchantId,landingUrl,currency,baseAmount,shippingAmount,taxAmount,feesAmount,couponAmount,pointsAmount,conditionJson,available,observedAt,expiresAt,sourceEvidenceId)`。金額はdecimal、未確認値はNULL。
- `FXRate(id,base,quote,rate,source,observedAt)`。換算通貨は固定しない。
- `SourceEvidence(id,sourceUrl,sourceType,accessPermitted,checkedAt,observedTextHash,terms,reviewStatus)`
- `ComparisonScenario(id,kind,people,nights,days,gb,exchangeRateRef,conditionsJson,createdAt)`
- `Article(id,slug,title,category,content,status,draftVersion,evidenceIds[],reviewedAt,publishedAt,updatedAt,canonicalUrl)`
- `Promotion(id,channel,content,articleId,affiliateProgramId,disclosureMode,status[draft|review|approved|scheduled|published|failed|paused],scheduledAt,externalPostId,contentHash)`
- `OutboundClick(id,offerId,articleId,channel,day,anonymousSessionKey,createdAt)`。個人特定ログを最小化。
- `Conversion(id,source,programId,externalConversionId,clickRef?,amount,commissionAmount,currency,status[pending|approved|rejected|reversed],eventAt,confirmedAt)`
- `AuditEvent(id,entity,entityId,action,actor,details,createdAt)`

## 総額比較のロジック
`total = baseAmount + shippingAmount + taxAmount + feesAmount - eligibleCouponAmount`
ポイントは「今回の支払額」と異なるため原則別表示（将来ポイント実質額も追加可）。外貨はFX参照日時と通貨を明記。手数料/関税/現地徴収税は条件に応じて計算; 不明な項目は**不明として残し、0を代入しない**。
航空券・ホテル・現地体験は人数、日程、空港/場所、キャンセル、為替、決済通貨、日付依存。ライブ見積がない場合は「参考総額・取得時点」と表示し、リアルタイム価格を装わない。
同条件で比較できない場合は順位付けをせず「比較条件が異なる」と示す。推奨順位を報酬額だけで決定しない。

## API例（認証/入力検証必須）
- `GET /api/v1/comparisons?category=esim&days=5&gb=10`
- `GET /api/v1/articles/[slug]` （公開情報のみ）
- `POST /api/internal/ingestions/run` （サービス認証）
- `POST /api/internal/promotions/approve` （管理者のみ）
- `GET /go/[id]` （リンク先はDB allowlist、署名/検証、302/307、外部ドメインを勝手に指定不可）
静的なページやCMS APIを採用する場合はAPI数を減らし、複雑化させない。

## CI
PRで lint/typecheck/unit/build。必要に応じて Playwright e2e/axe、DB migration smoke、link checker、secret scanning。依存関係更新は自動PR。DBバックアップと最小権限サービスアカウント。
