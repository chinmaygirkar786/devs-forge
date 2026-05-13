export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatRelativeTime(date: string | number | Date) {
  const target = new Date(date).getTime();
  const diff = target - Date.now();
  const absDiff = Math.abs(diff);

  const units = [
    { limit: 60_000, name: "second", value: 1_000 },
    { limit: 3_600_000, name: "minute", value: 60_000 },
    { limit: 86_400_000, name: "hour", value: 3_600_000 },
    { limit: 2_592_000_000, name: "day", value: 86_400_000 },
    { limit: 31_536_000_000, name: "month", value: 2_592_000_000 },
    { limit: Number.POSITIVE_INFINITY, name: "year", value: 31_536_000_000 },
  ];

  const unit = units.find((entry) => absDiff < entry.limit) ?? units[0];
  const amount = Math.round(diff / unit.value);

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    amount,
    unit.name as Intl.RelativeTimeFormatUnit,
  );
}

export function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function uniqueBy<T>(items: T[], selector: (item: T) => string) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = selector(item);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
