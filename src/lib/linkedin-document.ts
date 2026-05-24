import {
  decodeChar,
  encodeChar,
  type CharStyles,
  EMPTY_STYLES,
  linkedInCharacterCount,
  type LinkedInTextStyle,
} from "@/lib/linkedin-format";

export type { CharStyles };

export type LinkedInPostDocument = {
  plain: string;
  styles: CharStyles[];
};

export type LinkedInDisplaySegment = {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
};

export function createLinkedInDocument(plain: string): LinkedInPostDocument {
  return {
    plain,
    styles: Array.from({ length: plain.length }, () => ({ ...EMPTY_STYLES })),
  };
}

export function unicodeToLinkedInDocument(unicode: string): LinkedInPostDocument {
  const plainChars: string[] = [];
  const styles: CharStyles[] = [];

  for (const char of unicode) {
    const { base, styles: decoded } = decodeChar(char);
    plainChars.push(base);
    styles.push({ ...decoded });
  }

  return { plain: plainChars.join(""), styles };
}

export function linkedInDocumentToUnicode(document: LinkedInPostDocument) {
  const { plain, styles } = document;
  let output = "";

  for (let index = 0; index < plain.length; index++) {
    output += encodeChar(plain[index] ?? "", styles[index] ?? EMPTY_STYLES);
  }

  return output;
}

export function linkedInDocumentCharacterCount(document: LinkedInPostDocument) {
  return linkedInCharacterCount(linkedInDocumentToUnicode(document));
}

function isStyleableIndex(document: LinkedInPostDocument, index: number) {
  const char = document.plain[index];

  if (!char || char === "\n" || char === "\r") {
    return false;
  }

  const styles = document.styles[index] ?? EMPTY_STYLES;

  return (
    /^[A-Za-z0-9]$/.test(char) ||
    styles.bold ||
    styles.italic ||
    styles.underline ||
    styles.strikethrough
  );
}

function indexHasStyle(document: LinkedInPostDocument, index: number, style: LinkedInTextStyle) {
  const styles = document.styles[index] ?? EMPTY_STYLES;

  switch (style) {
    case "bold":
      return styles.bold;
    case "italic":
      return styles.italic;
    case "boldItalic":
      return styles.bold && styles.italic;
    case "underline":
      return styles.underline;
    case "strikethrough":
      return styles.strikethrough;
    default:
      return false;
  }
}

export function selectionHasStyleOnDocument(
  document: LinkedInPostDocument,
  selectionStart: number,
  selectionEnd: number,
  style: LinkedInTextStyle,
) {
  const start = Math.min(selectionStart, selectionEnd);
  const end = Math.max(selectionStart, selectionEnd);

  if (start === end) {
    return false;
  }

  const styleable: number[] = [];

  for (let index = start; index < end; index++) {
    if (isStyleableIndex(document, index)) {
      styleable.push(index);
    }
  }

  if (styleable.length === 0) {
    return false;
  }

  return styleable.every((index) => indexHasStyle(document, index, style));
}

function setIndexStyle(styles: CharStyles, style: LinkedInTextStyle, active: boolean): CharStyles {
  const next = { ...styles };

  switch (style) {
    case "bold":
      next.bold = active;
      break;
    case "italic":
      next.italic = active;
      break;
    case "boldItalic":
      next.bold = active;
      next.italic = active;
      break;
    case "underline":
      next.underline = active;
      break;
    case "strikethrough":
      next.strikethrough = active;
      break;
    default:
      break;
  }

  return next;
}

export function applyStyleToDocumentSelection(
  document: LinkedInPostDocument,
  selectionStart: number,
  selectionEnd: number,
  style: LinkedInTextStyle | "clear",
) {
  const start = Math.min(selectionStart, selectionEnd);
  const end = Math.max(selectionStart, selectionEnd);
  const nextStyles = [...document.styles];

  while (nextStyles.length < document.plain.length) {
    nextStyles.push({ ...EMPTY_STYLES });
  }

  if (style === "clear") {
    if (start === end) {
      return createLinkedInDocument(document.plain);
    }

    for (let index = start; index < end; index++) {
      nextStyles[index] = { ...EMPTY_STYLES };
    }

    return { plain: document.plain, styles: nextStyles };
  }

  if (start === end) {
    return document;
  }

  const remove = selectionHasStyleOnDocument(document, start, end, style);

  for (let index = start; index < end; index++) {
    if (!isStyleableIndex(document, index)) {
      continue;
    }

    const current = nextStyles[index] ?? { ...EMPTY_STYLES };
    nextStyles[index] = setIndexStyle(current, style, !remove);
  }

  return { plain: document.plain, styles: nextStyles };
}

export function remapStylesAfterPlainEdit(
  previous: LinkedInPostDocument,
  nextPlain: string,
): CharStyles[] {
  const empty = { ...EMPTY_STYLES };
  const { plain: oldPlain, styles: oldStyles } = previous;

  let prefix = 0;
  while (
    prefix < oldPlain.length &&
    prefix < nextPlain.length &&
    oldPlain[prefix] === nextPlain[prefix]
  ) {
    prefix++;
  }

  let oldSuffix = oldPlain.length;
  let newSuffix = nextPlain.length;

  while (
    oldSuffix > prefix &&
    newSuffix > prefix &&
    oldPlain[oldSuffix - 1] === nextPlain[newSuffix - 1]
  ) {
    oldSuffix--;
    newSuffix--;
  }

  const deletedCount = oldSuffix - prefix;
  const insertedCount = newSuffix - prefix;

  const middleStyles =
    deletedCount === insertedCount
      ? oldStyles.slice(prefix, oldSuffix)
      : Array.from({ length: insertedCount }, () => ({ ...empty }));

  return [...oldStyles.slice(0, prefix), ...middleStyles, ...oldStyles.slice(oldSuffix)];
}

export function insertIntoLinkedInDocument(
  document: LinkedInPostDocument,
  insert: string,
  selectionStart: number,
  selectionEnd: number,
) {
  const start = Math.min(selectionStart, selectionEnd);
  const end = Math.max(selectionStart, selectionEnd);
  const nextPlain = document.plain.slice(0, start) + insert + document.plain.slice(end);
  const remapped = remapStylesAfterPlainEdit(
    { plain: document.plain, styles: document.styles },
    nextPlain,
  );
  const cursor = start + insert.length;

  return {
    document: { plain: nextPlain, styles: remapped },
    selectionStart: cursor,
    selectionEnd: cursor,
  };
}

function segmentStyleKey(segment: LinkedInDisplaySegment) {
  return `${segment.bold}-${segment.italic}-${segment.underline}-${segment.strikethrough}`;
}

export function buildLinkedInDisplaySegments(
  document: LinkedInPostDocument,
): LinkedInDisplaySegment[] {
  const segments: LinkedInDisplaySegment[] = [];
  let current: LinkedInDisplaySegment | null = null;

  for (let index = 0; index < document.plain.length; index++) {
    const char = document.plain[index] ?? "";
    const styles = document.styles[index] ?? EMPTY_STYLES;
    const piece: LinkedInDisplaySegment = {
      text: char,
      bold: styles.bold,
      italic: styles.italic,
      underline: styles.underline,
      strikethrough: styles.strikethrough,
    };

    if (current && segmentStyleKey(current) === segmentStyleKey(piece)) {
      current.text += char;
      continue;
    }

    if (current) {
      segments.push(current);
    }

    current = piece;
  }

  if (current) {
    segments.push(current);
  }

  return segments;
}
