/**
 * SHA-256 (base64) of the inline theme bootstrap in `src/lib/theme.ts`.
 * Reference only — do not add to `script-src` alongside `'unsafe-inline'` (browsers ignore inline).
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
].join(", ");

/** Cloudflare Web Analytics beacon (injected by the Cloudflare dashboard). */
const CLOUDFLARE_ANALYTICS_SCRIPT = "https://static.cloudflareinsights.com";
const CLOUDFLARE_ANALYTICS_CONNECT = "https://cloudflareinsights.com";

/**
 * CSP for a Next.js App Router + Tailwind app.
 * Enforced in production only — report-only is omitted because Chrome DevTools
 * still logs CSP Issues (hurts Lighthouse Best Practices) without blocking anything.
 */
export function buildContentSecurityPolicy() {
  const directives = [
    "default-src 'self'",
    [
      "script-src",
      "'self'",
      // Do not combine hashes/nonces with 'unsafe-inline' — browsers ignore inline allowance.
      "'unsafe-inline'",
      CLOUDFLARE_ANALYTICS_SCRIPT,
    ].join(" "),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    ["connect-src", "'self'", CLOUDFLARE_ANALYTICS_CONNECT].join(" "),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
    ["worker-src", "'self'", "blob:"].join(" "),
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}

export type SecurityHeaderRow = {
  key: string;
  value: string;
};

function shouldApplyCsp() {
  return process.env.NODE_ENV === "production" && process.env.SECURITY_CSP_DISABLE !== "true";
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
    rows.push({
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy(),
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
