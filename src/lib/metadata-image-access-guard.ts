const METADATA_IMAGE_PATHS = new Set(["/opengraph-image"]);

const SOCIAL_PREVIEW_CRAWLER =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|Pinterest|Embedly/i;

export function isProtectedMetadataImagePath(pathname: string) {
  return METADATA_IMAGE_PATHS.has(pathname);
}

/** Allow link-preview bots; block users opening the image URL in a browser tab. */
export function isAllowedMetadataImageRequest(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";

  if (SOCIAL_PREVIEW_CRAWLER.test(userAgent)) {
    return true;
  }

  const fetchDest = request.headers.get("sec-fetch-dest") ?? "";
  const fetchMode = request.headers.get("sec-fetch-mode") ?? "";

  if (
    fetchDest === "document" ||
    fetchDest === "iframe" ||
    fetchMode === "navigate"
  ) {
    return false;
  }

  return true;
}
