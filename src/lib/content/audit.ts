import type { Article, Offer, SourceEvidence } from "@/lib/domain";
import { isPast, isStale } from "@/lib/dates";

/**
 * 公開コンテンツの鮮度監査。記事・証跡・オファーの期限切れや未レビューを検出し、
 * 更新候補として出力する（自動で書き換えない）。
 */

export type AuditKind =
  | "expired_offer"
  | "stale_evidence"
  | "missing_evidence"
  | "unreviewed_evidence"
  | "stale_article"
  | "old_draft";

export interface AuditFinding {
  kind: AuditKind;
  severity: "high" | "medium" | "low";
  slug: string | null;
  offerId?: string;
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
  offers: readonly Offer[],
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

  for (const offer of offers) {
    if (offer.sample) continue;
    if (isPast(offer.expiresAt, now)) {
      findings.push({
        kind: "expired_offer",
        severity: "high",
        slug: null,
        offerId: offer.id,
        message: "オファーの掲載期限が切れています",
      });
    }
    const item = evidenceById.get(offer.evidenceId);
    if (!item) {
      findings.push({
        kind: "missing_evidence",
        severity: "high",
        slug: null,
        offerId: offer.id,
        evidenceId: offer.evidenceId,
        message: "オファーが参照する出典が存在しません",
      });
    } else if (item.reviewStatus === "unreviewed") {
      findings.push({
        kind: "unreviewed_evidence",
        severity: "medium",
        slug: null,
        offerId: offer.id,
        evidenceId: item.id,
        message: "オファーの出典が未検証です",
      });
    }
  }

  const order = { high: 0, medium: 1, low: 2 };
  return findings.sort((a, b) => order[a.severity] - order[b.severity]);
}
