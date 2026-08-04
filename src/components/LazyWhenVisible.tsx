"use client";

import { useEffect, useRef, useState } from "react";

type LazyWhenVisibleProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  minHeight?: string;
  /** Mount children immediately (e.g. when navigating to a hash target inside). */
  forceVisible?: boolean;
};

export function LazyWhenVisible({
  children,
  fallback = null,
  rootMargin = "200px 0px",
  minHeight,
  forceVisible = false,
}: LazyWhenVisibleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const show = forceVisible || visible;

  useEffect(() => {
    if (show) {
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const frameId = requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, show]);

  return (
    <div ref={containerRef} style={minHeight ? { minHeight } : undefined}>
      {show ? children : fallback}
    </div>
  );
}
