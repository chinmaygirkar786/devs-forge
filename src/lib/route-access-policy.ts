/** Search engines that need robots.txt, sitemap.xml, and preview assets. */
const SEARCH_CRAWLER =
  /Googlebot|Google-InspectionTool|Storebot-Google|GoogleOther|bingbot|Applebot|DuckDuckBot|Slurp|Yandex|Baiduspider/i;

/** Social apps that fetch Open Graph images for link previews. */
const SOCIAL_PREVIEW_CRAWLER =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|Pinterest|Embedly/i;

const SEO_DISCOVERY_PATHS = new Set(["/robots.txt", "/sitemap.xml"]);

const BRAND_IMAGE_PATHS = new Set(["/opengraph-image", "/icon", "/apple-icon"]);

/** Address-bar access blocked; crawlers + same-page subresource fetches only. */
const STRICT_CRAWLER_OR_SUBRESOURCE_PATHS = new Set(["/icon", "/manifest.webmanifest"]);

const PWA_INTERNAL_PATHS = new Set(["/sw.js", "/favicon.ico"]);

const DEPLOY_INFRA_PATHS = new Set(["/BUILD_ID", "/_routes.json", "/_redirects"]);

export function isSearchCrawler(userAgent: string) {
  return SEARCH_CRAWLER.test(userAgent);
}

export function isSocialPreviewCrawler(userAgent: string) {
  return SOCIAL_PREVIEW_CRAWLER.test(userAgent);
}

export function isSeoCrawler(userAgent: string) {
  return isSearchCrawler(userAgent) || isSocialPreviewCrawler(userAgent);
}

export function isDirectBrowserNavigation(request: Request) {
  const fetchDest = request.headers.get("sec-fetch-dest") ?? "";
  const fetchMode = request.headers.get("sec-fetch-mode") ?? "";

  if (fetchDest === "document" || fetchDest === "iframe") {
    return true;
  }

  if (fetchMode === "navigate") {
    const allowedFetchDests = new Set(["manifest", "worker", "serviceworker", "script"]);
    return !allowedFetchDests.has(fetchDest);
  }

  return false;
}

export function isSeoDiscoveryPath(pathname: string) {
  return SEO_DISCOVERY_PATHS.has(pathname);
}

export function isBrandImagePath(pathname: string) {
  return BRAND_IMAGE_PATHS.has(pathname);
}

export function isStrictCrawlerOrSubresourcePath(pathname: string) {
  return STRICT_CRAWLER_OR_SUBRESOURCE_PATHS.has(pathname);
}

export function isPwaInternalPath(pathname: string) {
  return PWA_INTERNAL_PATHS.has(pathname) || pathname.startsWith("/pwa/icon-");
}

export function isDeployInfraPath(pathname: string) {
  return DEPLOY_INFRA_PATHS.has(pathname);
}

/**
 * `/icon` and `/manifest.webmanifest` — crawlers, or browser subresource loads only
 * (favicon / install manifest). Blocks tab navigation and anonymous fetches (curl, etc.).
 */
export function isAllowedStrictCrawlerOrSubresourceRequest(request: Request, pathname: string) {
  const userAgent = request.headers.get("user-agent") ?? "";

  if (isSeoCrawler(userAgent)) {
    return true;
  }

  const fetchDest = request.headers.get("sec-fetch-dest") ?? "";

  if (pathname === "/manifest.webmanifest" && fetchDest === "manifest") {
    return true;
  }

  if (pathname === "/icon" && fetchDest === "image") {
    return true;
  }

  return false;
}

/** OG + favicons for SEO/social; block viewing raw image URLs in a tab. */
export function isAllowedBrandImageRequest(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";

  if (isSeoCrawler(userAgent)) {
    return true;
  }

  const fetchDest = request.headers.get("sec-fetch-dest") ?? "";

  if (fetchDest === "image") {
    return true;
  }

  return !isDirectBrowserNavigation(request);
}

/** PWA install, service worker, and tab icons — not used for rankings. */
export function isAllowedPwaInternalRequest(request: Request) {
  return !isDirectBrowserNavigation(request);
}

/** Deployment metadata accidentally copied to public assets — deny all HTTP access. */
export function isAllowedDeployInfraRequest() {
  return false;
}

export function getInternalRouteDenyReason(
  pathname: string,
  request: Request,
): "redirect" | "forbidden" | null {
  if (isDeployInfraPath(pathname)) {
    return isAllowedDeployInfraRequest() ? null : "forbidden";
  }

  // robots.txt and sitemap.xml must always return 200 for crawlers, GSC, and Lighthouse.
  if (isSeoDiscoveryPath(pathname)) {
    return null;
  }

  if (isStrictCrawlerOrSubresourcePath(pathname)) {
    return isAllowedStrictCrawlerOrSubresourceRequest(request, pathname) ? null : "redirect";
  }

  if (isBrandImagePath(pathname)) {
    return isAllowedBrandImageRequest(request) ? null : "redirect";
  }

  if (isPwaInternalPath(pathname)) {
    return isAllowedPwaInternalRequest(request) ? null : "redirect";
  }

  return null;
}
