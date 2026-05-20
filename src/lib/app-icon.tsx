import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export function createFaviconIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: "linear-gradient(135deg, #4F46E5, #06B6D4)",
          color: "white",
          fontSize: 14,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        {siteConfig.logoMark}
      </div>
    ),
    {
      width: 32,
      height: 32,
    },
  );
}
