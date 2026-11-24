/**
 * Buffer GraphQL API クライアント（X投稿の下書き作成・予約投稿）。
 *
 * 設計方針:
 * - 公式 API は GraphQL（`https://api.buffer.com`）。認証は `Authorization: Bearer <token>`。
 * - X の Paid Partnership 開示は Buffer API では設定できない（`TwitterPostMetadataInput` に該当フィールドが無い）。
 *   そのため本文に PR 表記を必ず入れ、開示設定が必要な場合は Buffer UI で人が確認する。
 * - トークンは `.env.local`（Git管理外）に置き、ログや例外メッセージに出さない。
 */

const DEFAULT_ENDPOINT = "https://api.buffer.com";
const MAX_TEXT_LENGTH = 280;
const NON_PUBLIC_HOST = /https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?/i;

export interface BufferConfig {
  accessToken: string;
  organizationId: string;
  xChannelId: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
}

export type BufferDraftResult =
  | { status: "created"; postId: string | null }
  | { status: "skipped_duplicate"; postId: string }
  | { status: "blocked"; reason: string }
  | { status: "failed"; reason: string };

export type BufferScheduleResult =
  | { status: "scheduled"; postId: string | null; dueAt: string }
  | { status: "blocked"; reason: string }
  | { status: "failed"; reason: string };

interface GraphQlResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

interface PostNode {
  id: string;
  status: string;
  text: string | null;
  dueAt?: string | null;
}

interface PostsQuery {
  posts: { edges: { node: PostNode }[] };
}

/** 環境変数から設定を読む。1つでも欠ければ null（＝安全に停止）。 */
export function bufferConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): BufferConfig | null {
  const accessToken = env.BUFFER_ACCESS_TOKEN?.trim();
  const organizationId = env.BUFFER_ORGANIZATION_ID?.trim();
  const xChannelId = env.BUFFER_X_CHANNEL_ID?.trim();
  if (!accessToken || !organizationId || !xChannelId) return null;
  return { accessToken, organizationId, xChannelId };
}

/**
 * 投稿本文の事前チェック。問題があれば理由を返す（null なら OK）。
 * localhost などの非公開URLは、そのまま投稿すると404リンクになるため弾く。
 */
export function checkPostableText(text: string): string | null {
  if (text.trim().length === 0) return "本文が空です";
  if (text.length > MAX_TEXT_LENGTH) {
    return `280文字を超えています（${text.length}文字）`;
  }
  if (NON_PUBLIC_HOST.test(text)) {
    return "公開URLではないリンク（localhost等）が含まれています";
  }
  return null;
}

async function gql<T>(
  config: BufferConfig,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<GraphQlResponse<T>> {
  const fetchImpl = config.fetchImpl ?? fetch;
  const response = await fetchImpl(config.endpoint ?? DEFAULT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(30_000),
  });
  const json = (await response.json()) as GraphQlResponse<T>;
  if (!response.ok && !json.errors) {
    throw new Error(`Buffer API HTTP ${response.status}`);
  }
  return json;
}

async function postNodes(config: BufferConfig): Promise<PostNode[]> {
  const res = await gql<PostsQuery>(
    config,
    `query Posts($org: OrganizationId!) {
       posts(input: { organizationId: $org }) {
         edges { node { id status text dueAt } }
       }
     }`,
    { org: config.organizationId },
  );
  if (res.errors?.length) {
    throw new Error(res.errors.map((error) => error.message).join(" / "));
  }
  return (res.data?.posts.edges ?? []).map((edge) => edge.node);
}

/** 既存の下書きを取得する（重複作成の防止に使う）。 */
export async function listDrafts(
  config: BufferConfig,
): Promise<{ id: string; text: string }[]> {
  return (await postNodes(config))
    .filter((node) => node.status === "draft" && node.text !== null)
    .map((node) => ({ id: node.id, text: node.text ?? "" }));
}

/**
 * Buffer にX投稿の下書きを作る。公開はしない（人間がBufferで確認して投稿する）。
 */
export async function createDraftPost(
  text: string,
  config: BufferConfig,
): Promise<BufferDraftResult> {
  const issue = checkPostableText(text);
  if (issue) return { status: "blocked", reason: issue };

  let drafts: { id: string; text: string }[];
  try {
    drafts = await listDrafts(config);
  } catch (error) {
    return { status: "failed", reason: `下書き一覧の取得に失敗: ${toMessage(error)}` };
  }

  const normalized = text.trim();
  const duplicate = drafts.find((draft) => draft.text.trim() === normalized);
  if (duplicate) return { status: "skipped_duplicate", postId: duplicate.id };

  try {
    const res = await gql<{ createPost?: { __typename: string } }>(
      config,
      `mutation CreateDraft($input: CreatePostInput!) {
         createPost(input: $input) { __typename }
       }`,
      {
        input: {
          channelId: config.xChannelId,
          text,
          mode: "addToQueue",
          schedulingType: "automatic",
          saveToDraft: true,
        },
      },
    );
    if (res.errors?.length) {
      return { status: "failed", reason: res.errors.map((e) => e.message).join(" / ") };
    }
    const typename = res.data?.createPost?.__typename ?? "unknown";
    if (typename !== "PostActionSuccess") {
      return { status: "failed", reason: `Buffer が受理しませんでした（${typename}）` };
    }
    const after = await listDrafts(config).catch(() => []);
    const created = after.find((draft) => draft.text.trim() === normalized);
    return { status: "created", postId: created?.id ?? null };
  } catch (error) {
    return { status: "failed", reason: toMessage(error) };
  }
}

/** すでに予約済みの公開時刻（ISO文字列）を返す。同じ枠に重ねないために使う。 */
export async function listScheduledSlots(
  config: BufferConfig,
): Promise<string[]> {
  return (await postNodes(config))
    .filter((node) => node.status === "scheduled" || node.status === "buffer")
    .map((node) => node.dueAt ?? "")
    .filter((dueAt) => dueAt.length > 0);
}

/**
 * Buffer に予約投稿する（`dueAt` に公開される）。
 * 事前チェックは下書き作成と同じ。過去の時刻は受け付けない。
 */
export async function schedulePost(
  text: string,
  config: BufferConfig,
  dueAt: Date,
): Promise<BufferScheduleResult> {
  const issue = checkPostableText(text);
  if (issue) return { status: "blocked", reason: issue };
  if (Number.isNaN(dueAt.getTime())) {
    return { status: "blocked", reason: "公開予定時刻が不正です" };
  }
  if (dueAt.getTime() <= Date.now()) {
    return { status: "blocked", reason: "公開予定時刻が過去です" };
  }

  const iso = dueAt.toISOString();
  const normalized = text.trim();

  try {
    const res = await gql<{ createPost?: { __typename: string } }>(
      config,
      `mutation SchedulePost($input: CreatePostInput!) {
         createPost(input: $input) { __typename }
       }`,
      {
        input: {
          channelId: config.xChannelId,
          text,
          mode: "customScheduled",
          schedulingType: "automatic",
          dueAt: iso,
        },
      },
    );
    if (res.errors?.length) {
      return { status: "failed", reason: res.errors.map((e) => e.message).join(" / ") };
    }
    const typename = res.data?.createPost?.__typename ?? "unknown";
    if (typename !== "PostActionSuccess") {
      return { status: "failed", reason: `Buffer が受理しませんでした（${typename}）` };
    }
    const posts = await postNodes(config).catch(() => []);
    const created = posts.find((post) => (post.text ?? "").trim() === normalized);
    return { status: "scheduled", postId: created?.id ?? null, dueAt: iso };
  } catch (error) {
    return { status: "failed", reason: toMessage(error) };
  }
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
