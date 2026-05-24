/** Long-lived cache for stable URLs (icons, manifest, PWA assets). */
export const STATIC_ASSET_CACHE_CONTROL =
  "public, max-age=604800, stale-while-revalidate=86400";

export const staticAssetCacheHeaderRows = [
  { key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL },
] as const;
