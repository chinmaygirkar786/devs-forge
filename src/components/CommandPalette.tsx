"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { capturePosthog } from "@/lib/posthog";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import {
  getToolUsageHistory,
  getToolUsageHistoryServerSnapshot,
  subscribeToToolUsageHistory,
} from "@/lib/history";
import { SearchShortcutHint } from "@/components/SearchShortcutHint";
import { ToolIcon } from "@/components/ToolIcon";
import { routes } from "@/lib/internal-links";
import { cn } from "@/lib/utils";
import type { ToolSearchEntry } from "@/lib/tool-search-index";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  searchIndex: ToolSearchEntry[];
};

const SEARCH_DEBOUNCE_MS = 220;
const SEARCH_MIN_LOADING_MS = 380;
const MODAL_CLOSE_MS = 260;

function useDebouncedSearchQuery(query: string, active: boolean) {
  const [resolvedQuery, setResolvedQuery] = useState("");
  const [isHolding, setIsHolding] = useState(false);
  const timersRef = useRef<number[]>([]);

  const trimmedQuery = query.trim();
  const effectiveResolvedQuery = active && trimmedQuery ? resolvedQuery : "";
  const queryMismatch =
    active &&
    trimmedQuery.length > 0 &&
    trimmedQuery.toLowerCase() !== effectiveResolvedQuery.trim().toLowerCase();
  const isSearching = Boolean(active && trimmedQuery && (queryMismatch || isHolding));

  useEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      timersRef.current = [];
    };

    if (!active || !trimmedQuery) {
      clearTimers();
      return clearTimers;
    }

    const startedAt = Date.now();
    clearTimers();

    const debounceId = window.setTimeout(() => {
      setResolvedQuery(query);
      const elapsed = Date.now() - startedAt;
      const finishDelay = Math.max(0, SEARCH_MIN_LOADING_MS - elapsed);
      setIsHolding(true);

      const finishId = window.setTimeout(() => {
        setIsHolding(false);
      }, finishDelay);
      timersRef.current.push(finishId);
    }, SEARCH_DEBOUNCE_MS);
    timersRef.current.push(debounceId);

    return clearTimers;
  }, [active, query, trimmedQuery]);

  return {
    resolvedQuery: effectiveResolvedQuery,
    isSearching,
  };
}

function CommandPaletteSkeleton() {
  return (
    <div className="skeleton-pulse space-y-2" aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="command-palette-skeleton-row">
          <div className="skeleton-bar h-9 w-9 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="skeleton-bar h-4 w-2/5 rounded-lg" />
            <div className="skeleton-bar h-3.5 w-full rounded-lg" />
            <div className="skeleton-bar h-3.5 w-4/5 rounded-lg" />
          </div>
          <div className="skeleton-bar h-7 w-16 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CommandPalette({ open, onClose, searchIndex }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const openRef = useRef(open);
  const searchActive = open && !closing;
  const { resolvedQuery, isSearching } = useDebouncedSearchQuery(query, searchActive);
  const recent = useSyncExternalStore(
    subscribeToToolUsageHistory,
    getToolUsageHistory,
    getToolUsageHistoryServerSnapshot,
  );

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const handleClose = useCallback(() => {
    if (closing) {
      return;
    }

    onClose();
    setClosing(true);

    if (closeTimerRef.current !== undefined) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = undefined;
      setClosing(false);

      if (!openRef.current) {
        setQuery("");
      }
    }, MODAL_CLOSE_MS);
  }, [closing, onClose]);

  const results = useMemo(() => {
    const normalizedQuery = resolvedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return recent
        .map((entry) => searchIndex.find((tool) => tool.slug === entry.slug))
        .filter((tool): tool is ToolSearchEntry => Boolean(tool))
        .slice(0, 5);
    }

    return searchIndex
      .filter((tool) => {
        const searchable = [tool.title, tool.primaryKeyword, tool.description, ...tool.keywords]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [resolvedQuery, recent, searchIndex]);

  const resultsListKey = query.trim() ? resolvedQuery.trim().toLowerCase() : "recent";
  const rendered = open || closing;
  const motionState = closing && !open ? "closing" : "open";

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== undefined) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!rendered) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [rendered]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (rendered) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }

    return undefined;
  }, [handleClose, rendered]);

  if (!rendered) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      data-state={motionState}
      className="command-palette-overlay fixed inset-0 z-50 flex items-start justify-center px-4 pt-24"
    >
      <div
        data-state={motionState}
        className="command-palette-panel surface-card w-full max-w-2xl overflow-hidden rounded-3xl"
      >
        <div
          className={cn(
            "command-palette-search border-border border-b px-5 py-4",
            isSearching && "command-palette-search--pending",
          )}
        >
          <div className="flex items-center gap-3">
            <Search
              className="command-palette-search-icon h-4 w-4"
              strokeWidth={2.25}
              aria-hidden
            />
            <span className="bg-primary-soft text-primary inline-flex min-w-[4.75rem] shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap">
              <SearchShortcutHint />
            </span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for JSON, JWT, regex, timestamps..."
              className="placeholder:text-muted-foreground w-full border-none bg-transparent text-base outline-none"
            />
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-3">
          <p className="text-muted-foreground px-3 pb-2 text-xs font-semibold tracking-[0.2em] uppercase">
            {isSearching ? "Searching..." : query ? "Search results" : "Recently used tools"}
          </p>

          {isSearching ? (
            <CommandPaletteSkeleton />
          ) : (
            <div key={resultsListKey} className="command-palette-results space-y-2">
              {results.length ? (
                results.map((tool, index) => (
                  <Link
                    key={`${resultsListKey}-${tool.slug}`}
                    href={routes.tool(tool.slug)}
                    prefetch={false}
                    onClick={() => {
                      capturePosthog("command_palette_tool_selected", {
                        tool_slug: tool.slug,
                        tool_title: tool.title,
                        search_query: query.trim() || "",
                        source: query.trim() ? "search" : "recent",
                      });
                      handleClose();
                    }}
                    className="command-palette-option block rounded-2xl px-4 py-3"
                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <ToolIcon
                        slug={tool.slug}
                        size="sm"
                        className="command-palette-option-icon h-9 w-9 rounded-xl"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground font-semibold">{tool.title}</p>
                        <p className="text-muted-foreground mt-1 text-sm">{tool.description}</p>
                      </div>
                      <span className="command-palette-option-badge bg-accent-soft text-accent inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap">
                        {tool.categoryTitle}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="border-border text-muted-foreground rounded-2xl border border-dashed px-4 py-8 text-center text-sm">
                  No tools matched your search yet. Try JSON, regex, base64, UUID, or timestamp.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleClose}
        aria-label="Close command palette"
        className="absolute inset-0 -z-10"
      />
    </div>
  );
}
