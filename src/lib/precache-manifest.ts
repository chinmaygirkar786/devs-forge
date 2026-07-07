import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PRECACHE_MANIFEST_FALLBACK, type PrecacheManifest } from "@/lib/precache-manifest.fallback";

export type { PrecacheManifest };

const GENERATED_MANIFEST_PATH = join(process.cwd(), "src/lib/precache-manifest.generated.json");

export function loadPrecacheManifest(): PrecacheManifest {
  if (!existsSync(GENERATED_MANIFEST_PATH)) {
    return PRECACHE_MANIFEST_FALLBACK;
  }

  try {
    const parsed = JSON.parse(readFileSync(GENERATED_MANIFEST_PATH, "utf8")) as PrecacheManifest;

    if (
      typeof parsed.version === "string" &&
      Array.isArray(parsed.pages) &&
      Array.isArray(parsed.assets)
    ) {
      return parsed;
    }
  } catch {
    // Fall through to dev fallback.
  }

  return PRECACHE_MANIFEST_FALLBACK;
}
