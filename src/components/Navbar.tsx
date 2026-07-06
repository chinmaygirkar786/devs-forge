"use client";

import Link from "next/link";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import { capturePosthog } from "@/lib/posthog";
import { DeferredThemeToggle } from "@/components/DeferredThemeToggle";
import { SearchShortcutHint } from "@/components/SearchShortcutHint";
import { SiteLogo } from "@/components/SiteLogo";
import type { ToolSearchEntry } from "@/lib/tool-search-index";
import { siteConfig } from "@/lib/site";

const CommandPalette = lazy(() =>
  import("@/components/CommandPalette").then((module) => ({
    default: module.CommandPalette,
  })),
);

function preloadCommandPalette() {
  void import("@/components/CommandPalette");
}

type NavbarProps = {
  searchIndex: ToolSearchEntry[];
  isMac: boolean;
};

export function Navbar({ searchIndex, isMac }: NavbarProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteMounted, setPaletteMounted] = useState(false);

  const openPalette = useCallback((trigger: "button" | "keyboard") => {
    setPaletteMounted(true);
    setPaletteOpen(true);
    capturePosthog("command_palette_opened", { trigger });
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((current) => {
          if (!current) {
            setPaletteMounted(true);
            capturePosthog("command_palette_opened", { trigger: "keyboard" });
          }
          return !current;
        });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="border-border/80 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" prefetch className="flex items-center gap-3">
              <SiteLogo />
              <span className="text-foreground text-lg font-bold">{siteConfig.name}</span>
            </Link>

            <nav className="text-muted-foreground hidden items-center gap-5 text-sm lg:flex">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openPalette("button")}
              onMouseEnter={preloadCommandPalette}
              onFocus={preloadCommandPalette}
              className="nav-search-trigger surface-muted text-muted-foreground hidden cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium sm:flex"
            >
              <span>Search tools</span>
              <span className="nav-search-kbd border-border inline-flex min-w-[4.75rem] shrink-0 items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap">
                <SearchShortcutHint isMac={isMac} />
              </span>
            </button>
            <DeferredThemeToggle />
          </div>
        </div>
      </header>

      {paletteMounted ? (
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
