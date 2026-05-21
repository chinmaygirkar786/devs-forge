"use client";

import { lazy, Suspense } from "react";

const PwaProvider = lazy(() =>
  import("@/components/PwaProvider").then((module) => ({
    default: module.PwaProvider,
  })),
);

export function PwaProviderLazy() {
  return (
    <Suspense fallback={null}>
      <PwaProvider />
    </Suspense>
  );
}
