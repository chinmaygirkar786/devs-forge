"use client";

import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from "react";

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

function useCategoriesHashTarget() {
  const [targeted, setTargeted] = useState(false);
  const [scrollToken, setScrollToken] = useState(0);

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#categories") {
        setTargeted(true);
        setScrollToken((token) => token + 1);
      }
    };

    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return { targeted, scrollToken };
}

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
  const { targeted: forceCategories, scrollToken } = useCategoriesHashTarget();

  useEffect(() => {
    if (!scrollToken) {
      return;
    }

    const scrollToCategories = () => {
      document.getElementById("categories")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    // Wait a frame so the section (or its skeleton) is laid out, then again after
    // the lazy CategoryExplorer chunk mounts so the final position is correct.
    const frameId = requestAnimationFrame(scrollToCategories);
    const timerId = window.setTimeout(scrollToCategories, 120);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
    };
  }, [scrollToken]);

  return (
    <div className="space-y-10">
      <DeferredRecentlyUsedTools />

      {/* Stable hash target — must exist before CategoryExplorer lazy-mounts. */}
      <div id="categories" className="scroll-mt-24">
        <LazyWhenVisible
          fallback={<CategoriesSectionSkeleton />}
          rootMargin="0px"
          forceVisible={forceCategories}
        >
          <Suspense fallback={<CategoriesSectionSkeleton />}>
            <CategoryExplorer categories={categories} />
          </Suspense>
        </LazyWhenVisible>
      </div>
    </div>
  );
}
