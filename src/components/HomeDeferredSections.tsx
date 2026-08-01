"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";

import { LazyWhenVisible } from "@/components/LazyWhenVisible";
import { CategoriesSectionSkeleton, RecentlyUsedSkeleton } from "@/components/home-skeletons";
import type { CategoryExplorerCategory } from "@/components/CategoryExplorer";
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

const CategoryExplorer = lazy(() =>
  import("@/components/CategoryExplorer").then((module) => ({
    default: module.CategoryExplorer,
  })),
);

type HomeDeferredSectionsProps = {
  categories: CategoryExplorerCategory[];
};

function DeferredRecentlyUsedTools() {
  const recent = useSyncExternalStore(
    subscribeToToolUsageHistory,
    getToolUsageHistory,
    getToolUsageHistoryServerSnapshot,
  );

  if (!recent.length) {
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

export function HomeDeferredSections({ categories }: HomeDeferredSectionsProps) {
  return (
    <div className="space-y-10">
      <DeferredRecentlyUsedTools />

      <LazyWhenVisible fallback={<CategoriesSectionSkeleton />} rootMargin="0px">
        <Suspense fallback={<CategoriesSectionSkeleton />}>
          <CategoryExplorer categories={categories} />
        </Suspense>
      </LazyWhenVisible>
    </div>
  );
}
