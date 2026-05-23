import type { ToolSeoBlock } from "@/tools/types";

export const hashGeneratorSeo: ToolSeoBlock = {
  seoIntro:
    "Generate SHA-256, SHA-384, SHA-512, and SHA-1 hex digests from text using Web Crypto—no server upload.",
  contentSections: [
    {
      heading: "Hashing for debugging and verification",
      paragraphs: [
        "Developers hash strings for cache keys, checksum verification, and comparing webhook signatures. A hash generator online using Web Crypto matches what modern browsers expose to client apps.",
      ],
    },
    {
      heading: "Security notes",
      paragraphs: [
        "This tool is for debugging and checksum workflows, not password storage. Never treat client-side hashing as a replacement for server-side password hashing with salts.",
      ],
    },
  ],
  useCases: [
    "Compute SHA-256 checksums for config snippets.",
    "Compare hashed values from API documentation.",
    "Generate digests for cache-busting keys.",
    "Verify sample HMAC payloads during integration work.",
    "Test idempotency keys before sending requests.",
    "Document expected hash outputs in runbooks.",
  ],
  faqs: [
    {
      question: "Which algorithms are supported?",
      answer: "SHA-256, SHA-384, SHA-512, and SHA-1 via Web Crypto.",
    },
    {
      question: "Is my text uploaded?",
      answer: "No. Hashing runs locally in the browser.",
    },
    {
      question: "What encoding is used?",
      answer: "UTF-8 text is hashed; output is lowercase hexadecimal.",
    },
    {
      question: "Can I hash binary files?",
      answer: "Paste text content. For files, use CLI checksum tools.",
    },
    {
      question: "Is SHA-1 still useful?",
      answer: "Included for legacy systems; prefer SHA-256 for new work.",
    },
    {
      question: "Does this replace HMAC?",
      answer: "No. Use dedicated HMAC tooling when a secret key is required.",
    },
  ],
  internalLinkSlugs: [
    "jwt-decoder",
    "uuid-generator",
    "base64-encoder",
    "json-formatter",
    "regex-tester",
    "url-encoder",
  ],
};
