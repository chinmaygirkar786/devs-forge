import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export function createPwaIcon(size: number, maskable = false) {
  const inset = maskable ? Math.round(size * 0.18) : 0;
  const inner = size - inset * 2;
  const fontSize = Math.round(inner * 0.42);
  const borderRadius = maskable ? 0 : Math.round(inner * 0.22);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: maskable ? "#4F46E5" : "linear-gradient(135deg, #4F46E5, #06B6D4)",
        padding: inset,
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius,
          background: maskable ? "transparent" : "linear-gradient(135deg, #4F46E5, #06B6D4)",
          color: "white",
          fontSize,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        {siteConfig.logoMark}
      </div>
    </div>,
    {
      width: size,
      height: size,
    },
  );
}
