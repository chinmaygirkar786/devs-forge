import type { ToolSeoBlock } from "@/tools/types";

export const cronParserSeo: ToolSeoBlock = {
  seoIntro:
    "Decode standard cron expressions into plain English for crontab entries, workers, and CI schedules—locally in your browser.",
  contentSections: [
    {
      heading: "Reading cron syntax quickly",
      paragraphs: [
        "Five-field cron strings are compact but easy to misread. A cron parser online explains minute, hour, day-of-month, month, and day-of-week fields in human language before you edit production schedules.",
      ],
    },
    {
      heading: "Supported expression styles",
      paragraphs: [
        "The parser focuses on common Unix-style cron patterns including ranges, steps, and lists. Validate expressions here before pasting into servers or workflow YAML.",
      ],
    },
  ],
  useCases: [
    "Explain GitHub Actions cron schedules.",
    "Review legacy crontab lines during migrations.",
    "Document worker schedules for on-call runbooks.",
    "Sanity-check staging job timing before promote.",
    "Teach junior engineers cron field order.",
    "Pair with timestamp converter for claim exp review.",
  ],
  faqs: [
    {
      question: "Does this calculate next run times?",
      answer:
        "It provides human-readable descriptions. Use your scheduler for exact next executions.",
    },
    {
      question: "Are time zones handled?",
      answer: "Descriptions follow the expression only; apply server timezone context separately.",
    },
    {
      question: "Is data uploaded?",
      answer: "No. Parsing is local.",
    },
    {
      question: "What if parsing fails?",
      answer: "Invalid expressions show an error so you can fix fields.",
    },
    {
      question: "Does this support seconds field?",
      answer: "Standard five-field Unix cron is supported.",
    },
    {
      question: "Related tools?",
      answer: "Use timestamp converter when inspecting JWT exp values alongside schedules.",
    },
  ],
  internalLinkSlugs: [
    "timestamp-converter",
    "yaml-formatter",
    "json-formatter",
    "regex-tester",
    "uuid-generator",
    "url-encoder",
  ],
};
