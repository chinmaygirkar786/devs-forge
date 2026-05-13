export const siteConfig = {
  name: "Developer Tools Hub",
  shortName: "DevTools Hub",
  description:
    "Fast, free developer tools for formatting, decoding, generating, and converting code and data directly in your browser.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://developer-tools-hub.vercel.app",
  creator: "Developer Tools Hub",
  socialHandle: "@devtoolshub",
  heroTitle: "Developer Tools for Everyday Productivity",
  heroDescription:
    "Use instant online utilities for JSON, JWTs, regex, timestamps, HTML, Markdown, colors, UUIDs, URLs, and more without leaving your workflow.",
  navigation: [
    { href: "/", label: "Home" },
    { href: "/#popular-tools", label: "Popular Tools" },
    { href: "/#categories", label: "Categories" },
  ],
};

export const deploymentNotes = {
  analyticsEventName: "affiliate_click",
  futureAffiliatePlaceholder:
    "Replace placeholder affiliate URLs in src/lib/affiliate.ts before launch monetization.",
};
