import { NextResponse } from "next/server";
import { sentenceToSpec } from "@/src/lib/parser";
import {
  getAppToken,
  recommendTracks,
  getAudioFeatures,
} from "@/src/lib/spotify";

export async function POST(req: Request) {
  const { sentence } = await req.json();
  if (!sentence || typeof sentence !== "string") {
    return NextResponse.json({ error: "sentence required" }, { status: 400 });
  }

  const spec = sentenceToSpec(sentence);
  const token = await getAppToken();
  const recs = await recommendTracks(token, spec);
  const feats = await getAudioFeatures(
    token,
    recs.map((r) => r.id)
  );
  const byId = Object.fromEntries(feats.map((f: any) => [f.id, f]));

  const tracks = recs.map((t) => ({
    id: t.id,
    name: t.name,
    artists: t.artists,
    features: byId[t.id]
      ? {
          tempo: byId[t.id].tempo,
          energy: byId[t.id].energy,
          valence: byId[t.id].valence,
        }
      : undefined,
  }));

  return NextResponse.json({ spec, tracks });
}
