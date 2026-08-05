import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px",
        background: "#0a0a0a",
        color: "#EDEDED",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "64px",
            width: "64px",
            borderRadius: "16px",
            background: "#EDEDED",
            alignItems: "center",
            justifyContent: "center",
            color: "#0a0a0a",
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          {siteConfig.logoMark}
        </div>
        <div
          style={{
            fontSize: "26px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#A1A1A1",
          }}
        >
          {siteConfig.domain}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1.1 }}>
          {siteConfig.heroTitle}
        </div>
        <div style={{ fontSize: "28px", lineHeight: 1.5, color: "#A1A1A1" }}>
          Fast browser-based utilities for JSON, JWT, regex, HTML, timestamps, colors, Markdown, and
          more.
        </div>
      </div>
    </div>,
    size,
  );
}
