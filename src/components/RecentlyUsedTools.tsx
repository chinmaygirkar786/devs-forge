"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { ToolIcon } from "@/components/ToolIcon";
import {
  getToolUsageHistory,
  getToolUsageHistoryServerSnapshot,
  subscribeToToolUsageHistory,
} from "@/lib/history";
import { routes } from "@/lib/internal-links";

export function RecentlyUsedTools() {
  const recent = useSyncExternalStore(
    subscribeToToolUsageHistory,
    getToolUsageHistory,
    getToolUsageHistoryServerSnapshot,
  );

  if (!recent.length) {
    return null;
  }

  return (
    <section className="surface-card rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-foreground">Recently used</h2>
        <p className="text-sm text-muted-foreground">
          Stored locally on this device only.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {recent.map((entry) => (
          <Link
            key={entry.slug}
            href={routes.tool(entry.slug)}
            className="recent-tool-chip inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium whitespace-nowrap text-foreground"
          >
            <span className="recent-tool-chip-icon rounded-lg">
              <ToolIcon slug={entry.slug} size="sm" className="h-7 w-7 rounded-lg" />
            </span>
            {entry.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
