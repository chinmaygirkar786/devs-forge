import type { ComponentType } from "react";

type ToolModule = { default: ComponentType };

const toolLoaders: Record<string, () => Promise<ToolModule>> = {
  "json-formatter": () => import("@/tools/json-formatter/Tool"),
  "jwt-decoder": () => import("@/tools/jwt-decoder/Tool"),
  "regex-tester": () => import("@/tools/regex-tester/Tool"),
  "base64-encoder": () => import("@/tools/base64-encoder/Tool"),
  "uuid-generator": () => import("@/tools/uuid-generator/Tool"),
  "color-palette-generator": () => import("@/tools/color-palette-generator/Tool"),
  "gradient-generator": () => import("@/tools/gradient-generator/Tool"),
  "markdown-previewer": () => import("@/tools/markdown-previewer/Tool"),
  "url-encoder": () => import("@/tools/url-encoder/Tool"),
  "html-formatter": () => import("@/tools/html-formatter/Tool"),
  "xml-formatter": () => import("@/tools/xml-formatter/Tool"),
  "yaml-formatter": () => import("@/tools/yaml-formatter/Tool"),
  "css-formatter": () => import("@/tools/css-formatter/Tool"),
  "case-converter": () => import("@/tools/case-converter/Tool"),
  "hash-generator": () => import("@/tools/hash-generator/Tool"),
  "cron-parser": () => import("@/tools/cron-parser/Tool"),
  "query-string-parser": () => import("@/tools/query-string-parser/Tool"),
  "timestamp-converter": () => import("@/tools/timestamp-converter/Tool"),
  "json-to-typescript": () => import("@/tools/json-to-typescript/Tool"),
};

export const toolLoaderSlugs = Object.keys(toolLoaders);

export function loadToolModule(slug: string) {
  return toolLoaders[slug] ?? null;
}

export function assertToolLoadersRegistered(slugs: readonly string[]) {
  const loaderSet = new Set(toolLoaderSlugs);

  for (const slug of slugs) {
    if (!loaderSet.has(slug)) {
      throw new Error(
        `[tool registry] Missing loadToolModule entry for "${slug}". Add it to src/lib/load-tool-module.ts.`,
      );
    }
  }

  for (const loaderSlug of toolLoaderSlugs) {
    if (!slugs.includes(loaderSlug)) {
      throw new Error(
        `[tool registry] loadToolModule entry "${loaderSlug}" has no matching tool seed.`,
      );
    }
  }
}
