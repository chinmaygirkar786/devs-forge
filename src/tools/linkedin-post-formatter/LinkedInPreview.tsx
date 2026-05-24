import { useMemo } from "react";

import { buildLinkedInDisplaySegments, type LinkedInPostDocument } from "@/lib/linkedin-document";
import { cn } from "@/lib/utils";

type LinkedInPreviewProps = {
  document: LinkedInPostDocument;
  emptyText?: string;
  className?: string;
};

export function LinkedInPreview({
  document,
  emptyText = "Your formatted post will appear here.",
  className,
}: LinkedInPreviewProps) {
  const segments = useMemo(() => buildLinkedInDisplaySegments(document), [document]);

  if (!document.plain) {
    return (
      <div
        className={cn(
          "text-muted-foreground border-border bg-background min-h-[220px] rounded-3xl border px-5 py-4 text-base leading-7 whitespace-pre-wrap",
          className,
        )}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-border bg-background text-foreground min-h-[220px] rounded-3xl border px-5 py-4 text-base leading-7 whitespace-pre-wrap",
        className,
      )}
    >
      {segments.map((segment, index) => (
        <span
          key={`${index}-${segmentStyleKey(segment)}`}
          className={cn(
            segment.bold && "font-bold",
            segment.italic && "italic",
            segment.underline && "underline",
            segment.strikethrough && "line-through",
          )}
        >
          {segment.text}
        </span>
      ))}
    </div>
  );
}

function segmentStyleKey(segment: {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}) {
  return `${segment.bold}-${segment.italic}-${segment.underline}-${segment.strikethrough}`;
}
