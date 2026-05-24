"use client";

import Link from "next/link";
import { capturePosthog } from "@/lib/posthog";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

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

export function CommandPalette({ open, onClose, searchIndex }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const recent = useSyncExternalStore(
    subscribeToToolUsageHistory,
    getToolUsageHistory,
    getToolUsageHistoryServerSnapshot,
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }

    return undefined;
  }, [onClose, open]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

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
  }, [query, recent, searchIndex]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 px-4 pt-24 backdrop-blur-sm">
      <div className="surface-card w-full max-w-2xl overflow-hidden rounded-3xl">
        <div className="border-border border-b px-5 py-4">
          <div className="flex items-center gap-3">
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
            {query ? "Search results" : "Recently used tools"}
          </p>

          <div className="space-y-2">
            {results.length ? (
              results.map((tool) => (
                <Link
                  key={tool.slug}
                  href={routes.tool(tool.slug)}
                  onClick={() => {
                    capturePosthog("command_palette_tool_selected", {
                      tool_slug: tool.slug,
                      tool_title: tool.title,
                      search_query: query.trim() || "",
                      source: query.trim() ? "search" : "recent",
                    });
                    onClose();
                  }}
                  className={cn(
                    "block rounded-2xl border border-transparent px-4 py-3",
                    "hover:border-border-strong hover:bg-background-soft",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <ToolIcon slug={tool.slug} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground font-semibold">{tool.title}</p>
                      <p className="text-muted-foreground mt-1 text-sm">{tool.description}</p>
                    </div>
                    <span className="bg-accent-soft text-accent inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap">
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
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close command palette"
        className="absolute inset-0 -z-10"
      />
    </div>
  );
}
