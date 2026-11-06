# ADR-0002: 技術スタック・ホスティング・データ保存

- 日付: 2026-11-06
- 状態: 採用（プレビューまで）。本番ホスティング契約は未承認。
- 関連: P0-04, `docs/02_ARCHITECTURE.md`

## 論点
低コストで SEO に強く、AI 自動化と将来の DB 移行が可能な構成を選ぶ。

## 判断
| 領域 | 採用 | 理由 |
|---|---|---|
| UI/SEO | Next.js 16.4.5（App Router）+ React 19.3.1 + TypeScript 5.9 | SSR/SSG、Metadata API、Route Handler を1つで賄える |
| スタイル | Tailwind CSS 4.3（`@tailwindcss/postcss`） | デザイントークンをCSS変数で管理、ビルドが高速 |
| データ検証 | Zod 4 | 実行時スキーマ検証。ビルド時に参照整合性を検査 |
| テスト | Vitest 5 + Playwright 1.65 | 計算ロジックの単体テストと 375px の E2E |
| CI | GitHub Actions | 追加契約なしで lint/typecheck/test/build/E2E を実行 |
| データ保存（MVP） | Git管理の型付きTS/JSON + 実行時は `var/` のJSONL | DB資格情報なしでも安全に動作。監査ログを分離 |
| 将来のDB | PostgreSQL + Drizzle または Prisma（未決定） | 記事・オファー・成果の履歴管理。ADRを分けて決定 |
| Preview | Vercel（無料枠を想定、未契約） | Next.js のPreviewデプロイが容易。トークン未設定時はスキップ |
| 定期ジョブ | GitHub Actions（当面）/ GCP Cloud Run Jobs（将来） | 既存GCPの有無・課金設定は未確認のため推測しない |

## 代替案
- Cloudflare Pages + Workers: 無料枠は魅力的だが、Next.js の SSR/Route Handler 互換に追加検証が必要。
- GCP Cloud Run 単独: 既存アカウント・課金設定が未確認で、無料枠の条件確認が必要。
- Vercel Pro: 有料。費用対効果の判断にはアクセス数が必要で、現時点では契約しない。

## 費用（未契約・要確認）
- Vercel Hobby: 無料枠の商用利用条件・帯域・関数実行時間を**契約前に公式で確認**する。
- GitHub Actions: プライベートリポジトリの無料分数を超えると課金。現状のCIは数分/回。
- DB/オブジェクトストレージ: 未選択。月額0円〜低額を想定するが、金額は保証しない。

## 影響
- `var/` は Git 管理外。CI のジョブ成果はPRで `content/generated/` のみ共有する。
- DB移行時は `src/lib/store.ts` の実装差し替えで対応できるよう、リポジトリ層を分離している。

## ロールバック
- フロント変更は Git の revert。Vercel は即時ロールバック可能。
- データは Git 履歴と `var/` のバックアップから復元。
