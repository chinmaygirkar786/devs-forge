"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SectionSkeleton({ minHeight = "min-h-[280px]" }: { minHeight?: string }) {
  return (
    <div className={cn("surface-card rounded-2xl p-6 sm:p-8", minHeight)} aria-hidden>
      <Skeleton className="mb-4 h-4 w-40 rounded-lg" />
      <Skeleton className="mb-3 h-8 w-2/3 max-w-md rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-11/12 rounded-lg" />
        <Skeleton className="h-4 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}
