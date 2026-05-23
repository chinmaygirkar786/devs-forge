const usageStorageKey = "developer-tools-usage-history";
const toolHistoryEventName = "tool-history-updated";
const emptyHistory: ToolUsageEntry[] = [];

let cachedRawHistory: string | null | undefined;
let cachedHistory: ToolUsageEntry[] = emptyHistory;

export type ToolUsageEntry = {
  slug: string;
  title: string;
  category: string;
  visitedAt: string;
};

type LegacyToolUsageEntry = ToolUsageEntry & {
  name?: string;
};

function normalizeUsageEntry(entry: LegacyToolUsageEntry): ToolUsageEntry {
  return {
    slug: entry.slug,
    title: entry.title ?? entry.name ?? entry.slug,
    category: entry.category,
    visitedAt: entry.visitedAt,
  };
}

export function getToolUsageHistory() {
  if (typeof window === "undefined") {
    return emptyHistory;
  }

  try {
    const raw = window.localStorage.getItem(usageStorageKey);

    if (raw === cachedRawHistory) {
      return cachedHistory;
    }

    if (!raw) {
      cachedRawHistory = raw;
      cachedHistory = emptyHistory;
      return cachedHistory;
    }

    const parsed = JSON.parse(raw) as LegacyToolUsageEntry[];
    cachedRawHistory = raw;
    cachedHistory = Array.isArray(parsed) ? parsed.map(normalizeUsageEntry) : emptyHistory;
    return cachedHistory;
  } catch {
    cachedRawHistory = null;
    cachedHistory = emptyHistory;
    return cachedHistory;
  }
}

export function getToolUsageHistoryServerSnapshot() {
  return emptyHistory;
}

export function subscribeToToolUsageHistory(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleCustomChange = () => onStoreChange();
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === usageStorageKey) {
      onStoreChange();
    }
  };

  window.addEventListener(toolHistoryEventName, handleCustomChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(toolHistoryEventName, handleCustomChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function recordToolUsage(entry: Omit<ToolUsageEntry, "visitedAt">) {
  if (typeof window === "undefined") {
    return;
  }

  const nextEntry: ToolUsageEntry = {
    ...entry,
    visitedAt: new Date().toISOString(),
  };

  const nextHistory = [
    nextEntry,
    ...getToolUsageHistory().filter((item) => item.slug !== entry.slug),
  ].slice(0, 8);

  const serializedHistory = JSON.stringify(nextHistory);
  cachedRawHistory = serializedHistory;
  cachedHistory = nextHistory;
  window.localStorage.setItem(usageStorageKey, serializedHistory);
  window.dispatchEvent(new CustomEvent(toolHistoryEventName));
}
