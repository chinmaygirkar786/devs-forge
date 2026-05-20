import {
  Binary,
  Blend,
  Braces,
  Clock,
  CodeXml,
  FileJson2,
  FileText,
  Fingerprint,
  KeyRound,
  Link2,
  Palette,
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

export function ToolIconGlyph({
  slug,
  className,
}: IconGlyphProps & { slug: string }) {
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
    case "timestamp-converter":
      return <Clock {...props} />;
    case "json-to-typescript":
      return <FileJson2 {...props} />;
    default: {
      const _exhaustive: never = slug;
      return _exhaustive;
    }
  }
}
