/**
 * OpenRouter 経由の JSON 生成。キー未設定時は呼び出さない。
 * タイムアウト・429/5xx の指数バックオフを実装する。
 */
export interface OpenRouterRequest {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
}

export class LlmError extends Error {
  constructor(
    message: string,
    readonly retryable: boolean,
  ) {
    super(message);
    this.name = "LlmError";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callOpenRouterJson(
  request: OpenRouterRequest,
  options: { fetchImpl?: typeof fetch; retries?: number } = {},
): Promise<unknown> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const retries = options.retries ?? 3;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (attempt > 0) {
      const backoff = 500 * 2 ** (attempt - 1) + Math.floor(Math.random() * 250);
      await sleep(backoff);
    }

    let response: Response;
    try {
      response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${request.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://sougakuhikaku.com",
          "X-Title": "sougakuhikaku-content-bot",
        },
        body: JSON.stringify({
          model: request.model,
          messages: [
            { role: "system", content: request.system },
            { role: "user", content: request.user },
          ],
          temperature: 0.2,
          max_tokens: request.maxTokens ?? 2000,
          response_format: { type: "json_object" },
        }),
        signal: AbortSignal.timeout(60_000),
      });
    } catch (error) {
      if (attempt === retries) {
        throw new LlmError(
          `OpenRouter request failed: ${error instanceof Error ? error.message : "unknown"}`,
          true,
        );
      }
      continue;
    }

    if (response.status === 429 || response.status >= 500) {
      if (attempt === retries) {
        throw new LlmError(`OpenRouter returned ${response.status}`, true);
      }
      continue;
    }
    if (!response.ok) {
      throw new LlmError(`OpenRouter returned ${response.status}`, false);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new LlmError("OpenRouter returned empty content", false);
    }
    try {
      return JSON.parse(content);
    } catch {
      throw new LlmError("OpenRouter returned non-JSON content", false);
    }
  }

  throw new LlmError("OpenRouter retries exhausted", true);
}
