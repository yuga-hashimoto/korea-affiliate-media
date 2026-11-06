import { mkdir, readFile, rename, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";

/**
 * ローカル永続化（MVP）。本番ではPostgres/Cloud Storageに置き換える。
 * 既定の保存先はリポジトリ外扱いの var/ で、Gitにはコミットしない。
 */
export function dataDir(): string {
  return process.env.DATA_DIR ?? path.join(process.cwd(), "var");
}

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function readJsonFile<T>(relativePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(path.join(dataDir(), relativePath), "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeJsonAtomic(
  relativePath: string,
  value: unknown,
): Promise<void> {
  const target = path.join(dataDir(), relativePath);
  await ensureDir(path.dirname(target));
  const tmp = `${target}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(tmp, target);
}

export async function appendJsonl(
  relativePath: string,
  record: unknown,
): Promise<void> {
  const target = path.join(dataDir(), relativePath);
  await ensureDir(path.dirname(target));
  await appendFile(target, `${JSON.stringify(record)}\n`, "utf8");
}

export async function readJsonl<T>(relativePath: string): Promise<T[]> {
  try {
    const raw = await readFile(path.join(dataDir(), relativePath), "utf8");
    return raw
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as T];
        } catch {
          return [];
        }
      });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
