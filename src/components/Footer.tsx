import Link from "next/link";

import { SiteLogo } from "@/components/SiteLogo";

function HeartIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="text-accent h-4 w-4 shrink-0"
      fill="currentColor"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
import { routes } from "@/lib/internal-links";
import { siteConfig } from "@/lib/site";
import { tools } from "@/tools";

export function Footer() {
  const footerTools = tools.slice(0, 6);

  return (
    <footer className="border-border mt-20 border-t">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <SiteLogo size="sm" />
            <h2 className="text-foreground text-2xl font-bold">{siteConfig.name}</h2>
          </div>
          <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-7">
            {siteConfig.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link
              href={routes.toolsIndex}
              prefetch={false}
              className="text-foreground hover:text-primary font-medium"
            >
              All tools
            </Link>
            <Link
              href={routes.about}
              prefetch={false}
              className="text-foreground hover:text-primary font-medium"
            >
              About
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground text-sm font-semibold tracking-[0.2em] uppercase">
            Popular tools
          </h3>
          <div className="mt-4 space-y-3">
            {footerTools.map((tool) => (
              <Link
                key={tool.slug}
                href={routes.tool(tool.slug)}
                prefetch={false}
                className="text-foreground hover:text-primary flex items-center gap-2 text-sm"
              >
                <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
                {tool.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground text-sm font-semibold tracking-[0.2em] uppercase">
            Explore
          </h3>
          <ul className="text-muted-foreground mt-4 space-y-3 text-sm">
            <li>
              <Link href={routes.toolsIndex} prefetch={false} className="hover:text-foreground">
                Full tools directory
              </Link>
            </li>
            <li>
              <Link
                href={routes.category("formatting")}
                prefetch={false}
                className="hover:text-foreground"
              >
                Formatting tools
              </Link>
            </li>
            <li>
              <Link
                href={routes.category("utilities")}
                prefetch={false}
                className="hover:text-foreground"
              >
                Developer utilities
              </Link>
            </li>
            <li>Local-only workflows for speed and privacy</li>
          </ul>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:justify-end">
            Made with
            <span className="inline-flex items-center gap-1">
              <HeartIcon />
              <span>love</span>
            </span>
            by <span className="text-foreground font-medium">Chinmay Girkar</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
