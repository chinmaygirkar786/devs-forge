"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const DISMISS_KEY = "pwa-install-dismissed";
const UPDATE_DISMISS_KEY = "pwa-update-dismissed";

const bannerClassName =
  "pwa-install-banner fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6";

const actionButtonClassName =
  "cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground";

const primaryButtonClassName =
  "cursor-pointer rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background";

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

function shouldRegisterServiceWorker() {
  return process.env.NODE_ENV === "production";
}

export function PwaProvider() {
  const [dismissed, setDismissed] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [precaching, setPrecaching] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const hint = useSyncExternalStore(
    subscribeInstallUi,
    () => (dismissed ? null : resolveInstallHint()),
    getInstallHintServerSnapshot,
  );

  function dismissInstallUi() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  const applyUpdate = useCallback(() => {
    sessionStorage.removeItem(UPDATE_DISMISS_KEY);
    sessionStorage.setItem("pwa-reload-pending", "1");
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setUpdateAvailable(false);
  }, [waitingWorker]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (!shouldRegisterServiceWorker()) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      });
      return;
    }

    const onControllerChange = () => {
      if (sessionStorage.getItem("pwa-reload-pending") !== "1") {
        return;
      }

      sessionStorage.removeItem("pwa-reload-pending");
      window.location.reload();
    };

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "PRECACHE_COMPLETE") {
        setPrecaching(false);
      }

      if (event.data?.type === "HARD_NAVIGATE" && typeof event.data.url === "string") {
        const target = event.data.url;

        if (window.location.pathname !== target) {
          window.location.assign(target);
        }
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    navigator.serviceWorker.addEventListener("message", onMessage);

    void navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        if (!navigator.serviceWorker.controller) {
          setPrecaching(true);
        }

        const trackWaitingWorker = (worker: ServiceWorker | null) => {
          if (!worker) {
            return;
          }

          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller &&
              sessionStorage.getItem(UPDATE_DISMISS_KEY) !== "1"
            ) {
              setWaitingWorker(worker);
              setUpdateAvailable(true);
            }
          });
        };

        trackWaitingWorker(registration.waiting);

        registration.addEventListener("updatefound", () => {
          trackWaitingWorker(registration.installing);
        });
      })
      .catch(() => {
        setPrecaching(false);
      });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, []);

  const showUpdateBanner = updateAvailable && !precaching;
  const showPrecacheBanner = precaching && !updateAvailable;
  const showInstallBanner = Boolean(hint) && !showUpdateBanner && !showPrecacheBanner;

  return (
    <>
      {showPrecacheBanner ? (
        <div className={bannerClassName} role="status" aria-live="polite">
          <p className="text-foreground text-sm font-semibold">Preparing offline tools</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Caching pages and scripts so every tool works without a network connection.
          </p>
        </div>
      ) : null}

      {showUpdateBanner ? (
        <div className={bannerClassName} role="region" aria-label="App update available">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-foreground text-sm font-semibold">Update available</p>
              <p className="text-muted-foreground mt-1 text-sm">
                A new version of Devs Forge is ready. Refresh to get the latest tools and fixes.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem(UPDATE_DISMISS_KEY, "1");
                  setUpdateAvailable(false);
                }}
                className={actionButtonClassName}
              >
                Later
              </button>
              <button type="button" onClick={applyUpdate} className={primaryButtonClassName}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showInstallBanner && hint === "ios" ? (
        <div className={bannerClassName} role="region" aria-label="Install app on iOS">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-foreground text-sm font-semibold">Install on iPhone or iPad</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Tap the Share button in Safari, then choose &quot;Add to Home Screen&quot;.
              </p>
            </div>
            <button type="button" onClick={dismissInstallUi} className={`${actionButtonClassName} shrink-0`}>
              Got it
            </button>
          </div>
        </div>
      ) : null}

      {showInstallBanner && hint === "desktop" ? (
        <div className={bannerClassName} role="region" aria-label="Install app">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-foreground text-sm font-semibold">Install Devs Forge</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Use the install icon in your browser&apos;s address bar or menu when it appears.
              </p>
            </div>
            <button type="button" onClick={dismissInstallUi} className={`${actionButtonClassName} shrink-0`}>
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
