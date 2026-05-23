"use client";

import { lazy, Suspense } from "react";

const ThemeToggle = lazy(() =>
  import("@/components/ThemeToggle").then((module) => ({
    default: module.ThemeToggle,
  })),
);

export function ThemeToggleLazy() {
  return (
    <Suspense
      fallback={
        <div className="surface-muted h-[34px] w-[148px] animate-pulse rounded-full" aria-hidden />
      }
    >
      <ThemeToggle />
    </Suspense>
  );
}
