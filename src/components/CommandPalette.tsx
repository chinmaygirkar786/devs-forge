"use client";

import { capturePosthog } from "@/lib/posthog";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getToolUsageHistory,
  getToolUsageHistoryServerSnapshot,
  subscribeToToolUsageHistory,
} from "@/lib/history";
import { ToolIcon } from "@/components/ToolIcon";
import { routes } from "@/lib/internal-links";
import type { ToolSearchEntry } from "@/lib/tool-search-index";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  searchIndex: ToolSearchEntry[];
};

const SEARCH_DEBOUNCE_MS = 220;
const SEARCH_MIN_LOADING_MS = 380;

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
    <div className="space-y-2 p-2" aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-start gap-3 rounded-lg px-2 py-1.5">
          <Skeleton className="size-9 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
          <Skeleton className="h-7 w-16 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CommandPalette({ open, onClose, searchIndex }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { resolvedQuery, isSearching } = useDebouncedSearchQuery(query, open);
  const recent = useSyncExternalStore(
    subscribeToToolUsageHistory,
    getToolUsageHistory,
    getToolUsageHistoryServerSnapshot,
  );

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

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        onClose();
        setQuery("");
      }
    },
    [onClose],
  );

  const handleSelect = useCallback(
    (tool: ToolSearchEntry) => {
      capturePosthog("command_palette_tool_selected", {
        tool_slug: tool.slug,
        tool_title: tool.title,
        search_query: query.trim() || "",
        source: query.trim() ? "search" : "recent",
      });
      handleOpenChange(false);
      router.push(routes.tool(tool.slug));
    },
    [handleOpenChange, query, router],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Search tools"
      description="Search for JSON, JWT, regex, timestamps, and more."
      className="top-24 max-w-2xl translate-y-0 sm:max-w-2xl"
    >
      <Command shouldFilter={false}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search for JSON, JWT, regex, timestamps..."
        />
        <CommandList className="max-h-[420px] p-1">
          {isSearching ? (
            <CommandPaletteSkeleton />
          ) : (
            <>
              <p className="text-muted-foreground px-3 py-2 text-xs font-semibold tracking-[0.2em] uppercase">
                {query.trim() ? "Search results" : "Recently used tools"}
              </p>
              {results.length ? (
                <CommandGroup>
                  {results.map((tool) => (
                    <CommandItem
                      key={tool.slug}
                      value={tool.slug}
                      onSelect={() => handleSelect(tool)}
                      className="items-start gap-3 py-2.5"
                    >
                      <ToolIcon slug={tool.slug} size="sm" className="mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground font-semibold">{tool.title}</p>
                        <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
                          {tool.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 whitespace-nowrap">
                        {tool.categoryTitle}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>
                  No tools matched your search yet. Try JSON, regex, base64, UUID, or timestamp.
                </CommandEmpty>
              )}
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
