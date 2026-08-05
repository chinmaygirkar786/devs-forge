import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export function createFaviconIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        background: "#0a0a0a",
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 800,
        fontFamily: "sans-serif",
      }}
    >
      {siteConfig.logoMark}
    </div>,
    {
      width: 32,
      height: 32,
    },
  );
}
