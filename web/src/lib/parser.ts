import type { Spec } from "./types";

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\s\-&]+/g, "")
    .replace(/[^a-z0-9]/g, "");
const LOOKUP: Record<string, string> = {
  lofi: "chill",
  hiphop: "hip-hop",
  randb: "r-n-b",
  edm: "edm",
  electronic: "electronic",
  dance: "electronic",
  jazz: "jazz",
  rock: "rock",
  house: "house",
  pop: "pop",
  classical: "classical",
  country: "country",
  ambient: "ambient",
  chill: "chill",
  indie: "indie",
  techno: "techno",
};
const SAFE = new Set(Object.values(LOOKUP));

export function sentenceToSpec(input: string): Spec {
  const text = input.toLowerCase();
  const spec: Spec = { seeds: { genres: [] }, features: {} };

  let minutes = 0;
  const h = text.match(/(\d+(?:\.\d+)?)\s*h/);
  const m = text.match(/(\d+(?:\.\d+)?)\s*m/);
  if (h) minutes += Math.round(parseFloat(h[1]) * 60);
  if (m) minutes += Math.round(parseFloat(m[1]));
  if (!minutes && /\bhalf an hour\b/.test(text)) minutes = 30;
  if (minutes > 0) spec.minutes = minutes;

  spec.targetTracks = Math.ceil((spec.minutes ?? 60) / 3.2);

  const n = norm(input);
  const found = new Set<string>();
  for (const key in LOOKUP)
    if (n.includes(key)) {
      const seed = LOOKUP[key];
      if (SAFE.has(seed)) found.add(seed);
    }
  if (found.size) spec.seeds.genres = Array.from(found);

  return spec;
}
