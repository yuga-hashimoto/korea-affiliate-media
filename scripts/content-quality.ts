/**
 * コンテンツ品質レポート。
 *
 * - 公開記事の本文文字数・見出し数・出典数を一覧化し、薄い記事を可視化する。
 * - タイトル/説明の重複、出典なし記事、内部リンク不足も検出する。
 * - 既定はレポート出力のみ（exit 0）。`--strict` で閾値未満があれば exit 1。
 *
 * 使い方: pnpm jobs:quality [--strict] [--min=1000]
 */
import { articleList, publishedArticles } from "../src/data";

const bodyChars = (article: (typeof articleList)[number]): number =>
  article.sections.reduce(
    (total, section) =>
      total + section.paragraphs.reduce((n, paragraph) => n + paragraph.length, 0),
    0,
  );

function parseArgs(argv: string[]): { strict: boolean; min: number } {
  const minArg = argv.find((arg) => arg.startsWith("--min="));
  const min = minArg ? Number(minArg.split("=")[1]) : 1000;
  return {
    strict: argv.includes("--strict"),
    min: Number.isFinite(min) && min > 0 ? min : 1000,
  };
}

function main(): void {
  const { strict, min } = parseArgs(process.argv.slice(2));
  const rows = publishedArticles
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      category: article.category,
      chars: bodyChars(article),
      sections: article.sections.length,
      faq: article.faq.length,
      evidence: article.evidenceIds.length,
      related: article.related.length,
    }))
    .sort((a, b) => a.chars - b.chars);

  const thin = rows.filter((row) => row.chars < min);
  const median = rows.length
    ? rows[Math.floor(rows.length / 2)]?.chars ?? 0
    : 0;

  const titleCounts = new Map<string, number>();
  const descriptionCounts = new Map<string, number>();
  for (const article of articleList) {
    titleCounts.set(article.title, (titleCounts.get(article.title) ?? 0) + 1);
    descriptionCounts.set(
      article.description,
      (descriptionCounts.get(article.description) ?? 0) + 1,
    );
  }
  const duplicateTitles = [...titleCounts.entries()].filter(([, n]) => n > 1);
  const duplicateDescriptions = [...descriptionCounts.entries()].filter(
    ([, n]) => n > 1,
  );
  const noEvidence = rows.filter((row) => row.evidence === 0);
  const noRelated = rows.filter((row) => row.related === 0);

  const lines: string[] = [];
  lines.push("# コンテンツ品質レポート");
  lines.push("");
  lines.push(`- 公開記事: ${rows.length}件（全${articleList.length}件）`);
  lines.push(`- 本文文字数の中央値: ${median}字`);
  lines.push(`- 基準（${min}字）未満の記事: ${thin.length}件`);
  lines.push(`- タイトル重複: ${duplicateTitles.length}組 / 説明文重複: ${duplicateDescriptions.length}組`);
  lines.push(`- 出典なし: ${noEvidence.length}件 / 関連記事なし: ${noRelated.length}件`);
  lines.push("");
  lines.push("## 本文が短い記事（上位20件）");
  lines.push("");
  lines.push("| 本文 | 見出し | 出典 | 記事 |");
  lines.push("| --- | --- | --- | --- |");
  for (const row of rows.slice(0, 20)) {
    lines.push(
      `| ${row.chars}字 | ${row.sections} | ${row.evidence} | \`${row.slug}\` |`,
    );
  }
  lines.push("");

  if (duplicateTitles.length > 0) {
    lines.push("## タイトルの重複");
    lines.push("");
    for (const [title, count] of duplicateTitles) {
      lines.push(`- ${count}回: ${title}`);
    }
    lines.push("");
  }
  if (duplicateDescriptions.length > 0) {
    lines.push("## 説明文の重複");
    lines.push("");
    for (const [, count] of duplicateDescriptions) {
      lines.push(`- ${count}回の重複`);
    }
    lines.push("");
  }
  if (noEvidence.length > 0) {
    lines.push("## 出典がない記事");
    lines.push("");
    for (const row of noEvidence) lines.push(`- \`${row.slug}\``);
    lines.push("");
  }
  if (noRelated.length > 0) {
    lines.push("## 関連記事がない記事");
    lines.push("");
    for (const row of noRelated) lines.push(`- \`${row.slug}\``);
    lines.push("");
  }

  console.log(lines.join("\n"));

  if (strict && thin.length > 0) {
    console.error(
      `\n[content-quality] ${min}字未満の記事が ${thin.length}件あります（--strict）。`,
    );
    process.exitCode = 1;
  }
}

main();
