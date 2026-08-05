"use client";

import { lazy, Suspense, useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

const ThemeToggle = lazy(() =>
  import("@/components/ThemeToggle").then((module) => ({
    default: module.ThemeToggle,
  })),
);

function ThemeToggleSkeleton() {
  return (
    <div className="theme-toggle-skeleton shrink-0" aria-hidden>
      <Skeleton className="h-[26px] w-[38px] rounded-full sm:w-[50px]" />
      <Skeleton className="h-[26px] w-[38px] rounded-full sm:w-[50px]" />
      <Skeleton className="h-[26px] w-[38px] rounded-full sm:w-[58px]" />
    </div>
  );
}

/** Loads theme controls after idle time so they stay off the critical path. */
export function DeferredThemeToggle() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = () => setReady(true);

    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(run, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }

    const id = setTimeout(run, 2500);
    return () => clearTimeout(id);
  }, []);

  if (!ready) {
    return <ThemeToggleSkeleton />;
  }

  return (
    <Suspense fallback={<ThemeToggleSkeleton />}>
      <ThemeToggle />
    </Suspense>
  );
}
