import { uniqueBy } from "@/lib/utils";

export type AffiliateContext =
  "ai-coding" | "hosting" | "api" | "backend" | "frontend" | "design" | "productivity";

export type AffiliateItem = {
  id: string;
  name: string;
  description: string;
  href: string | null;
  cta: string;
  tags: AffiliateContext[];
  note: string;
};

const affiliateCatalog: AffiliateItem[] = [
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-assisted coding for editing, refactoring, and debugging.",
    href: null,
    cta: "Affiliate link coming soon",
    tags: ["ai-coding", "productivity", "frontend", "backend"],
    note: "Best fit for teams that want faster coding and codebase-aware workflows.",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Deploy frontend apps with previews, analytics, and edge delivery.",
    href: null,
    cta: "Affiliate link coming soon",
    tags: ["hosting", "frontend", "productivity"],
    note: "Strong fit for static and App Router deployments.",
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    description: "Cloud compute, managed databases, and simple developer hosting.",
    href: null,
    cta: "Affiliate link coming soon",
    tags: ["hosting", "backend", "api"],
    note: "Useful when a tool workflow grows into a hosted backend service.",
  },
  {
    id: "postman",
    name: "Postman",
    description: "API testing, documentation, and collaboration for backend workflows.",
    href: null,
    cta: "Affiliate link coming soon",
    tags: ["api", "backend", "productivity"],
    note: "Pairs naturally with token, JSON, and request-focused utilities.",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Design systems, UI exploration, and collaboration for product teams.",
    href: null,
    cta: "Affiliate link coming soon",
    tags: ["design", "frontend", "productivity"],
    note: "Relevant for color palettes, gradients, and frontend prototyping.",
  },
];

const clickStorageKey = "developer-tools-affiliate-clicks";

type AffiliateClickEvent = {
  affiliateId: string;
  slug: string;
  clickedAt: string;
};

export function getAffiliateSuggestions(contexts: AffiliateContext[], limit = 3) {
  const matches = contexts.flatMap((context) =>
    affiliateCatalog.filter((item) => item.tags.includes(context)),
  );

  return uniqueBy(matches, (item) => item.id).slice(0, limit);
}

export function trackAffiliateClick(affiliateId: string, slug: string) {
  if (typeof window === "undefined") {
    return;
  }

  const nextEvent: AffiliateClickEvent = {
    affiliateId,
    slug,
    clickedAt: new Date().toISOString(),
  };

  const existing = (() => {
    try {
      const raw = window.localStorage.getItem(clickStorageKey);
      return raw ? (JSON.parse(raw) as AffiliateClickEvent[]) : [];
    } catch {
      return [] as AffiliateClickEvent[];
    }
  })();

  window.localStorage.setItem(
    clickStorageKey,
    JSON.stringify([nextEvent, ...existing].slice(0, 30)),
  );

  if ("gtag" in window && typeof window.gtag === "function") {
    window.gtag("event", "affiliate_click", {
      affiliate_id: affiliateId,
      tool_slug: slug,
    });
  }
}
