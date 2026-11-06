import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/korea/travel/esim", "/articles/korea-esim-total-cost", "/methodology"];

for (const path of pages) {
  test(`${path} に重大なアクセシビリティ違反がない`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );

    expect(
      serious.map((violation) => ({
        id: violation.id,
        help: violation.help,
        nodes: violation.nodes.slice(0, 3).map((node) => node.target),
      })),
    ).toEqual([]);
  });
}
