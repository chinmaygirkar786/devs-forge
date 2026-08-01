import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PwaProviderDeferred } from "@/components/PwaProviderDeferred";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isMacUserAgent } from "@/lib/platform";
import { siteConfig } from "@/lib/site";
import { toolSearchIndex } from "@/lib/tool-search-index";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.heroTitle} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    shortcut: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isMac = isMacUserAgent(userAgent);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      {...(isMac ? { "data-mac": "" } : {})}
      className={`${geistSans.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.className} flex min-h-full flex-col`}>
        <TooltipProvider delayDuration={150}>
          <Navbar searchIndex={toolSearchIndex} isMac={isMac} />
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-8 pb-10 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
          <PwaProviderDeferred />
        </TooltipProvider>
      </body>
    </html>
  );
}
