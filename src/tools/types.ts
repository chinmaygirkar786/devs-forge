import type { ComponentType } from "react";

import type { AffiliateContext } from "@/lib/affiliate";

export type ToolCategory =
  | "formatting"
  | "conversion"
  | "generators"
  | "utilities";

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

export type ToolSeoBlock = {
  seoIntro: string;
  useCases: string[];
  faqs: ToolFaq[];
};

export type ToolDefinition = {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  popular?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywordCluster: ToolKeywordCluster;
  howItWorks: string[];
  examples: ToolExample[];
  relatedSlugs: string[];
  affiliateContext: AffiliateContext[];
  seoIntro: string;
  useCases: string[];
  faqs: ToolFaq[];
  loadComponent: () => Promise<{ default: ComponentType }>;
};

export type ToolSeed = Omit<
  ToolDefinition,
  "seoIntro" | "useCases" | "faqs" | "keywords"
>;
