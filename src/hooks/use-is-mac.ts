"use client";

import { usePlatform } from "@/components/PlatformProvider";

/** macOS / iOS shortcut labeling — seeded from the request User-Agent on the server. */
export function useIsMac() {
  return usePlatform().isMac;
}
