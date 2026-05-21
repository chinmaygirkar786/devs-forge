"use client";

import { lazy, Suspense, useEffect } from "react";

import { recordToolUsage } from "@/lib/history";

type ToolUsageMeta = {
  title: string;
  category: string;
};

type ToolPageClientProps = {
  slug: string;
  usageMeta: ToolUsageMeta;
};

function ToolLoadingFallback() {
  return (
    <div className="surface-card min-h-[280px] rounded-3xl p-6 text-sm text-muted-foreground">
      Loading interactive tool...
    </div>
  );
}

const toolComponentMap = {
  "json-formatter": lazy(() => import("@/tools/json-formatter/Tool")),
  "jwt-decoder": lazy(() => import("@/tools/jwt-decoder/Tool")),
  "regex-tester": lazy(() => import("@/tools/regex-tester/Tool")),
  "base64-encoder": lazy(() => import("@/tools/base64-encoder/Tool")),
  "uuid-generator": lazy(() => import("@/tools/uuid-generator/Tool")),
  "color-palette-generator": lazy(() => import("@/tools/color-palette-generator/Tool")),
  "gradient-generator": lazy(() => import("@/tools/gradient-generator/Tool")),
  "markdown-previewer": lazy(() => import("@/tools/markdown-previewer/Tool")),
  "url-encoder": lazy(() => import("@/tools/url-encoder/Tool")),
  "html-formatter": lazy(() => import("@/tools/html-formatter/Tool")),
  "timestamp-converter": lazy(() => import("@/tools/timestamp-converter/Tool")),
  "json-to-typescript": lazy(() => import("@/tools/json-to-typescript/Tool")),
} as const;

export function ToolPageClient({ slug, usageMeta }: ToolPageClientProps) {
  const ToolComponent = toolComponentMap[slug as keyof typeof toolComponentMap];

  useEffect(() => {
    recordToolUsage({
      slug,
      title: usageMeta.title,
      category: usageMeta.category,
    });
  }, [slug, usageMeta]);

  if (!ToolComponent) {
    return null;
  }

  return (
    <Suspense fallback={<ToolLoadingFallback />}>
      <ToolComponent />
    </Suspense>
  );
}
