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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Recommended Developer Tools
          </p>
          <h3 className="mt-2 text-xl font-bold text-foreground">
            Tools that may help your workflow
          </h3>
        </div>
        <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-accent">
          Affiliate-ready
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="surface-muted rounded-2xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-foreground">{item.name}</h4>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {item.note}
                </p>
              </div>
            </div>

            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => trackAffiliateClick(item.id, slug)}
                className="mt-4 inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
              >
                {item.cta}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-4 inline-flex cursor-not-allowed rounded-full border border-dashed border-border-strong px-4 py-2 text-sm font-semibold text-muted-foreground"
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
