import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/lib/internal-links";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="page-fade mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-primary text-sm font-semibold tracking-[0.22em] uppercase">Offline mode</p>
      <h1 className="text-foreground mt-4 text-3xl font-black tracking-tight sm:text-4xl">
        You&apos;re offline
      </h1>
      <p className="text-muted-foreground mt-4 text-base leading-8">
        {siteConfig.name} tools run in your browser. Open a cached tool to keep working without a
        network connection.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={routes.toolsIndex}
          className="bg-foreground text-background rounded-full px-5 py-3 text-sm font-semibold"
        >
          Browse tools
        </Link>
        <Link
          href="/"
          className="border-border text-foreground rounded-full border px-5 py-3 text-sm font-semibold"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
