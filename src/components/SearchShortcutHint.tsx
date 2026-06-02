import { cn } from "@/lib/utils";

type SearchShortcutHintProps = {
  className?: string;
  isMac?: boolean;
};

/** Platform-aware shortcut label — `isMac` comes from the request User-Agent on the server. */
export function SearchShortcutHint({ className, isMac = false }: SearchShortcutHintProps) {
  if (isMac) {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        <span className="text-[0.7rem] leading-none font-semibold" aria-hidden>
          ⌘
        </span>
        <span aria-hidden>K</span>
        <span className="sr-only">Command K</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label="Control K">
      CTRL + K
    </span>
  );
}

type SearchShortcutPhraseProps = {
  className?: string;
  template: "press-to-search" | "open-anywhere";
  isMac?: boolean;
};

export function SearchShortcutPhrase({
  className,
  template,
  isMac = false,
}: SearchShortcutPhraseProps) {
  if (template === "press-to-search") {
    return (
      <span className={className}>
        Press <SearchShortcutHint className="inline-flex align-middle" isMac={isMac} /> to search
      </span>
    );
  }

  return (
    <span className={className}>
      Open tool search anywhere with{" "}
      <SearchShortcutHint className="inline-flex align-middle" isMac={isMac} /> for fast navigation.
    </span>
  );
}
