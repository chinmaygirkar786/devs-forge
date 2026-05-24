type PostHogClient = typeof import("posthog-js").default;

type CaptureProperties = Record<string, string | number | boolean | null>;

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

let client: PostHogClient | null = null;
let initPromise: Promise<PostHogClient | null> | null = null;

export function initPosthog() {
  if (!token || typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (client) {
    return Promise.resolve(client);
  }

  initPromise ??= import("posthog-js").then(({ default: posthog }) => {
    if (!posthog.__loaded) {
      posthog.init(token, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        defaults: "2026-01-30",
        capture_exceptions: true,
        debug: process.env.NODE_ENV === "development",
      });
    }

    client = posthog;
    return posthog;
  });

  return initPromise;
}

export function capturePosthog(event: string, properties?: CaptureProperties) {
  void initPosthog().then((posthog) => {
    posthog?.capture(event, properties);
  });
}

/** Load analytics after first paint so PostHog does not bloat the critical JS bundle. */
export function schedulePosthogBootstrap() {
  if (!token || typeof window === "undefined") {
    return;
  }

  const run = () => {
    void initPosthog();
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 2500 });
    return;
  }

  setTimeout(run, 1500);
}
