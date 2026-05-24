"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { Bold, Eraser, Italic, Link2, Strikethrough, Underline } from "lucide-react";

import {
  ActionButton,
  CopyButton,
  FieldLabel,
  SectionCard,
  StatusBanner,
  TextareaField,
  ToolGrid,
  useToolShortcuts,
} from "@/components/tool-ui";
import {
  applyStyleToDocumentSelection,
  createLinkedInDocument,
  insertIntoLinkedInDocument,
  linkedInDocumentCharacterCount,
  linkedInDocumentToUnicode,
  remapStylesAfterPlainEdit,
  selectionHasStyleOnDocument,
  type LinkedInPostDocument,
} from "@/lib/linkedin-document";
import { LINKEDIN_POST_CHAR_LIMIT, type LinkedInTextStyle } from "@/lib/tool-helpers";
import { cn } from "@/lib/utils";

import { EmojiPicker } from "@/tools/linkedin-post-formatter/EmojiPicker";
import { LinkedInPreview } from "@/tools/linkedin-post-formatter/LinkedInPreview";

const samplePost = `Three lessons I learned after my first year leading a team:

1. Delegation is a skill you can practice—not a personality type.
2. A five-sentence written update beats another status meeting.
3. Your calendar reflects your real priorities. Audit it monthly.

What would you add to this list? Share it in the comments.

https://example.com/team-leadership-notes`;

type ToolbarButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  pressed?: boolean;
};

function ToolbarButton({ label, onClick, children, className, pressed }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "border-border bg-background-soft text-foreground hover:border-border-strong hover:bg-background inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border transition-colors",
        pressed &&
          "border-primary bg-primary-soft text-primary hover:border-primary hover:bg-primary-soft",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default function LinkedInPostFormatterTool() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [document, setDocument] = useState<LinkedInPostDocument>(() =>
    createLinkedInDocument(samplePost),
  );
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const linkedInUnicode = useMemo(() => linkedInDocumentToUnicode(document), [document]);
  const charCount = linkedInDocumentCharacterCount(document);
  const overLimit = charCount > LINKEDIN_POST_CHAR_LIMIT;

  const syncSelection = useCallback(() => {
    const element = textareaRef.current;
    if (!element) {
      return { start: 0, end: 0 };
    }

    const next = { start: element.selectionStart, end: element.selectionEnd };
    setSelection(next);
    return next;
  }, []);

  const refreshSelection = useCallback(() => {
    syncSelection();
  }, [syncSelection]);

  const updateDocumentWithSelection = useCallback(
    (nextDocument: LinkedInPostDocument, selectionStart: number, selectionEnd: number) => {
      setDocument(nextDocument);
      requestAnimationFrame(() => {
        const element = textareaRef.current;
        if (!element) {
          return;
        }

        element.focus();
        element.setSelectionRange(selectionStart, selectionEnd);
      });
    },
    [],
  );

  const applyStyle = useCallback(
    (style: LinkedInTextStyle | "clear") => {
      const { start, end } = syncSelection();
      const nextDocument = applyStyleToDocumentSelection(document, start, end, style);
      updateDocumentWithSelection(nextDocument, start, end);
    },
    [document, syncSelection, updateDocumentWithSelection],
  );

  const insertLink = useCallback(() => {
    const url = window.prompt("Paste URL (LinkedIn auto-links https:// addresses)");

    if (!url?.trim()) {
      return;
    }

    const normalized = url.trim();
    const withSpace = normalized.startsWith("http") ? normalized : `https://${normalized}`;
    const { start, end } = syncSelection();
    const insertValue = document.plain.slice(start, end) ? withSpace : `\n${withSpace}\n`;
    const result = insertIntoLinkedInDocument(document, insertValue, start, end);
    updateDocumentWithSelection(result.document, result.selectionStart, result.selectionEnd);
  }, [document, syncSelection, updateDocumentWithSelection]);

  const insertEmoji = useCallback(
    (emoji: string) => {
      const { start, end } = syncSelection();
      const result = insertIntoLinkedInDocument(document, emoji, start, end);
      updateDocumentWithSelection(result.document, result.selectionStart, result.selectionEnd);
    },
    [document, syncSelection, updateDocumentWithSelection],
  );

  const handlePlainChange = useCallback((nextPlain: string) => {
    setDocument((previous) => ({
      plain: nextPlain,
      styles: remapStylesAfterPlainEdit(previous, nextPlain),
    }));
  }, []);

  useToolShortcuts({
    onCopy: () => {
      if (linkedInUnicode) {
        void navigator.clipboard.writeText(linkedInUnicode);
      }
    },
    onClear: () => setDocument(createLinkedInDocument("")),
  });

  return (
    <ToolGrid>
      <SectionCard
        title="LinkedIn post editor"
        description="Write in plain text here. Formatting is applied when you copy—Unicode characters LinkedIn accepts on paste."
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <ToolbarButton
            label="Bold (toggle)"
            pressed={selectionHasStyleOnDocument(document, selection.start, selection.end, "bold")}
            onClick={() => applyStyle("bold")}
          >
            <Bold className="h-4 w-4" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton
            label="Italic (toggle)"
            pressed={selectionHasStyleOnDocument(
              document,
              selection.start,
              selection.end,
              "italic",
            )}
            onClick={() => applyStyle("italic")}
          >
            <Italic className="h-4 w-4" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton
            label="Bold italic (toggle)"
            pressed={selectionHasStyleOnDocument(
              document,
              selection.start,
              selection.end,
              "boldItalic",
            )}
            onClick={() => applyStyle("boldItalic")}
          >
            <span className="text-xs font-bold italic">Bi</span>
          </ToolbarButton>
          <ToolbarButton
            label="Underline (toggle)"
            pressed={selectionHasStyleOnDocument(
              document,
              selection.start,
              selection.end,
              "underline",
            )}
            onClick={() => applyStyle("underline")}
          >
            <Underline className="h-4 w-4" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough (toggle)"
            pressed={selectionHasStyleOnDocument(
              document,
              selection.start,
              selection.end,
              "strikethrough",
            )}
            onClick={() => applyStyle("strikethrough")}
          >
            <Strikethrough className="h-4 w-4" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton label="Insert link URL" onClick={insertLink}>
            <Link2 className="h-4 w-4" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton label="Clear formatting" onClick={() => applyStyle("clear")}>
            <Eraser className="h-4 w-4" strokeWidth={2.25} />
          </ToolbarButton>
          <EmojiPicker onSelect={insertEmoji} />
        </div>
        <p className="text-muted-foreground mb-3 text-xs leading-5">
          Open the emoji picker for categories and search, or use your system keyboard in the
          editor.
        </p>

        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Post text" />
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              overLimit ? "text-danger" : "text-muted-foreground",
            )}
          >
            {charCount.toLocaleString()} / {LINKEDIN_POST_CHAR_LIMIT.toLocaleString()} characters
          </span>
        </div>

        <TextareaField
          ref={textareaRef}
          value={document.plain}
          onChange={(event) => handlePlainChange(event.target.value)}
          onSelect={refreshSelection}
          onKeyUp={refreshSelection}
          onMouseUp={refreshSelection}
          minHeight="min-h-[280px]"
          className="font-sans text-base leading-7"
          placeholder="Write your LinkedIn post here..."
        />

        {overLimit ? (
          <div className="mt-3">
            <StatusBanner
              tone="danger"
              text="This post exceeds LinkedIn’s ~3,000 character limit. Trim before publishing."
            />
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton
            variant="ghost"
            onClick={() => setDocument(createLinkedInDocument(samplePost))}
          >
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setDocument(createLinkedInDocument(""))}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard
        title="Preview & copy"
        description="Preview uses your normal font with bold and italic styling. Copy outputs Unicode text for pasting into LinkedIn."
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <FieldLabel label="Formatted preview" />
          <CopyButton value={linkedInUnicode} label="Copy for LinkedIn" />
        </div>
        <LinkedInPreview document={document} />
      </SectionCard>
    </ToolGrid>
  );
}
