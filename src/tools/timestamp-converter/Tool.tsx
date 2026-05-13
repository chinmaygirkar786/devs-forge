"use client";

import { useMemo, useState } from "react";

import {
  ActionButton,
  CopyButton,
  FieldLabel,
  SectionCard,
  StatPill,
  StatusBanner,
  TextareaField,
} from "@/components/tool-ui";
import { parseTimestamp } from "@/lib/tool-helpers";

const sampleTimestamp = "1715619600";

export default function TimestampConverterTool() {
  const [input, setInput] = useState(sampleTimestamp);

  const result = useMemo(() => {
    const date = parseTimestamp(input);
    if (!date) {
      return {
        date: null,
        error: "Enter a Unix timestamp in seconds or milliseconds, or a readable date.",
      };
    }

    return {
      date,
      error: "",
    };
  }, [input]);

  const output = result.date
    ? JSON.stringify(
        {
          iso: result.date.toISOString(),
          local: result.date.toLocaleString(),
          unixSeconds: Math.floor(result.date.getTime() / 1000),
          unixMilliseconds: result.date.getTime(),
        },
        null,
        2,
      )
    : "";

  return (
    <div className="space-y-6">
      <SectionCard
        title="Timestamp input"
        description="Convert Unix timestamps to readable dates or parse readable dates back to Unix values."
      >
        <FieldLabel label="Timestamp or date string" />
        <TextareaField
          minHeight="min-h-[140px]"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleTimestamp)}>
            Load Unix example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput(new Date().toISOString())}>
            Use current ISO date
          </ActionButton>
        </div>
      </SectionCard>

      {result.date ? (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <SectionCard
            title="Resolved values"
            description="Seconds and milliseconds are both available for API and token workflows."
          >
            <div className="grid gap-4">
              <StatPill label="Unix seconds" value={Math.floor(result.date.getTime() / 1000)} />
              <StatPill label="Unix milliseconds" value={result.date.getTime()} />
              <StatPill
                label="Timezone"
                value={Intl.DateTimeFormat().resolvedOptions().timeZone}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Formatted output"
            description="Copy structured values for debugging or documentation."
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <FieldLabel label="Date conversion" />
              <CopyButton value={output} />
            </div>
            <TextareaField value={output} readOnly spellCheck={false} />
          </SectionCard>
        </div>
      ) : (
        <StatusBanner tone="danger" text={result.error} />
      )}
    </div>
  );
}
