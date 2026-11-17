/**
 * レビュー待ち記事のプレビューHTMLを出力する（ローカル専用）。
 *
 * - `status: "review"` の記事を本文・FAQ・出典つきで1ページにまとめる。
 * - 公開前チェック（禁止表現・出典ノートにない数値）を併記する。
 * - 出力先は `var/reports/review-<YYYY-MM-DD>.html`（var/ はGit管理外）。
 *
 * 使い方: pnpm exec tsx scripts/render-review.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { articleList, evidenceList } from "../src/data";
import { BANNED_PHRASES } from "../src/lib/ai/policy";
import { ARTICLE_CTA_PROGRAMS } from "../src/lib/cta";

const ROOT = process.cwd();

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bodyChars(article: { sections: { paragraphs: string[] }[] }): number {
  return article.sections.reduce(
    (total, section) =>
      total + section.paragraphs.reduce((n, paragraph) => n + paragraph.length, 0),
    0,
  );
}

function unsupportedNumbers(article: (typeof articleList)[number]): string[] {
  const noteText = article.evidenceIds
    .map((id) => {
      const evidence = evidenceList.find((item) => item.id === id);
      return `${evidence?.note ?? ""} ${evidence?.sourceUrl ?? ""}`;
    })
    .join(" ")
    .replace(/,/g, "");
  const body =
    article.sections.map((s) => s.heading + s.paragraphs.join("")).join("") +
    article.faq.map((f) => f.question + f.answer).join("");
  const numbers = new Set(
    (body.match(/[0-9][0-9,.]*/g) ?? []).map((raw) => raw.replace(/,/g, "").replace(/\.$/, "")),
  );
  return [...numbers].filter((n) => n.length > 2 && !noteText.includes(n));
}

function renderArticle(article: (typeof articleList)[number]): string {
  const banned = BANNED_PHRASES.filter((phrase) =>
    JSON.stringify(article).includes(phrase),
  );
  const missing = unsupportedNumbers(article);
  const cta = ARTICLE_CTA_PROGRAMS[article.slug];
  const evidenceRows = article.evidenceIds
    .map((id) => {
      const item = evidenceList.find((e) => e.id === id);
      if (!item) return `<li><strong>${esc(id)}</strong>: 出典が見つかりません</li>`;
      return `<li><strong>${esc(item.id)}</strong>（${esc(item.reviewStatus)} / ${esc(item.checkedAt.slice(0, 10))}）<br /><a href="${esc(item.sourceUrl)}">${esc(item.sourceUrl)}</a><br /><span class="note">${esc(item.note)}</span></li>`;
    })
    .join("");

  const sections = article.sections
    .map((section) => {
      const bullets =
        section.bullets && section.bullets.length > 0
          ? `<ul>${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
          : "";
      const image = section.image
        ? `<figure><img src="${esc(section.image.src)}" alt="${esc(section.image.alt)}" style="max-width:100%;border-radius:8px" /><figcaption class="note">Photo: ${esc(section.image.credit)}</figcaption></figure>`
        : "";
      const table = section.table
        ? `<table>${section.table.caption ? `<caption>${esc(section.table.caption)}</caption>` : ""}<thead><tr>${section.table.head.map((cell) => `<th>${esc(cell)}</th>`).join("")}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`
        : "";
      return `<section><h3>${esc(section.heading)}</h3>${section.paragraphs
        .map((paragraph) => `<p>${esc(paragraph)}</p>`)
        .join("")}${bullets}${table}${image}</section>`;
    })
    .join("");

  const faq = article.faq
    .map(
      (item) =>
        `<dt>${esc(item.question)}</dt><dd>${esc(item.answer)}</dd>`,
    )
    .join("");

  return `<article id="${esc(article.slug)}">
  <header>
    <p class="meta">${esc(article.slug)} / ${esc(article.category)} / ${esc(article.status)} / 更新 ${esc(article.updatedAt.slice(0, 10))} / 本文 ${bodyChars(article)}字</p>
    <h2>${esc(article.title)}</h2>
    <p class="lead">${esc(article.description)}</p>
  </header>
  <div class="checks">
    <p>禁止表現: ${banned.length === 0 ? "なし" : esc(banned.join(", "))}</p>
    <p>出典ノートにない数値: ${missing.length === 0 ? "なし" : esc(missing.join(", "))}</p>
    <p>CTA: ${cta ? esc(cta.join(", ")) : "カテゴリ共通"}</p>
  </div>
  ${article.heroImage ? `<figure><img src="${esc(article.heroImage.src)}" alt="${esc(article.heroImage.alt)}" style="max-width:100%;border-radius:8px" /><figcaption class="note">Photo: ${esc(article.heroImage.credit)}</figcaption></figure>` : ""}
  ${sections}
  <section><h3>FAQ</h3><dl>${faq}</dl></section>
  <section><h3>出典</h3><ul class="evidence">${evidenceRows}</ul></section>
</article>`;
}

async function main(): Promise<void> {
  const drafts = articleList.filter((article) => article.status === "review");
  const today = new Date().toISOString().slice(0, 10);
  const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>レビュー待ち記事 ${drafts.length}本（${today}）</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 0 auto; max-width: 860px; padding: 24px; line-height: 1.8; color: #111; }
  h1 { font-size: 24px; } h2 { font-size: 20px; margin-top: 0; } h3 { font-size: 15px; margin: 20px 0 6px; }
  article { border: 2px solid #111; border-radius: 12px; padding: 20px; margin: 24px 0; }
  .meta { font-size: 12px; color: #555; } .lead { color: #333; }
  .checks { background: #fffbe6; border: 1px solid #e5d48a; border-radius: 8px; padding: 8px 12px; font-size: 12px; }
  .note { font-size: 12px; color: #555; } .evidence li { margin-bottom: 8px; font-size: 12px; }
  table { border-collapse: collapse; } td, th { border: 1px solid #ccc; padding: 4px 8px; font-size: 12px; }
</style>
</head>
<body>
<h1>レビュー待ち記事 ${drafts.length}本</h1>
<p>生成日: ${today}。本文・FAQ・出典・公開前チェックを1ページにまとめたローカル用のプレビューです。公開は人のレビュー後に行います。</p>
${drafts.map(renderArticle).join("\n")}
</body>
</html>`;

  const outDir = path.join(ROOT, "var/reports");
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `review-${today}.html`);
  await writeFile(outPath, html, "utf8");
  console.log(`[review] ${drafts.length}本を ${path.relative(ROOT, outPath)} に出力しました`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
