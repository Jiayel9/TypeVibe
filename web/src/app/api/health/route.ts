// This file is just to test that the api is working! That's why it'll just return true

import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok: true });
}
