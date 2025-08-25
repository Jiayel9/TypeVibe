// src/app / api / generate / route.ts;
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sentenceToSpec } from "@/lib/parser";
import { getAppToken, recommendTracksViaSearch } from "@/lib/spotify";

export async function POST(req: Request) {
  try {
    const { sentence } = await req.json();
    if (!sentence || typeof sentence !== "string") {
      return NextResponse.json({ error: "sentence required" }, { status: 400 });
    }

    const spec = sentenceToSpec(sentence);
    const token = await getAppToken();
    const tracks = await recommendTracksViaSearch(token, spec, {
      market: "US",
    });

    return NextResponse.json({ spec, tracks }, { status: 200 }); // Return object includes spec and tracks
  } catch (e: any) {
    console.error("/api/generate error:", e);
    return NextResponse.json(
      { error: "internal error", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
