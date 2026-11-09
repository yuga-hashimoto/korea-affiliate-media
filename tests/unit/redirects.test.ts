import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { publishedArticles } from "@/data";

describe("Cloudflare Pages _redirects", () => {
  const content = readFileSync(
    path.join(process.cwd(), "public/_redirects"),
    "utf8",
  );
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  it("旧URLは308で記事・編集方針へ転送する", () => {
    expect(lines).toContain(
      "/korea/travel/esim /articles/korea-esim-wifi-guide/ 308",
    );
    expect(lines).toContain(
      "/korea/travel/airport-transport /articles/incheon-airport-to-seoul/ 308",
    );
    expect(lines).toContain("/methodology /editorial-policy/ 308");
  });

  it("統合した記事は統合先へ308転送する", () => {
    const expected: Record<string, string> = {
      "/articles/korea-season-and-packing/": "/articles/korea-season-guide/",
      "/articles/seoul-cherry-blossom-guide/": "/articles/korea-season-guide/",
      "/articles/seoul-summer-guide/": "/articles/korea-season-guide/",
      "/articles/seoul-autumn-guide/": "/articles/korea-season-guide/",
      "/articles/seoul-winter-illumination/": "/articles/korea-season-guide/",
      "/articles/seoul-2nights-3days-model-course/": "/articles/seoul-model-courses/",
      "/articles/seoul-3nights-4days-slow-plan/": "/articles/seoul-model-courses/",
      "/articles/seoul-cafe-area-guide/": "/articles/seoul-cafe-guide/",
      "/articles/korean-dessert-cafe/": "/articles/seoul-cafe-guide/",
      "/articles/korea-cafe-order-guide/": "/articles/seoul-cafe-guide/",
      "/articles/seoul-night-view-guide/": "/articles/korea-night-view-guide/",
      "/articles/busan-night-view-guide/": "/articles/korea-night-view-guide/",
      "/articles/incheon-airport-transfer-guide/": "/articles/incheon-airport-to-seoul/",
    };
    for (const [from, to] of Object.entries(expected)) {
      expect(lines, from).toContain(`${from} ${to} 308`);
    }
  });

  it("外部ドメインへの転送を含まない", () => {
    for (const line of lines) {
      const [from, to] = line.split(/\s+/);
      expect(from?.startsWith("/"), line).toBe(true);
      expect(to?.startsWith("/"), line).toBe(true);
    }
  });

  it("転送先は末尾スラッシュ付きの実URL（308連鎖を避ける）", () => {
    for (const line of lines) {
      const to = line.split(/\s+/)[1];
      if (!to) continue;
      expect(to === "/" || to.endsWith("/"), `転送先に末尾スラッシュがない: ${line}`).toBe(
        true,
      );
    }
  });

  it("記事への転送先は公開中の記事に存在する（404転送を作らない）", () => {
    const slugs = new Set(publishedArticles.map((article) => article.slug));
    for (const line of lines) {
      const to = line.split(/\s+/)[1];
      if (!to || !to.startsWith("/articles/")) continue;
      const slug = to.replace(/^\/articles\//, "").replace(/\/$/, "");
      expect(slugs.has(slug), `未公開の記事へ転送している: ${line}`).toBe(true);
    }
  });
});
