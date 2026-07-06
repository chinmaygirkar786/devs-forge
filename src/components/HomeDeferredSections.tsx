"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";

import { LazyWhenVisible } from "@/components/LazyWhenVisible";
import { SectionSkeleton } from "@/components/SectionSkeleton";
import {
  getToolUsageHistory,
  getToolUsageHistoryServerSnapshot,
  subscribeToToolUsageHistory,
} from "@/lib/history";

const RecentlyUsedTools = lazy(() =>
  import("@/components/RecentlyUsedTools").then((module) => ({
    default: module.RecentlyUsedTools,
  })),
);

const HomeExplorer = lazy(() =>
  import("@/components/HomeExplorer").then((module) => ({
    default: module.HomeExplorer,
  })),
);

function useHasRecentTools() {
  const recent = useSyncExternalStore(
    subscribeToToolUsageHistory,
    getToolUsageHistory,
    getToolUsageHistoryServerSnapshot,
  );

  return recent.length > 0;
}

/** Renders nothing until local history has at least one tool (no skeleton or min-height gap). */
function DeferredRecentlyUsedTools() {
  const hasRecent = useHasRecentTools();

  if (!hasRecent) {
    return null;
  }

  return (
    <LazyWhenVisible
      fallback={<SectionSkeleton minHeight="min-h-0" />}
      rootMargin="120px 0px"
    >
      <Suspense fallback={<SectionSkeleton minHeight="min-h-0" />}>
        <RecentlyUsedTools />
      </Suspense>
    </LazyWhenVisible>
  );
}

type HomeExplorerTool = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
};

type HomeDeferredSectionsProps = {
  explorerTools: HomeExplorerTool[];
};

export function HomeDeferredSections({ explorerTools }: HomeDeferredSectionsProps) {
  return (
    <div className="space-y-10">
      <DeferredRecentlyUsedTools />

      <LazyWhenVisible
        fallback={<SectionSkeleton minHeight="min-h-[420px]" />}
        minHeight="420px"
        rootMargin="0px"
      >
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[420px]" />}>
          <HomeExplorer tools={explorerTools} />
        </Suspense>
      </LazyWhenVisible>
    </div>
  );
}
