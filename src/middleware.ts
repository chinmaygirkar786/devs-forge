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

function isProtectedChunkPath(pathname: string) {
  return (
    pathname.startsWith("/_next/static/chunks/") &&
    (pathname.endsWith(".js") || pathname.endsWith(".js.map"))
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

/**
 * Only allow chunk files when loaded as scripts from this site (Sec-Fetch-*).
 * Blocks direct URL visits, curl/wget, and cross-site hotlinking.
 */
function isAllowedChunkRequest(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return false;
  }

  const fetchDest = request.headers.get("sec-fetch-dest") ?? "";
  const fetchSite = request.headers.get("sec-fetch-site") ?? "";

  if (
    fetchDest === "script" &&
    (fetchSite === "same-origin" || fetchSite === "same-site")
  ) {
    return true;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return false;
  }

  try {
    return new URL(referer).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/cdn-cgi/rum") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedChunkPath(pathname)) {
    if (!isAllowedChunkRequest(request)) {
      return new NextResponse(null, { status: 403 });
    }

    return NextResponse.next();
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
