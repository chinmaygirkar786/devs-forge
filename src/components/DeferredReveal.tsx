"use client";

import type { ReactNode } from "react";

import { LazyWhenVisible } from "@/components/LazyWhenVisible";

type DeferredRevealProps = {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
};

export function DeferredReveal({
  children,
  fallback,
  rootMargin = "200px 0px",
}: DeferredRevealProps) {
  return (
    <LazyWhenVisible fallback={fallback} rootMargin={rootMargin}>
      {children}
    </LazyWhenVisible>
  );
}
