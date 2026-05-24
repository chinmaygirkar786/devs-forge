import type { ToolSeoBlock } from "@/tools/types";

export const linkedinPostFormatterSeo: ToolSeoBlock = {
  seoIntro:
    "Format LinkedIn posts with bold, italic, underline, and strikethrough using Unicode characters LinkedIn displays when you paste—no Word or Google Docs workaround required.",
  contentSections: [
    {
      heading: "Why Word formatting fails in LinkedIn",
      paragraphs: [
        "LinkedIn’s post composer does not read rich text from Microsoft Word or Google Docs. Pasting from those apps often strips bold and spacing you expected to keep. Unicode formatters solve this by converting letters into special characters LinkedIn renders as styled text.",
      ],
    },
    {
      heading: "How Unicode styling works",
      paragraphs: [
        "Bold and italic use mathematical alphanumeric symbols. Underline and strikethrough apply combining marks per character. Everything stays plain text so you can copy the result directly into LinkedIn’s post box.",
      ],
    },
  ],
  useCases: [
    "Bold a hook line before publishing a launch post.",
    "Italicize emphasis without retyping in LinkedIn’s limited editor.",
    "Insert emoji and URLs before copying a draft from notes.",
    "Check character count against LinkedIn’s post limit.",
    "Strip Unicode styling back to normal ASCII when editing.",
    "Prepare founder updates and hiring posts faster.",
  ],
  faqs: [
    {
      question: "Does this post directly to LinkedIn?",
      answer: "No. Copy the output and paste it into LinkedIn’s post composer yourself.",
    },
    {
      question: "Why not use Word or Google Docs?",
      answer:
        "Those apps use proprietary rich text. LinkedIn only preserves Unicode characters and line breaks when you paste.",
    },
    {
      question: "Can I add hyperlinks with custom anchor text?",
      answer:
        "LinkedIn auto-links plain https:// URLs. Custom anchor text is not supported—paste the full URL.",
    },
    {
      question: "Are Unicode bold letters accessible?",
      answer:
        "Screen readers may read styled Unicode letter-by-letter. Use styling sparingly for important phrases.",
    },
    {
      question: "Is my post uploaded to a server?",
      answer: "No. Formatting runs entirely in your browser.",
    },
    {
      question: "What is LinkedIn’s character limit?",
      answer: "Posts are roughly 3,000 characters. The editor shows a live count as you type.",
    },
  ],
  internalLinkSlugs: [
    "markdown-previewer",
    "case-converter",
    "url-encoder",
    "json-formatter",
    "hash-generator",
    "regex-tester",
  ],
};
