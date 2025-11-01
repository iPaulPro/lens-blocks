import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const { pathname } = url;

  const isComponentJson = pathname.startsWith("/r/") && pathname.endsWith(".json");
  if (!isComponentJson) return NextResponse.next();

  if (req.method !== "GET") return NextResponse.next();

  const range = req.headers.get("range");
  const purpose = req.headers.get("purpose");
  if (range || purpose === "prefetch") return NextResponse.next();

  const component = pathname.match(/^\/r\/(.+)\.json$/)?.[1] ?? "unknown";
  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  console.log(
    JSON.stringify({
      event: "shadcn_registry_install",
      component,
      ua,
      ip,
      ts: new Date().toISOString(),
    }),
  );

  return NextResponse.next();
}

export const config = {
  matcher: ["/r/:path*.json"],
};
