// src/lib/spotify.ts
import { Buffer } from "node:buffer";
import type { Spec, SpotifyTrack, AppTrack } from "./types";

const ACCOUNTS = "https://accounts.spotify.com";
const API = "https://api.spotify.com/v1";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const CID = requireEnv("SPOTIFY_CLIENT_ID");
const SECRET = requireEnv("SPOTIFY_CLIENT_SECRET");

const bearer = (t: string) => ({ Authorization: `Bearer ${t}` });
async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "<no body>";
  }
}

// ---------------- Token (client credentials) ----------------
let APP_TOKEN: { value: string; exp: number } | null = null;

export async function getAppToken(): Promise<string> {
  const now = Date.now();
  if (APP_TOKEN && now < APP_TOKEN.exp - 10_000) return APP_TOKEN.value;

  const res = await fetch(`${ACCOUNTS}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${CID}:${SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`token error ${res.status}: ${await safeText(res)}`);
  }

  const json = await res.json();
  APP_TOKEN = {
    value: json.access_token,
    exp: Date.now() + json.expires_in * 1000,
  };
  return APP_TOKEN.value;
}

// ---------------- Helpers ----------------
const DEFAULT_MARKET = "US"; // change to "CA" if you prefer

// Supports both shapes: seeds: string[]  OR  seeds: { genres?: string[] }
function normalizeSeeds(spec: Spec): string[] {
  const s: any = spec.seeds;
  return Array.isArray(s) ? s : s?.genres ?? [];
}

function dedupeById<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      out.push(item);
    }
  }
  return out;
}

// ---------------- Search primitives ----------------

async function searchTracks(
  token: string,
  query: string,
  opts?: { market?: string; limit?: number }
): Promise<AppTrack[]> {
  const url = new URL(`${API}/search`);
  url.search = new URLSearchParams({
    q: query,
    type: "track",
    market: opts?.market ?? DEFAULT_MARKET,
    limit: String(Math.min(opts?.limit ?? 25, 50)),
  }).toString();

  const res = await fetch(url, {
    headers: { ...bearer(token), Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[searchTracks]",
      res.status,
      await safeText(res),
      "\nurl:",
      url.toString()
    );
    return [];
  }

  const json: any = await res.json();
  const items: SpotifyTrack[] = json?.tracks?.items ?? [];
  return items.map((t) => ({
    id: t.id,
    uri: t.uri,
    name: t.name,
    artists: (t.artists ?? []).map((a: any) => a.name).join(", "),
    albumArt: t.album.images[1]?.url ?? "", // medium-sized album art,
  }));
}

// Build short, genre-flavored queries from Spec
function buildQueries(spec: Spec): string[] {
  const seeds = normalizeSeeds(spec);
  const qs: string[] = [];

  if (seeds.length) {
    for (const g of seeds.slice(0, 3)) {
      qs.push(`${g} instrumental`, `${g} playlist`, `${g} vibes`);
    }
  } else {
    // safe defaults
    qs.push("chill instrumental", "ambient", "indie chill");
  }
  // unique & capped
  return Array.from(new Set(qs)).slice(0, 6);
}

// ---------------- Public: search-based recommendations ----------------
export async function recommendTracksViaSearch(
  token: string,
  spec: Spec,
  opts?: { market?: string }
): Promise<AppTrack[]> {
  const queries = buildQueries(spec);
  const market = opts?.market ?? DEFAULT_MARKET;
  const target = Math.min(spec.targetTracks ?? 30, 100);

  const buckets: AppTrack[][] = [];
  for (const q of queries) {
    const tracks = await searchTracks(token, q, {
      market,
      limit: Math.min(target, 25),
    });
    buckets.push(tracks);
  }

  // round-robin merge to mix buckets
  const merged: AppTrack[] = [];
  let i = 0;
  while (merged.length < target) {
    let added = false;
    for (const b of buckets) {
      if (i < b.length) {
        merged.push(b[i]);
        added = true;
        if (merged.length >= target) break;
      }
    }
    if (!added) break; // all buckets exhausted
    i++;
  }

  return dedupeById(merged).slice(0, target);
}

// Optional: keep old name working if your route still imports recommendTracks()
export async function recommendTracks(
  token: string,
  spec: Spec,
  opts?: { market?: string }
): Promise<AppTrack[]> {
  return recommendTracksViaSearch(token, spec, opts);
}
