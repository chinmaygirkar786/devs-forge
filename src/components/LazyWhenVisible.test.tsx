import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LazyWhenVisible } from "@/components/LazyWhenVisible";

describe("LazyWhenVisible", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows children immediately when forceVisible is true", () => {
    render(
      <LazyWhenVisible forceVisible fallback={<div>fallback</div>}>
        <div>deferred content</div>
      </LazyWhenVisible>,
    );

    expect(screen.getByText("deferred content")).toBeInTheDocument();
    expect(screen.queryByText("fallback")).not.toBeInTheDocument();
  });

  it("shows the fallback first when forceVisible is false and nothing has intersected yet", () => {
    const OriginalIO = window.IntersectionObserver;

    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds: ReadonlyArray<number> = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    try {
      render(
        <LazyWhenVisible forceVisible={false} fallback={<div>fallback</div>}>
          <div>deferred content</div>
        </LazyWhenVisible>,
      );

      expect(screen.getByText("fallback")).toBeInTheDocument();
      expect(screen.queryByText("deferred content")).not.toBeInTheDocument();
    } finally {
      window.IntersectionObserver = OriginalIO;
    }
  });
});
