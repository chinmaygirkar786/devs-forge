"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";

import { LazyWhenVisible } from "@/components/LazyWhenVisible";
import { HomeExplorerSkeleton, RecentlyUsedSkeleton } from "@/components/home-skeletons";
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
    <LazyWhenVisible fallback={<RecentlyUsedSkeleton />} rootMargin="120px 0px">
      <Suspense fallback={<RecentlyUsedSkeleton />}>
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

      <LazyWhenVisible fallback={<HomeExplorerSkeleton />} rootMargin="0px">
        <Suspense fallback={<HomeExplorerSkeleton />}>
          <HomeExplorer tools={explorerTools} />
        </Suspense>
      </LazyWhenVisible>
    </div>
  );
}
