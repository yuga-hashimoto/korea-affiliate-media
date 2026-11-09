import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

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
});
