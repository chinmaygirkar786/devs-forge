import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `About | ${siteConfig.name}` },
  description:
    "Learn about Devs Forge — free browser-based developer tools for formatting, decoding, generating, and converting code without uploads or accounts.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
};

export default function AboutPage() {
  return (
    <div className="page-fade">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      <section className="surface-card rounded-[2rem] p-6 sm:p-8">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          About {siteConfig.name}
        </h1>
        <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
          <p>
            {siteConfig.name} is a collection of free online developer tools built for
            everyday engineering tasks. Format JSON, decode JWTs, test regex patterns,
            convert timestamps, and more — directly in your browser.
          </p>
          <p>
            Privacy matters: inputs are processed locally on your device. We do not
            require accounts, and tool data is not uploaded to our servers for normal
            use.
          </p>
          <p>
            Explore the full catalog on the{" "}
            <Link href="/tools" className="font-semibold text-primary hover:underline">
              tools index
            </Link>
            , or start with a popular utility like the{" "}
            <Link
              href="/tools/json-formatter"
              className="font-semibold text-primary hover:underline"
            >
              JSON formatter
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
