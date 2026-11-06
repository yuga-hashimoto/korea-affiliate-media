import { afterEach, describe, expect, it } from "vitest";
import { resolveGoTarget, resolveOutboundLink } from "@/lib/affiliate";
import { offer, approvedProgram, pendingProgram } from "./fixtures";

const original = process.env.AFFILIATE_LINKS_ENABLED;

afterEach(() => {
  if (original === undefined) delete process.env.AFFILIATE_LINKS_ENABLED;
  else process.env.AFFILIATE_LINKS_ENABLED = original;
});

describe("resolveOutboundLink", () => {
  it("提携未承認は公式URLのみ", () => {
    process.env.AFFILIATE_LINKS_ENABLED = "true";
    const result = resolveOutboundLink(offer(), pendingProgram);
    expect(result.mode).toBe("official");
    expect(result.href).toBe("https://example.com/item");
  });

  it("承認済みでもフラグOFFなら公式URL", () => {
    process.env.AFFILIATE_LINKS_ENABLED = "false";
    const result = resolveOutboundLink(offer(), approvedProgram);
    expect(result.mode).toBe("official");
  });

  it("承認済みかつフラグONなら成果リンク", () => {
    process.env.AFFILIATE_LINKS_ENABLED = "true";
    const result = resolveOutboundLink(offer(), approvedProgram);
    expect(result.mode).toBe("affiliate");
    expect(result.href).toBe("https://example.com/aff/123");
  });

  it("承認済みでも媒体許可にwebがなければ公式URL", () => {
    process.env.AFFILIATE_LINKS_ENABLED = "true";
    const result = resolveOutboundLink(offer(), {
      ...approvedProgram,
      allowedMedia: ["x"],
    });
    expect(result.mode).toBe("official");
  });

  it("httpsではないリンクは無効化する", () => {
    const result = resolveOutboundLink(
      offer({ landingUrl: "http://example.com/item" }),
      null,
    );
    expect(result.mode).toBe("blocked");
    expect(resolveGoTarget(offer({ landingUrl: "http://example.com/item" }), null).href).toBeNull();
  });
});
