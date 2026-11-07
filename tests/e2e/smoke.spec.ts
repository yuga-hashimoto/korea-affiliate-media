import { expect, test } from "@playwright/test";

test.describe("主要ページ", () => {
  test("トップページが旅行メディアとして表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/韓国旅行ノート/);
    await expect(
      page.getByRole("heading", { level: 1, name: /週末は/ }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /ソウル旅行ガイド/ })).toBeVisible();
    await expect(page.getByText("今日行くなら、どこ？")).toBeVisible();
  });

  test("ソウルカテゴリに記事が表示される", async ({ page }) => {
    await page.goto("/korea/travel/seoul");
    await expect(
      page.getByRole("heading", { level: 1, name: "ソウル" }),
    ).toBeVisible();
    await expect(page.getByRole("article").first()).toBeVisible();
  });

  test("記事ページに本文・出典・関連記事が表示される", async ({ page }) => {
    await page.goto("/articles/korea-travel-checklist");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "韓国旅行チェックリスト",
    );
    await expect(page.getByText(/参照元・確認日時/)).toBeVisible();
    await expect(page.getByText(/よくある質問/)).toBeVisible();
  });

  test("記事一覧をカテゴリで絞り込める", async ({ page }) => {
    await page.goto("/articles?category=cafe");
    await expect(page.getByText(/件$/).first()).toBeVisible();
    const cards = page.getByRole("article");
    expect(await cards.count()).toBeGreaterThan(0);
    await expect(
      page
        .getByRole("navigation", { name: "カテゴリで絞り込む" })
        .getByRole("link", { name: "カフェ" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("記事検索が機能する", async ({ page }) => {
    await page.goto("/articles?q=カフェ");
    await expect(page.getByText(/「カフェ」の検索結果/)).toBeVisible();
  });

  test("存在しない記事は404", async ({ page }) => {
    const response = await page.goto("/articles/not-a-real-article");
    expect(response?.status()).toBe(404);
  });

  test("Previewではnoindex", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });

  test("canonical・OGP・JSON-LDが出力される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /127\.0\.0\.1:4400/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    const jsonLd = await page.locator('script[type="application/ld+json"]').count();
    expect(jsonLd).toBeGreaterThan(0);
  });

  test("robots.txt は Preview で全面Disallow", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();
    expect(body).toContain("Disallow: /");
  });
});

test.describe("レスポンシブ", () => {
  test("モバイル幅で横スクロールが発生しない", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/korea/travel/seoul");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: testInfo.outputPath("seoul-mobile.png"),
      fullPage: true,
    });
  });

  test("キーボードでナビゲーションに到達できる", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.textContent);
    expect(focused).toContain("本文へスキップ");
  });
});
