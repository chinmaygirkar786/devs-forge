import {
  Binary,
  Blend,
  Braces,
  CalendarClock,
  CaseSensitive,
  Clock,
  CodeXml,
  Hash,
  FileCode,
  FileJson2,
  FileText,
  Fingerprint,
  KeyRound,
  Link2,
  ListFilter,
  Megaphone,
  Palette,
  ScrollText,
  SearchCode,
  Wrench,
} from "lucide-react";

import { isToolSlug } from "@/tools/slugs";

type IconGlyphProps = {
  className?: string;
};

const iconProps = (className?: string) => ({
  className,
  strokeWidth: 2.25 as const,
  "aria-hidden": true as const,
});

export function ToolIconGlyph({ slug, className }: IconGlyphProps & { slug: string }) {
  const props = iconProps(className);

  if (!isToolSlug(slug)) {
    return <Wrench {...props} />;
  }

  switch (slug) {
    case "json-formatter":
      return <Braces {...props} />;
    case "jwt-decoder":
      return <KeyRound {...props} />;
    case "regex-tester":
      return <SearchCode {...props} />;
    case "base64-encoder":
      return <Binary {...props} />;
    case "uuid-generator":
      return <Fingerprint {...props} />;
    case "color-palette-generator":
      return <Palette {...props} />;
    case "gradient-generator":
      return <Blend {...props} />;
    case "markdown-previewer":
      return <FileText {...props} />;
    case "url-encoder":
      return <Link2 {...props} />;
    case "html-formatter":
      return <CodeXml {...props} />;
    case "xml-formatter":
      return <FileCode {...props} />;
    case "yaml-formatter":
      return <ScrollText {...props} />;
    case "css-formatter":
      return <Palette {...props} />;
    case "case-converter":
      return <CaseSensitive {...props} />;
    case "hash-generator":
      return <Hash {...props} />;
    case "cron-parser":
      return <CalendarClock {...props} />;
    case "query-string-parser":
      return <ListFilter {...props} />;
    case "timestamp-converter":
      return <Clock {...props} />;
    case "json-to-typescript":
      return <FileJson2 {...props} />;
    case "linkedin-post-formatter":
      return <Megaphone {...props} />;
    default: {
      const _exhaustive: never = slug;
      return _exhaustive;
    }
  }
}
