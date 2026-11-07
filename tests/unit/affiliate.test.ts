import { describe, expect, it } from "vitest";
import { parseAffiliateLinks, resolveOutbound } from "@/lib/affiliate";

const allowed = new Set(["prog-klook", "prog-tripcom"]);

describe("parseAffiliateLinks", () => {
  it("正しいJSONからhttpsのリンクだけを読み込む", () => {
    const links = parseAffiliateLinks(
      JSON.stringify({
        "prog-klook": "https://affiliate.example/klook",
        "prog-tripcom": "http://insecure.example/trip",
        unknown: "https://affiliate.example/unknown",
      }),
      allowed,
    );
    expect(links).toEqual({
      "prog-klook": "https://affiliate.example/klook",
    });
  });

  it("不正なJSONは空として扱う", () => {
    expect(parseAffiliateLinks("{not json", allowed)).toEqual({});
    expect(parseAffiliateLinks(undefined, allowed)).toEqual({});
  });
});

describe("resolveOutbound", () => {
  const official = "https://www.klook.com/ja/";

  it("フラグOFFでは公式URL", () => {
    const result = resolveOutbound("prog-klook", official, {
      enabled: false,
      raw: JSON.stringify({ "prog-klook": "https://affiliate.example/klook" }),
    });
    expect(result).toEqual({ href: official, isAffiliate: false });
  });

  it("フラグONで承認済みリンクがあれば成果リンク", () => {
    const result = resolveOutbound("prog-klook", official, {
      enabled: true,
      raw: JSON.stringify({ "prog-klook": "https://affiliate.example/klook" }),
    });
    expect(result).toEqual({
      href: "https://affiliate.example/klook",
      isAffiliate: true,
    });
  });

  it("リンク未設定なら公式URL", () => {
    const result = resolveOutbound("prog-klook", official, {
      enabled: true,
      raw: "{}",
    });
    expect(result).toEqual({ href: official, isAffiliate: false });
  });

  it("未登録のプログラムIDは公式URL", () => {
    const result = resolveOutbound("prog-unknown", official, {
      enabled: true,
      raw: JSON.stringify({ "prog-unknown": "https://affiliate.example/x" }),
    });
    expect(result).toEqual({ href: official, isAffiliate: false });
  });
});
