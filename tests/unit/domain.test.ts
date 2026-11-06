import { describe, expect, it } from "vitest";
import { OfferSchema } from "@/lib/domain";
import { offer } from "./fixtures";

describe("OfferSchema", () => {
  it("税込の場合は taxAmount > 0 を拒否する", () => {
    const result = OfferSchema.safeParse(
      offer({ taxIncluded: true, taxAmount: 100 }),
    );
    expect(result.success).toBe(false);
  });

  it("priceBasis=sample なのに sample=false なら拒否する", () => {
    const result = OfferSchema.safeParse(
      offer({ priceBasis: "sample", sample: false }),
    );
    expect(result.success).toBe(false);
  });

  it("未確認金額（null）を許可する", () => {
    const result = OfferSchema.safeParse(offer({ baseAmount: null }));
    expect(result.success).toBe(true);
  });

  it("負の金額を拒否する", () => {
    const result = OfferSchema.safeParse(offer({ baseAmount: -1 }));
    expect(result.success).toBe(false);
  });
});
