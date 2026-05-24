import {
  Document as YamlDocument,
  isMap as isYamlMap,
  isSeq as isYamlSeq,
  parse as parseYaml,
  stringify as stringifyYaml,
  visit as visitYaml,
} from "yaml";
import cronstrue from "cronstrue";

type JwtDecodedPart = Record<string, unknown> | null;
type RGB = { r: number; g: number; b: number };

export type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512" | "SHA-1";

export type CaseStyle =
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "kebab-case"
  | "CONSTANT_CASE"
  | "lower case"
  | "UPPER CASE";

export function formatJson(value: string, space = 2) {
  const parsed = JSON.parse(value);
  return JSON.stringify(parsed, null, space);
}

export function encodeBase64(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

export function decodeBase64(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

  return decodeURIComponent(escape(atob(padded)));
}

export function decodeJwtSegment(segment: string): JwtDecodedPart {
  try {
    const decoded = decodeBase64(segment);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function inspectJwt(token: string) {
  const segments = token.trim().split(".");

  if (segments.length < 2) {
    throw new Error("A JWT must contain at least header and payload segments.");
  }

  const [headerSegment, payloadSegment, signature = ""] = segments;
  const header = decodeJwtSegment(headerSegment);
  const payload = decodeJwtSegment(payloadSegment);

  if (!header || !payload) {
    throw new Error("Unable to decode the JWT header or payload.");
  }

  return {
    header,
    payload,
    signature,
  };
}

const regexTokenMap: Array<[RegExp, string]> = [
  [/\\d/, "matches a digit"],
  [/\\w/, "matches a word character"],
  [/\\s/, "matches whitespace"],
  [/\^/, "anchors the match at the start of the text"],
  [/\$/, "anchors the match at the end of the text"],
  [/\+/, "repeats the previous token one or more times"],
  [/\*/, "repeats the previous token zero or more times"],
  [/\?/, "makes the previous token optional or lazy depending on context"],
  [/\{(\d+,?\d*)\}/, "sets an explicit repetition range"],
  [/\((?!\?:)/, "creates a capture group"],
  [/\(\?:/, "creates a non-capturing group"],
  [/\[/, "starts a character set"],
  [/\|/, "creates an either-or branch"],
];

export function explainRegex(pattern: string) {
  const explanations = regexTokenMap
    .filter(([token]) => token.test(pattern))
    .map(([, explanation]) => explanation);

  if (!explanations.length) {
    return [
      "This pattern mainly uses literal characters. Add groups, sets, or quantifiers to make matching more flexible.",
    ];
  }

  return explanations;
}

function toPascalCase(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function inferType(value: unknown, keyName: string, interfaces: string[]): string {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return "unknown[]";
    }

    const uniqueTypes = [...new Set(value.map((item) => inferType(item, keyName, interfaces)))];
    return uniqueTypes.length === 1 ? `${uniqueTypes[0]}[]` : `(${uniqueTypes.join(" | ")})[]`;
  }

  if (typeof value === "object") {
    const interfaceName = toPascalCase(keyName);
    interfaces.push(generateInterface(interfaceName, value as Record<string, unknown>, interfaces));
    return interfaceName;
  }

  if (typeof value === "number") {
    return "number";
  }

  if (typeof value === "string") {
    return "string";
  }

  if (typeof value === "boolean") {
    return "boolean";
  }

  return "unknown";
}

function generateInterface(name: string, value: Record<string, unknown>, interfaces: string[]) {
  const lines = Object.entries(value).map(([key, entryValue]) => {
    const safeKey = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
    const inferredType = inferType(entryValue, key, interfaces);
    return `  ${safeKey}: ${inferredType};`;
  });

  return `export interface ${name} {\n${lines.join("\n")}\n}`;
}

export function jsonToTypeScript(value: string, rootName: string) {
  const parsed = JSON.parse(value) as unknown;
  const interfaces: string[] = [];
  const rootInterfaceName = toPascalCase(rootName) || "RootObject";

  if (Array.isArray(parsed)) {
    const first = parsed[0] ?? {};
    const root = generateInterface(
      `${rootInterfaceName}Item`,
      first as Record<string, unknown>,
      interfaces,
    );
    return [root, ...interfaces, `export type ${rootInterfaceName} = ${rootInterfaceName}Item[];`]
      .filter((line, index, array) => array.indexOf(line) === index)
      .join("\n\n");
  }

  if (typeof parsed !== "object" || parsed === null) {
    return `export type ${rootInterfaceName} = ${typeof parsed};`;
  }

  const root = generateInterface(rootInterfaceName, parsed as Record<string, unknown>, interfaces);
  return [root, ...interfaces]
    .filter((line, index, array) => array.indexOf(line) === index)
    .join("\n\n");
}

const HTML_VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

type HtmlToken = { type: "text"; value: string } | { type: "tag"; value: string };

function readHtmlTag(source: string, start: number) {
  let index = start + 1;

  while (index < source.length) {
    const character = source[index];

    if (character === '"' || character === "'") {
      index += 1;
      while (index < source.length && source[index] !== character) {
        index += 1;
      }
    } else if (character === ">") {
      return {
        value: source.slice(start, index + 1),
        nextIndex: index + 1,
      };
    }

    index += 1;
  }

  throw new Error("Invalid HTML: unclosed tag.");
}

function tokenizeHtml(source: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];
  let index = 0;

  while (index < source.length) {
    if (source[index] === "<") {
      const tag = readHtmlTag(source, index);
      tokens.push({ type: "tag", value: tag.value });
      index = tag.nextIndex;
      continue;
    }

    let end = index;
    while (end < source.length && source[end] !== "<") {
      end += 1;
    }

    const text = source.slice(index, end);
    if (text.trim()) {
      tokens.push({ type: "text", value: text });
    }

    index = end;
  }

  return tokens;
}

function parseHtmlTag(tag: string) {
  const trimmed = tag.trim();

  if (trimmed.startsWith("<!--")) {
    return { kind: "comment" as const };
  }

  if (/^<!DOCTYPE/i.test(trimmed)) {
    return { kind: "doctype" as const };
  }

  if (trimmed.startsWith("<?")) {
    return { kind: "instruction" as const };
  }

  const closingMatch = trimmed.match(/^<\/\s*([A-Za-z][\w:-]*)/);
  if (closingMatch) {
    return { kind: "close" as const, name: closingMatch[1].toLowerCase() };
  }

  const openingMatch = trimmed.match(/^<\s*([A-Za-z][\w:-]*)/);
  if (!openingMatch) {
    return { kind: "unknown" as const };
  }

  const name = openingMatch[1].toLowerCase();
  const selfClosing = /\/\s*>$/.test(trimmed) || HTML_VOID_ELEMENTS.has(name);

  return {
    kind: selfClosing ? ("self-closing" as const) : ("open" as const),
    name,
  };
}

export function minifyHtml(value: string) {
  return value
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\n/g, "")
    .trim();
}

export function formatHtml(value: string, indentSize = 2) {
  const source = value.trim();
  if (!source) {
    return "";
  }

  const indent = " ".repeat(indentSize);
  const tokens = tokenizeHtml(source);
  const lines: string[] = [];
  let depth = 0;

  for (const token of tokens) {
    if (token.type === "text") {
      const text = token.value.replace(/\s+/g, " ").trim();
      if (!text) {
        continue;
      }

      lines.push(`${indent.repeat(depth)}${text}`);
      continue;
    }

    const tagInfo = parseHtmlTag(token.value);
    const tag = token.value.trim();

    if (
      tagInfo.kind === "comment" ||
      tagInfo.kind === "doctype" ||
      tagInfo.kind === "instruction" ||
      tagInfo.kind === "unknown"
    ) {
      lines.push(`${indent.repeat(depth)}${tag}`);
      continue;
    }

    if (tagInfo.kind === "close") {
      depth = Math.max(depth - 1, 0);
      lines.push(`${indent.repeat(depth)}${tag}`);
      continue;
    }

    lines.push(`${indent.repeat(depth)}${tag}`);

    if (tagInfo.kind === "open") {
      depth += 1;
    }
  }

  return lines.join("\n");
}

function parseXmlDocument(value: string): Document {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("XML input is empty.");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(trimmed, "application/xml");
  const parseError = doc.querySelector("parsererror");

  if (parseError) {
    const message = parseError.textContent?.replace(/\s+/g, " ").trim() || "Invalid XML document.";
    throw new Error(message);
  }

  return doc;
}

function escapeXmlText(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatXmlElement(element: Element, depth: number, indentSize: number, lines: string[]) {
  const indent = " ".repeat(indentSize);
  const attrString = Array.from(element.attributes)
    .map((attr) => ` ${attr.name}="${attr.value}"`)
    .join("");

  const meaningfulChildren = Array.from(element.childNodes).filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent?.trim().length ?? 0) > 0;
    }

    return node.nodeType !== Node.PROCESSING_INSTRUCTION_NODE;
  });

  if (meaningfulChildren.length === 0) {
    lines.push(`${indent.repeat(depth)}<${element.tagName}${attrString} />`);
    return;
  }

  const onlyText =
    meaningfulChildren.length === 1 && meaningfulChildren[0].nodeType === Node.TEXT_NODE;

  if (onlyText) {
    const text = meaningfulChildren[0].textContent?.trim() ?? "";
    lines.push(
      `${indent.repeat(depth)}<${element.tagName}${attrString}>${escapeXmlText(text)}</${element.tagName}>`,
    );
    return;
  }

  lines.push(`${indent.repeat(depth)}<${element.tagName}${attrString}>`);

  for (const child of meaningfulChildren) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        lines.push(`${indent.repeat(depth + 1)}${escapeXmlText(text)}`);
      }
      continue;
    }

    if (child.nodeType === Node.ELEMENT_NODE) {
      formatXmlElement(child as Element, depth + 1, indentSize, lines);
      continue;
    }

    if (child.nodeType === Node.COMMENT_NODE) {
      lines.push(`${indent.repeat(depth + 1)}<!--${child.textContent ?? ""}-->`);
      continue;
    }

    if (child.nodeType === Node.CDATA_SECTION_NODE) {
      lines.push(`${indent.repeat(depth + 1)}<![CDATA[${child.textContent ?? ""}]]>`);
    }
  }

  lines.push(`${indent.repeat(depth)}</${element.tagName}>`);
}

export function formatXml(value: string, indentSize = 2) {
  const doc = parseXmlDocument(value);
  const root = doc.documentElement;

  if (!root) {
    return "";
  }

  const lines: string[] = [];
  formatXmlElement(root, 0, indentSize, lines);
  const body = lines.join("\n");
  const hasDeclaration = /^\s*<\?xml/i.test(value);

  if (hasDeclaration) {
    const versionMatch = value.match(/version\s*=\s*["']([^"']+)["']/i);
    const encodingMatch = value.match(/encoding\s*=\s*["']([^"']+)["']/i);
    const version = versionMatch?.[1] ?? "1.0";
    const encoding = encodingMatch?.[1];
    const declaration = encoding
      ? `<?xml version="${version}" encoding="${encoding}"?>`
      : `<?xml version="${version}"?>`;

    return `${declaration}\n${body}`;
  }

  return body;
}

export function minifyXml(value: string) {
  const doc = parseXmlDocument(value);
  const serialized = new XMLSerializer().serializeToString(doc);
  const minified = serialized.replace(/>\s+</g, "><").trim();
  const hasDeclaration = /^\s*<\?xml/i.test(value);

  if (hasDeclaration && !minified.startsWith("<?xml")) {
    const versionMatch = value.match(/version\s*=\s*["']([^"']+)["']/i);
    const encodingMatch = value.match(/encoding\s*=\s*["']([^"']+)["']/i);
    const version = versionMatch?.[1] ?? "1.0";
    const encoding = encodingMatch?.[1];
    const declaration = encoding
      ? `<?xml version="${version}" encoding="${encoding}"?>`
      : `<?xml version="${version}"?>`;

    return `${declaration}${minified}`;
  }

  return minified;
}

export function formatYaml(value: string, indent = 2) {
  const parsed = parseYaml(value);
  return stringifyYaml(parsed, { indent, lineWidth: 0 });
}

function nestedYamlMapDepth(path: readonly unknown[]) {
  return path.filter(isYamlMap).length;
}

export function minifyYaml(value: string) {
  const doc = new YamlDocument(parseYaml(value));

  visitYaml(doc, {
    Map(_key, node, path) {
      if (!isYamlMap(node)) {
        return;
      }

      // Keep top-level keys on separate lines; inline nested maps (flow style).
      if (nestedYamlMapDepth(path) > 0) {
        node.flow = true;
      }
    },
    Seq(_key, node, path) {
      if (isYamlSeq(node) && nestedYamlMapDepth(path) > 0) {
        node.flow = true;
      }
    },
  });

  return doc.toString({ indent: 2, lineWidth: 0 }).trimEnd();
}

export function formatCss(value: string, indentSize = 2) {
  const indent = " ".repeat(indentSize);
  let depth = 0;
  const normalized = value
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "";
  }

  const tokens = normalized.split(/(\{|\}|;)/).filter(Boolean);
  const lines: string[] = [];
  let buffer = "";

  for (const token of tokens) {
    if (token === "{") {
      buffer = buffer.trim();
      if (buffer) {
        lines.push(`${indent.repeat(depth)}${buffer} {`);
      }
      depth += 1;
      buffer = "";
      continue;
    }

    if (token === "}") {
      depth = Math.max(depth - 1, 0);
      lines.push(`${indent.repeat(depth)}}`);
      buffer = "";
      continue;
    }

    if (token === ";") {
      const rule = buffer.trim();
      if (rule) {
        lines.push(`${indent.repeat(depth)}${rule};`);
      }
      buffer = "";
      continue;
    }

    buffer += token;
  }

  const tail = buffer.trim();
  if (tail) {
    lines.push(`${indent.repeat(depth)}${tail}`);
  }

  return lines.join("\n");
}

export function minifyCss(value: string) {
  return value
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*;\s*/g, ";")
    .replace(/\s*:\s*/g, ":")
    .trim();
}

function splitIdentifierWords(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

export function convertCase(value: string, style: CaseStyle) {
  const words = splitIdentifierWords(value);
  if (words.length === 0) {
    return "";
  }

  switch (style) {
    case "camelCase":
      return words
        .map((word, index) =>
          index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`,
        )
        .join("");
    case "PascalCase":
      return words.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join("");
    case "snake_case":
      return words.join("_");
    case "kebab-case":
      return words.join("-");
    case "CONSTANT_CASE":
      return words.join("_").toUpperCase();
    case "lower case":
      return words.join(" ");
    case "UPPER CASE":
      return words.join(" ").toUpperCase();
    default:
      return value;
  }
}

export async function hashText(value: string, algorithm: HashAlgorithm) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function describeCron(expression: string) {
  const trimmed = expression.trim();
  if (!trimmed) {
    throw new Error("Cron expression is empty.");
  }

  return cronstrue.toString(trimmed, { throwExceptionOnParseError: true });
}

export type QueryParamRow = {
  key: string;
  value: string;
};

export function parseQueryStringInput(value: string): QueryParamRow[] {
  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  const query = trimmed.includes("?") ? trimmed.split("?").slice(1).join("?") : trimmed;
  const params = new URLSearchParams(query.startsWith("?") ? query : `?${query}`);

  return Array.from(params.entries()).map(([key, paramValue]) => ({
    key,
    value: paramValue,
  }));
}

export function buildQueryString(rows: QueryParamRow[]) {
  const params = new URLSearchParams();
  for (const row of rows) {
    if (!row.key) {
      continue;
    }
    params.append(row.key, row.value);
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export function parseTimestamp(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number(trimmed);
    const milliseconds = trimmed.length > 10 ? numeric : numeric * 1000;
    return new Date(milliseconds);
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function hexToRgb(hex: string): RGB {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((segment) => segment + segment)
          .join("")
      : normalized;

  const parsed = Number.parseInt(expanded, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

export function getReadableTextColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.64 ? "#111827" : "#FFFFFF";
}

function rgbToHex({ r, g, b }: RGB) {
  return `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

function rgbToHsl({ r, g, b }: RGB) {
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;
  const max = Math.max(normalizedR, normalizedG, normalizedB);
  const min = Math.min(normalizedR, normalizedG, normalizedB);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: lightness };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;
  switch (max) {
    case normalizedR:
      hue = (normalizedG - normalizedB) / delta + (normalizedG < normalizedB ? 6 : 0);
      break;
    case normalizedG:
      hue = (normalizedB - normalizedR) / delta + 2;
      break;
    default:
      hue = (normalizedR - normalizedG) / delta + 4;
  }

  return { h: hue / 6, s: saturation, l: lightness };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  if (s === 0) {
    const value = l * 255;
    return { r: value, g: value, b: value };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let normalizedT = t;
    if (normalizedT < 0) normalizedT += 1;
    if (normalizedT > 1) normalizedT -= 1;
    if (normalizedT < 1 / 6) return p + (q - p) * 6 * normalizedT;
    if (normalizedT < 1 / 2) return q;
    if (normalizedT < 2 / 3) return p + (q - p) * (2 / 3 - normalizedT) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: hue2rgb(p, q, h + 1 / 3) * 255,
    g: hue2rgb(p, q, h) * 255,
    b: hue2rgb(p, q, h - 1 / 3) * 255,
  };
}

export function generatePalette(baseHex: string) {
  const steps = [
    { label: "50", lightness: 0.97 },
    { label: "100", lightness: 0.92 },
    { label: "200", lightness: 0.84 },
    { label: "300", lightness: 0.74 },
    { label: "400", lightness: 0.64 },
    { label: "500", lightness: 0.53 },
    { label: "600", lightness: 0.43 },
    { label: "700", lightness: 0.34 },
    { label: "800", lightness: 0.25 },
    { label: "900", lightness: 0.16 },
  ];
  const hsl = rgbToHsl(hexToRgb(baseHex));
  const isAchromatic = hsl.s < 0.01;
  const saturation = isAchromatic ? 0 : clamp(hsl.s, 0.25, 0.8);

  return steps.map((step) => ({
    label: step.label,
    value: rgbToHex(hslToRgb(hsl.h, saturation, step.lightness)),
  }));
}

export {
  applyLinkedInStyle,
  applyStyleToSelection,
  insertAtCursor,
  linkedInCharacterCount,
  LINKEDIN_POST_CHAR_LIMIT,
  selectionHasStyle,
  stripLinkedInStyles,
} from "@/lib/linkedin-format";
export type { LinkedInTextStyle } from "@/lib/linkedin-format";
export {
  applyStyleToDocumentSelection,
  buildLinkedInDisplaySegments,
  createLinkedInDocument,
  insertIntoLinkedInDocument,
  linkedInDocumentCharacterCount,
  linkedInDocumentToUnicode,
  remapStylesAfterPlainEdit,
  selectionHasStyleOnDocument,
  unicodeToLinkedInDocument,
} from "@/lib/linkedin-document";
export type {
  CharStyles,
  LinkedInDisplaySegment,
  LinkedInPostDocument,
} from "@/lib/linkedin-document";
