import { isSearchCrawler } from "@/lib/route-access-policy";

export function isProtectedChunkPath(pathname: string) {
  return (
    pathname.startsWith("/_next/static/chunks/") &&
    (pathname.endsWith(".js") || pathname.endsWith(".js.map"))
  );
}

function isSameOriginReferer(referer: string, origin: string) {
  try {
    return new URL(referer).origin === origin;
  } catch {
    return false;
  }
}

/**
 * Allow in-page script/module loads from this origin.
 * Blocks opening chunk URLs directly in the browser tab (document navigation).
 */
export function isAllowedChunkRequest(request: Request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return false;
  }

  const userAgent = request.headers.get("user-agent") ?? "";

  if (isSearchCrawler(userAgent)) {
    return true;
  }

  const fetchDest = request.headers.get("sec-fetch-dest") ?? "";
  const fetchSite = request.headers.get("sec-fetch-site") ?? "";
  const fetchMode = request.headers.get("sec-fetch-mode") ?? "";
  const accept = request.headers.get("accept") ?? "";
  const referer = request.headers.get("referer") ?? "";
  const origin = new URL(request.url).origin;

  if (fetchDest === "document" || fetchDest === "iframe" || fetchMode === "navigate") {
    return false;
  }

  const sameSite = fetchSite === "same-origin" || fetchSite === "same-site";
  const allowedMode = fetchMode === "no-cors" || fetchMode === "cors";

  // Classic <script src="..."> chunk loads
  if (fetchDest === "script" && sameSite && allowedMode) {
    return true;
  }

  // dynamic import() / modulepreload — Chrome sends dest "empty", not "script"
  if (fetchDest === "empty" && fetchMode === "cors" && sameSite) {
    return true;
  }

  // Some clients omit Sec-Fetch-*; allow only when clearly requesting JS from our pages
  if (
    !fetchDest &&
    !fetchMode &&
    (accept.includes("application/javascript") ||
      accept.includes("text/javascript") ||
      accept.includes("*/*")) &&
    isSameOriginReferer(referer, origin)
  ) {
    return true;
  }

  return false;
}

export const chunkResponseHeaders = {
  vary: "Sec-Fetch-Dest, Sec-Fetch-Site, Sec-Fetch-Mode",
} as const;
