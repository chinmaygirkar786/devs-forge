"use client";

import { LazyWhenVisible } from "@/components/LazyWhenVisible";

type DeferredRevealProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
  rootMargin?: string;
};

/** Shows a card-shaped skeleton until the section scrolls into view (or is near viewport). */
export function DeferredReveal({
  children,
  fallback,
  rootMargin = "160px 0px",
}: DeferredRevealProps) {
  return (
    <LazyWhenVisible fallback={fallback} rootMargin={rootMargin}>
      {children}
    </LazyWhenVisible>
  );
}
