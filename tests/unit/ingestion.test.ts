import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runIngestion } from "@/lib/ingestion/connector";

let dir: string;
const original = process.env.DATA_DIR;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "keai-ingest-"));
  process.env.DATA_DIR = dir;
});

afterEach(async () => {
  process.env.DATA_DIR = original;
  await rm(dir, { recursive: true, force: true });
});

const validOffer = {
  id: "feed-1",
  merchantId: "m1",
  category: "esim",
  productName: "5日 3GB",
  landingUrl: "https://example.com/p/1",
  currency: "JPY",
  baseAmount: 1000,
  shippingAmount: 0,
  taxAmount: 0,
  feesAmount: 0,
  taxIncluded: true,
  condition: {
    groupKey: "g1",
    label: "5日 3GB",
    people: 1,
    nights: null,
    days: 5,
    gb: 3,
  },
  observedAt: "2026-11-06T09:00:00.000Z",
  expiresAt: null,
  sourceUrl: "https://example.com/feed",
  accessPermitted: "yes",
  evidenceCheckedAt: "2026-11-06T09:00:00.000Z",
  available: true,
};

function makeFetch(payload: unknown) {
  return vi.fn(async () =>
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  ) as unknown as typeof fetch;
}

describe("runIngestion", () => {
  it("INGESTION_ENABLED=false では外部取得しない", async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    const result = await runIngestion({
      enabled: false,
      feedUrl: "https://feeds.example.com/feed",
      allowedHosts: ["feeds.example.com"],
      fetchImpl,
    });
    expect(result.status).toBe("disabled");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("許可されていないホストは拒否する", async () => {
    const result = await runIngestion({
      enabled: true,
      feedUrl: "https://evil.example.com/feed",
      allowedHosts: ["feeds.example.com"],
      fetchImpl: makeFetch({ offers: [] }),
    });
    expect(result.status).toBe("error");
  });

  it("取得許諾が未確認のオファーは保存しない", async () => {
    const result = await runIngestion({
      enabled: true,
      feedUrl: "https://feeds.example.com/feed",
      allowedHosts: ["feeds.example.com"],
      now: new Date("2026-11-06T12:00:00.000Z"),
      fetchImpl: makeFetch({
        offers: [
          validOffer,
          { ...validOffer, id: "feed-2", accessPermitted: "unknown" },
        ],
      }),
    });
    expect(result.status).toBe("ok");
    expect(result.accepted).toBe(1);
    expect(result.rejected.some((r) => r.reason.includes("許諾"))).toBe(true);
  });

  it("証跡が古いオファーは保存しない", async () => {
    const result = await runIngestion({
      enabled: true,
      feedUrl: "https://feeds.example.com/feed",
      allowedHosts: ["feeds.example.com"],
      now: new Date("2026-12-01T00:00:00.000Z"),
      fetchImpl: makeFetch({ offers: [validOffer] }),
    });
    expect(result.accepted).toBe(0);
    expect(result.rejected[0]?.reason).toContain("古い");
  });

  it("同一内容は重複としてスキップする", async () => {
    const options = {
      enabled: true,
      feedUrl: "https://feeds.example.com/feed",
      allowedHosts: ["feeds.example.com"],
      now: new Date("2026-11-06T12:00:00.000Z"),
      fetchImpl: makeFetch({ offers: [validOffer] }),
    };
    const first = await runIngestion(options);
    const second = await runIngestion(options);
    expect(first.accepted).toBe(1);
    expect(second.accepted).toBe(0);
    expect(second.duplicates).toBe(1);
  });
});
