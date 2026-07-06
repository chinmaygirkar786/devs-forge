"use client";

import { cn } from "@/lib/utils";

export function SectionSkeleton({ minHeight = "min-h-[280px]" }: { minHeight?: string }) {
  return (
    <div
      className={cn("skeleton-pulse surface-card rounded-[2rem] p-6 sm:p-8", minHeight)}
      aria-hidden
    >
      <div className="skeleton-bar mb-4 h-4 w-40 rounded-lg" />
      <div className="skeleton-bar mb-3 h-8 w-2/3 max-w-md rounded-lg" />
      <div className="space-y-2">
        <div className="skeleton-bar h-4 w-full rounded-lg" />
        <div className="skeleton-bar h-4 w-11/12 rounded-lg" />
        <div className="skeleton-bar h-4 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}
