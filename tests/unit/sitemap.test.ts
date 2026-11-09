import { afterAll, beforeAll, describe, expect, it } from "vitest";
import sitemap, { withTrailingSlash } from "@/app/sitemap";

const BASE = "https://sougakuhikaku.com";

describe("sitemap.xml", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_SITE_URL = BASE;
  });

  afterAll(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
  });

  it("withTrailingSlash はルート以外に末尾スラッシュを付ける", () => {
    expect(withTrailingSlash("/")).toBe("/");
    expect(withTrailingSlash("/articles")).toBe("/articles/");
    expect(withTrailingSlash("/articles/")).toBe("/articles/");
    expect(withTrailingSlash("/korea/travel//")).toBe("/korea/travel/");
  });

  it("全URLが canonical と同じ末尾スラッシュ形式（308連鎖を避ける）", () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.url.startsWith(`${BASE}/`), entry.url).toBe(true);
      expect(
        entry.url === `${BASE}/` || entry.url.endsWith("/"),
        `末尾スラッシュがない: ${entry.url}`,
      ).toBe(true);
      expect(entry.url.slice("https://".length)).not.toContain("//");
    }
  });

  it("重複URLを含まない", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("記事URLを末尾スラッシュ付きで含む", () => {
    const articleUrls = sitemap()
      .map((entry) => entry.url)
      .filter((url) => url.includes("/articles/"));
    expect(articleUrls.length).toBeGreaterThan(0);
    for (const url of articleUrls) {
      expect(url.endsWith("/"), url).toBe(true);
    }
  });
});
