/**
 * 許諾済みフィードの取り込み。既定は停止（INGESTION_ENABLED=false）。
 */
import { runIngestion } from "../src/lib/ingestion/connector";
import { writeJsonAtomic } from "../src/lib/store";

async function main(): Promise<void> {
  const allowedHosts = (process.env.INGESTION_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

  const result = await runIngestion({
    enabled: process.env.INGESTION_ENABLED === "true",
    feedUrl: process.env.INGESTION_FEED_URL ?? null,
    allowedHosts,
  });

  await writeJsonAtomic("ingestion/last-run.json", {
    at: new Date().toISOString(),
    ...result,
  });

  console.log(JSON.stringify(result, null, 2));
  if (result.status === "error") process.exitCode = 1;
}

main().catch((error) => {
  console.error("[ingestion] fatal", error);
  process.exitCode = 1;
});
