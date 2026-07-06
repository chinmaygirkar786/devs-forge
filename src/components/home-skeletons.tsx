import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function SkeletonBar({ className }: { className?: string }) {
  return <div className={cn("skeleton-bar", className)} aria-hidden />;
}

function SkeletonSurface({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("skeleton-pulse", className)} aria-hidden>
      {children}
    </div>
  );
}

export function ToolCardSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonSurface className={cn("surface-muted flex gap-4 rounded-3xl p-5", className)}>
      <SkeletonBar className="h-11 w-11 shrink-0 rounded-2xl" />
      <div className="min-w-0 flex-1 space-y-2.5">
        <SkeletonBar className="h-5 w-3/5" />
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-4/5" />
      </div>
    </SkeletonSurface>
  );
}

export function RecentlyUsedSkeleton() {
  return (
    <SkeletonSurface className="surface-card rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonBar className="h-6 w-36" />
        <SkeletonBar className="hidden h-4 w-52 sm:block" />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <SkeletonBar key={index} className="h-11 w-36 rounded-full" />
        ))}
      </div>
    </SkeletonSurface>
  );
}

export function HomeExplorerSkeleton() {
  return (
    <SkeletonSurface className="surface-card rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <SkeletonBar className="h-4 w-48" />
          <SkeletonBar className="h-9 w-full max-w-lg" />
          <SkeletonBar className="h-9 w-4/5 max-w-md" />
          <SkeletonBar className="h-4 w-full" />
          <SkeletonBar className="h-4 w-11/12" />
        </div>
        <SkeletonBar className="h-14 w-full max-w-xl rounded-[1.75rem]" />
      </div>
      <SkeletonBar className="mt-4 h-4 w-72" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <ToolCardSkeleton key={index} className="surface-muted" />
        ))}
      </div>
    </SkeletonSurface>
  );
}

export function CategoryCardSkeleton() {
  return (
    <SkeletonSurface className="surface-card rounded-3xl p-6">
      <SkeletonBar className="h-4 w-28" />
      <SkeletonBar className="mt-3 h-8 w-24" />
      <div className="mt-3 space-y-2">
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-11/12" />
      </div>
      <div className="mt-5 space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <SkeletonBar key={index} className="h-4 w-4/5" />
        ))}
      </div>
    </SkeletonSurface>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-4" aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function CategoriesSectionSkeleton() {
  return (
    <section className="space-y-8" aria-hidden>
      <SkeletonSurface className="max-w-3xl space-y-4">
        <SkeletonBar className="h-4 w-40" />
        <SkeletonBar className="h-10 w-full max-w-xl" />
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-11/12" />
      </SkeletonSurface>
      <CategoryGridSkeleton />
    </section>
  );
}

export function WorkflowCardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <SkeletonSurface className="surface-card rounded-[2rem] p-6 sm:p-8">
      <SkeletonBar className="h-4 w-32" />
      <SkeletonBar className="mt-3 h-8 w-full max-w-md" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: lines }, (_, index) => (
          <SkeletonBar key={index} className="h-4 w-full" />
        ))}
      </div>
    </SkeletonSurface>
  );
}

export function WorkflowSectionSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" aria-hidden>
      <WorkflowCardSkeleton lines={4} />
      <SkeletonSurface className="surface-card rounded-[2rem] p-6 sm:p-8">
        <SkeletonBar className="h-4 w-32" />
        <div className="mt-4 space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="surface-muted rounded-2xl p-4">
              <SkeletonBar className="h-5 w-28" />
              <SkeletonBar className="mt-2 h-4 w-full" />
              <SkeletonBar className="mt-2 h-4 w-11/12" />
            </div>
          ))}
        </div>
      </SkeletonSurface>
    </div>
  );
}

export function HeroPopularToolsSkeleton() {
  return (
    <div className="grid gap-4" aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <ToolCardSkeleton key={index} />
      ))}
    </div>
  );
}
