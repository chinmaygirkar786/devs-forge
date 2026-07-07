export type PrecacheManifest = {
  version: string;
  pages: readonly string[];
  assets: readonly string[];
};

/** Minimal manifest for local dev when postbuild has not run. */
export const PRECACHE_MANIFEST_FALLBACK: PrecacheManifest = {
  version: "dev",
  pages: ["/", "/tools", "/offline"],
  assets: [],
};
