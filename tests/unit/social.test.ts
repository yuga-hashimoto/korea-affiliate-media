import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildSocialDraft, isDuplicatePost } from "@/lib/social/drafts";
import { deliverPromotion } from "@/lib/social/delivery";
import type { Article, Promotion } from "@/lib/domain";

const article: Article = {
  slug: "korea-esim-total-cost",
  title: "韓国eSIMの総額比較｜価格だけで選ばないための確認項目",
  description:
    "韓国旅行用eSIMを「表示価格」ではなく総支払額で比べる方法を解説。為替・税・手数料・有効期限・端末対応の確認手順をまとめます。",
  category: "seoul",
  status: "published",
  aiGenerated: false,
  reviewedAt: "2026-11-06T09:00:00.000Z",
  publishedAt: "2026-11-06T09:00:00.000Z",
  updatedAt: "2026-11-06T09:00:00.000Z",
  evidenceIds: ["ev-airalo-official"],
  sections: [{ heading: "見出し", paragraphs: ["本文です。"] }],
  faq: [],
  related: [],
  tags: [],
  hubPath: null,
  imageAlt: null,
};

function promotion(overrides: Partial<Promotion> = {}): Promotion {
  return {
    id: "promo-1",
    channel: "x",
    content: "【総額比較】テスト投稿\nhttps://sougakuhikaku.com/articles/x\nPR",
    articleSlug: "x",
    disclosureMode: "pr_label",
    status: "approved",
    scheduledAt: null,
    externalPostId: null,
    contentHash: "hash-1234abcd",
    createdAt: "2026-11-06T09:00:00.000Z",
    updatedAt: "2026-11-06T09:00:00.000Z",
    facts: [],
    risks: [],
    approvedBy: "tester",
    ...overrides,
  };
}

describe("buildSocialDraft", () => {
  it("280文字以内でPR表記とURLを含む", () => {
    const draft = buildSocialDraft({
      article,
      siteUrl: "https://sougakuhikaku.com",
    });
    expect(draft.ok).toBe(true);
    expect(draft.text.length).toBeLessThanOrEqual(280);
    expect(draft.text).toContain("PR");
    expect(draft.text).toContain("https://sougakuhikaku.com/articles/korea-esim-total-cost");
  });

  it("同一本文を重複判定できる", () => {
    expect(
      isDuplicatePost(
        [{ contentHash: "abc", articleSlug: "x" }],
        { contentHash: "abc", articleSlug: "y" },
      ),
    ).toBe(true);
    expect(
      isDuplicatePost(
        [{ contentHash: "abc", articleSlug: "x" }],
        { contentHash: "def", articleSlug: "x" },
      ),
    ).toBe(true);
    expect(
      isDuplicatePost(
        [{ contentHash: "abc", articleSlug: "x" }],
        { contentHash: "def", articleSlug: "y" },
      ),
    ).toBe(false);
  });
});

describe("deliverPromotion", () => {
  let dir: string;
  const original = process.env.DATA_DIR;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "keai-social-"));
    process.env.DATA_DIR = dir;
  });

  afterEach(async () => {
    process.env.DATA_DIR = original;
    await rm(dir, { recursive: true, force: true });
  });

  it("未承認の投稿は送信しない", async () => {
    const result = await deliverPromotion(promotion({ status: "needs_review" }), {
      enabled: true,
      webhookUrl: "https://hooks.example.com/x",
      webhookSecret: "secret",
      paidPartnershipSupported: true,
    });
    expect(result.status).toBe("blocked");
  });

  it("Paid Partnership開示を保証できない場合はPR投稿を止める", async () => {
    const result = await deliverPromotion(promotion(), {
      enabled: true,
      webhookUrl: "https://hooks.example.com/x",
      webhookSecret: "secret",
      paidPartnershipSupported: false,
    });
    expect(result.status).toBe("blocked");
    expect(result.reason).toContain("Paid Partnership");
  });

  it("SOCIAL_PUBLISH_ENABLED=false ではdry-run", async () => {
    const result = await deliverPromotion(promotion(), {
      enabled: false,
      webhookUrl: "https://hooks.example.com/x",
      webhookSecret: "secret",
      paidPartnershipSupported: true,
    });
    expect(result.status).toBe("dry_run");
  });

  it("Webhook未設定時は安全に停止する", async () => {
    const result = await deliverPromotion(promotion(), {
      enabled: true,
      webhookUrl: null,
      webhookSecret: null,
      paidPartnershipSupported: true,
    });
    expect(result.status).toBe("blocked");
    expect(result.reason).toContain("SOCIAL_WEBHOOK_URL");
  });

  it("同一投稿の再送を防止する", async () => {
    const first = await deliverPromotion(promotion(), {
      enabled: false,
      webhookUrl: "https://hooks.example.com/x",
      webhookSecret: "secret",
      paidPartnershipSupported: true,
    });
    expect(first.status).toBe("dry_run");
    // dry-run は履歴に残さないため、送信設定で1回送信→2回目は重複扱い
    const fetchImpl = (async () =>
      new Response("{}", { status: 200 })) as unknown as typeof fetch;
    const sent = await deliverPromotion(promotion(), {
      enabled: true,
      webhookUrl: "https://hooks.example.com/x",
      webhookSecret: "secret",
      paidPartnershipSupported: true,
      fetchImpl,
    });
    expect(sent.status).toBe("sent");
    const again = await deliverPromotion(promotion(), {
      enabled: true,
      webhookUrl: "https://hooks.example.com/x",
      webhookSecret: "secret",
      paidPartnershipSupported: true,
      fetchImpl,
    });
    expect(again.status).toBe("already_delivered");
  });
});
