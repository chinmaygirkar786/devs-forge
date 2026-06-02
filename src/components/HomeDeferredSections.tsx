"use client";

import { lazy, Suspense } from "react";

import { LazyWhenVisible } from "@/components/LazyWhenVisible";
import { SectionSkeleton } from "@/components/SectionSkeleton";

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
      <LazyWhenVisible
        fallback={<SectionSkeleton minHeight="min-h-[200px]" />}
        minHeight="200px"
        rootMargin="120px 0px"
      >
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[200px]" />}>
          <RecentlyUsedTools />
        </Suspense>
      </LazyWhenVisible>

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
