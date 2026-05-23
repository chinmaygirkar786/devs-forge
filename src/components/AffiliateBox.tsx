"use client";

import { trackAffiliateClick, type AffiliateItem } from "@/lib/affiliate";

type AffiliateBoxProps = {
  slug: string;
  items: AffiliateItem[];
};

export function AffiliateBox({ slug, items }: AffiliateBoxProps) {
  return (
    <aside className="surface-card rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">
            Recommended Developer Tools
          </p>
          <h3 className="text-foreground mt-2 text-xl font-bold">
            Tools that may help your workflow
          </h3>
        </div>
        <span className="bg-accent-soft text-accent inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap">
          Affiliate-ready
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="surface-muted rounded-2xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-foreground font-semibold">{item.name}</h4>
                <p className="text-muted-foreground mt-1 text-sm leading-6">{item.description}</p>
                <p className="text-muted-foreground mt-2 text-xs leading-5">{item.note}</p>
              </div>
            </div>

            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => trackAffiliateClick(item.id, slug)}
                className="bg-foreground text-background mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold"
              >
                {item.cta}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="border-border-strong text-muted-foreground mt-4 inline-flex cursor-not-allowed rounded-full border border-dashed px-4 py-2 text-sm font-semibold"
              >
                {item.cta}
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
