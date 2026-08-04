import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/social-icons";
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
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <section className="surface-card rounded-[2rem] p-6 sm:p-8">
        <h1 className="text-foreground text-4xl font-black tracking-tight">
          About {siteConfig.name}
        </h1>
        <div className="text-muted-foreground mt-6 space-y-4 text-base leading-8">
          <p>
            {siteConfig.name} is a collection of free online developer tools built for everyday
            engineering tasks. Format JSON, decode JWTs, test regex patterns, convert timestamps,
            and more — directly in your browser.
          </p>
          <p>
            Privacy matters: inputs are processed locally on your device. We do not require
            accounts, and tool data is not uploaded to our servers for normal use.
          </p>
          <p>
            Explore the full catalog on the{" "}
            <Link href="/tools" className="text-primary font-semibold hover:underline">
              tools index
            </Link>
            , or start with a popular utility like the{" "}
            <Link
              href="/tools/json-formatter"
              className="text-primary font-semibold hover:underline"
            >
              JSON formatter
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="surface-card mt-8 rounded-[2rem] p-6 sm:p-8">
        <Badge variant="secondary" className="tracking-[0.14em] uppercase">
          Built by
        </Badge>
        <h2 className="text-foreground mt-4 text-3xl font-black tracking-tight">
          Chinmay Girish Girkar
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-8">
          Hey, I&apos;m Chinmay — a software developer with about five years of experience building
          frontend web and mobile apps, while steadily growing on the backend side too. Day to day
          I work with React, Next.js, React Native, Expo, and TypeScript, and I&apos;m also
          comfortable with Express, Fastify, and MongoDB. Devs Forge started as a learning project:
          I wanted to take something from scratch all the way to a real, globally available product
          on my own — the kind of everyday tools I wish were always one tab away. Outside of code,
          you&apos;ll usually find me with a book, in a game, or catching up on movies and series.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2" aria-label="Social links">
            <Button asChild variant="outline" size="icon" title="Email">
              <a href={`mailto:${siteConfig.social.gmail}`}>
                <Mail className="size-4" aria-hidden />
                <span className="sr-only">Email</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" title="LinkedIn">
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon className="size-4" aria-hidden />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" title="X (Twitter)">
              <a href={siteConfig.social.x} target="_blank" rel="noopener noreferrer">
                <XIcon className="size-4" aria-hidden />
                <span className="sr-only">X (Twitter)</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" title="GitHub">
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="size-4" aria-hidden />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
