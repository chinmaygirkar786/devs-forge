import type { ComponentType } from "react";

import type { AffiliateContext } from "@/lib/affiliate";

export type ToolCategory = "formatting" | "conversion" | "generators" | "utilities";

export type ToolExample = {
  title: string;
  input?: string;
  output?: string;
};

export type ToolFaq = {
  question: string;
  answer: string;
};

export type ToolKeywordCluster = {
  primary: string;
  secondary: string[];
  longTail: string[];
};

export type ToolContentSection = {
  heading: string;
  paragraphs: string[];
};

export type ToolSeoBlock = {
  seoIntro: string;
  contentSections?: ToolContentSection[];
  useCases: string[];
  faqs: ToolFaq[];
  /** Slugs highlighted in the in-page internal links section (defaults to relatedSlugs). */
  internalLinkSlugs?: string[];
};

export type ToolDefinition = {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  popular?: boolean;
  metaTitle: string;
  metaDescription: string;
  pageHeading: string;
  seoLinkLabel: string;
  keywordCluster: ToolKeywordCluster;
  howItWorks: string[];
  examples: ToolExample[];
  relatedSlugs: string[];
  affiliateContext: AffiliateContext[];
  seoIntro: string;
  contentSections: ToolContentSection[];
  useCases: string[];
  faqs: ToolFaq[];
  internalLinkSlugs: string[];
  loadComponent: () => Promise<{ default: ComponentType }>;
};

export type ToolSeed = Omit<
  ToolDefinition,
  | "seoIntro"
  | "contentSections"
  | "useCases"
  | "faqs"
  | "internalLinkSlugs"
  | "keywords"
  | "metaTitle"
  | "metaDescription"
  | "pageHeading"
  | "seoLinkLabel"
>;
