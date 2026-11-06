/**
 * 為替レートの更新。認可されたAPIが設定されるまで安全に停止する。
 * 取得値は var/fx/latest.json に保存し、src/data/fx.ts のサンプル値は書き換えない。
 */
import { z } from "zod";
import { FxRateSchema } from "../src/lib/domain";
import { writeJsonAtomic } from "../src/lib/store";

const PayloadSchema = z.object({ rates: z.array(z.unknown()) });

async function main(): Promise<void> {
  const apiUrl = process.env.FX_API_URL;
  const apiKey = process.env.FX_API_KEY;
  const allowedHosts = (process.env.FX_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

  if (!apiUrl) {
    console.log(
      "[fx] FX_API_URL が未設定のため停止します。サンプルレートは表示検証専用です。",
    );
    return;
  }

  const url = new URL(apiUrl);
  if (url.protocol !== "https:" || !allowedHosts.includes(url.hostname)) {
    throw new Error(`許可されていないFX APIです: ${url.hostname}`);
  }

  const response = await fetch(url, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`FX API error: HTTP ${response.status}`);

  const payload = PayloadSchema.parse(await response.json());
  const rates = payload.rates.map((item) => FxRateSchema.parse(item));
  await writeJsonAtomic("fx/latest.json", {
    fetchedAt: new Date().toISOString(),
    source: url.toString(),
    rates,
  });
  console.log(`[fx] ${rates.length}件のレートを保存しました。`);
}

main().catch((error) => {
  console.error("[fx] fatal", error);
  process.exitCode = 1;
});
