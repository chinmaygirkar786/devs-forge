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
    <LazyWhenVisible
      fallback={<SectionSkeleton minHeight="min-h-[620px]" />}
      minHeight="620px"
      rootMargin="280px 0px"
    >
      <div className="space-y-10">
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[200px]" />}>
          <RecentlyUsedTools />
        </Suspense>
        <Suspense fallback={<SectionSkeleton minHeight="min-h-[420px]" />}>
          <HomeExplorer tools={explorerTools} />
        </Suspense>
      </div>
    </LazyWhenVisible>
  );
}
