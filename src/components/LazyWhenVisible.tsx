"use client";

import { useEffect, useRef, useState } from "react";

type LazyWhenVisibleProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  minHeight?: string;
};

export function LazyWhenVisible({
  children,
  fallback = null,
  rootMargin = "200px 0px",
  minHeight,
}: LazyWhenVisibleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
  }, [rootMargin]);

  return (
    <div ref={containerRef} style={minHeight ? { minHeight } : undefined}>
      {visible ? children : fallback}
    </div>
  );
}
