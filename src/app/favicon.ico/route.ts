import { createFaviconIcon } from "@/lib/app-icon";
import { STATIC_ASSET_CACHE_CONTROL } from "@/lib/static-asset-cache";

export async function GET() {
  const response = createFaviconIcon();
  response.headers.set("Cache-Control", STATIC_ASSET_CACHE_CONTROL);
  return response;
}
