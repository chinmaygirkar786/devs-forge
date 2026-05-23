import type { ToolSeoBlock } from "@/tools/types";

export const cssFormatterSeo: ToolSeoBlock = {
  seoIntro:
    "Beautify or minify CSS for components, email templates, and quick style debugging—entirely in your browser.",
  contentSections: [
    {
      heading: "When to format CSS online",
      paragraphs: [
        "Copied styles from devtools or legacy pages often arrive as one line. A css formatter online restores readable blocks for review, while minify mode compacts rules for embeds.",
      ],
    },
    {
      heading: "Limitations of browser-based CSS formatting",
      paragraphs: [
        "This tool focuses on common rule blocks and declarations. Complex preprocessors (Sass, Less) should be expanded before formatting here.",
      ],
    },
  ],
  useCases: [
    "Indent CSS copied from browser inspector.",
    "Minify widget styles before embedding.",
    "Clean up email template styles.",
    "Prepare readable snippets for design reviews.",
    "Compact utility CSS for documentation.",
    "Pair with HTML formatter for markup plus styles.",
  ],
  faqs: [
    {
      question: "Does formatting change selectors?",
      answer: "Selectors and declarations stay the same; whitespace is adjusted.",
    },
    {
      question: "Are comments preserved?",
      answer: "Comments are stripped during processing to keep output consistent.",
    },
    {
      question: "Can I minify for production?",
      answer: "Yes. Use minify mode for compact single-line output.",
    },
    {
      question: "Is data sent to a server?",
      answer: "No. Transformations run locally.",
    },
    {
      question: "Does this validate CSS?",
      answer: "It formats structure; invalid syntax may still parse loosely.",
    },
    {
      question: "How does this relate to HTML formatter?",
      answer: "Format HTML structure here, then format CSS rules in this tool.",
    },
  ],
  internalLinkSlugs: [
    "html-formatter",
    "gradient-generator",
    "color-palette-generator",
    "json-formatter",
    "markdown-previewer",
    "url-encoder",
  ],
};
