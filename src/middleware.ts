import { type NextRequest, NextResponse } from "next/server";

import {
  chunkResponseHeaders,
  isAllowedChunkRequest,
  isProtectedChunkPath,
} from "@/lib/chunk-access-guard";
import { getInternalRouteDenyReason } from "@/lib/route-access-policy";

function denyInternalRoute(request: NextRequest, reason: "redirect" | "forbidden") {
  if (reason === "redirect") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return new NextResponse(null, {
    status: 403,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/cdn-cgi/rum") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const denyReason = getInternalRouteDenyReason(pathname, request);

  if (denyReason) {
    return denyInternalRoute(request, denyReason);
  }

  if (isProtectedChunkPath(pathname)) {
    if (!isAllowedChunkRequest(request)) {
      return denyInternalRoute(request, "forbidden");
    }

    const response = NextResponse.next();
    response.headers.set("Vary", chunkResponseHeaders.vary);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cdn-cgi/rum",
    "/robots.txt",
    "/sitemap.xml",
    "/BUILD_ID",
    "/_routes.json",
    "/_redirects",
    "/opengraph-image",
    "/sw.js",
    "/manifest.webmanifest",
    "/apple-icon",
    "/icon",
    "/favicon.ico",
    "/pwa/icon-192",
    "/pwa/icon-512",
    "/pwa/icon-512-maskable",
    "/_next/static/chunks/:path*",
  ],
};
