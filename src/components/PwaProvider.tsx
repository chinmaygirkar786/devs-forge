"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const DISMISS_KEY = "pwa-install-dismissed";

const bannerClassName =
  "pwa-install-banner fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6";

const actionButtonClassName =
  "cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground";

function detectIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function detectStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isInstallDismissed() {
  return sessionStorage.getItem(DISMISS_KEY) === "1";
}

function resolveInstallHint(): "ios" | "desktop" | null {
  if (isInstallDismissed() || detectStandalone()) {
    return null;
  }

  if (detectIos()) {
    return "ios";
  }

  return "desktop";
}

function getInstallHintServerSnapshot() {
  return null;
}

function subscribeInstallUi(onStoreChange: () => void) {
  const media = window.matchMedia("(display-mode: standalone)");

  const onAppInstalled = () => {
    sessionStorage.removeItem(DISMISS_KEY);
    onStoreChange();
  };

  media.addEventListener("change", onStoreChange);
  window.addEventListener("appinstalled", onAppInstalled);

  return () => {
    media.removeEventListener("change", onStoreChange);
    window.removeEventListener("appinstalled", onAppInstalled);
  };
}

export function PwaProvider() {
  const [dismissed, setDismissed] = useState(false);

  const hint = useSyncExternalStore(
    subscribeInstallUi,
    () => (dismissed ? null : resolveInstallHint()),
    getInstallHintServerSnapshot,
  );

  function dismissInstallUi() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
        console.error("[pwa] Service worker registration failed:", error);
      });
    }
  }, []);

  if (!hint) {
    return null;
  }

  if (hint === "ios") {
    return (
      <div className={bannerClassName} role="region" aria-label="Install app on iOS">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-foreground text-sm font-semibold">Install on iPhone or iPad</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Tap the Share button in Safari, then choose &quot;Add to Home Screen&quot;.
            </p>
          </div>
          <button
            type="button"
            onClick={dismissInstallUi}
            className={`${actionButtonClassName} shrink-0`}
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={bannerClassName} role="region" aria-label="Install app">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-foreground text-sm font-semibold">Install Devs Forge</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Use the install icon in your browser&apos;s address bar or menu when it appears.
          </p>
        </div>
        <button
          type="button"
          onClick={dismissInstallUi}
          className={`${actionButtonClassName} shrink-0`}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
