import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { emptyDb, type TkaDb } from "./types";

const FILE = path.join(process.cwd(), "data", "tka-store.json");
const TMP_FILE = "/tmp/pilar-tka-store.json";

function storePath(): string {
  return process.env.VERCEL ? TMP_FILE : FILE;
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

async function readDisk(): Promise<TkaDb> {
  try {
    const raw = await readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw) as TkaDb;
    return {
      profiles: parsed.profiles ?? {},
      daily: parsed.daily ?? [],
      lessons: parsed.lessons ?? [],
      tryouts: parsed.tryouts ?? [],
      mastery: parsed.mastery ?? {},
      otps: parsed.otps ?? {},
    };
  } catch {
    return emptyDb();
  }
}

async function writeDisk(db: TkaDb): Promise<void> {
  const file = storePath();
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(db), "utf8");
}

export async function mutateStore<T>(fn: (db: TkaDb) => T | Promise<T>): Promise<T> {
  return withLock(async () => {
    mem = await readDisk();
    const result = await fn(mem);
    await writeDisk(mem);
    return result;
  });
}

export async function readStore(): Promise<TkaDb> {
  return withLock(async () => {
    mem = await readDisk();
    return mem;
  });
}
