"use client";

import { useMemo, useState } from "react";

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
import { buildQueryString, parseQueryStringInput } from "@/lib/tool-helpers";

const sampleQuery = "https://api.example.com/search?q=dev+tools&page=2&sort=desc";

export default function QueryStringParserTool() {
  const [input, setInput] = useState(sampleQuery);

  const rows = useMemo(() => parseQueryStringInput(input), [input]);
  const serialized = useMemo(() => buildQueryString(rows), [rows]);

  useToolShortcuts({
    onCopy: () => {
      if (serialized) {
        void navigator.clipboard.writeText(serialized);
      }
    },
    onClear: () => setInput(""),
  });

  return (
    <ToolGrid>
      <SectionCard
        title="URL or query string"
        description="Parse query parameters into a readable table and rebuild encoded strings."
      >
        <FieldLabel label="Input" />
        <TextareaField value={input} onChange={(event) => setInput(event.target.value)} />

        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton variant="ghost" onClick={() => setInput(sampleQuery)}>
            Load example
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setInput("")}>
            Clear
          </ActionButton>
        </div>
      </SectionCard>

      <SectionCard title="Parsed parameters" description="Decoded keys and values from the query string.">
        {rows.length === 0 ? (
          <StatusBanner tone="neutral" text="No query parameters detected." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-background-soft text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Key</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.key}-${row.value}`} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{row.key}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <FieldLabel label="Rebuilt query string" />
            <CopyButton value={serialized} />
          </div>
          <TextareaField value={serialized} readOnly spellCheck={false} />
          <div className="mt-4">
            <StatusBanner
              tone={rows.length > 0 ? "success" : "neutral"}
              text={
                rows.length > 0
                  ? `${rows.length} parameter(s) parsed.`
                  : "Paste a URL or query string to parse."
              }
            />
          </div>
        </div>
      </SectionCard>
    </ToolGrid>
  );
}
