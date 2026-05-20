import { type NextRequest, NextResponse } from "next/server";

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
    const pwaFetchDests = new Set(["manifest", "worker", "serviceworker", "script"]);
    return !pwaFetchDests.has(fetchDest);
  }

  return false;
}

export function middleware(request: NextRequest) {
  if (!isProtectedAssetPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (isDirectBrowserNavigation(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sw.js",
    "/manifest.webmanifest",
    "/apple-icon",
    "/icon",
    "/favicon.ico",
    "/pwa/icon-192",
    "/pwa/icon-512",
    "/pwa/icon-512-maskable",
  ],
};
