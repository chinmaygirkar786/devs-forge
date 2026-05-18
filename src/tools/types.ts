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

export type ToolDefinition = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  popular?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywordCluster: {
    primary: string;
    secondary: string[];
    longTail: string[];
  };
  howItWorks: string[];
  examples: ToolExample[];
  relatedSlugs: string[];
  affiliateContext: AffiliateContext[];
  seoIntro: string;
  useCases: string[];
  faqs: ToolFaq[];
  loadComponent: () => Promise<{ default: ComponentType }>;
};
