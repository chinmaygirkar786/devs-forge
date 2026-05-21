"use client";

import { lazy, Suspense } from "react";

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
    <>
      <Suspense fallback={<SectionSkeleton minHeight="min-h-[200px]" />}>
        <RecentlyUsedTools />
      </Suspense>
      <Suspense fallback={<SectionSkeleton minHeight="min-h-[420px]" />}>
        <HomeExplorer tools={explorerTools} />
      </Suspense>
    </>
  );
}
