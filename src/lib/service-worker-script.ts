import { loadPrecacheManifest } from "@/lib/precache-manifest";

/** Service worker source served at /sw.js (browser install only, not for direct viewing). */
export function buildServiceWorkerScript(): string {
  const manifest = loadPrecacheManifest();
  const manifestJson = JSON.stringify(manifest);

  return `const PRECACHE_MANIFEST = ${manifestJson};
const SW_CACHE_REVISION = "3";
const CACHE_VERSION = "devs-forge-" + PRECACHE_MANIFEST.version + "-" + SW_CACHE_REVISION;
const STATIC_CACHE = CACHE_VERSION + "-static";
const PAGES_CACHE = CACHE_VERSION + "-pages";
const PRECACHE_PAGES = new Set(PRECACHE_MANIFEST.pages.filter(isHtmlPagePath));
const OFFLINE_URL = "/offline";
const PRECACHE_BATCH_SIZE = 8;

self.addEventListener("install", (event) => {
  event.waitUntil(
    precacheAll()
      .then(() => {
        if (!self.registration.active) {
          return self.skipWaiting();
        }
      })
      .then(() =>
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "PRECACHE_COMPLETE" });
          });
        }),
      )
      .catch(() => undefined),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (
    url.pathname.startsWith("/pwa/") ||
    url.pathname === "/sw.js" ||
    url.pathname.endsWith(".webmanifest")
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (isNextRouterRequest(request)) {
    event.respondWith(cacheFirstRsc(request, event));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(cacheFirstNavigation(request, event));
    return;
  }

  event.respondWith(networkFirst(request, STATIC_CACHE));
});

function isHtmlPagePath(pathname) {
  return !pathname.includes(".") && !pathname.startsWith("/pwa/");
}

function isNextRouterRequest(request) {
  return (
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-Prefetch") === "1" ||
    request.headers.get("Next-Router-Segment-Prefetch") === "1" ||
    (request.headers.get("accept") ?? "").includes("text/x-component")
  );
}

function normalizePathname(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function documentCacheKey(pathname) {
  return self.location.origin + "/__devs_forge_cache__/doc" + normalizePathname(pathname);
}

function rscCacheKey(pathname) {
  return self.location.origin + "/__devs_forge_cache__/rsc" + normalizePathname(pathname);
}

function pageDocumentRequest(pathname) {
  return new Request(self.location.origin + normalizePathname(pathname), {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Accept: "text/html,application/xhtml+xml",
    },
  });
}

function pageRscRequest(pathname) {
  return new Request(self.location.origin + normalizePathname(pathname), {
    method: "GET",
    credentials: "same-origin",
    headers: {
      RSC: "1",
      Accept: "text/x-component",
    },
  });
}

async function cloneResponseForCache(response) {
  const body = await response.clone().arrayBuffer();
  const headers = new Headers();

  for (const header of ["content-type", "cache-control", "x-nextjs-cache", "x-nextjs-prerender"]) {
    const value = response.headers.get(header);

    if (value) {
      headers.set(header, value);
    }
  }

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function putCachedDocument(cache, pathname, response) {
  if (!response.ok) {
    return;
  }

  await cache.put(documentCacheKey(pathname), await cloneResponseForCache(response));
}

async function putCachedRsc(cache, pathname, response) {
  if (!response.ok) {
    return;
  }

  await cache.put(rscCacheKey(pathname), await cloneResponseForCache(response));
}

async function getCachedDocument(cache, pathname) {
  return cache.match(documentCacheKey(pathname));
}

async function getCachedRsc(cache, pathname) {
  return cache.match(rscCacheKey(pathname));
}

async function precacheAll() {
  const pageCache = await caches.open(PAGES_CACHE);
  const staticCache = await caches.open(STATIC_CACHE);

  await precacheHtmlPages(pageCache, PRECACHE_MANIFEST.pages.filter(isHtmlPagePath));
  await precacheUrls(staticCache, PRECACHE_MANIFEST.assets);
  await precacheUrls(staticCache, PRECACHE_MANIFEST.pages.filter((url) => !isHtmlPagePath(url)));
}

async function precacheHtmlPages(cache, pathnames) {
  for (let index = 0; index < pathnames.length; index += PRECACHE_BATCH_SIZE) {
    const batch = pathnames.slice(index, index + PRECACHE_BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async (pathname) => {
        const normalizedPath = normalizePathname(pathname);

        try {
          const documentResponse = await fetch(pageDocumentRequest(normalizedPath));

          if (documentResponse.ok) {
            await putCachedDocument(cache, normalizedPath, documentResponse);
          }
        } catch {
          // Ignore per-page precache failures.
        }

        try {
          const rscResponse = await fetch(pageRscRequest(normalizedPath));

          if (rscResponse.ok) {
            await putCachedRsc(cache, normalizedPath, rscResponse);
          }
        } catch {
          // Ignore per-page RSC precache failures.
        }
      }),
    );
  }
}

async function precacheUrls(cache, urls) {
  for (let index = 0; index < urls.length; index += PRECACHE_BATCH_SIZE) {
    const batch = urls.slice(index, index + PRECACHE_BATCH_SIZE);

    await Promise.allSettled(
      batch.map((url) =>
        fetch(url, { credentials: "same-origin" })
          .then((response) => {
            if (response.ok) {
              return cache.put(url, response.clone());
            }

            return undefined;
          })
          .catch(() => undefined),
      ),
    );
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return cached ?? Response.error();
  }
}

async function cacheFirstNavigation(request, fetchEvent) {
  const cache = await caches.open(PAGES_CACHE);
  const pathname = normalizePathname(new URL(request.url).pathname);
  const cached = await getCachedDocument(cache, pathname);

  const revalidate = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await putCachedDocument(cache, pathname, response);
      }
    })
    .catch(() => undefined);

  if (cached) {
    fetchEvent.waitUntil(revalidate);
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      await putCachedDocument(cache, pathname, response);
    }

    return response;
  } catch {
    return offlineFallback(cache);
  }
}

async function cacheFirstRsc(request, fetchEvent) {
  const cache = await caches.open(PAGES_CACHE);
  const pathname = normalizePathname(new URL(request.url).pathname);
  const cached = await getCachedRsc(cache, pathname);

  const revalidate = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await putCachedRsc(cache, pathname, response);
      }
    })
    .catch(() => undefined);

  if (cached) {
    fetchEvent.waitUntil(revalidate);
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      await putCachedRsc(cache, pathname, response);
    }

    return response;
  } catch {
    const document = await getCachedDocument(cache, pathname);

    if (document && PRECACHE_PAGES.has(pathname)) {
      fetchEvent.waitUntil(
        self.clients.matchAll({ type: "window" }).then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "HARD_NAVIGATE", url: pathname });
          });
        }),
      );
    }

    return Response.error();
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cached = await cache.match(request);
    return cached ?? Response.error();
  }
}

async function offlineFallback(cache) {
  const offlinePage = await getCachedDocument(cache, OFFLINE_URL);

  if (offlinePage) {
    return offlinePage;
  }

  return new Response("You are offline. Reconnect to use Devs Forge.", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
`;
}

/** @deprecated Use buildServiceWorkerScript() so the precache manifest is injected at serve time. */
export const serviceWorkerScript = buildServiceWorkerScript();
