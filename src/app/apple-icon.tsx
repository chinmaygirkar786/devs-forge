import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 40,
        background: "#0a0a0a",
        color: "#ffffff",
        fontSize: 72,
        fontWeight: 800,
        fontFamily: "sans-serif",
      }}
    >
      {siteConfig.logoMark}
    </div>,
    size,
  );
}
