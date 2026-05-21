"use client";

import Link from "next/link";
import { lazy, Suspense, useEffect, useState } from "react";

import { SiteLogo } from "@/components/SiteLogo";
import { ThemeToggleLazy } from "@/components/ThemeToggleLazy";
import type { ToolSearchEntry } from "@/lib/tool-search-index";
import { siteConfig } from "@/lib/site";

const CommandPalette = lazy(() =>
  import("@/components/CommandPalette").then((module) => ({
    default: module.CommandPalette,
  })),
);

type NavbarProps = {
  searchIndex: ToolSearchEntry[];
};

export function Navbar({ searchIndex }: NavbarProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <SiteLogo />
              <span className="text-lg font-bold text-foreground">{siteConfig.name}</span>
            </Link>

            <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
              {siteConfig.navigation.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="surface-muted hidden cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:flex"
            >
              <span>Search tools</span>
              <span className="inline-flex min-w-[4.75rem] shrink-0 items-center justify-center rounded-full border border-border px-3 py-1 text-xs font-semibold whitespace-nowrap">
                Ctrl + K
              </span>
            </button>
            <ThemeToggleLazy />
          </div>
        </div>
      </header>

      {paletteOpen ? (
        <Suspense fallback={null}>
          <CommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            searchIndex={searchIndex}
          />
        </Suspense>
      ) : null}
    </>
  );
}
