import type { NextConfig } from "next";

import { staticAssetCacheHeaderRows } from "./src/lib/static-asset-cache";
import { getSecurityHeaderRows } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["lucide-react", "react-markdown"],
  },
  async redirects() {
    return [
      {
        source: "/cdn-cgi/rum",
        destination: "/",
        permanent: false,
      },
    ];
  },
  async headers() {
    const cacheHeaders = staticAssetCacheHeaderRows.map(({ key, value }) => ({ key, value }));

    return [
      { source: "/robots.txt", headers: cacheHeaders },
      { source: "/sitemap.xml", headers: cacheHeaders },
      { source: "/icon", headers: cacheHeaders },
      { source: "/apple-icon", headers: cacheHeaders },
      { source: "/favicon.ico", headers: cacheHeaders },
      { source: "/manifest.webmanifest", headers: cacheHeaders },
      { source: "/pwa/:path*", headers: cacheHeaders },
      {
        source: "/:path*",
        headers: getSecurityHeaderRows(),
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/chunks/:path*",
        headers: [
          {
            key: "Vary",
            value: "Sec-Fetch-Dest, Sec-Fetch-Site, Sec-Fetch-Mode",
          },
        ],
      },
    ];
  },
};

function withOptionalBundleAnalyzer(config: NextConfig): NextConfig {
  if (process.env.ANALYZE !== "true") {
    return config;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bundleAnalyzer = require("@next/bundle-analyzer");
  return bundleAnalyzer({ enabled: true })(config);
}

export default withOptionalBundleAnalyzer(nextConfig);

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
