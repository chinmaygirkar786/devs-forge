"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";

import posthog from "posthog-js";

import { recordToolUsage } from "@/lib/history";
import { loadToolModule } from "@/lib/load-tool-module";

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

export function ToolPageClient({ slug, usageMeta }: ToolPageClientProps) {
  const [Tool, setTool] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loader = loadToolModule(slug);
    if (!loader) {
      return;
    }

    void loader().then((module) => {
      if (!cancelled) {
        setTool(() => module.default);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    const record = () => {
      recordToolUsage({
        slug,
        title: usageMeta.title,
        category: usageMeta.category,
      });
      posthog.capture("tool_used", {
        tool_slug: slug,
        tool_title: usageMeta.title,
        tool_category: usageMeta.category,
      });
    };

    if (typeof requestIdleCallback === "function") {
      const idleId = requestIdleCallback(record);
      return () => cancelIdleCallback(idleId);
    }

    const timerId = window.setTimeout(record, 0);
    return () => window.clearTimeout(timerId);
  }, [slug, usageMeta]);

  if (!Tool) {
    return <ToolLoadingFallback />;
  }

  return <Tool />;
}
