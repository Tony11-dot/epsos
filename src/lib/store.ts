import "server-only";
import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { SiteContent } from "./types";
import { seedContent } from "./seed";

// ─────────────────────────────────────────────────────────────────────────
// Swappable content store.
//   STORE_DRIVER=local  → JSON file at content/data.json (default, dev)
//   STORE_DRIVER=redis  → Upstash Redis REST (production)
// Both expose the same getContent()/saveContent() contract.
// ─────────────────────────────────────────────────────────────────────────

const KEY = "epsos:content";
const DATA_FILE = path.join(process.cwd(), "content", "data.json");

interface Driver {
  read(): Promise<SiteContent | null>;
  write(content: SiteContent): Promise<void>;
}

// ── Local JSON driver ──────────────────────────────────────────────────────
const localDriver: Driver = {
  async read() {
    try {
      const raw = await fs.readFile(DATA_FILE, "utf8");
      return JSON.parse(raw) as SiteContent;
    } catch {
      return null;
    }
  },
  async write(content) {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2), "utf8");
  },
};

// ── Upstash Redis driver ────────────────────────────────────────────────────
function redisDriver(): Driver {
  let client: import("@upstash/redis").Redis | null = null;
  async function get() {
    if (!client) {
      const { Redis } = await import("@upstash/redis");
      client = Redis.fromEnv();
    }
    return client;
  }
  return {
    async read() {
      const c = await get();
      const val = await c.get<SiteContent>(KEY);
      return val ?? null;
    },
    async write(content) {
      const c = await get();
      await c.set(KEY, content);
    },
  };
}

function pickDriver(): Driver {
  return process.env.STORE_DRIVER === "redis" ? redisDriver() : localDriver;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Deep-merge stored content over the seed. Plain objects recurse (so a newly
 * added nested field — e.g. control.courses — falls back to its seed default
 * even when the parent object was saved before the field existed). Arrays and
 * primitives are taken from the stored value as-is (user edits win, lists
 * replace wholesale). Missing keys fall back to the seed.
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined) return base;
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = deepMerge((base as Record<string, unknown>)[key], override[key]);
    }
    return out as T;
  }
  return override as T;
}

/** Merge stored content over the seed so newly-added fields always have defaults. */
function withDefaults(stored: SiteContent | null): SiteContent {
  if (!stored) return structuredClone(seedContent);
  return deepMerge(structuredClone(seedContent), stored);
}

// Wrapped in React cache(): deduped within a single request/render, but read
// fresh on every new request. This keeps admin edits reflecting live and stays
// correct across serverless instances (no stale long-lived process cache).
export const getContent = cache(async (): Promise<SiteContent> => {
  const driver = pickDriver();
  const stored = await driver.read();
  return withDefaults(stored);
});

export async function saveContent(content: SiteContent): Promise<void> {
  const driver = pickDriver();
  await driver.write(content);
}
