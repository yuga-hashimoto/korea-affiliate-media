import { expect, test } from "@playwright/test";

test.describe("主要ページ", () => {
  test("トップページが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/総額比較/);
    await expect(
      page.getByRole("heading", { level: 1, name: /実際に払う総額/ }),
    ).toBeVisible();
    await expect(page.getByRole("navigation", { name: "メインナビゲーション" })).toHaveCount(
      page.viewportSize() && page.viewportSize()!.width >= 768 ? 1 : 0,
    );
  });

  test("eSIM比較ページに総額・内訳・出典が表示される", async ({ page }, testInfo) => {
    await page.goto("/korea/travel/esim");
    await expect(
      page.getByRole("heading", { level: 1, name: /韓国eSIMの総額比較/ }),
    ).toBeVisible();
    await expect(page.getByText("サンプル").first()).toBeVisible();
    if (testInfo.project.name === "desktop-chromium") {
      await expect(page.getByRole("table")).toBeVisible();
    } else {
      await expect(page.getByRole("article").first()).toBeVisible();
    }
    await expect(page.getByText("UNKNOWN").first()).toBeVisible();
    const detail = page.getByRole("main").locator("details:visible").first();
    await detail.locator("summary").click();
    await expect(detail.getByText(/計算式:/)).toBeVisible();
    await expect(detail.getByText(/確認日時:/)).toBeVisible();
  });

  test("サンプルデータでは「総額最安」と断定しない", async ({ page }) => {
    await page.goto("/korea/travel/esim");
    await expect(page.getByText("この条件での総額最安は")).toHaveCount(0);
  });

  test("記事ページが表示され、下書きは404になる", async ({ page }) => {
    await page.goto("/articles/korea-esim-total-cost");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("韓国eSIM");
    const response = await page.goto("/articles/korea-sale-calendar");
    expect(response?.status()).toBe(404);
  });

  test("比較APIがJSONを返す", async ({ request }) => {
    const response = await request.get("/api/v1/comparisons?category=esim");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.category).toBe("esim");
    expect(Array.isArray(body.offers)).toBe(true);
    expect(body.demoMode).toBe(true);
  });

  test("/go の外部リダイレクトが登録済みオファーで307になる", async ({ request }) => {
    const response = await request.get("/go/off-esim-a", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toMatch(/^https:\/\//);
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("未登録の /go は404、外部URLを指定できない", async ({ request }) => {
    const response = await request.get("/go/../../etc/passwd", { maxRedirects: 0 });
    expect([400, 404]).toContain(response.status());
    const open = await request.get("/go/off-esim-a?url=https://evil.example", {
      maxRedirects: 0,
    });
    expect(open.headers()["location"]).not.toContain("evil.example");
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
    const jsonLd = await page.locator('script[type="application/ld+json"]').count();
    expect(jsonLd).toBeGreaterThan(0);
  });
});

test.describe("レスポンシブ", () => {
  test("モバイル幅で横スクロールが発生しない", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/korea/travel/esim");
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - window.innerWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: testInfo.outputPath("esim-mobile.png"),
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
