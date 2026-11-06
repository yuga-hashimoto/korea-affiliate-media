/**
 * 公開コンテンツの鮮度監査。更新候補を出力するだけで、自動では書き換えない。
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { articleList, evidenceList } from "../src/data/index";
import { auditContent } from "../src/lib/content/audit";

async function main(): Promise<void> {
  const now = new Date();
  const findings = auditContent(articleList, evidenceList, { now });
  const summary = {
    generatedAt: now.toISOString(),
    counts: {
      high: findings.filter((f) => f.severity === "high").length,
      medium: findings.filter((f) => f.severity === "medium").length,
      low: findings.filter((f) => f.severity === "low").length,
    },
    findings,
  };

  const dir = path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "var"), "reports");
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, "content-audit.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `[audit] high=${summary.counts.high} medium=${summary.counts.medium} low=${summary.counts.low}`,
  );
  for (const finding of findings.slice(0, 20)) {
    console.log(
      `- [${finding.severity}] ${finding.kind} ${finding.slug ?? "（記事なし）"}: ${finding.message}`,
    );
  }
}

main().catch((error) => {
  console.error("[audit] fatal", error);
  process.exitCode = 1;
});
