"use client";

import { LazyWhenVisible } from "@/components/LazyWhenVisible";
import { PwaProviderLazy } from "@/components/PwaProviderLazy";

export function PwaProviderDeferred() {
  return (
    <LazyWhenVisible fallback={null} rootMargin="0px">
      <PwaProviderLazy />
    </LazyWhenVisible>
  );
}
