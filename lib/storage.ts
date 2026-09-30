/**
 * Almacenamiento de leads, límite de peticiones por IP y control de duplicados.
 *
 * Funciona en dos modos, elegidos automáticamente:
 *  - Upstash Redis (si existen las variables UPSTASH_REDIS_REST_URL/TOKEN o KV_REST_API_URL/TOKEN):
 *    persistente y compartido entre instancias. Es el modo recomendado en Vercel.
 *  - Local (sin variables): guarda en data/leads.json y lleva el límite de peticiones en memoria.
 *    Ideal para desarrollo. En Vercel usa /tmp, que NO es persistente (ver README).
 */
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { LeadInput } from "@/lib/validation";

export type LeadStatus = "new" | "contacted" | "closed";

export type Lead = LeadInput & {
  id: string;
  createdAt: string;
  status: LeadStatus;
};

export const RATE_LIMIT = { max: 5, windowSeconds: 10 * 60 }; // 5 envíos cada 10 minutos por IP
export const DUPLICATE_WINDOW_SECONDS = 24 * 60 * 60; // mismo email: 1 envío cada 24 h

// ---------- Upstash Redis (API REST, sin dependencias) ----------

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
export const storageMode: "redis" | "local" = REDIS_URL && REDIS_TOKEN ? "redis" : "local";

async function redis<T = unknown>(command: (string | number)[]): Promise<T> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || json.error) throw new Error(`Redis: ${json.error ?? res.status}`);
  return json.result as T;
}

// ---------- Modo local ----------

const LOCAL_FILE = process.env.VERCEL
  ? path.join("/tmp", "leads.json")
  : path.join(process.cwd(), "data", "leads.json");

async function readLocalLeads(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as Lead[];
  } catch {
    return [];
  }
}

async function writeLocalLeads(leads: Lead[]) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(leads, null, 2), "utf8");
}

const memoryHits = new Map<string, { count: number; resetAt: number }>();

// ---------- API pública ----------

/** Devuelve true si la IP todavía puede enviar; false si superó el límite. */
export async function checkRateLimit(ip: string): Promise<boolean> {
  if (storageMode === "redis") {
    const key = `ratelimit:contact:${ip}`;
    const count = await redis<number>(["INCR", key]);
    if (count === 1) await redis(["EXPIRE", key, RATE_LIMIT.windowSeconds]);
    return count <= RATE_LIMIT.max;
  }

  const now = Date.now();
  const entry = memoryHits.get(ip);
  if (!entry || entry.resetAt < now) {
    memoryHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowSeconds * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= RATE_LIMIT.max;
}

/**
 * Guarda el lead. Si el mismo email ya envió una solicitud en las últimas 24 h,
 * no guarda nada y devuelve { ok: false, reason: "duplicate" }.
 */
export async function createLead(
  input: LeadInput,
): Promise<{ ok: true; lead: Lead } | { ok: false; reason: "duplicate" }> {
  const lead: Lead = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), status: "new" };

  if (storageMode === "redis") {
    const dedupeKey = `lead:email:${input.email}`;
    const reserved = await redis<string | null>(["SET", dedupeKey, lead.id, "NX", "EX", DUPLICATE_WINDOW_SECONDS]);
    if (reserved !== "OK") return { ok: false, reason: "duplicate" };
    try {
      await redis(["LPUSH", "leads", JSON.stringify(lead)]);
    } catch (error) {
      await redis(["DEL", dedupeKey]).catch(() => {});
      throw error;
    }
    return { ok: true, lead };
  }

  const leads = await readLocalLeads();
  const since = Date.now() - DUPLICATE_WINDOW_SECONDS * 1000;
  const duplicate = leads.some((l) => l.email === input.email && Date.parse(l.createdAt) > since);
  if (duplicate) return { ok: false, reason: "duplicate" };

  leads.unshift(lead);
  await writeLocalLeads(leads);
  return { ok: true, lead };
}
