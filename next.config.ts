import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    return [
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

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
