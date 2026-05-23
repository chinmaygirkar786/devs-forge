/**
 * SHA-256 (base64) of the inline theme bootstrap in `src/lib/theme.ts`.
 * Recompute when `themeScript` changes: `node -e "..."` or update `public/_headers` too.
 */
export const themeScriptSha256 = "oo3FANOraHvAaybf9nQ/2E6O07se9p9X/uLTT5PVox8=";

const permissionsPolicy = [
  "accelerometer=()",
  "camera=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "payment=()",
  "usb=()",
  "interest-cohort=()",
].join(", ");

/**
 * CSP for a Next.js App Router + Tailwind + PostHog (`/ingest` proxy) app.
 * Enforced only when `SECURITY_CSP_ENFORCE=true`; otherwise report-only in production.
 */
export function buildContentSecurityPolicy(): string {
  const directives = [
    "default-src 'self'",
    [
      "script-src",
      "'self'",
      "'unsafe-inline'",
      `'sha256-${themeScriptSha256}'`,
      "https://us-assets.i.posthog.com",
    ].join(" "),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    ["connect-src", "'self'", "https://us.i.posthog.com", "https://us.posthog.com"].join(" "),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}

export type SecurityHeaderRow = {
  key: string;
  value: string;
};

function shouldApplyCsp() {
  return process.env.NODE_ENV === "production";
}

function isEnforcingCsp() {
  return process.env.SECURITY_CSP_ENFORCE === "true";
}

/** Security headers safe for HTML pages and static assets (CSP only affects documents). */
export function getSecurityHeaderRows(): SecurityHeaderRow[] {
  const rows: SecurityHeaderRow[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Permissions-Policy", value: permissionsPolicy },
    { key: "X-DNS-Prefetch-Control", value: "off" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];

  if (process.env.NODE_ENV === "production") {
    rows.push({
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains; preload",
    });
  }

  if (shouldApplyCsp()) {
    const policy = buildContentSecurityPolicy();
    rows.push({
      key: isEnforcingCsp() ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
      value: policy,
    });
  }

  return rows;
}

function applySecurityHeaderRows(headers: Headers) {
  for (const { key, value } of getSecurityHeaderRows()) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }
}

/** Clone a Worker/fetch `Response` with security headers applied. */
export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  applySecurityHeaderRows(headers);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** Apply headers on a Next.js middleware response without replacing the instance. */
export function applySecurityHeadersInPlace<T extends Response>(response: T): T {
  applySecurityHeaderRows(response.headers);
  return response;
}

/**
 * `public/_headers` for Cloudflare static assets — update manually when CSP changes
 * (theme script hash or directives). Run `npm run typecheck` after edits.
 */
export function formatCloudflareHeadersFile(): string {
  const lines = [
    "# https://developers.cloudflare.com/workers/static-assets/headers/",
    "# Global security headers (static assets + fallthrough)",
    "/*",
    ...getSecurityHeaderRows().map(({ key, value }) => `  ${key}: ${value}`),
    "",
    "# Long-cache hashed build assets",
    "/_next/static/*",
    "  Cache-Control: public,max-age=31536000,immutable",
    "",
  ];

  return lines.join("\n");
}
