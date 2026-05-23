/** Detect Apple desktop/mobile UA for keyboard shortcut labeling (⌘ vs CTRL). */
export function isMacUserAgent(userAgent: string) {
  return /Macintosh|Mac OS X|iPhone|iPad|iPod/i.test(userAgent);
}
