"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const ThemeToggle = lazy(() =>
  import("@/components/ThemeToggle").then((module) => ({
    default: module.ThemeToggle,
  })),
);

function ThemeToggleSkeleton() {
  return (
    <div className="theme-toggle-skeleton skeleton-pulse surface-muted shrink-0" aria-hidden>
      <div className="skeleton-bar h-[26px] w-[50px] rounded-full" />
      <div className="skeleton-bar h-[26px] w-[50px] rounded-full" />
      <div className="skeleton-bar h-[26px] w-[58px] rounded-full" />
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
