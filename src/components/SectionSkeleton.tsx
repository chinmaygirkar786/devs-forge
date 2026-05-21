"use client";

export function SectionSkeleton({ minHeight = "min-h-[280px]" }: { minHeight?: string }) {
  return (
    <div
      className={`surface-card animate-pulse rounded-[2rem] p-6 sm:p-8 ${minHeight}`}
      aria-hidden
    />
  );
}
