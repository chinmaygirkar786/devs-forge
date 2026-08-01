"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackAffiliateClick, type AffiliateItem } from "@/lib/affiliate";

type AffiliateBoxProps = {
  slug: string;
  items: AffiliateItem[];
};

export function AffiliateBox({ slug, items }: AffiliateBoxProps) {
  return (
    <aside className="surface-card rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.22em] uppercase">
            Recommended Developer Tools
          </p>
          <h3 className="text-foreground mt-2 text-xl font-bold">
            Tools that may help your workflow
          </h3>
        </div>
        <Badge variant="secondary" className="shrink-0 whitespace-nowrap">
          Affiliate-ready
        </Badge>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="surface-muted rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-foreground font-semibold">{item.name}</h4>
                <p className="text-muted-foreground mt-1 text-sm leading-6">{item.description}</p>
                <p className="text-muted-foreground mt-2 text-xs leading-5">{item.note}</p>
              </div>
            </div>

            {item.href ? (
              <Button asChild className="mt-4 rounded-full">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => trackAffiliateClick(item.id, slug)}
                >
                  {item.cta}
                </a>
              </Button>
            ) : (
              <Button type="button" variant="outline" disabled className="mt-4 rounded-full">
                {item.cta}
              </Button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
