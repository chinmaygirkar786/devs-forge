import Link from "next/link";

import { SiteLogo } from "@/components/SiteLogo";
import { siteConfig } from "@/lib/site";
import { tools } from "@/tools";

export function Footer() {
  const footerTools = tools.slice(0, 6);

  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <SiteLogo size="sm" />
            <h2 className="text-2xl font-bold text-foreground">{siteConfig.name}</h2>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Popular tools
          </h3>
          <div className="mt-4 space-y-3">
            {footerTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="block text-sm text-foreground hover:text-primary"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Built for SEO
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Static generation for tool routes</li>
            <li>Structured metadata and strong internal linking</li>
            <li>Local-only workflows for speed and privacy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
