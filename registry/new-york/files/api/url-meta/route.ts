import { NextResponse } from "next/server";
import getMetaFromUrl from "@/registry/new-york/lib/get-meta-from-url";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
  const meta = await getMetaFromUrl({ url });
  return NextResponse.json(meta, { headers: { "Cache-Control": "max-age=0, s-maxage=3600" } });
}
