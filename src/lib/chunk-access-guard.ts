import { isSearchCrawler } from "@/lib/route-access-policy";

export function isProtectedChunkPath(pathname: string) {
  return (
    pathname.startsWith("/_next/static/chunks/") &&
    (pathname.endsWith(".js") || pathname.endsWith(".js.map"))
  );
}

/**
 * Allow only in-page <script> loads from this origin.
 * No referer fallback — that let browser tab visits show bundle source.
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

  if (
    fetchDest === "document" ||
    fetchDest === "iframe" ||
    fetchMode === "navigate"
  ) {
    return false;
  }

  return (
    fetchDest === "script" &&
    (fetchSite === "same-origin" || fetchSite === "same-site") &&
    (fetchMode === "no-cors" || fetchMode === "cors")
  );
}

export const chunkResponseHeaders = {
  vary: "Sec-Fetch-Dest, Sec-Fetch-Site, Sec-Fetch-Mode",
} as const;
