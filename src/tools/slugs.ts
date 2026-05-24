export const toolSlugList = [
  "json-formatter",
  "jwt-decoder",
  "regex-tester",
  "base64-encoder",
  "uuid-generator",
  "color-palette-generator",
  "gradient-generator",
  "markdown-previewer",
  "url-encoder",
  "html-formatter",
  "xml-formatter",
  "yaml-formatter",
  "css-formatter",
  "case-converter",
  "hash-generator",
  "cron-parser",
  "query-string-parser",
  "timestamp-converter",
  "json-to-typescript",
  "linkedin-post-formatter",
] as const;

export type ToolSlug = (typeof toolSlugList)[number];

export function isToolSlug(value: string): value is ToolSlug {
  return (toolSlugList as readonly string[]).includes(value);
}
