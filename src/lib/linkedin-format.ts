export const LINKEDIN_POST_CHAR_LIMIT = 3000;

export type LinkedInTextStyle = "bold" | "italic" | "boldItalic" | "underline" | "strikethrough";

const COMBINING_UNDERLINE = "\u0332";
const COMBINING_STRIKE = "\u0336";

/** Sans-serif mathematical blocks — closer to LinkedIn / system UI fonts than serif math bold. */
const STYLE_OFFSETS: Record<
  Exclude<LinkedInTextStyle, "underline" | "strikethrough">,
  { upper: number; lower: number; digit: number | null }
> = {
  bold: { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec },
  italic: { upper: 0x1d608, lower: 0x1d622, digit: null },
  boldItalic: { upper: 0x1d63c, lower: 0x1d656, digit: null },
};

/** Legacy serif mathematical bold/italic (older tool output). */
const LEGACY_STYLE_OFFSETS: Array<(typeof STYLE_OFFSETS)["bold"]> = [
  { upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce },
  { upper: 0x1d434, lower: 0x1d44e, digit: null },
  { upper: 0x1d468, lower: 0x1d482, digit: null },
];

type AlphanumericStyle = Exclude<LinkedInTextStyle, "underline" | "strikethrough">;

export type CharStyles = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
};

export const EMPTY_STYLES: CharStyles = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
};

function mapAlphanumeric(char: string, offsets: (typeof STYLE_OFFSETS)["bold"]) {
  const code = char.charCodeAt(0);

  if (code >= 65 && code <= 90) {
    return String.fromCodePoint(offsets.upper + (code - 65));
  }

  if (code >= 97 && code <= 122) {
    return String.fromCodePoint(offsets.lower + (code - 97));
  }

  if (offsets.digit !== null && code >= 48 && code <= 57) {
    return String.fromCodePoint(offsets.digit + (code - 48));
  }

  return char;
}

function codePointInRange(cp: number, start: number, end: number) {
  return cp >= start && cp <= end;
}

function matchOffsetRange(
  cp: number,
  offsets: (typeof STYLE_OFFSETS)["bold"],
): "upper" | "lower" | "digit" | null {
  if (codePointInRange(cp, offsets.upper, offsets.upper + 25)) {
    return "upper";
  }

  if (codePointInRange(cp, offsets.lower, offsets.lower + 25)) {
    return "lower";
  }

  if (offsets.digit !== null && codePointInRange(cp, offsets.digit, offsets.digit + 9)) {
    return "digit";
  }

  return null;
}

function reverseFromOffsets(cp: number, offsets: (typeof STYLE_OFFSETS)["bold"]) {
  const match = matchOffsetRange(cp, offsets);

  if (match === "upper") {
    return String.fromCharCode(65 + (cp - offsets.upper));
  }

  if (match === "lower") {
    return String.fromCharCode(97 + (cp - offsets.lower));
  }

  if (match === "digit") {
    return String.fromCharCode(48 + (cp - offsets.digit!));
  }

  return null;
}

function reverseAlphanumericChar(char: string) {
  const cp = char.codePointAt(0);

  if (cp === undefined) {
    return char;
  }

  for (const offsets of [
    STYLE_OFFSETS.boldItalic,
    STYLE_OFFSETS.bold,
    STYLE_OFFSETS.italic,
    ...LEGACY_STYLE_OFFSETS,
  ]) {
    const reversed = reverseFromOffsets(cp, offsets);
    if (reversed) {
      return reversed;
    }
  }

  return char;
}

function detectAlphanumericStyle(char: string): AlphanumericStyle | null {
  const cp = char.codePointAt(0);

  if (cp === undefined) {
    return null;
  }

  for (const style of ["boldItalic", "bold", "italic"] as const) {
    if (matchOffsetRange(cp, STYLE_OFFSETS[style])) {
      return style;
    }
  }

  for (const offsets of LEGACY_STYLE_OFFSETS) {
    if (matchOffsetRange(cp, offsets)) {
      if (offsets.upper === 0x1d468) {
        return "boldItalic";
      }

      if (offsets.upper === 0x1d434) {
        return "italic";
      }

      return "bold";
    }
  }

  return null;
}

export function decodeChar(char: string): { base: string; styles: CharStyles } {
  const styles: CharStyles = { ...EMPTY_STYLES };

  let working = char;

  if (working.includes(COMBINING_UNDERLINE)) {
    styles.underline = true;
    working = working.replaceAll(COMBINING_UNDERLINE, "");
  }

  if (working.includes(COMBINING_STRIKE)) {
    styles.strikethrough = true;
    working = working.replaceAll(COMBINING_STRIKE, "");
  }

  const alphanumericStyle = detectAlphanumericStyle(working);

  if (alphanumericStyle === "bold") {
    styles.bold = true;
  } else if (alphanumericStyle === "italic") {
    styles.italic = true;
  } else if (alphanumericStyle === "boldItalic") {
    styles.bold = true;
    styles.italic = true;
  }

  const base = reverseAlphanumericChar(working);

  return { base, styles };
}

export function encodeChar(base: string, styles: CharStyles) {
  if (base === "\n" || base === "\r") {
    return base;
  }

  let output = base;

  if (/^[A-Za-z0-9]$/.test(base)) {
    if (styles.bold && styles.italic) {
      output = mapAlphanumeric(base, STYLE_OFFSETS.boldItalic);
    } else if (styles.bold) {
      output = mapAlphanumeric(base, STYLE_OFFSETS.bold);
    } else if (styles.italic) {
      output = mapAlphanumeric(base, STYLE_OFFSETS.italic);
    }
  }

  if (styles.underline) {
    output += COMBINING_UNDERLINE;
  }

  if (styles.strikethrough) {
    output += COMBINING_STRIKE;
  }

  return output;
}

function charHasStyle(char: string, style: LinkedInTextStyle) {
  const { styles } = decodeChar(char);

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

function isStyleableChar(char: string) {
  if (char === "\n" || char === "\r") {
    return false;
  }

  const { base, styles } = decodeChar(char);

  return (
    /^[A-Za-z0-9]$/.test(base) ||
    styles.underline ||
    styles.strikethrough ||
    styles.bold ||
    styles.italic
  );
}

export function selectionHasStyle(text: string, style: LinkedInTextStyle) {
  const styleable = [...text].filter(isStyleableChar);

  if (styleable.length === 0) {
    return false;
  }

  return styleable.every((char) => charHasStyle(char, style));
}

function setCharStyle(char: string, style: LinkedInTextStyle, active: boolean) {
  const { base, styles } = decodeChar(char);

  if (base === "\n" || base === "\r") {
    return char;
  }

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

  return encodeChar(base, next);
}

function toggleStyleOnText(text: string, style: LinkedInTextStyle) {
  const remove = selectionHasStyle(text, style);
  return [...text].map((char) => setCharStyle(char, style, !remove)).join("");
}

export function applyLinkedInStyle(text: string, style: LinkedInTextStyle) {
  return [...text].map((char) => setCharStyle(char, style, true)).join("");
}

export function stripLinkedInStyles(text: string) {
  return [...text].map((char) => encodeChar(decodeChar(char).base, EMPTY_STYLES)).join("");
}

export function insertAtCursor(
  text: string,
  insert: string,
  selectionStart: number,
  selectionEnd: number,
) {
  const nextText = text.slice(0, selectionStart) + insert + text.slice(selectionEnd);
  const cursor = selectionStart + insert.length;

  return {
    nextText,
    selectionStart: cursor,
    selectionEnd: cursor,
  };
}

export function applyStyleToSelection(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  style: LinkedInTextStyle | "clear",
) {
  const start = Math.min(selectionStart, selectionEnd);
  const end = Math.max(selectionStart, selectionEnd);
  const selected = text.slice(start, end);

  if (style === "clear") {
    if (!selected) {
      const cleared = stripLinkedInStyles(text);
      return { nextText: cleared, selectionStart: 0, selectionEnd: cleared.length };
    }

    const transformed = stripLinkedInStyles(selected);
    const nextText = text.slice(0, start) + transformed + text.slice(end);

    return {
      nextText,
      selectionStart: start,
      selectionEnd: start + transformed.length,
    };
  }

  if (!selected) {
    return { nextText: text, selectionStart: start, selectionEnd: end };
  }

  const transformed = toggleStyleOnText(selected, style);
  const nextText = text.slice(0, start) + transformed + text.slice(end);

  return {
    nextText,
    selectionStart: start,
    selectionEnd: start + transformed.length,
  };
}

export function linkedInCharacterCount(text: string) {
  return [...text].length;
}
