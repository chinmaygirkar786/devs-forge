"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const ThemeToggle = lazy(() =>
  import("@/components/ThemeToggle").then((module) => ({
    default: module.ThemeToggle,
  })),
);

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
    return <div className="surface-muted h-[34px] w-[148px] shrink-0 rounded-full" aria-hidden />;
  }

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
