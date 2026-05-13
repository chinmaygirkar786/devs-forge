"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import {
  getToolUsageHistory,
  getToolUsageHistoryServerSnapshot,
  subscribeToToolUsageHistory,
} from "@/lib/history";
import { toolCategories } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { tools } from "@/tools";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
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
        .map((entry) => tools.find((tool) => tool.slug === entry.slug))
        .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool))
        .slice(0, 5);
    }

    return tools
      .filter((tool) => {
        const searchable = [
          tool.name,
          tool.description,
          tool.keywordCluster.primary,
          ...tool.keywordCluster.secondary,
          ...tool.keywordCluster.longTail,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [query, recent]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/40 px-4 pt-24 backdrop-blur-sm">
      <div className="surface-card w-full max-w-2xl overflow-hidden rounded-3xl">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex min-w-[4.75rem] shrink-0 items-center justify-center rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-primary">
              Ctrl + K
            </span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for JSON, JWT, regex, timestamps..."
              className="w-full border-none bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-3">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {query ? "Search results" : "Recently used tools"}
          </p>

          <div className="space-y-2">
            {results.length ? (
              results.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  onClick={onClose}
                  className={cn(
                    "block rounded-2xl border border-transparent px-4 py-3",
                    "hover:border-border-strong hover:bg-background-soft",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{tool.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium whitespace-nowrap text-accent">
                      {toolCategories[tool.category].title}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No tools matched your search yet. Try JSON, regex, base64, UUID, or
                timestamp.
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
