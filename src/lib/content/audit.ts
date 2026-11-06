import type { Article, SourceEvidence } from "@/lib/domain";
import { isStale } from "@/lib/dates";

/**
 * 公開コンテンツの鮮度監査。記事・出典の期限切れや未レビューを検出し、
 * 更新候補として出力する（自動で書き換えない）。
 */

export type AuditKind =
  | "stale_evidence"
  | "missing_evidence"
  | "stale_article"
  | "old_draft";

export interface AuditFinding {
  kind: AuditKind;
  severity: "high" | "medium" | "low";
  slug: string | null;
  evidenceId?: string;
  message: string;
}

export interface AuditOptions {
  now: Date;
  articleMaxAgeDays?: number;
  draftMaxAgeDays?: number;
  evidenceMaxAgeDays?: number;
}

export function auditContent(
  articles: readonly Article[],
  evidence: readonly SourceEvidence[],
  options: AuditOptions,
): AuditFinding[] {
  const {
    now,
    articleMaxAgeDays = 180,
    draftMaxAgeDays = 30,
    evidenceMaxAgeDays = 14,
  } = options;
  const findings: AuditFinding[] = [];
  const evidenceById = new Map(evidence.map((item) => [item.id, item]));

  for (const article of articles) {
    if (article.status === "published") {
      for (const evidenceId of article.evidenceIds) {
        const item = evidenceById.get(evidenceId);
        if (!item) {
          findings.push({
            kind: "missing_evidence",
            severity: "high",
            slug: article.slug,
            evidenceId,
            message: "記事が参照する出典が存在しません",
          });
          continue;
        }
        if (item.reviewStatus === "rejected") {
          findings.push({
            kind: "missing_evidence",
            severity: "high",
            slug: article.slug,
            evidenceId,
            message: "出典が却下されています",
          });
        } else if (
          item.reviewStatus === "unreviewed" ||
          item.reviewStatus === "stale" ||
          isStale(item.checkedAt, now, evidenceMaxAgeDays)
        ) {
          findings.push({
            kind: "stale_evidence",
            severity: "medium",
            slug: article.slug,
            evidenceId,
            message: "出典の再確認が必要です",
          });
        }
      }

      if (isStale(article.updatedAt, now, articleMaxAgeDays)) {
        findings.push({
          kind: "stale_article",
          severity: "low",
          slug: article.slug,
          message: `記事の最終更新から${articleMaxAgeDays}日以上経過しています`,
        });
      }
    } else if (
      (article.status === "draft" || article.status === "review") &&
      isStale(article.updatedAt, now, draftMaxAgeDays)
    ) {
      findings.push({
        kind: "old_draft",
        severity: "low",
        slug: article.slug,
        message: `下書きのまま${draftMaxAgeDays}日以上経過しています`,
      });
    }
  }

  const order = { high: 0, medium: 1, low: 2 };
  return findings.sort((a, b) => order[a.severity] - order[b.severity]);
}
