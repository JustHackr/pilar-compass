import { demoDb } from "./demo";
import { emptyDb, type TkaDb } from "./types";

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

function loadDemo(): TkaDb {
  return structuredClone(demoDb());
}

export function resetStoreForTests(): void {
  mem = null;
}

export async function mutateStore<T>(fn: (db: TkaDb) => T | Promise<T>): Promise<T> {
  return withLock(async () => {
    mem ??= loadDemo();
    return fn(mem);
  });
}

export async function readStore(): Promise<TkaDb> {
  return withLock(async () => {
    mem ??= loadDemo();
    return mem;
  });
}
