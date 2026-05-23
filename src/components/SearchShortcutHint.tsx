"use client";

import { Command } from "lucide-react";

import { useIsMac } from "@/hooks/use-is-mac";
import { cn } from "@/lib/utils";

type SearchShortcutHintProps = {
  className?: string;
};

/** Platform-aware “open search” shortcut: ⌘ icon + K on macOS, CTRL + K elsewhere. */
export function SearchShortcutHint({ className }: SearchShortcutHintProps) {
  const isMac = useIsMac();

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {isMac ? (
        <>
          <Command className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
          <span aria-hidden>K</span>
          <span className="sr-only">Command K</span>
        </>
      ) : (
        <span aria-label="Control K">CTRL + K</span>
      )}
    </span>
  );
}

type SearchShortcutPhraseProps = {
  className?: string;
  template: "press-to-search" | "open-anywhere";
};

/** Sentence-length copy with the same platform-aware shortcut. */
export function SearchShortcutPhrase({ className, template }: SearchShortcutPhraseProps) {
  if (template === "press-to-search") {
    return (
      <span className={className}>
        Press <SearchShortcutHint className="inline-flex align-middle" /> to search
      </span>
    );
  }

  return (
    <span className={className}>
      Open tool search anywhere with <SearchShortcutHint className="inline-flex align-middle" /> for
      fast navigation.
    </span>
  );
}
