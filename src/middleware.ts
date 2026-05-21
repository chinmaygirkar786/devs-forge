import { type NextRequest, NextResponse } from "next/server";

import {
  chunkResponseHeaders,
  isAllowedChunkRequest,
  isProtectedChunkPath,
} from "@/lib/chunk-access-guard";
import {
  isAllowedMetadataImageRequest,
  isProtectedMetadataImagePath,
} from "@/lib/metadata-image-access-guard";

/** App-internal assets that should not be opened as standalone pages in a browser tab. */
const PROTECTED_EXACT_PATHS = new Set([
  "/sw.js",
  "/manifest.webmanifest",
  "/apple-icon",
  "/icon",
  "/favicon.ico",
]);

function isProtectedAssetPath(pathname: string) {
  return (
    PROTECTED_EXACT_PATHS.has(pathname) || pathname.startsWith("/pwa/icon-")
  );
}

/** True when someone opened the URL in a browser tab (not a PWA / SW fetch). */
function isDirectBrowserNavigation(request: NextRequest) {
  const fetchDest = request.headers.get("sec-fetch-dest") ?? "";
  const fetchMode = request.headers.get("sec-fetch-mode") ?? "";

  if (fetchDest === "document" || fetchDest === "iframe") {
    return true;
  }

  if (fetchMode === "navigate") {
    const pwaFetchDests = new Set([
      "manifest",
      "worker",
      "serviceworker",
      "script",
    ]);
    return !pwaFetchDests.has(fetchDest);
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/cdn-cgi/rum") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedMetadataImagePath(pathname)) {
    if (!isAllowedMetadataImageRequest(request)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedChunkPath(pathname)) {
    if (!isAllowedChunkRequest(request)) {
      return new NextResponse(null, {
        status: 403,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set("Vary", chunkResponseHeaders.vary);
    return response;
  }

  if (!isProtectedAssetPath(pathname)) {
    return NextResponse.next();
  }

  if (isDirectBrowserNavigation(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cdn-cgi/rum",
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
