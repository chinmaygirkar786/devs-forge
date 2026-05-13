"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

import { recordToolUsage } from "@/lib/history";
import { getToolBySlug } from "@/lib/tools";

type ToolPageClientProps = {
  slug: string;
};

const loadingFallback = () => (
  <div className="surface-card rounded-3xl p-6 text-sm text-muted-foreground">
    Loading interactive tool...
  </div>
);

const toolComponentMap = {
  "json-formatter": dynamic(() => import("@/tools/json-formatter/Tool"), {
    loading: loadingFallback,
  }),
  "jwt-decoder": dynamic(() => import("@/tools/jwt-decoder/Tool"), {
    loading: loadingFallback,
  }),
  "regex-tester": dynamic(() => import("@/tools/regex-tester/Tool"), {
    loading: loadingFallback,
  }),
  "base64-encoder": dynamic(() => import("@/tools/base64-encoder/Tool"), {
    loading: loadingFallback,
  }),
  "uuid-generator": dynamic(() => import("@/tools/uuid-generator/Tool"), {
    loading: loadingFallback,
  }),
  "color-palette-generator": dynamic(
    () => import("@/tools/color-palette-generator/Tool"),
    {
      loading: loadingFallback,
    },
  ),
  "gradient-generator": dynamic(() => import("@/tools/gradient-generator/Tool"), {
    loading: loadingFallback,
  }),
  "markdown-previewer": dynamic(
    () => import("@/tools/markdown-previewer/Tool"),
    {
      loading: loadingFallback,
    },
  ),
  "url-encoder": dynamic(() => import("@/tools/url-encoder/Tool"), {
    loading: loadingFallback,
  }),
  "html-formatter": dynamic(() => import("@/tools/html-formatter/Tool"), {
    loading: loadingFallback,
  }),
  "timestamp-converter": dynamic(
    () => import("@/tools/timestamp-converter/Tool"),
    {
      loading: loadingFallback,
    },
  ),
  "json-to-typescript": dynamic(
    () => import("@/tools/json-to-typescript/Tool"),
    {
      loading: loadingFallback,
    },
  ),
} as const;

export function ToolPageClient({ slug }: ToolPageClientProps) {
  const tool = getToolBySlug(slug);
  const ToolComponent = toolComponentMap[slug as keyof typeof toolComponentMap];

  useEffect(() => {
    if (!tool) {
      return;
    }

    recordToolUsage({
      slug: tool.slug,
      name: tool.name,
      category: tool.category,
    });
  }, [tool]);

  if (!tool || !ToolComponent) {
    return null;
  }

  return <ToolComponent />;
}
