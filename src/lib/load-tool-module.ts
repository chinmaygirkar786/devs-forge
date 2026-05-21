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
  "timestamp-converter": () => import("@/tools/timestamp-converter/Tool"),
  "json-to-typescript": () => import("@/tools/json-to-typescript/Tool"),
};

export function loadToolModule(slug: string) {
  return toolLoaders[slug] ?? null;
}
