import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { demoDb } from "./demo";
import { emptyDb, type TkaDb } from "./types";

const DEFAULT_FILE = path.join(process.cwd(), "data", "tka-store.json");
const VERCEL_TMP = "/tmp/pilar-tka-store.json";

export function usesPostgres(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
}

function filePath(): string {
  if (process.env.TKA_STORE_PATH) return process.env.TKA_STORE_PATH;
  if (process.env.VERCEL) return VERCEL_TMP;
  return DEFAULT_FILE;
}

export function persistToDisk(): boolean {
  if (process.env.TKA_STORE_PATH) return true;
  if (process.env.VITEST) return false;
  return true;
}

export function parseDb(raw: unknown): TkaDb {
  const parsed = (raw && typeof raw === "object" ? raw : {}) as Partial<TkaDb>;
  return {
    profiles: parsed.profiles ?? emptyDb().profiles,
    daily: parsed.daily ?? [],
    lessons: parsed.lessons ?? [],
    tryouts: parsed.tryouts ?? [],
    mastery: parsed.mastery ?? {},
    otps: parsed.otps ?? {},
    events: parsed.events ?? [],
  };
}

export function mergeWithDemo(saved: TkaDb, seed: TkaDb = demoDb()): TkaDb {
  return {
    profiles: { ...seed.profiles, ...saved.profiles },
    daily: saved.daily,
    lessons: saved.lessons,
    tryouts: saved.tryouts,
    mastery: { ...seed.mastery, ...saved.mastery },
    otps: { ...seed.otps, ...saved.otps },
    events: saved.events.length ? saved.events : seed.events,
  };
}

async function readFileStore(): Promise<TkaDb> {
  try {
    const raw = await readFile(filePath(), "utf8");
    return parseDb(JSON.parse(raw) as unknown);
  } catch {
    return emptyDb();
  }
}

async function writeFileStore(db: TkaDb): Promise<void> {
  const file = filePath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(db), "utf8");
}

async function withSql<T>(fn: (sql: import("postgres").Sql) => Promise<T>): Promise<T> {
  const postgres = (await import("postgres")).default;
  const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
  try {
    return await fn(sql);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function readPostgres(): Promise<TkaDb> {
  return withSql(async (sql) => {
    await sql`CREATE TABLE IF NOT EXISTS pilar_tka_store (
      id text PRIMARY KEY,
      data jsonb NOT NULL
    )`;
    const rows = await sql<{ data: unknown }[]>`
      SELECT data FROM pilar_tka_store WHERE id = 'main'
    `;
    return parseDb(rows[0]?.data);
  });
}

async function writePostgres(db: TkaDb): Promise<void> {
  await withSql(async (sql) => {
    await sql`CREATE TABLE IF NOT EXISTS pilar_tka_store (
      id text PRIMARY KEY,
      data jsonb NOT NULL
    )`;
    await sql`
      INSERT INTO pilar_tka_store (id, data)
      VALUES ('main', ${sql.json(db as never)})
      ON CONFLICT (id) DO UPDATE SET data = excluded.data
    `;
  });
}

async function readDisk(): Promise<TkaDb> {
  if (usesPostgres()) {
    try {
      return await readPostgres();
    } catch {
      return readFileStore();
    }
  }
  return readFileStore();
}

async function writeDisk(db: TkaDb): Promise<void> {
  if (usesPostgres()) {
    try {
      await writePostgres(db);
      return;
    } catch {
      await writeFileStore(db);
      return;
    }
  }
  await writeFileStore(db);
}

let mem: TkaDb | null = null;
let chain: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function loadOnce(): Promise<TkaDb> {
  if (mem) return mem;
  if (!persistToDisk()) {
    mem = structuredClone(demoDb());
    return mem;
  }
  mem = mergeWithDemo(await readDisk());
  return mem;
}

export function resetStoreForTests(): void {
  mem = null;
}

export async function mutateStore<T>(fn: (db: TkaDb) => T | Promise<T>): Promise<T> {
  return withLock(async () => {
    const db = await loadOnce();
    const result = await fn(db);
    if (persistToDisk()) await writeDisk(db);
    return result;
  });
}

export async function readStore(): Promise<TkaDb> {
  return withLock(async () => loadOnce());
}
