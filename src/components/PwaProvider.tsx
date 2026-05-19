"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const bannerClassName =
  "pwa-install-banner fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6";

const actionButtonClassName =
  "cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground";

const primaryButtonClassName =
  "cursor-pointer rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background";

function detectIos() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function detectStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function PwaProvider() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((error) => {
          console.error("[pwa] Service worker registration failed:", error);
        });
    }

    const updateInstalled = () => {
      setIsInstalled(detectStandalone());
    };

    updateInstalled();

    const media = window.matchMedia("(display-mode: standalone)");
    media.addEventListener("change", updateInstalled);

    if (detectIos() && !detectStandalone()) {
      setShowIosHint(true);
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstallEvent(null);
      setShowIosHint(false);
      setIsInstalled(true);
      setDismissed(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      media.removeEventListener("change", updateInstalled);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      setInstallEvent(null);
    }

    setDismissed(true);
  }

  if (isInstalled || dismissed) {
    return null;
  }

  if (installEvent) {
    return (
      <div className={bannerClassName} role="region" aria-label="Install app">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Install Devs Forge</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add to your home screen or desktop for quick access to developer tools.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className={actionButtonClassName}
            >
              Not now
            </button>
            <button
              type="button"
              onClick={handleInstall}
              className={primaryButtonClassName}
            >
              Install
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showIosHint) {
    return null;
  }

  return (
    <div className={bannerClassName} role="region" aria-label="Install app on iOS">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Install on iPhone or iPad</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the Share button in Safari, then choose &quot;Add to Home Screen&quot;.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className={`${actionButtonClassName} shrink-0`}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
